import express from 'express';
import {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  batchLogHours,
} from '../controllers/goalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all routes with auth middleware
router.use(protect);

router.route('/').get(getGoals).post(createGoal);
router.post('/batch-log', batchLogHours);
router.route('/:id').get(getGoalById).put(updateGoal).delete(deleteGoal);

export default router;
