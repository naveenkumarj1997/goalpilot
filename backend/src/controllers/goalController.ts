import { Request, Response } from 'express';
import Goal from '../models/Goal';
import User from '../models/User';

// Extend express Request to include user
interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
export const getGoalById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }

    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, deadline, priority, dailyAvailableHours, category } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Please add a goal name' });
      return;
    }

    const goal = await Goal.create({
      name,
      description,
      deadline,
      priority,
      dailyAvailableHours,
      category,
      user: req.user.id,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }

    if (goal.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }

    if (goal.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    await goal.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Batch log hours for multiple goals
// @route   POST /api/goals/batch-log
// @access  Private
export const batchLogHours = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { logs } = req.body; // Array of { goalId, hours }

    if (!Array.isArray(logs)) {
      res.status(400).json({ message: 'Invalid data format' });
      return;
    }

    const updatePromises = logs.map(async (log) => {
      if (log.hours > 0) {
        return Goal.findOneAndUpdate(
          { _id: log.goalId, user: req.user.id },
          { 
            $inc: { completedHours: log.hours },
            $push: { timeLogs: { hours: log.hours, date: new Date() } }
          },
          { new: true }
        );
      }
      return Promise.resolve(null);
    });

    await Promise.all(updatePromises);

    // Update user's lastDailyLog to current time
    const user = await User.findById(req.user.id);
    if (user) {
      user.lastDailyLog = new Date();
      await user.save();
    }

    res.json({ message: 'Hours logged successfully', lastDailyLog: user?.lastDailyLog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
