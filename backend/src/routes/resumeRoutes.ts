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

router.use(protect);

// Debug endpoint
router.get('/debug-env', (req, res) => {
  res.json({ 
    hasKey: !!process.env.GEMINI_API_KEY, 
    keyLength: process.env.GEMINI_API_KEY?.length || 0,
    keyStart: process.env.GEMINI_API_KEY?.substring(0, 4)
  });
});

// AI Endpoints (must come before /:id routes to avoid matching conflicts)
router.post('/ai/summary', generateSummary);
router.post('/ai/enhance-bullet', enhanceBullet);
router.post('/ai/categorize-skills', categorizeSkills);
router.post('/ai/ats-score', scanATS);

// CRUD
router.get('/', getResumes);
router.post('/', createResume);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/duplicate', duplicateResume);

export default router;
