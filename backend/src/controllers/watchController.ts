import { Request, Response } from 'express';
import WatchRoom from '../models/WatchRoom';
import WatchHistory from '../models/WatchHistory';
import User from '../models/User';
import FriendRequest from '../models/FriendRequest';

// ==========================================
// ROOM MANAGEMENT
// ==========================================

export const getPublicRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await WatchRoom.find({ type: 'Public', isActive: true })
      .populate('hostId', 'name email role')
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const room = await WatchRoom.findById(req.params.id).populate('hostId', 'name');
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const rooms = await WatchRoom.find({ hostId: user._id })
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { name, type, maxUsers, password } = req.body;

    const newRoom = new WatchRoom({
      name,
      hostId: user._id,
      type,
      maxUsers,
      password: type === 'Private' ? password : null,
      isActive: true,
      participants: [{ userId: user._id }]
    });

    await newRoom.save();
    
    // Update stats
    await User.findByIdAndUpdate(user._id, { $inc: { 'watchTogetherStats.roomsHosted': 1 } });

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating room' });
  }
};

export const verifyRoomPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId, password } = req.body;
    const room = await WatchRoom.findById(roomId);

    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    if (room.type === 'Private' && room.password !== password) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const endRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { roomId, durationMinutes } = req.body;

    const room = await WatchRoom.findById(roomId);
    if (!room || room.hostId.toString() !== user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    room.isActive = false;
    await room.save();

    const uniqueParticipantIds = Array.from(new Set(room.participants.map(p => p.userId?.toString()))).filter(Boolean);

    const history = new WatchHistory({
      roomName: room.name,
      hostId: room.hostId,
      durationMinutes,
      participants: uniqueParticipantIds
    });
    await history.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWatchHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    // Get history where user was host or participant
    const history = await WatchHistory.find({
      $or: [
        { hostId: user._id },
        { participants: user._id }
      ]
    } as any)
    .populate('hostId', 'name')
    .populate('participants', 'name')
    .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==========================================
// FRIEND MANAGEMENT
// ==========================================

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    if (!query) { res.json([]); return; }
    
    const users = await User.find({ 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    } as any).select('name email role');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const currentUser = await User.findById(user._id).populate('friends', 'name email status role lastActiveAt');
    res.json(currentUser?.friends || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFriendRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const incoming = await FriendRequest.find({ receiver: user._id, status: 'pending' }).populate('sender', 'name email');
    const outgoing = await FriendRequest.find({ sender: user._id, status: 'pending' }).populate('receiver', 'name email');
    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { receiverId } = req.body;

    if (user._id.toString() === receiverId) {
      res.status(400).json({ message: 'Cannot add yourself' });
      return;
    }

    const existingFriend = await User.findOne({ _id: user._id, friends: receiverId });
    if (existingFriend) {
      res.status(400).json({ message: 'Already friends' });
      return;
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: user._id, receiver: receiverId, status: 'pending' },
        { sender: receiverId, receiver: user._id, status: 'pending' }
      ]
    } as any);

    if (existingRequest) {
      res.status(400).json({ message: 'Request already exists' });
      return;
    }

    const newRequest = new FriendRequest({ sender: user._id, receiver: receiverId });
    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request || request.receiver.toString() !== user._id.toString()) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    request.status = 'accepted';
    await request.save();

    // Add each other
    await User.findByIdAndUpdate(user._id, { $addToSet: { friends: request.sender } });
    await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: user._id } });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request || request.receiver.toString() !== user._id.toString()) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    request.status = 'declined';
    await request.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { friendId } = req.params;

    await User.findByIdAndUpdate(user._id, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: user._id } });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
