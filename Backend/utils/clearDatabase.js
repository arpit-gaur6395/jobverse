import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/JP");
    console.log("Connected to MongoDB");

    // Get all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log("Found collections:", collections.map(c => c.name));

    // Drop each collection
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`Dropped collection: ${collection.name}`);
    }

    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

clearDatabase();
