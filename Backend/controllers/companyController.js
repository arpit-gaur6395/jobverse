import Company from "../models/Company.js";

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json({ message: "Company created successfully", company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCompany) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company updated successfully", company: updatedCompany });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully", company: deletedCompany });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeaturedCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ featured: true });
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCompaniesByIndustry = async (req, res) => {
  try {
    const { industry } = req.params;
    const companies = await Company.find({ industry });
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCompaniesBySize = async (req, res) => {
  try {
    const { size } = req.params;
    const companies = await Company.find({ size });
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
