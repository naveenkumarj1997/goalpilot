import express from 'express';
import { getItems, getBookmarks, toggleBookmark, triggerManualAggregation } from '../controllers/intelligenceController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getItems);
router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks/:itemId', protect, toggleBookmark);
router.post('/aggregate', protect, triggerManualAggregation);

export default router;
