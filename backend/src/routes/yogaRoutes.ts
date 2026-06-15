import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getProfile,
  updateExperienceLevel,
  getLessons,
  getLessonById,
  toggleFavorite,
  completeSession,
  getSessionLogs
} from '../controllers/yogaController';

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile);

router.route('/profile/level')
  .put(protect, updateExperienceLevel);

router.route('/lessons')
  .get(protect, getLessons);

router.route('/lessons/:id')
  .get(protect, getLessonById);

router.route('/favorites/:id')
  .post(protect, toggleFavorite);

router.route('/sessions')
  .get(protect, getSessionLogs)
  .post(protect, completeSession);

export default router;
