import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import SupportMessage from '../models/SupportMessage';

export const getUserMessages = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await SupportMessage.find({ user: req.user?._id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching support messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text is required' });

    const message = await SupportMessage.create({
      user: req.user?._id,
      sender: 'User',
      text
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await SupportMessage.updateMany(
      { user: req.user?._id, sender: 'Admin', isRead: false },
      { isRead: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating messages' });
  }
};
