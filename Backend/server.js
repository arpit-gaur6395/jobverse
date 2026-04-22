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
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!process.env.JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is not set in environment variables");
    process.exit(1);
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
app.use("/api/resume", resumeRoutes);

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/JP")
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("DB connection failed:", err));

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
