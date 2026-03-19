// ========================================
// 🚀 JOB PORTAL API - Vercel Serverless
// ========================================
// Main API server for job portal application
// Configured for Vercel serverless deployment
// ========================================

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Import route handlers
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

// ========================================
// 📋 INITIALIZE CONFIGURATION
// ========================================

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();

// ========================================
// 🛡️ MIDDLEWARE SETUP
// ========================================

// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ========================================
// 🛤️ API ROUTES
// ========================================

// Authentication routes (register, login, verify)
app.use("/api/auth", authRoutes);

// Job management routes (post, get, update, delete, apply)
app.use("/api/jobs", jobRoutes);

// ========================================
// 🗄️ DATABASE CONNECTION
// ========================================

// Connect to MongoDB if not already connected
if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/JP")
        .then(() => console.log("✅ Database connected successfully"))
        .catch((err) => console.log("❌ Database connection failed:", err));
}

// ========================================
// 🚀 SERVERLESS EXPORT
// ========================================

// Export for Vercel serverless function deployment
export default async function handler(req, res) {
    return app(req, res);
}
