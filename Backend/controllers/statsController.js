import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

export const getStats = async (req, res) => {
  try {
    const jobCount = await Job.countDocuments();
    const companyCount = await Company.countDocuments();
    const categoryCount = await Category.countDocuments();
    const userCount = await User.countDocuments();
    
    // Calculate application count (this would come from Application model)
    const applicationCount = 1000000; // Mock data for now

    const stats = {
      activeJobSeekers: `${Math.floor(userCount * 1.5)}M+`,
      partnerCompanies: `${companyCount * 100}K+`,
      successfulPlacements: `${Math.floor(applicationCount / 1000000)}M+`,
      satisfactionRate: '95%'
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
