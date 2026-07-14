import { Request, Response } from 'express';
import TickTickTask from '../models/TickTickTask';

// Get tasks for a specific date range or all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { startDate, endDate, folder } = req.query;
    let query: any = { user: user._id };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = startDate;
    }

    if (folder) {
      query.folder = folder;
    }

    const nonRecurringQuery: any = { ...query, 'recurrence.type': 'none' };
    const recurringQuery: any = { user: user._id, 'recurrence.type': { $ne: 'none' } };
    if (folder) recurringQuery.folder = folder;

    const [nonRecurringTasks, recurringTasks] = await Promise.all([
      TickTickTask.find(nonRecurringQuery).sort({ date: 1, time: 1, createdAt: -1 }),
      TickTickTask.find(recurringQuery)
    ]);

    res.json([...nonRecurringTasks, ...recurringTasks]);
  } catch (error: any) {
    console.error('Error fetching ticktick tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const task = await TickTickTask.findOne({ _id: req.params.id, user: user._id });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error: any) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { title, description, date, time, endTime, priority, folder, tags, recurrence, badge } = req.body;

    const newTask = new TickTickTask({
      user: user._id,
      title,
      description,
      date,
      time,
      endTime,
      priority: priority || 'None',
      folder: folder || 'Inbox',
      tags: tags || [],
      recurrence: recurrence || { type: 'none' },
      badge
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { title, description, date, time, endTime, priority, completed, folder, tags, recurrence, toggleCompletedDate, badge } = req.body;

    const task = await TickTickTask.findOne({ _id: req.params.id, user: user._id });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (date !== undefined) task.date = date;
    if (time !== undefined) task.time = time;
    if (endTime !== undefined) task.endTime = endTime;
    if (priority !== undefined) task.priority = priority;
    if (folder !== undefined) task.folder = folder;
    if (tags !== undefined) task.tags = tags;
    if (recurrence !== undefined) task.recurrence = recurrence;
    if (badge !== undefined) task.badge = badge;

    if (toggleCompletedDate) {
      // Manage array of completed dates for recurring tasks
      if (!task.completedDates) task.completedDates = [];
      if (completed) {
        if (!task.completedDates.includes(toggleCompletedDate)) {
          task.completedDates.push(toggleCompletedDate);
        }
      } else {
        task.completedDates = task.completedDates.filter(d => d !== toggleCompletedDate);
      }
    } else if (completed !== undefined) {
      task.completed = completed;
    }

    await task.save();
    res.json(task);
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const task = await TickTickTask.findOneAndDelete({ _id: req.params.id, user: user._id });
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({ message: 'Task removed' });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
