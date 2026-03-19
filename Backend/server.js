import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";


import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set a default JWT_SECRET for development if not provided
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "development_jwt_secret_key_please_change_in_production_1234567890abcdef";
    console.log("Warning: Using default JWT_SECRET for development. Please set JWT_SECRET in production.");
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/stats", statsRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/JP")
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("DB connection failed:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
