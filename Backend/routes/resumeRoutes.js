import express from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeResume, getAnalysisStatus, testAIProviders } from '../controllers/resumeController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept TXT, PDF, and DOCX files
    const allowedTypes = ['.txt', '.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .txt, .pdf, and .docx files are supported.'));
    }
  }
});

// Test all AI providers endpoint
router.get('/test-providers', testAIProviders);

// Root endpoint for /api/analyze-resume
router.post('/', upload.single('resume'), analyzeResume);

// Analyze resume endpoint
router.post('/analyze', upload.single('resume'), analyzeResume);

// Alias for analyze-resume to match frontend
router.post('/analyze-resume', upload.single('resume'), analyzeResume);

// Get analysis status endpoint
router.get('/status', getAnalysisStatus);

export default router;
