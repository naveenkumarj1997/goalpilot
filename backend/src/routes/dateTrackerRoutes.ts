import express from 'express';
import { getSavedDates, createSavedDate, deleteSavedDate } from '../controllers/dateTrackerController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getSavedDates);
router.post('/', protect, createSavedDate);
router.delete('/:id', protect, deleteSavedDate);

export default router;
