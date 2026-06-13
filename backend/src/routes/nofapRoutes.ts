import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getProfile,
  updateTargetGoal,
  dailyCheckIn,
  getLogs,
  addJournalEntry,
  getJournalEntries,
  getMotivation
} from '../controllers/nofapController';

const router = express.Router();

router.use(protect);

router.route('/profile').get(getProfile);
router.route('/target').put(updateTargetGoal);
router.route('/checkin').post(dailyCheckIn);
router.route('/logs').get(getLogs);
router.route('/journal').post(addJournalEntry).get(getJournalEntries);
router.route('/motivation').get(getMotivation);

export default router;
