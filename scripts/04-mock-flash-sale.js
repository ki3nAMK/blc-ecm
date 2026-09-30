// Seeds demo flash sales on top of the products created by 01-generate-accounts.js:
// one sale that's active right now, one scheduled to start later, and one with a very
// short window so you can watch FlashSaleCronService flip it scheduled -> active ->
// expired within a minute of running this script. Also drives one buyer through a full
// purchase of the active-sale product at the discounted price, so there's a concrete
// "bought during a flash sale" order to inspect afterward.
//
// Every step goes through the real flow (REST API + signed on-chain transactions from
// the actual seller/buyer wallets) — nothing is written to MongoDB directly, except the
// Mongo mirror PATCH that every flash-sale-aware page reads from (same shape a real
// seller's "Start Flash Sale" button in the UI would send).
//
// MUST run after 01-generate-accounts.js — this script buys products that script is
// expected to have already created and listed on-chain.
//
// Re-running without a fresh 00-reset-data.js first will fail to re-start a sale that's
// still active/scheduled from the previous run (the contract rejects that on purpose) —
// this script detects that and cancels the old sale first so a re-run still works.
//
// Usage: node scripts/04-mock-flash-sale.js

const {
  ethers,
  ROLE_ACCOUNTS,
  getHardhatWallet,
  getProvider,
  apiCall,
  authHeaders,
  loginAccount,
  toBytes32,
  getContractAddresses,
  loadAbi,
} = require('./config');

const DISCOUNT_RATIO = 0.8; // 20% off, applied to both price and escrow to keep the deposit ratio unchanged

const nonceCache = new Map();
async function nextNonce(provider, address) {
  const key = address.toLowerCase();
  if (!nonceCache.has(key)) {
    nonceCache.set(key, await provider.getTransactionCount(address, 'latest'));
  }
  const nonce = nonceCache.get(key);
  nonceCache.set(key, nonce + 1);
  return nonce;
}

async function sendTx(provider, contract, wallet, method, args, overrides = {}) {
  const nonce = await nextNonce(provider, wallet.address);
  const tx = await contract[method](...args, { ...overrides, nonce });
  return tx.wait();
}

function round8(value) {
  return Number(value.toFixed(8));
}

async function startFlashSale({
  provider,
  escrowAsSeller,
  sellerWallet,
  sellerToken,
  product,
  startDelaySeconds,
  durationSeconds,
}) {
  const discountedPrice = round8(product.price * DISCOUNT_RATIO);
  const discountedEscrow = round8(product.escrow * DISCOUNT_RATIO);
  const productIdBytes32 = toBytes32(String(product.id));

  // The on-chain window must be relative to the CHAIN's own clock, not wall-clock time —
  // a local Hardhat node that's been sitting idle can drift its block timestamp well behind
  // real time, and a wall-clock-based startTime would look like it's in the future to the
  // contract, silently leaving the discount never active. Mongo, by contrast, is read by the
  // cron job and the frontend using real wall-clock time, so its copy of the window uses
  // Date.now() instead — the two clocks don't need to agree with each other, only with
  // whichever consumer (contract vs. backend/UI) is checking them.
  const chainNow = (await provider.getBlock('latest')).timestamp;
  const chainStartTime = chainNow + startDelaySeconds;
  const chainEndTime = chainStartTime + durationSeconds;

  const args = [
    productIdBytes32,
    ethers.parseEther(discountedPrice.toFixed(8)),
    ethers.parseEther(discountedEscrow.toFixed(8)),
    chainStartTime,
    chainEndTime,
  ];

  let receipt;
  try {
    receipt = await sendTx(provider, escrowAsSeller, sellerWallet, 'setFlashSale', args);
  } catch (err) {
    if (String(err?.reason || err?.message || '').includes('sale already active/scheduled')) {
      await sendTx(provider, escrowAsSeller, sellerWallet, 'cancelFlashSale', [productIdBytes32]);
      receipt = await sendTx(provider, escrowAsSeller, sellerWallet, 'setFlashSale', args);
    } else {
      throw err;
    }
  }

  const wallNow = Date.now();
  await apiCall(`/products/${product.id}/flash-sale`, {
    method: 'PATCH',
    headers: authHeaders(sellerToken),
    body: JSON.stringify({
      discountedPrice,
      discountedEscrow,
      startTime: new Date(wallNow + startDelaySeconds * 1000).toISOString(),
      endTime: new Date(wallNow + startDelaySeconds * 1000 + durationSeconds * 1000).toISOString(),
      txHash: receipt.hash,
    }),
  });

  return { discountedPrice, discountedEscrow };
}

async function runFlashSaleOrder({ provider, buyerSession, buyerWallet, sellerWallet, product, sale, escrowAbi, addresses, referralCode }) {
  const order = await apiCall('/orders', {
    method: 'POST',
    headers: authHeaders(buyerSession.accessToken),
    body: JSON.stringify({
      items: [{ productId: product.id, quantity: 1 }],
      referralCode,
    }),
  });
  const item = order.items[0];

  const productIdBytes32 = toBytes32(String(product.id));
  const orderIdBytes32 = toBytes32(String(item.orderContractId));

  const escrowAsBuyer = new ethers.Contract(addresses.escrow, escrowAbi, buyerWallet);
  const escrowAsSeller = new ethers.Contract(addresses.escrow, escrowAbi, sellerWallet);

  const escrowWei = ethers.parseEther(sale.discountedEscrow.toFixed(8));
  const restWei = ethers.parseEther((sale.discountedPrice - sale.discountedEscrow).toFixed(8));

  const patch = async (status) => {
    await apiCall(`/orders/${order.id}/item-status`, {
      method: 'PATCH',
      headers: authHeaders(buyerSession.accessToken),
      body: JSON.stringify({ productId: product.id, status }),
    });
  };

  await sendTx(provider, escrowAsBuyer, buyerWallet, 'depositEarnest', [
    productIdBytes32,
    orderIdBytes32,
    1,
    ethers.ZeroAddress,
  ], { value: escrowWei });
  await patch('DEPOSIT_ESCROW');

  await sendTx(provider, escrowAsSeller, sellerWallet, 'approveProduct', [productIdBytes32, orderIdBytes32, buyerWallet.address]);
  await sendTx(provider, escrowAsBuyer, buyerWallet, 'depositRestAmount', [orderIdBytes32], { value: restWei });
  await patch('FULLY_DEPOSITED');

  await sendTx(provider, escrowAsSeller, sellerWallet, 'finalizeOrder', [orderIdBytes32, buyerWallet.address]);
  await patch('SELLER_FINALIZED');

  await sendTx(provider, escrowAsBuyer, buyerWallet, 'approveReceiveProduct', [orderIdBytes32]);
  await patch('ORDER_RECEIVED');

  await sendTx(provider, escrowAsSeller, sellerWallet, 'rewardOrder', [orderIdBytes32, buyerWallet.address]);
  await patch('DONE');

  return order.id;
}

async function main() {
  console.log('=== Seeding demo flash sales ===');

  const provider = getProvider();
  const addresses = getContractAddresses();
  const escrowAbi = loadAbi('Escrow');

  const sellerCfg = ROLE_ACCOUNTS.sellers[0];
  const sellerWallet = getHardhatWallet(sellerCfg.index, provider);
  const sellerSession = await loginAccount(sellerWallet);
  if (sellerSession.user.role !== 'SELLER') {
    throw new Error(`${sellerCfg.name} is not role=SELLER yet — run scripts/01-generate-accounts.js first.`);
  }

  const buyerCfg = ROLE_ACCOUNTS.buyers[0];
  const buyerWallet = getHardhatWallet(buyerCfg.index, provider);
  const buyerSession = await loginAccount(buyerWallet);

  console.log(`\nLoading ${sellerCfg.name}'s products...`);
  const resp = await apiCall('/products/me?page=1&limit=50', {
    headers: authHeaders(sellerSession.accessToken),
  });
  const products = (resp.data || []).filter((p) => p.publish === 'published');
  if (products.length < 3) {
    throw new Error(
      `${sellerCfg.name} needs at least 3 published products — run scripts/01-generate-accounts.js first.`,
    );
  }

  const [activeProduct, scheduledProduct, expiringProduct] = products;

  const escrowAsSeller = new ethers.Contract(addresses.escrow, escrowAbi, sellerWallet);

  console.log(`\nStarting an ACTIVE flash sale on "${activeProduct.name}"...`);
  const activeSale = await startFlashSale({
    provider,
    escrowAsSeller,
    sellerWallet,
    sellerToken: sellerSession.accessToken,
    product: activeProduct,
    startDelaySeconds: -60,
    durationSeconds: 3660,
  });
  console.log(`      ${activeProduct.price} -> ${activeSale.discountedPrice} ETH, ends in 1 hour.`);

  console.log(`\nStarting a SCHEDULED flash sale on "${scheduledProduct.name}"...`);
  const scheduledSale = await startFlashSale({
    provider,
    escrowAsSeller,
    sellerWallet,
    sellerToken: sellerSession.accessToken,
    product: scheduledProduct,
    startDelaySeconds: 3600,
    durationSeconds: 3600,
  });
  console.log(`      ${scheduledProduct.price} -> ${scheduledSale.discountedPrice} ETH, starts in 1 hour.`);

  console.log(`\nStarting a SOON-TO-EXPIRE flash sale on "${expiringProduct.name}"...`);
  await startFlashSale({
    provider,
    escrowAsSeller,
    sellerWallet,
    sellerToken: sellerSession.accessToken,
    product: expiringProduct,
    startDelaySeconds: -120,
    durationSeconds: 135,
  });
  console.log('      Ends in ~15s — watch FlashSaleCronService flip it to "expired" within a minute.');

  console.log(`\nBuying "${activeProduct.name}" at the flash-sale price (full order lifecycle)...`);
  const orderId = await runFlashSaleOrder({
    provider,
    buyerSession,
    buyerWallet,
    sellerWallet,
    product: activeProduct,
    sale: activeSale,
    escrowAbi,
    addresses,
  });
  console.log(`      Order ${orderId} completed at the discounted price.`);

  console.log('\n=== Done ===');
  console.log('Reload the home page to see the "Flash Sale" section and countdown badges.');
}

main().catch((err) => {
  console.error('\nFlash sale seeding failed:', err);
  process.exit(1);
});
