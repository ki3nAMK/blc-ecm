import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      gas: 12000000,
      // Use Hardhat default accounts (same as npx hardhat node)
      accounts: [
        process.env.ADMIN_PRIVATE_KEY ||
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        process.env.SELLER1_PRIVATE_KEY ||
          "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
        process.env.SELLER2_PRIVATE_KEY ||
          "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
        process.env.SELLER3_PRIVATE_KEY ||
          "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
        process.env.BUYER_PRIVATE_KEY ||
          "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926b",
      ],
    },
  },
};

export default config;

