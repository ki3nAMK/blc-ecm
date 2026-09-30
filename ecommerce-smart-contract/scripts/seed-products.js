// seed-products.js
// Seed products và reviews vào MongoDB từ product.json
// Chạy: node scripts/seed-products.js
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pizza?replicaSet=rs0";
const DB_NAME = process.env.MONGODB_DB_NAME || "pizza";

// product.json nằm ở ecommerce-contract-api
const PRODUCT_JSON_PATH = path.resolve(__dirname, "../../ecommerce-contract-api/product.json");

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log("✅ Connected to MongoDB");

  const db = client.db(DB_NAME);

  // 3 seller IDs - khớp với seed-product.service.ts
  const sellers = [
    new ObjectId("692bb953007be6c2b9e1bfbe"), // Seller One
    new ObjectId("69304403f2c21e98d1fb2cba"),  // Seller Two
    new ObjectId("69304427f2c21e98d1fb2cc5"),  // Seller Three
  ];

  // Đọc product.json
  console.log("📖 Reading product.json from:", PRODUCT_JSON_PATH);
  const rawData = fs.readFileSync(PRODUCT_JSON_PATH, "utf-8");
  const data = JSON.parse(rawData);
  const products = data.products || data; // handle both {products: [...]} and direct array
  console.log(`📦 Found ${products.length} products in JSON`);

  // Clear existing data
  await db.collection("products").deleteMany({});
  await db.collection("productreviews").deleteMany({});
  console.log("🗑️ Cleared existing products and reviews");

  let sellerIndex = 0;
  let insertedProducts = 0;
  let insertedReviews = 0;

  for (const prod of products) {
    // Assign seller vòng tròn
    const sellerId = sellers[sellerIndex % sellers.length];
    sellerIndex++;

    // Tách reviews
    const reviewsData = prod.reviews || [];
    const { reviews, id, _id, ...prodData } = prod; // remove reviews, id, _id

    // Tạo random price/escrow nếu chưa có
    const randomPrice = parseFloat((Math.random() * (3 - 0.5) + 0.5).toFixed(4));
    const price = prodData.price || randomPrice;
    const escrow = prodData.escrow || parseFloat((price / 2).toFixed(4));
    const available = prodData.available || prodData.quantity || 10;

    // Insert product
    const productResult = await db.collection("products").insertOne({
      ...prodData,
      sellerId,
      price,
      escrow,
      priceSale: prodData.priceSale || parseFloat((price - 0.1).toFixed(4)),
      available,
      reviews: [],
      totalReviews: 0,
      totalRatings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const productId = productResult.insertedId;
    insertedProducts++;

    // Insert reviews
    const reviewIds = [];
    for (const review of reviewsData) {
      const { id: rid, _id: _, ...reviewData } = review;
      const reviewResult = await db.collection("productreviews").insertOne({
        ...reviewData,
        productId,
        postedAt: new Date(review.postedAt || new Date()),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      reviewIds.push(reviewResult.insertedId);
      insertedReviews++;
    }

    // Update product với reviewIds và ratings
    if (reviewIds.length > 0) {
      const ratings = reviewsData
        .map((r) => r.rating)
        .filter((r) => typeof r === "number");
      const avgRating =
        ratings.length > 0
          ? parseFloat(
              (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            )
          : 0;

      await db.collection("products").updateOne(
        { _id: productId },
        {
          $set: {
            reviews: reviewIds,
            totalReviews: reviewIds.length,
            totalRatings: avgRating,
          },
        }
      );
    }
  }

  console.log(`✅ Inserted ${insertedProducts} products`);
  console.log(`✅ Inserted ${insertedReviews} reviews`);

  // Verify
  const productCount = await db.collection("products").countDocuments();
  const reviewCount = await db.collection("productreviews").countDocuments();
  console.log(`📊 Final: ${productCount} products, ${reviewCount} reviews in DB`);

  await client.close();
  console.log("✅ MongoDB connection closed. Seed completed!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
