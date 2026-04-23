import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { uploadToSupabase, deleteFromSupabase } from "../config/supabase.js";
import path from "path";

// ========================================
// 📋 JOB CONTROLLERS
// ========================================

/**
 * Post a new job
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const postJob = async (req, res) => {
  try {
    const jobData = { ...req.body, userId: req.user._id };
    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      message: "Job posted successfully",
      job
    });
  } catch (err) {
    console.error("Error posting job:", err);
    res.status(500).json({
      message: "Failed to post job",
      error: err.message
    });
  }
};

/**
 * Get all jobs with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getJob = async (req, res) => {
  try {
    // If pagination parameters are provided, use pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const usePagination = req.query.page || req.query.limit;

    let jobs;
    let total;
    let totalPages;

    if (usePagination) {
      const skip = (page - 1) * limit;
      jobs = await Job.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      total = await Job.countDocuments();
      totalPages = Math.ceil(total / limit);

      res.status(200).json({
        jobs,
        pagination: {
          currentPage: page,
          totalPages,
          totalJobs: total,
          jobsPerPage: limit,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } else {
      // Fetch all jobs without pagination for home page
      jobs = await Job.find()
        .sort({ createdAt: -1 })
        .lean(); // Use lean() for faster queries

      res.status(200).json({ jobs });
    }
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: err.message
    });
  }
};

/**
 * Delete a job by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      message: "Job deleted successfully",
      job: deletedJob
    });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({
      message: "Failed to delete job",
      error: err.message
    });
  }
};

/**
 * Update a job by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      message: "Job updated successfully",
      job: updatedJob
    });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({
      message: "Failed to update job",
      error: err.message
    });
  }
};


// ========================================
// 📋 APPLICATION CONTROLLERS
// ========================================

/**
 * Apply for a job
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get user data from authenticated user
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const userName = req.user?.name;
    const userEmail = req.user?.email;

    // Validate user role
    if (userRole !== "seeker") {
      return res.status(403).json({
        message: "Only job seekers can apply for jobs"
      });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      userId: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this job"
      });
    }

    // Handle file uploads to Supabase
    let resumeUrl = null;
    let photoUrl = null;

    console.log('Files received:', req.files);

    if (req.files?.resume && req.files.resume[0]) {
      try {
        const resumeFile = req.files.resume[0];
        console.log('Uploading resume:', resumeFile.originalname);
        const filename = `resume_${userId}_${Date.now()}`;
        resumeUrl = await uploadToSupabase(resumeFile, 'resumes', filename);
        console.log('Resume uploaded successfully:', resumeUrl);
      } catch (error) {
        console.error('Error uploading resume to Supabase:', error.message, error);
      }
    }

    if (req.files?.photo && req.files.photo[0]) {
      try {
        const photoFile = req.files.photo[0];
        console.log('Uploading photo:', photoFile.originalname);
        const filename = `photo_${userId}_${Date.now()}`;
        photoUrl = await uploadToSupabase(photoFile, 'photos', filename);
        console.log('Photo uploaded successfully:', photoUrl);
      } catch (error) {
        console.error('Error uploading photo to Supabase:', error.message, error);
      }
    }

    console.log('Final URLs - Resume:', resumeUrl, 'Photo:', photoUrl);

    // Create new application
    const newApplication = new Application({
      job: jobId,
      userId: userId,
      name: userName,
      email: userEmail,
      resume: resumeUrl,
      photo: photoUrl,
    });

    await newApplication.save();

    // Update job's applicants array
    await Job.findByIdAndUpdate(jobId, {
      $push: {
        applicants: {
          name: userName,
          email: userEmail,
          appliedAt: new Date()
        }
      }
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication
    });
  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({
      message: "Failed to submit application",
      error: err.message
    });
  }
};

/**
 * Get all applicants for a specific job
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicants = await Application.find({ job: jobId })
      .populate('job', 'job company')
      .sort({ appliedAt: -1 });

    res.json(applicants);
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({
      message: "Failed to fetch applicants",
      error: err.message
    });
  }
};

/**
 * Delete an applicant by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteApplicant = async (req, res) => {
  try {
    const applicantId = req.params.id;
    const deletedApplicant = await Application.findByIdAndDelete(applicantId);

    if (!deletedApplicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Delete files from Supabase
    if (deletedApplicant.resume) {
      await deleteFromSupabase(deletedApplicant.resume);
    }
    if (deletedApplicant.photo) {
      await deleteFromSupabase(deletedApplicant.photo);
    }

    res.json({ message: "Applicant deleted successfully" });
  } catch (err) {
    console.error("Error deleting applicant:", err);
    res.status(500).json({
      message: "Failed to delete applicant",
      error: err.message
    });
  }
};

/**
 * Check if user has already applied to a job
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?._id;

    const existingApplication = await Application.findOne({
      job: jobId,
      userId: userId
    });

    res.json({
      hasApplied: !!existingApplication,
      application: existingApplication
    });
  } catch (err) {
    console.error("Error checking application status:", err);
    res.status(500).json({
      message: "Failed to check application status",
      error: err.message
    });
  }
};

// ========================================
// 📋 USER APPLICATION CONTROLLERS
// ========================================

/**
 * Get all applications for the current user (job seeker)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user?._id;

    const applications = await Application.find({ userId })
      .populate('job', 'job company salary location')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({
      message: "Failed to fetch applications",
      error: err.message
    });
  }
};

/**
 * Get all applications for jobs posted by the current employer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user?._id;

    // Get all jobs posted by this employer
    const employerJobs = await Job.find({ userId: employerId });
    const jobIds = employerJobs.map(job => job._id);

    // Get all applications for employer's jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'job company salary location')
      .populate('userId', 'name email')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching employer applications:", err);
    res.status(500).json({
      message: "Failed to fetch applications",
      error: err.message
    });
  }
};

// ========================================
// 📋 APPLICATION STATUS MANAGEMENT
// ========================================

/**
 * Update application status (employer only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employerId = req.user?._id;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: " + validStatuses.join(', ')
      });
    }

    // Find the application and populate job
    const application = await Application.findById(id).populate('job');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify job ownership
    if (!application.job || application.job.userId.toString() !== employerId) {
      return res.status(403).json({
        message: "You can only update applications for your own jobs"
      });
    }

    // Update the application status
    application.status = status;
    await application.save();

    res.json({
      message: "Application status updated successfully",
      application
    });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({
      message: "Failed to update application status",
      error: err.message
    });
  }
};

/**
 * Delete an application (employer only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user?._id;

    // Find the application and populate job
    const application = await Application.findById(id).populate('job');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify job ownership
    if (!application.job || application.job.userId.toString() !== employerId) {
      return res.status(403).json({
        message: "You can only delete applications for your own jobs"
      });
    }

    // Delete files from Supabase
    if (application.resume) {
      await deleteFromSupabase(application.resume);
    }
    if (application.photo) {
      await deleteFromSupabase(application.photo);
    }

    // Delete the application
    await Application.findByIdAndDelete(id);

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({
      message: "Failed to delete application",
      error: err.message
    });
  }
};

// ========================================
// 📋 EMPLOYER JOB MANAGEMENT
// ========================================

/**
 * Get all jobs posted by the current employer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMyJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get jobs that belong to this user
    const jobs = await Job.find({ userId: userId })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Error fetching employer jobs:", err);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: err.message
    });
  }
};
