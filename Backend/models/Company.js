import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String, required: true },
    industry: { type: String, required: true },
    size: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    openPositions: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    benefits: [String],
    featured: { type: Boolean, default: false },
    website: { type: String },
    founded: { type: String },
    linkedin: { type: String },
    email: { type: String },
    phone: { type: String }
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
