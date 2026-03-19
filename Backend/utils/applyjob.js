import multer from "multer";
import path from "path";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const applyJob = [
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { jobId } = req.params;
      const { name, email } = req.body;

      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      const resumePath = req.files?.resume ? req.files.resume[0].path : null;
      const photoPath = req.files?.photo ? req.files.photo[0].path : null;

      const application = new Application({
        job: jobId,
        userId: req.user?._id,
        name,
        email,
        resume: resumePath,
        photo: photoPath,
      });

      await application.save();

      res.status(201).json({ message: "Application submitted", application });
    } catch (err) {
      console.error("Error in applyJob:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
];
