import { Request, Response } from 'express';
import Habit from '../models/Habit';

interface AuthRequest extends Request {
  user?: any;
}

export const getHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, frequency, color } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Please provide a habit name' });
      return;
    }

    const habit = await Habit.create({
      name,
      frequency,
      color,
      user: req.user.id,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });
      return;
    }

    if (habit.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    await habit.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const toggleLogHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date } = req.body; // Expects an ISO string like '2026-06-06T00:00:00.000Z'
    
    if (!date) {
      res.status(400).json({ message: 'Please provide a date' });
      return;
    }

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });
      return;
    }

    if (habit.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    const targetDate = new Date(date);
    // Normalize to midnight UTC for precise comparison
    targetDate.setUTCHours(0, 0, 0, 0);

    const targetTime = targetDate.getTime();

    // Check if the exact date is already logged
    const existingLogIndex = habit.logs.findIndex(log => {
      const logDate = new Date(log);
      logDate.setUTCHours(0, 0, 0, 0);
      return logDate.getTime() === targetTime;
    });

    if (existingLogIndex >= 0) {
      // Remove it (Toggle Off)
      habit.logs.splice(existingLogIndex, 1);
    } else {
      // Add it (Toggle On)
      habit.logs.push(targetDate);
    }

    // Sort logs just in case
    habit.logs.sort((a, b) => a.getTime() - b.getTime());

    await habit.save();

    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
