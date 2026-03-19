import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const postJob = async (req, res) => {
  try {
    const jobData = { ...req.body, userId: req.user._id };
    const job = new Job(jobData);
    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully", job: deletedJob });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get user data from authenticated user
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const userName = req.user?.name;
    const userEmail = req.user?.email;

    // Check if user is a job seeker
    if (userRole !== "seeker") {
      return res.status(403).json({
        message: "Only job seekers can apply for jobs"
      });
    }

    // Check if user has already applied to this job
    const existingApplication = await Application.findOne({
      job: jobId,
      userId: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this job"
      });
    }

    // Get file paths from multer
    const resumeFile = req.files?.resume ? req.files.resume[0] : null;
    const photoFile = req.files?.photo ? req.files.photo[0] : null;

    // Extract only filename (not full path) and ensure clean path
    const resumePath = resumeFile ? resumeFile.filename.replace(/^.*[\\\/]/, '') : null;
    const photoPath = photoFile ? photoFile.filename.replace(/^.*[\\\/]/, '') : null;

    console.log('File upload debug:', {
      resumeOriginal: resumeFile?.originalname,
      resumeFilename: resumeFile?.filename,
      resumeCleanPath: resumePath,
      photoOriginal: photoFile?.originalname,
      photoFilename: photoFile?.filename,
      photoCleanPath: photoPath
    });

    const newApplication = new Application({
      job: jobId,
      userId: userId,
      name: userName,
      email: userEmail,
      resume: resumePath,
      photo: photoPath,
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

    res.status(201).json({ message: "Application submitted successfully", application: newApplication });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicants = await Application.find({ job: jobId });
    console.log(`Found ${applicants.length} applicants for job ${jobId}:`, applicants.map(a => ({ id: a._id, name: a.name, status: a.status })));
    res.json(applicants);
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteApplicant = async (req, res) => {
  try {
    const applicantId = req.params.id;
    const deletedApplicant = await Application.findByIdAndDelete(applicantId);
    if (!deletedApplicant) return res.status(404).json({ message: "Applicant not found" });
    res.json({ message: "Applicant deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?._id;

    const existingApplication = await Application.findOne({
      job: jobId,
      userId: userId
    });

    res.json({ hasApplied: !!existingApplication });
  } catch (err) {
    console.error("Error checking application status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user?._id;

    const applications = await Application.find({ userId })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user?._id;

    // Get all jobs posted by this employer
    const employerJobs = await Job.find({ userId: employerId });
    const jobIds = employerJobs.map(job => job._id);

    // Get all applications for employer's jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching employer applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employerId = req.user?._id;

    console.log(`Attempting to update application ${id} to status: ${status}`);
    console.log(`Employer ID: ${employerId}`);

    // Find the application and populate job
    const application = await Application.findById(id).populate('job');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    console.log(`Application found:`, {
      applicationId: application._id,
      jobId: application.job?._id,
      jobTitle: application.job?.job,
      jobOwner: application.job?.userId
    });

    // Verify that the job belongs to this employer
    if (!application.job) {
      return res.status(404).json({ message: "Associated job not found" });
    }

    // Check if the job belongs to the current employer
    const jobOwnerId = application.job.userId.toString();
    const currentEmployerId = employerId.toString();

    console.log(`Ownership comparison:`, {
      jobOwnerId,
      currentEmployerId,
      areEqual: jobOwnerId === currentEmployerId,
      jobOwnerIdType: typeof jobOwnerId,
      currentEmployerIdType: typeof currentEmployerId
    });

    if (jobOwnerId !== currentEmployerId) {
      console.log(`Access denied: Job ${application.job._id} belongs to user ${jobOwnerId}, but user ${currentEmployerId} is trying to update`);
      return res.status(403).json({ message: "You can only update applications for your own jobs" });
    }

    // Update the application status
    application.status = status;
    await application.save();

    console.log(`Application ${id} status updated to: ${status} by employer ${employerId}`);

    res.json({ message: "Application status updated successfully", application });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user?._id;

    // Find the application
    const application = await Application.findById(id).populate('job');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify that the job belongs to this employer
    if (application.job.userId.toString() !== employerId) {
      return res.status(403).json({ message: "You can only delete applications for your own jobs" });
    }

    // Delete the application
    await Application.findByIdAndDelete(id);

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Only get jobs that belong to this user
    const jobs = await Job.find({ userId: userId }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Error fetching employer jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};
