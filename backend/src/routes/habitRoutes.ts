import express from 'express';
import {
  getHabits,
  createHabit,
  deleteHabit,
  toggleLogHabit,
  updateHabit
} from '../controllers/habitController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/').get(getHabits).post(createHabit);
router.route('/:id').delete(deleteHabit).put(updateHabit);
router.route('/:id/toggle').post(toggleLogHabit);

export default router;
