import express from 'express';
import { getChatHistory, getUnreadCounts } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/unread', getUnreadCounts);
router.get('/:friendId', getChatHistory);

export default router;
