require("dotenv").config();
var _ = require("lodash");

const { getProducts } = require("./connect-database.js");
const { handleGetClient } = require("./helper.js");
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deploy & setup...");

  const users = await ethers.getSigners();
  const { admin, seller1, seller2, seller3, buyer } = handleGetClient(users);

  console.log("✅ Signers loaded:");
  console.log("Admin:", admin.address);
  console.log("Seller1:", seller1.address);
  console.log("Seller2:", seller2.address);
  console.log("Seller3:", seller3.address);
  console.log("Buyer:", buyer ? buyer.address : "(not in localhost accounts - OK for deploy)");


  // ================= DEPLOY ERC1155 =================
  console.log("\n📦 Deploying ERC1155...");

  const MyERC1155 = await ethers.getContractFactory(
    process.env.ERC1155_CONTRACT,
    admin
  );

  const myErc1155Contract = await MyERC1155.deploy(process.env.CONTRACT_URL);
  await myErc1155Contract.waitForDeployment();

  const myErc1155Address = await myErc1155Contract.getAddress();
  console.log("✅ ERC1155 deployed at:", myErc1155Address);

  // ================= DEPLOY ESCROW =================
  console.log("\n📦 Deploying Escrow...");

  const Escrow = await ethers.getContractFactory(process.env.ESCROW_CONTRACT);
  const escrowContract = await Escrow.deploy(
    admin.address,
    [seller1.address, seller2.address, seller3.address],
    myErc1155Address
  );
  await escrowContract.waitForDeployment();

  console.log("✅ Escrow deployed at:", escrowContract.target);

  // ================= DEPLOY AIRDROP DISTRIBUTOR =================
  console.log("\n📦 Deploying AirdropDistributor...");

  const AirdropDistributor = await ethers.getContractFactory("AirdropDistributor");
  const airdropContract = await AirdropDistributor.deploy(admin.address);
  await airdropContract.waitForDeployment();

  console.log("✅ AirdropDistributor deployed at:", airdropContract.target);

  // ================= LOAD MONGO PRODUCTS =================
  console.log("\n📥 Loading products from MongoDB...");
  const mapSellerProduct = await getProducts();
  const totalProduct = _.reduce(
    mapSellerProduct,
    (sum, val) => sum + _.size(val.seller.products),
    0
  );
  console.log(
    `✅ Mongo product map loaded successfull: ${_.size(
      mapSellerProduct
    )} sellers with total: ${totalProduct} products`
  );

  // ================= APPROVAL =================
  console.log("\n✅ Setting approval for Escrow...");

  for (const seller of [seller1, seller2, seller3]) {
    const tx = await myErc1155Contract
      .connect(seller)
      .setApprovalForAll(escrowContract.target, true);

    await tx.wait();
    console.log(`✅ Approval success for seller: ${seller.address}`);
  }

  // ================= MINT + LIST =================
  console.log("\n🪙 Minting & Listing Products...");

  const sellerArray = [seller1, seller2, seller3];

  for (let sellerIndex = 0; sellerIndex < sellerArray.length; sellerIndex++) {
    const seller = sellerArray[sellerIndex];

    console.log(`\n👤 Processing seller: ${seller.address}`);

    const products = _.find(
      mapSellerProduct,
      (mapper) =>
        mapper.seller.address.toLowerCase() === seller.address.toLowerCase()
    );

    if (!products || !products.seller.products.length) {
      console.log("⚠️ No products for seller:", seller.address);
      continue;
    }

    for (let i = 0; i < products.seller.products.length; i++) {
      const prod = products.seller.products[i];

      console.log(`\n📦 Product ${i + 1}/${products.seller.products.length}`);
      console.log("Mongo Product ID:", prod.id);
      console.log("Available:", prod.available);
      console.log("Price:", prod.price);
      console.log("Escrow:", prod.escrow);

      if (prod.available <= 0) {
        console.log(`=> Product is not enough quantity: ${prod.available}`);
        continue;
      }

      const productId = ethers.encodeBytes32String(prod.id);

      // ======== MINT ========
      console.log("🪙 Minting ERC1155 token...");

      const mintTx = await myErc1155Contract
        .connect(admin)
        .mintAuto(seller.address, prod.available, "0x");

      const mintReceipt = await mintTx.wait();

      const tokenId = mintReceipt.logs
        .map((log) => {
          try {
            return myErc1155Contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e) => e && e.name === "TransferSingle").args.id;

      console.log("✅ Mint success | Token ID:", tokenId.toString());

      // ======== LIST TO ESCROW ========
      console.log("📝 Listing product to Escrow...");

      const price = ethers.parseUnits(prod.price.toString(), 18);
      const escrow = ethers.parseUnits(prod.escrow.toString(), 18);

      const listTx = await escrowContract
        .connect(seller)
        .list(productId, escrow, price, prod.available, tokenId);

      await listTx.wait();

      console.log("✅ Listed successfully!");
    }
  }

  // ================= UPDATE FRONTEND CONFIG =================
  const fs = require("fs");
  const path = require("path");
  const configPath = path.join(__dirname, "../../ecommerce-contract/src/config/blockchain.json");

  if (fs.existsSync(configPath)) {
    const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (configData["31337"]) {
      configData["31337"].myErc1155.address = myErc1155Address;
      configData["31337"].escrow.address = escrowContract.target;
      configData["31337"].airdrop = { address: airdropContract.target };
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), "utf8");
      console.log(`\n⚙️  Updated frontend blockchain.json with new contract addresses!`);
    }
  }

  // ================= UPDATE BACKEND CONFIG =================
  const yaml = require("js-yaml");
  const backendConfigPath = path.join(__dirname, "../../ecommerce-contract-api/config.yml");

  if (fs.existsSync(backendConfigPath)) {
    const backendConfig = yaml.load(fs.readFileSync(backendConfigPath, "utf8"));
    if (backendConfig.blockchain) {
      backendConfig.blockchain.erc1155Address = myErc1155Address;
      backendConfig.blockchain.escrowAddress = escrowContract.target;
      backendConfig.blockchain.airdropAddress = airdropContract.target;
      fs.writeFileSync(backendConfigPath, yaml.dump(backendConfig), "utf8");
      console.log(`⚙️  Updated backend config.yml with new contract addresses!`);
    }
  }

  // ================= SYNC ABIs =================
  // Keeps both apps' static ABI copies in lockstep with the compiled contracts —
  // deploy.js only used to sync addresses, so a contract function/event change (like
  // adding flash sale support to Escrow) silently left both apps calling against a
  // stale ABI until this was added.
  const artifactsToSync = [
    { name: "Escrow", path: "contracts/Escrow.sol/Escrow.json" },
    { name: "MyERC1155", path: "contracts/MyErc1155.sol/MyERC1155.json" },
    { name: "AirdropDistributor", path: "contracts/AirdropDistributor.sol/AirdropDistributor.json" },
  ];

  for (const { name, path: artifactRelPath } of artifactsToSync) {
    const artifactPath = path.join(__dirname, "../artifacts", artifactRelPath);
    if (!fs.existsSync(artifactPath)) continue;

    const { abi } = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abiJson = JSON.stringify(abi, null, 2);

    for (const abiDir of [
      path.join(__dirname, "../../ecommerce-contract-api/src/abis"),
      path.join(__dirname, "../../ecommerce-contract/src/abis"),
    ]) {
      const target = path.join(abiDir, `${name}.json`);
      if (fs.existsSync(abiDir)) {
        fs.writeFileSync(target, abiJson, "utf8");
      }
    }
  }
  console.log("⚙️  Synced compiled ABIs into both apps' src/abis/");

  console.log("\n🎉 ALL PROCESS COMPLETED SUCCESSFULLY!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
