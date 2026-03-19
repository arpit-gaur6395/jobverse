import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getFeaturedCategories,
  getTrendingCategories
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/featured", getFeaturedCategories);
router.get("/trending", getTrendingCategories);

export default router;
