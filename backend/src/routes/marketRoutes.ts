import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getNews,
  getNewsStats,
  toggleNewsRead,
  toggleNewsSaved,
  getOverview,
  askAiAnalyst,
  getPortfolio,
  addPortfolioItem,
  triggerAggregation
} from '../controllers/marketController';

const router = express.Router();

router.get('/news', protect, getNews);
router.get('/news/stats', protect, getNewsStats);
router.post('/news/:id/read', protect, toggleNewsRead);
router.post('/news/:id/save', protect, toggleNewsSaved);
router.get('/overview', protect, getOverview);
router.post('/analyst', protect, askAiAnalyst);
router.post('/aggregate', protect, triggerAggregation);

router.route('/portfolio')
  .get(protect, getPortfolio)
  .post(protect, addPortfolioItem);

export default router;
