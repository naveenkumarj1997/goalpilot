import express from 'express';
import { sendRequest, acceptRequest, declineRequest, getFriends, getPendingRequests } from '../controllers/friendController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/request', sendRequest);
router.post('/accept', acceptRequest);
router.post('/decline', declineRequest);
router.get('/', getFriends);
router.get('/requests', getPendingRequests);

export default router;
