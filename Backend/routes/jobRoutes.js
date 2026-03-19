import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import {
  getJob,
  postJob,
  applyJob,
  deleteJob,
  updateJob,
  getApplicantsByJob,
  deleteApplicant,
  checkApplicationStatus,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
  deleteApplication,
  getMyJobs
} from "../controllers/jobController.js";
import { authenticateToken } from "../middleware/auth.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// ========================================
// 📋 JOB ROUTES CONFIGURATION
// ========================================

const router = express.Router();

// ========================================
// 📁 FILE UPLOAD CONFIGURATION
// ========================================

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// ========================================
// 🚀 PUBLIC JOB ROUTES
// ========================================

// Get all jobs (public access)
router.get("/getjob", getJob);

// ========================================
// 🔐 PROTECTED JOB ROUTES
// ========================================

// Job management (employer only)
router.post("/postjob", authenticateToken, postJob);
router.delete("/:id", authenticateToken, deleteJob);
router.put("/:id", authenticateToken, updateJob);
router.get("/my-jobs", authenticateToken, getMyJobs);

// Job applications (job seekers)
router.post("/apply/:jobId", authenticateToken, upload.fields([{ name: "resume" }, { name: "photo" }]), applyJob);
router.get("/check-status/:jobId", authenticateToken, checkApplicationStatus);
router.get("/my-applications", authenticateToken, getMyApplications);

// Application management (employers)
router.get("/applicants/:jobId", authenticateToken, getApplicantsByJob);
router.get("/employer-applications", authenticateToken, getEmployerApplications);
router.patch("/application/:id/status", authenticateToken, updateApplicationStatus);
router.delete("/application/:id", authenticateToken, deleteApplication);
router.delete("/applicant/:id", authenticateToken, deleteApplicant);

// ========================================
// � EXPORT ROUTER
// ========================================

export default router;
