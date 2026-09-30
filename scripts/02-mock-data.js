// Generates realistic activity on top of the accounts created by 01-generate-accounts.js:
// a batch of orders across sellers/buyers (some referred by the affiliate, run to varying
// stages of the real on-chain escrow lifecycle so dashboards show a realistic mix of
// statuses), a couple of product reviews, and an admin-created + approved Airdrop campaign
// once the affiliate has real earned commission to be ranked by.
//
// Every step goes through the real flow (REST API + signed on-chain transactions from the
// actual buyer/seller wallets) — nothing is written to MongoDB directly here.
//
// MUST run after 01-generate-accounts.js — this script only logs into accounts and buys
// products that script is expected to have already created.
//
// Usage: node scripts/02-mock-data.js

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

// Each entry drives one order: how far through the escrow lifecycle it's pushed,
// whether it's placed with the affiliate's referral code, and the quantity bought.
const ORDER_PLAN = [
  { depth: 'DONE', referred: true, qty: 2 },
  { depth: 'DONE', referred: true, qty: 1 },
  { depth: 'DONE', referred: false, qty: 1 },
  { depth: 'DONE', referred: true, qty: 3 },
  { depth: 'DONE', referred: false, qty: 2 },
  { depth: 'FULLY_DEPOSITED', referred: true, qty: 1 },
  { depth: 'FULLY_DEPOSITED', referred: false, qty: 1 },
  { depth: 'DEPOSIT_ESCROW', referred: false, qty: 2 },
  { depth: 'DEPOSIT_ESCROW', referred: true, qty: 1 },
  { depth: 'DONE', referred: false, qty: 1 },
];

const REVIEW_COMMENTS = [
  { rating: 5, comment: 'Excellent quality, exactly as described. Fast delivery too!' },
  { rating: 4, comment: 'Really happy with this, fits well and looks great.' },
  { rating: 5, comment: 'Would buy again. Great value for the price.' },
];

// Local nonce cache, keyed by lowercased address — eth_getTransactionCount("latest"/"pending")
// on this local Hardhat node has repeatedly proven stale for back-to-back sends from the same
// signer, so nonces are assigned explicitly instead of relying on ethers' automatic resolution.
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

async function patchItemStatus(orderId, productId, status, token) {
  await apiCall(`/orders/${orderId}/item-status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ productId, status }),
  });
}

async function runOrder({ plan, index, buyerSession, buyerWallet, product, sellerWallet, escrowAbi, addresses, provider, affiliateAddress, affiliateCode }) {
  const referrerCode = plan.referred ? affiliateCode : undefined;

  const order = await apiCall('/orders', {
    method: 'POST',
    headers: authHeaders(buyerSession.accessToken),
    body: JSON.stringify({
      items: [{ productId: product.id, quantity: plan.qty }],
      referralCode: referrerCode,
    }),
  });
  const item = order.items[0];

  const productIdBytes32 = toBytes32(String(product.id));
  const orderIdBytes32 = toBytes32(String(item.orderContractId));
  const referrerAddress = plan.referred ? affiliateAddress : ethers.ZeroAddress;

  const escrowWei = ethers.parseEther((product.escrow * plan.qty).toFixed(8));
  const restWei = ethers.parseEther(((product.price - product.escrow) * plan.qty).toFixed(8));

  const escrowAsBuyer = new ethers.Contract(addresses.escrow, escrowAbi, buyerWallet);
  const escrowAsSeller = new ethers.Contract(addresses.escrow, escrowAbi, sellerWallet);

  await sendTx(provider, escrowAsBuyer, buyerWallet, 'depositEarnest', [
    productIdBytes32,
    orderIdBytes32,
    plan.qty,
    referrerAddress,
  ], { value: escrowWei });
  await patchItemStatus(order.id, product.id, 'DEPOSIT_ESCROW', buyerSession.accessToken);

  if (plan.depth === 'FULLY_DEPOSITED' || plan.depth === 'DONE') {
    await sendTx(provider, escrowAsSeller, sellerWallet, 'approveProduct', [
      productIdBytes32,
      orderIdBytes32,
      buyerWallet.address,
    ]);
    await sendTx(provider, escrowAsBuyer, buyerWallet, 'depositRestAmount', [orderIdBytes32], {
      value: restWei,
    });
    await patchItemStatus(order.id, product.id, 'FULLY_DEPOSITED', buyerSession.accessToken);
  }

  if (plan.depth === 'DONE') {
    await sendTx(provider, escrowAsSeller, sellerWallet, 'finalizeOrder', [orderIdBytes32, buyerWallet.address]);
    await patchItemStatus(order.id, product.id, 'SELLER_FINALIZED', buyerSession.accessToken);

    await sendTx(provider, escrowAsBuyer, buyerWallet, 'approveReceiveProduct', [orderIdBytes32]);
    await patchItemStatus(order.id, product.id, 'ORDER_RECEIVED', buyerSession.accessToken);

    await sendTx(provider, escrowAsSeller, sellerWallet, 'rewardOrder', [orderIdBytes32, buyerWallet.address]);
    await patchItemStatus(order.id, product.id, 'DONE', buyerSession.accessToken);

    const review = REVIEW_COMMENTS[index % REVIEW_COMMENTS.length];
    try {
      await apiCall(`/products/${product.id}/reviews`, {
        method: 'POST',
        headers: authHeaders(buyerSession.accessToken),
        body: JSON.stringify(review),
      });
    } catch {
      // buyer already reviewed this product in a previous run — fine to skip
    }
  }

  return { orderId: order.id, depth: plan.depth, referred: plan.referred, product: product.name, qty: plan.qty };
}

async function main() {
  const provider = getProvider();
  const addresses = getContractAddresses();
  const escrowAbi = loadAbi('Escrow');

  console.log('=== Logging into role accounts ===');
  const adminSession = await loginAccount(getHardhatWallet(ROLE_ACCOUNTS.admin.index, provider));
  if (adminSession.user.role !== 'ADMIN') {
    throw new Error('Admin account is not role=ADMIN yet — run scripts/01-generate-accounts.js first.');
  }

  const sellerSessions = [];
  for (const cfg of ROLE_ACCOUNTS.sellers) {
    const session = await loginAccount(getHardhatWallet(cfg.index, provider));
    if (session.user.role !== 'SELLER') {
      throw new Error(`${cfg.name} is not role=SELLER yet — run scripts/01-generate-accounts.js first.`);
    }
    sellerSessions.push(session);
  }

  const affiliateSession = await loginAccount(getHardhatWallet(ROLE_ACCOUNTS.affiliate.index, provider));
  if (affiliateSession.user.role !== 'AFFILIATE') {
    throw new Error('Affiliate account is not role=AFFILIATE yet — run scripts/01-generate-accounts.js first.');
  }
  const affiliateAddress = affiliateSession.wallet.address;
  const affiliateCode = affiliateSession.user.referralCode;
  console.log(`Affiliate referral code: ${affiliateCode}`);

  const buyerSessions = [];
  for (const cfg of ROLE_ACCOUNTS.buyers) {
    buyerSessions.push(await loginAccount(getHardhatWallet(cfg.index, provider)));
  }

  console.log('\n=== Loading seller product catalogs ===');
  const allProducts = [];
  for (let i = 0; i < sellerSessions.length; i++) {
    const resp = await apiCall('/products/me?page=1&limit=50', {
      headers: authHeaders(sellerSessions[i].accessToken),
    });
    const items = resp.data || [];
    if (items.length === 0) {
      throw new Error(
        `${ROLE_ACCOUNTS.sellers[i].name} has no products yet — run scripts/01-generate-accounts.js first.`,
      );
    }
    for (const p of items) {
      allProducts.push({
        id: p.id || p._id,
        name: p.name,
        price: p.price,
        escrow: p.escrow,
        sellerIndex: i,
      });
    }
  }
  console.log(`Loaded ${allProducts.length} products across ${sellerSessions.length} sellers.`);

  console.log('\n=== Placing orders ===');
  const results = [];
  for (let i = 0; i < ORDER_PLAN.length; i++) {
    const plan = ORDER_PLAN[i];
    const buyerSession = buyerSessions[i % buyerSessions.length];
    const buyerWallet = getHardhatWallet(ROLE_ACCOUNTS.buyers[i % buyerSessions.length].index, provider);
    const product = allProducts[i % allProducts.length];
    const sellerWallet = getHardhatWallet(ROLE_ACCOUNTS.sellers[product.sellerIndex].index, provider);

    process.stdout.write(
      `Order ${i + 1}/${ORDER_PLAN.length}: ${product.name} x${plan.qty} -> ${plan.depth}` +
        `${plan.referred ? ' (referred)' : ''}... `,
    );

    const result = await runOrder({
      plan,
      index: i,
      buyerSession,
      buyerWallet,
      product,
      sellerWallet,
      escrowAbi,
      addresses,
      provider,
      affiliateAddress,
      affiliateCode,
    });
    results.push(result);
    console.log('done');
  }

  console.log('\n=== Creating admin Airdrop campaign for top affiliates ===');
  const campaign = await apiCall('/admin/airdrop', {
    method: 'POST',
    headers: authHeaders(adminSession.accessToken),
    body: JSON.stringify({ name: 'Top Affiliate Rewards', topN: 1, rewardPerRecipientEth: 0.05 }),
  });
  console.log(`Campaign #${campaign.campaignId} created (draft), merkle root computed for top affiliate.`);

  await apiCall(`/admin/airdrop/${campaign.campaignId}/approve`, {
    method: 'POST',
    headers: authHeaders(adminSession.accessToken),
  });
  console.log(`Campaign #${campaign.campaignId} approved and funded on-chain.`);
  console.log('The affiliate can now claim it from the "Airdrop" card on /affiliate.');

  console.log('\n=== Summary ===');
  console.table(results);
  const doneCount = results.filter((r) => r.depth === 'DONE').length;
  const referredCount = results.filter((r) => r.referred).length;
  console.log(`${results.length} orders placed — ${doneCount} completed, ${referredCount} referred by the affiliate.`);
}

main().catch((err) => {
  console.error('\nMock data generation failed:', err);
  process.exit(1);
});
