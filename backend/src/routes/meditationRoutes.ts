import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getProfile,
  updateProfile,
  getLessons,
  getLessonById,
  toggleFavorite,
  logSession,
  getSessionLogs
} from '../controllers/meditationController';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.get('/lessons', protect, getLessons);
router.get('/lesson/:id', protect, getLessonById);
router.post('/favorite/:id', protect, toggleFavorite);

router.post('/log', protect, logSession);
router.get('/logs', protect, getSessionLogs);

export default router;
