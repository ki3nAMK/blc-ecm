require("dotenv").config();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGO_URI || !DB_NAME) {
  throw new Error("❌ Thiếu MONGO_URI hoặc MONGO_DB_NAME trong .env");
}

async function connectMongo() {
  const client = new MongoClient(MONGO_URI);

  try {
    console.log("⏳ Connecting to MongoDB...");
    await client.connect();

    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    return { client, db };
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

async function getProducts() {
  const { client, db } = await connectMongo();

  const collections = await db.listCollections().toArray();
  console.log(
    "📦 Collections:",
    collections.map((c) => c.name)
  );

  const sellers = await db
    .collection("users")
    .find({
      role: "SELLER",
    })
    .toArray();

  console.log(`✅ Found ${sellers.length} sellers`);

  const result = [];

  for (const seller of sellers) {
    const products = await db
      .collection("products")
      .find({
        sellerId: new ObjectId(seller._id),
      })
      .toArray();

    const productIds = products.map((p) => ({
      id: p._id.toString(),
      available: p.available,
      price: p.price,
      escrow: p.escrow,
    }));

    result.push({
      seller: {
        id: seller._id.toString(),
        address: seller.publicAddress,
        products: productIds,
      },
    });
  }

  await client.close();
  console.log("✅ MongoDB closed");

  return result;
}

module.exports = {
  getProducts,
};
