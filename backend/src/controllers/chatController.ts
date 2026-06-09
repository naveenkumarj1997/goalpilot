import { Request, Response } from 'express';
import Message from '../models/Message';

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const friendId = req.params.friendId;

    // Mark all unread messages from this friend as read
    await Message.updateMany(
      { sender: friendId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUnreadCounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    // Aggregate unread messages by sender
    const unreadCounts = await Message.aggregate([
      { $match: { receiver: userId, read: false } },
      { $group: { _id: "$sender", count: { $sum: 1 } } }
    ]);

    const totalUnread = unreadCounts.reduce((acc, curr) => acc + curr.count, 0);

    const perUser: Record<string, number> = {};
    unreadCounts.forEach(item => {
      perUser[item._id.toString()] = item.count;
    });

    res.status(200).json({
      total: totalUnread,
      perUser
    });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
