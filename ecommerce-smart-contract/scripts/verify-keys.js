const { ethers } = require("ethers");

const keys = [
  { name: "admin", key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" },
  { name: "seller1", key: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" },
  { name: "seller2", key: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a" },
  { name: "seller3", key: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6" },
  { name: "buyer",  key: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926b" },
];

for (const { name, key } of keys) {
  const wallet = new ethers.Wallet(key);
  console.log(`${name}: ${wallet.address}`);
}
