// check-accounts.js - kiểm tra accounts khi connect tới localhost network
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  console.log("Total signers:", signers.length);
  for (const s of signers) {
    console.log("Address:", s.address);
  }
}

main().catch(console.error);
