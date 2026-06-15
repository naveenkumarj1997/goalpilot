import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getProfile,
  getLessons,
  completeLesson,
  getDailyQuote,
  getQuotes,
  getJournal,
  createJournalEntry,
  completeExercise,
  completeChallenge
} from '../controllers/stoicController';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);

router.get('/lessons', getLessons);
router.post('/lessons/:lessonId/complete', completeLesson);

router.get('/quotes', getQuotes);
router.get('/quotes/daily', getDailyQuote);

router.get('/journal', getJournal);
router.post('/journal', createJournalEntry);

router.post('/exercises/complete', completeExercise);
router.post('/challenges/complete', completeChallenge);

export default router;
