import express from 'express';
import { getLeaderboard, getMyStats, getMyHistory } from '../controllers/gameController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/leaderboard', getLeaderboard);
router.get('/stats', getMyStats);
router.get('/history', getMyHistory);

export default router;
