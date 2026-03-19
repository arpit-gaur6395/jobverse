import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    jobCount: { type: Number, default: 0 },
    color: { type: String, required: true },
    subcategories: [String],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    growth: { type: String, default: "0%" }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
