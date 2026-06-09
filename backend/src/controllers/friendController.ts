import { Request, Response } from 'express';
import FriendRequest from '../models/FriendRequest';
import Friendship from '../models/Friendship';
import User from '../models/User';

export const sendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const senderId = (req as any).user._id;
    const { receiverId } = req.body;

    if (senderId.toString() === receiverId) {
      res.status(400).json({ message: "Cannot send request to yourself" });
      return;
    }

    // Check if already friends
    const existingFriendship = await Friendship.findOne({
      $or: [
        { user1: senderId, user2: receiverId },
        { user1: receiverId, user2: senderId },
      ]
    });

    if (existingFriendship) {
      res.status(400).json({ message: "Already friends" });
      return;
    }

    // Check if a pending request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    if (existingRequest) {
      res.status(400).json({ message: "Request already sent" });
      return;
    }

    // Check if receiver sent a request to sender
    const reverseRequest = await FriendRequest.findOne({
      sender: receiverId,
      receiver: senderId,
      status: 'pending'
    });

    if (reverseRequest) {
      // Just accept the reverse request
      reverseRequest.status = 'accepted';
      await reverseRequest.save();
      await Friendship.create({ user1: senderId, user2: receiverId });
      res.status(200).json({ message: "Now friends", type: 'accepted_reverse' });
      return;
    }

    const newRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json(newRequest);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const acceptRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const receiverId = (req as any).user._id;
    const { requestId } = req.body;

    const request = await FriendRequest.findOne({ _id: requestId, receiver: receiverId, status: 'pending' });
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    request.status = 'accepted';
    await request.save();

    await Friendship.create({ user1: request.sender, user2: receiverId });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const declineRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const receiverId = (req as any).user._id;
    const { requestId } = req.body;

    const request = await FriendRequest.findOne({ _id: requestId, receiver: receiverId, status: 'pending' });
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    request.status = 'declined';
    await request.save();

    res.status(200).json({ message: "Friend request declined" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }]
    }).populate('user1', 'name email').populate('user2', 'name email');

    const friends = friendships.map(f => {
      if (f.user1._id.toString() === userId.toString()) return f.user2;
      return f.user1;
    });

    res.status(200).json(friends);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getPendingRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    // Requests received
    const requests = await FriendRequest.find({
      receiver: userId,
      status: 'pending'
    }).populate('sender', 'name email');

    res.status(200).json(requests);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
