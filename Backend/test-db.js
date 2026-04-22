import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

console.log("Testing MongoDB connection...");
console.log("Connection string:", MONGO_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Database connected successfully!");
        mongoose.connection.close();
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Database connection failed:");
        console.error(err.message);
        process.exit(1);
    });
