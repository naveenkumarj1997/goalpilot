import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getAstrologyProfile,
  createOrUpdateProfile,
  deleteProfile,
  searchCities,
  getTodayHoroscope,
  getCurrentDaysHoroscope,
  getDashaPeriods,
  getTransitInterpretations,
  calculateMatch,
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/astrologyController';

const router = express.Router();

router.get('/cities', searchCities);
router.get('/today', protect, getTodayHoroscope);
router.get('/current-days', protect, getCurrentDaysHoroscope);
router.get('/dasha', protect, getDashaPeriods);
router.get('/transit', protect, getTransitInterpretations);
router.post('/match', protect, calculateMatch);

router.get('/profile', protect, getAstrologyProfile);
router.post('/profile', protect, createOrUpdateProfile);
router.delete('/profile/:id', protect, deleteProfile);

router.get('/notes', protect, getNotes);
router.post('/notes', protect, createNote);
router.put('/notes/:id', protect, updateNote);
router.delete('/notes/:id', protect, deleteNote);

export default router;
