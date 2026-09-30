// Shared configuration + helpers for the dev-data scripts (00-reset, 01-generate-accounts, 02-mock-data).
// Deliberately dependency-free: reuses `ethers`/`mongodb` from ecommerce-smart-contract's own
// node_modules (same packages already used by its own scripts/) instead of shipping a package.json here.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SMART_CONTRACT_DIR = path.join(ROOT, 'ecommerce-smart-contract');
const API_DIR = path.join(ROOT, 'ecommerce-contract-api');
const FRONTEND_DIR = path.join(ROOT, 'ecommerce-contract');

const { ethers } = require(path.join(SMART_CONTRACT_DIR, 'node_modules', 'ethers'));
const { MongoClient, ObjectId } = require(path.join(SMART_CONTRACT_DIR, 'node_modules', 'mongodb'));

const API_URL = 'http://localhost:3000/api/v1';
const RPC_URL = 'http://127.0.0.1:8545';
const MONGO_URI = 'mongodb://localhost:27017/pizza?replicaSet=rs0';
const DB_NAME = 'pizza';

// Standard Hardhat default mnemonic — the same one `npx hardhat node` derives its 20
// funded default accounts from. Indices 0-4 below are exactly the addresses already
// hardcoded in ecommerce-smart-contract/.env (ADMIN/SELLER1-3/BUYER_ADDRESS).
const MNEMONIC = 'test test test test test test test test test test test junk';

// Role accounts used by both 01-generate-accounts.js and 02-mock-data.js.
// Indices are stable across runs so re-seeding always produces the same addresses.
const ROLE_ACCOUNTS = {
  admin: { index: 0, role: 'ADMIN', name: 'Admin' },
  sellers: [
    { index: 1, role: 'SELLER', name: 'Seller One' },
    { index: 2, role: 'SELLER', name: 'Seller Two' },
    { index: 3, role: 'SELLER', name: 'Seller Three' },
  ],
  buyers: [
    { index: 4, role: 'CLIENT', name: 'Buyer One' },
    { index: 6, role: 'CLIENT', name: 'Buyer Two' },
  ],
  affiliate: { index: 5, role: 'AFFILIATE', name: 'Affiliate One' },
};

function getHardhatWallet(index, provider) {
  const wallet = ethers.HDNodeWallet.fromPhrase(MNEMONIC, undefined, `m/44'/60'/0'/0/${index}`);
  return provider ? wallet.connect(provider) : wallet;
}

function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

async function apiCall(urlPath, opts = {}) {
  const res = await fetch(`${API_URL}${urlPath}`, opts);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`${opts.method || 'GET'} ${urlPath} -> ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

// Registers (idempotent — returns the existing account if already registered) and logs
// in via the real signature-based auth flow, exactly like a MetaMask login would.
async function loginAccount(wallet) {
  const created = await apiCall('/auth/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicAddress: wallet.address }),
  });
  const user = created.data;
  const signature = await wallet.signMessage(`I am signing my one-time nonce: ${user.nonce}`);
  const login = await apiCall('/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicAddress: wallet.address, signature }),
  });
  const me = await apiCall('/users/me', { headers: authHeaders(login.accessToken) });
  return { wallet, accessToken: login.accessToken, user: me };
}

async function withMongo(fn) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  try {
    return await fn(client.db(DB_NAME));
  } finally {
    await client.close();
  }
}

// Matches the encoding already used throughout the app (FE's use-list-product-on-chain.ts,
// the deploy.js auto-lister): a Mongo ObjectId hex string fits well within bytes32-as-UTF8.
function toBytes32(hexId) {
  try {
    return ethers.encodeBytes32String(hexId);
  } catch {
    return `0x${hexId.padStart(64, '0')}`;
  }
}

function getContractAddresses() {
  const configPath = path.join(FRONTEND_DIR, 'src', 'config', 'blockchain.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const chain = config['31337'];
  return {
    myErc1155: chain.myErc1155.address,
    escrow: chain.escrow.address,
    airdrop: chain.airdrop.address,
  };
}

function loadAbi(name) {
  const abiPath = path.join(API_DIR, 'src', 'abis', `${name}.json`);
  return JSON.parse(fs.readFileSync(abiPath, 'utf8'));
}

module.exports = {
  ROOT,
  SMART_CONTRACT_DIR,
  API_DIR,
  FRONTEND_DIR,
  ethers,
  ObjectId,
  API_URL,
  RPC_URL,
  MONGO_URI,
  DB_NAME,
  MNEMONIC,
  ROLE_ACCOUNTS,
  getHardhatWallet,
  getProvider,
  apiCall,
  authHeaders,
  loginAccount,
  withMongo,
  toBytes32,
  getContractAddresses,
  loadAbi,
};
