import express from 'express';
import { 
  getPublicRooms, 
  getMyRooms, 
  createRoom, 
  verifyRoomPassword, 
  endRoom, 
  getWatchHistory,
  searchUsers,
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getRoomById
} from '../controllers/watchController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

// Room Routes
router.get('/rooms/public', getPublicRooms);
router.get('/rooms/my', getMyRooms);
router.get('/rooms/:id', getRoomById);
router.post('/rooms', createRoom);
router.post('/rooms/verify', verifyRoomPassword);
router.post('/rooms/end', endRoom);
router.get('/history', getWatchHistory);

// Friend Routes
router.get('/users/search', searchUsers);
router.get('/friends', getFriends);
router.get('/friends/requests', getFriendRequests);
router.post('/friends/request', sendFriendRequest);
router.post('/friends/accept', acceptFriendRequest);
router.post('/friends/reject', rejectFriendRequest);
router.delete('/friends/:friendId', removeFriend);

export default router;
