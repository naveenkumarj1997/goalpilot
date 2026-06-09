import express from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  generateSummary,
  enhanceBullet,
  categorizeSkills,
  scanATS
} from '../controllers/resumeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth middleware to all resume routes
router.use(protect);

// CRUD
router.get('/', getResumes);
router.post('/', createResume);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/duplicate', duplicateResume);

// AI Endpoints
router.post('/ai/summary', generateSummary);
router.post('/ai/enhance-bullet', enhanceBullet);
router.post('/ai/categorize-skills', categorizeSkills);
router.post('/ai/ats-score', scanATS);

export default router;
