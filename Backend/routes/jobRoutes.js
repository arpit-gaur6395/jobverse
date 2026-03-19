import express from "express";
import path from "path";
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
import multer from "multer";
import fs from "fs";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/getjob", getJob);
router.post("/postjob", authenticateToken, postJob);
router.delete("/:id", authenticateToken, deleteJob);
router.put("/:id", authenticateToken, updateJob);

// Test route to check if uploads are accessible
router.get("/test-uploads", (req, res) => {
  try {
    const fs = require('fs');
    const uploadsDir = path.join(process.cwd(), "uploads");
    const files = fs.readdirSync(uploadsDir);
    res.json({
      message: "Files in uploads directory",
      uploadsPath: uploadsDir,
      files: files,
      accessibleVia: `/uploads/`,
      testUrls: files.map(file => `http://localhost:5000/uploads/${file}`)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Debug endpoint to check specific application
router.get("/debug/application/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id)
      .populate('job', 'job company userId')
      .populate('userId', 'name email role');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application data debug",
      applicationId: application._id,
      storedResume: application.resume,
      storedPhoto: application.photo,
      resumeUrl: application.resume ? `http://localhost:5000/uploads/${application.resume}` : null,
      photoUrl: application.photo ? `http://localhost:5000/uploads/${application.photo}` : null,
      applicant: {
        name: application.name,
        email: application.email
      },
      job: {
        id: application.job?._id,
        title: application.job?.job,
        company: application.job?.company
      }
    });
  } catch (err) {
    console.error("Debug application error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Debug endpoint to check application data
router.get("/debug/applications", authenticateToken, async (req, res) => {
  try {
    const employerId = req.user._id;
    const applications = await Application.find()
      .populate('job', 'job company userId')
      .populate('userId', 'name email role')
      .sort({ appliedAt: -1 });

    res.json({
      message: "All applications with file data",
      count: applications.length,
      applications: applications.map(app => ({
        id: app._id,
        name: app.name,
        email: app.email,
        resume: app.resume,
        photo: app.photo,
        resumeUrl: app.resume ? `http://localhost:5000/uploads/${app.resume}` : null,
        photoUrl: app.photo ? `http://localhost:5000/uploads/${app.photo}` : null,
        jobTitle: app.job?.job,
        jobCompany: app.job?.company
      }))
    });
  } catch (err) {
    console.error("Debug applications error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Simple file upload test endpoint
router.post("/test-upload", upload.fields([{ name: "testFile" }]), (req, res) => {
  try {
    const testFile = req.files.testFile ? req.files.testFile[0] : null;

    if (testFile) {
      res.json({
        message: "File uploaded successfully",
        file: {
          originalname: testFile.originalname,
          filename: testFile.filename,
          path: testFile.path,
          size: testFile.size,
          mimetype: testFile.mimetype
        },
        accessibleAt: `http://localhost:5000/uploads/${testFile.filename}`
      });
    } else {
      res.status(400).json({ message: "No file uploaded" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/apply/:jobId", authenticateToken, upload.fields([{ name: "resume" }, { name: "photo" }]), applyJob);

router.get("/applicants/:jobId", authenticateToken, getApplicantsByJob);

router.get("/check-status/:jobId", authenticateToken, checkApplicationStatus);

router.get("/my-applications", authenticateToken, getMyApplications);

router.get("/employer-applications", authenticateToken, getEmployerApplications);

router.get("/my-jobs", authenticateToken, getMyJobs);

// Debug route to check current user's jobs and applications
router.get("/debug/my-info", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Get user's jobs
    const jobs = await Job.find({ userId: userId }).select('_id job company userId');

    // Get applications for user's jobs
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', '_id job company userId')
      .select('_id name email status job');

    res.json({
      currentUser: {
        id: userId,
        role: userRole
      },
      jobs: jobs,
      applications: applications
    });
  } catch (err) {
    console.error("Debug info error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/application/:id/status", authenticateToken, updateApplicationStatus);

// Enhanced status update endpoint with more details
router.patch("/application/:id/status/verbose", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        details: {
          applicationId: id,
          user: req.user
        }
      });
    }

    const employerId = req.user._id;

    if (!employerId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
        details: {
          applicationId: id,
          user: req.user
        }
      });
    }

    console.log(`🔍 VERBOSE STATUS UPDATE CHECK`);
    console.log(`Application ID: ${id}`);
    console.log(`New Status: ${status}`);
    console.log(`Employer ID: ${employerId}`);
    console.log(`Employer Role: ${req.user.role}`);

    // Find application with full population
    const application = await Application.findById(id)
      .populate('job', 'job company userId')
      .populate('userId', 'name email role');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
        details: {
          applicationId: id,
          employerId: employerId
        }
      });
    }

    console.log(`Application Found:`, {
      applicationId: application._id,
      applicantName: application.name,
      applicantEmail: application.email,
      jobTitle: application.job?.job,
      jobCompany: application.job?.company,
      jobOwnerId: application.job?.userId,
      currentStatus: application.status
    });

    if (!application.job) {
      return res.status(404).json({
        success: false,
        message: "Associated job not found",
        details: {
          applicationId: id,
          jobId: application.job,
          application: application
        }
      });
    }

    if (!application.job.userId) {
      return res.status(404).json({
        success: false,
        message: "Job has no owner (userId missing)",
        details: {
          applicationId: id,
          job: application.job,
          jobId: application.job._id,
          jobTitle: application.job.job
        }
      });
    }

    // Ownership check
    const jobOwnerId = application.job.userId.toString();
    const currentEmployerId = employerId.toString();

    console.log(`Ownership check:`, {
      jobOwnerId: jobOwnerId,
      currentEmployerId: currentEmployerId,
      jobOwnerIdType: typeof jobOwnerId,
      currentEmployerIdType: typeof currentEmployerId,
      areEqual: jobOwnerId === currentEmployerId,
      strictEqual: jobOwnerId === currentEmployerId
    });

    if (jobOwnerId !== currentEmployerId) {
      return res.status(403).json({
        success: false,
        message: "You can only update applications for your own jobs",
        details: {
          applicationId: id,
          jobOwnerId: jobOwnerId,
          currentEmployerId: currentEmployerId,
          isOwner: jobOwnerId === currentEmployerId,
          jobTitle: application.job.job,
          jobCompany: application.job.company,
          jobOwnerIdType: typeof jobOwnerId,
          currentEmployerIdType: typeof currentEmployerId
        }
      });
    }

    // Update status
    application.status = status;
    await application.save();

    console.log(`✅ Status updated successfully`);

    res.json({
      success: true,
      message: "Application status updated successfully",
      application: application,
      details: {
        applicationId: id,
        oldStatus: application.status,
        newStatus: status,
        updatedBy: employerId
      }
    });

  } catch (err) {
    console.error("❌ Error in verbose status update:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
      details: {
        applicationId: req.params.id,
        employerId: req.user?._id,
        user: req.user,
        requestBody: req.body
      }
    });
  }
});

router.delete("/application/:id", authenticateToken, deleteApplication);

router.delete("/applicant/:id", authenticateToken, deleteApplicant);

export default router;
