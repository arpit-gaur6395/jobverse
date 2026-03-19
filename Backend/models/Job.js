
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: String, required: true },
    company: { type: String, required: true },
    jobType: { type: String, required: true },
    salary: { type: String, default: "Not specified" },
    location: { type: String, required: true },
    jobDescription: { type: String, required: true },
    applicants: [
        {
            name: String,
            email: String,
            appliedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
