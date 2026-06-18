import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getUserMessages, sendMessage, markAsRead } from '../controllers/supportController';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUserMessages)
  .post(sendMessage)
  .put(markAsRead);

export default router;
