import { Request, Response } from 'express';
import Task from '../models/Task';

interface AuthRequest extends Request {
  user?: any;
}

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, details, date, completed } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Please add a task title' });
      return;
    }

    const task = await Task.create({
      title,
      details,
      date,
      completed: completed || false,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
