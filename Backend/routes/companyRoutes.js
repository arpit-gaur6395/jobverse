import express from "express";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getFeaturedCompanies,
  getCompaniesByIndustry,
  getCompaniesBySize
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/", getCompanies);
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);
router.get("/featured", getFeaturedCompanies);
router.get("/industry/:industry", getCompaniesByIndustry);
router.get("/size/:size", getCompaniesBySize);

export default router;
