import express from 'express';
import { updateSettings } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/settings', protect, updateSettings);

export default router;
