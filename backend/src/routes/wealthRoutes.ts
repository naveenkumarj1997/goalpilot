import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getWealthProfile,
  updateWealthProfile,
  getDreams,
  createDream,
  updateDream,
  deleteDream,
  getNetWorthHistory,
  addNetWorthEntry,
  getAIDreamAdvice,
  getBucketList,
  createBucketListItem,
  updateBucketListItem,
  deleteBucketListItem
} from '../controllers/wealthController';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Profile
router.route('/profile')
  .get(getWealthProfile)
  .put(updateWealthProfile);

// Dreams
router.route('/dreams')
  .get(getDreams)
  .post(createDream);

router.route('/dreams/:id')
  .put(updateDream)
  .delete(deleteDream);

// Net Worth Tracker
router.post('/net-worth', protect, addNetWorthEntry);
router.get('/net-worth/history', protect, getNetWorthHistory);

// AI Advisor
router.get('/advisor', protect, getAIDreamAdvice);

// Bucket List
router.get('/bucket-list', protect, getBucketList);
router.post('/bucket-list', protect, createBucketListItem);
router.put('/bucket-list/:id', protect, updateBucketListItem);
router.delete('/bucket-list/:id', protect, deleteBucketListItem);

export default router;
