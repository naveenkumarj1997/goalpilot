import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getProfile,
  updateProfile,
  addOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getVisionBoard,
  addVisionBoardItem,
  deleteVisionBoardItem,
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  getJournals,
  addJournal,
  getActivities,
  addActivity,
  getAffirmations,
  addAffirmation,
  deleteAffirmation,
  askSuccessCoach
} from '../controllers/manifestationController';

const router = express.Router();

// Profile
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Opportunities
router.post('/opportunities', protect, addOpportunity);
router.put('/opportunities/:oppId', protect, updateOpportunity);
router.delete('/opportunities/:oppId', protect, deleteOpportunity);

// Vision Board
router.get('/vision-board', protect, getVisionBoard);
router.post('/vision-board', protect, addVisionBoardItem);
router.delete('/vision-board/:id', protect, deleteVisionBoardItem);

// Goals
router.get('/goals', protect, getGoals);
router.post('/goals', protect, addGoal);
router.put('/goals/:id', protect, updateGoal);
router.delete('/goals/:id', protect, deleteGoal);

// Journals
router.get('/journals', protect, getJournals);
router.post('/journals', protect, addJournal);

// Activities
router.get('/activities', protect, getActivities);
router.post('/activities', protect, addActivity);

// Affirmations
router.get('/affirmations', protect, getAffirmations);
router.post('/affirmations', protect, addAffirmation);
router.delete('/affirmations', protect, deleteAffirmation);

// AI Coach
router.post('/coach/ask', protect, askSuccessCoach);

export default router;
