import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getProfile, createOrUpdateProfile, logActivity, getLogs } from '../controllers/personalController';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.post('/profile', createOrUpdateProfile);
router.post('/log', logActivity);
router.get('/logs', getLogs);

export default router;
