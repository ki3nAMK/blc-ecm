// seed-users.js
// Chạy: node seed-users.js
const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URI = "mongodb://localhost:27017/pizza?replicaSet=rs0";
const DB_NAME = "pizza";

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log("✅ Connected to MongoDB");

  const db = client.db(DB_NAME);

  // Clear existing users
  await db.collection("users").deleteMany({});
  console.log("🗑️ Cleared existing users");

  // Hardhat default accounts (mnemonic: test test test ... junk)
  // Account #0 = Admin
  // Account #1 = Seller1  => ObjectId: 692bb953007be6c2b9e1bfbe (from seed-product.service.ts)
  // Account #2 = Seller2  => ObjectId: 69304403f2c21e98d1fb2cba
  // Account #3 = Seller3  => ObjectId: 69304427f2c21e98d1fb2cc5
  // Account #4 = Buyer

  const users = [
    {
      _id: new ObjectId("692aa000007be6c2b9e1bfaa"), // admin
      name: "Admin",
      email: "admin@pizza.com",
      color: "#1976d2",
      avatar:
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
      role: "ADMIN",
      nonce: Math.floor(Math.random() * 10000),
      publicAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      _id: new ObjectId("692bb953007be6c2b9e1bfbe"), // seller1 - hardcoded in seed-product.service.ts
      name: "Seller One",
      email: "seller1@pizza.com",
      color: "#e91e63",
      avatar:
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
      role: "SELLER",
      nonce: Math.floor(Math.random() * 10000),
      publicAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      _id: new ObjectId("69304403f2c21e98d1fb2cba"), // seller2 - hardcoded in seed-product.service.ts
      name: "Seller Two",
      email: "seller2@pizza.com",
      color: "#4caf50",
      avatar:
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
      role: "SELLER",
      nonce: Math.floor(Math.random() * 10000),
      publicAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      _id: new ObjectId("69304427f2c21e98d1fb2cc5"), // seller3 - hardcoded in seed-product.service.ts
      name: "Seller Three",
      email: "seller3@pizza.com",
      color: "#ff9800",
      avatar:
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
      role: "SELLER",
      nonce: Math.floor(Math.random() * 10000),
      publicAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      _id: new ObjectId("692aa111007be6c2b9e1bfbb"), // buyer
      name: "Buyer One",
      email: "buyer@pizza.com",
      color: "#9c27b0",
      avatar:
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
      role: "CLIENT",
      nonce: Math.floor(Math.random() * 10000),
      publicAddress: "0x15d34AAf54267DB7d7C367839AAf71A00a2C6A65",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  const result = await db.collection("users").insertMany(users);
  console.log(`✅ Inserted ${result.insertedCount} users`);

  for (const user of users) {
    console.log(`  - [${user.role}] ${user.name}: ${user.publicAddress} (ID: ${user._id})`);
  }

  await client.close();
  console.log("✅ MongoDB connection closed");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
