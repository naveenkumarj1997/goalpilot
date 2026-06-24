import { Request, Response } from 'express';
import SavedDate from '../models/SavedDate';

export const getSavedDates = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const dates = await SavedDate.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(200).json(dates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSavedDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { title, targetDate, type } = req.body;

    if (!title || !targetDate || !type) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const savedDate = new SavedDate({
      user: user._id,
      title,
      targetDate,
      type
    });

    await savedDate.save();
    res.status(201).json(savedDate);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'This date is already tracked.' });
      return;
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteSavedDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const deleted = await SavedDate.findOneAndDelete({ _id: id, user: user._id });
    if (!deleted) {
      res.status(404).json({ message: 'Date not found' });
      return;
    }

    res.status(200).json({ message: 'Date deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
