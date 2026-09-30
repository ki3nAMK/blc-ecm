// Resets the local dev stack back to an empty baseline: wipes MongoDB, resets the
// Hardhat chain to genesis, and redeploys the 3 contracts fresh (which also re-syncs
// their addresses into both the frontend and backend configs).
//
// Run this FIRST whenever you want a clean slate — before 01-generate-accounts.js.
//
// Usage: node scripts/00-reset-data.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { getProvider, withMongo, SMART_CONTRACT_DIR, API_DIR } = require('./config');

// Every collection this app writes to. Kept as an explicit list (rather than
// "drop the whole database") so indexes/collection options survive a reset.
const COLLECTIONS_TO_CLEAR = [
  'users',
  'products',
  'productreviews',
  'orders',
  'airdropcampaigns',
  'blogs',
];

async function resetChain() {
  console.log('\n[1/4] Resetting Hardhat chain to genesis (hardhat_reset)...');
  const provider = getProvider();
  await provider.send('hardhat_reset', []);
  console.log('      Done — all balances and contract state wiped.');
}

function redeployContracts() {
  console.log('\n[2/4] Redeploying contracts and syncing FE/BE configs...');
  execSync('npx hardhat run scripts/deploy.js --network localhost', {
    cwd: SMART_CONTRACT_DIR,
    stdio: 'inherit',
  });
}

async function resetDatabase() {
  console.log('\n[3/4] Wiping MongoDB collections...');
  await withMongo(async (db) => {
    for (const name of COLLECTIONS_TO_CLEAR) {
      const result = await db.collection(name).deleteMany({});
      console.log(`      - ${name}: removed ${result.deletedCount} document(s)`);
    }
  });
}

function clearUploads() {
  console.log('\n[4/4] Clearing uploaded images...');
  for (const dir of ['products', 'blog']) {
    const uploadsDir = path.join(API_DIR, 'uploads', dir);
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    }
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`      Cleared ${uploadsDir}`);
  }
}

async function main() {
  console.log('=== Resetting dev data to a clean, empty baseline ===');
  console.log('(Mongo is wiped BEFORE redeploying, since deploy.js auto-lists');
  console.log(' whatever products are currently in Mongo for the 3 default sellers.)');

  // Mongo must be emptied before redeploy — deploy.js reads Mongo to auto-list any
  // existing seller products on the freshly deployed contracts. Wiping first means
  // the redeploy comes out with zero pre-listed products, i.e. a truly clean slate.
  await resetDatabase();
  await resetChain();
  redeployContracts();
  clearUploads();

  console.log('\n=== Reset complete ===');
  console.log('Chain, database, and uploaded files are now empty.');
  console.log('\nIMPORTANT: restart the backend (`yarn start:dev` in ecommerce-contract-api)');
  console.log('so it picks up the freshly deployed contract addresses from config.yml —');
  console.log('nest-cli does not hot-reload plain config file edits.');
  console.log('\nNext: node scripts/01-generate-accounts.js');
}

main().catch((err) => {
  console.error('\nReset failed:', err);
  process.exit(1);
});
