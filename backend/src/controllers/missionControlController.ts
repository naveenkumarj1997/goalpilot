import { Request, Response } from 'express';
import DailyPlan from '../models/DailyPlan';
import Task from '../models/Task';
import Habit from '../models/Habit';
import Goal from '../models/Goal';
import WorkoutPlan from '../models/WorkoutPlan';
import { generateMissionControlPlan } from '../services/geminiService';

export const getPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const dateStr = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const plan = await DailyPlan.findOne({ user: user._id, date: dateStr });
    
    // Return the plan or null if not planned yet
    res.json(plan);
  } catch (error: any) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const generatePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { mode, date } = req.body; // 'ai' or 'manual', date: 'YYYY-MM-DD'
    const dateStr = date || new Date().toISOString().split('T')[0];
    
    // Check if plan already exists for today, delete it if regenerating
    await DailyPlan.deleteOne({ user: user._id, date: dateStr });

    // Aggregate data
    const tasks = await Task.find({ user: user._id, completed: false });
    const habits = await Habit.find({ user: user._id, isActive: true });
    const goals = await Goal.find({ user: user._id });
    const workouts = await WorkoutPlan.find({ user: user._id, isActive: true });

    const aggregatedData = {
      tasks: tasks.map(t => ({ id: t._id, title: t.title })),
      habits: Array.from(new Map(habits.map(h => [h.name, h])).values()).map(h => ({ id: h._id, title: h.name })),
      goals: goals.map(g => ({ id: g._id, title: g.name })),
      wellness: Array.from(new Map(workouts.map(w => [w.title || 'Workout', w])).values()).map(w => ({ id: w._id, title: w.title || 'Workout' }))
    };

    let generatedTasks = [];
    let aiCoaching = "Let's conquer the day! Drag and drop tasks to build your schedule.";
    let isFallback = false;

    if (mode === 'ai') {
      const aiResponse = await generateMissionControlPlan(aggregatedData, user.name);
      generatedTasks = aiResponse.tasks || [];
      aiCoaching = aiResponse.aiCoaching || aiCoaching;
      isFallback = aiResponse.isFallback || false;
    } else {
      // Manual mode: combine everything unscheduled
      const allItems = [
        ...aggregatedData.tasks.map((t: any) => ({ ...t, sourceModule: "Task" })),
        ...aggregatedData.habits.map((h: any) => ({ ...h, sourceModule: "Habit" })),
        ...aggregatedData.goals.map((g: any) => ({ ...g, sourceModule: "Goal" })),
        ...aggregatedData.wellness.map((w: any) => ({ ...w, sourceModule: "Workout" }))
      ];
      generatedTasks = allItems.map((item: any) => ({
        id: item.id,
        title: item.title,
        sourceModule: item.sourceModule,
        priority: "Medium"
      }));
    }

    const newPlan = new DailyPlan({
      user: user._id,
      date: dateStr,
      tasks: generatedTasks,
      aiCoaching,
      isFallback
    });

    await newPlan.save();
    res.json(newPlan);
  } catch (error: any) {
    console.error('Error generating plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { taskId, startTime, endTime, completed, priority, color, date } = req.body;
    const dateStr = date || new Date().toISOString().split('T')[0];

    const plan = await DailyPlan.findOne({ user: user?._id, date: dateStr });
    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }

    const taskIndex = plan.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      if (startTime !== undefined) plan.tasks[taskIndex].startTime = startTime;
      if (endTime !== undefined) plan.tasks[taskIndex].endTime = endTime;
      if (completed !== undefined) plan.tasks[taskIndex].completed = completed;
      if (priority !== undefined) plan.tasks[taskIndex].priority = priority;
      if (color !== undefined) (plan.tasks[taskIndex] as any).color = color;

      // Update success score
      const totalTasks = plan.tasks.length;
      const completedTasks = plan.tasks.filter(t => t.completed).length;
      plan.successScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      await plan.save();
    }

    res.json(plan);
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { title, startTime, endTime, priority, color, date } = req.body;
    const dateStr = date || new Date().toISOString().split('T')[0];

    const plan = await DailyPlan.findOne({ user: user?._id, date: dateStr });
    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }

    const newTask = {
      id: 'custom-' + Date.now().toString(),
      title,
      sourceModule: 'Custom',
      startTime,
      endTime,
      completed: false,
      priority: priority || 'Medium',
      color: color || 'blue',
    };

    plan.tasks.push(newTask);

    // Update success score
    const totalTasks = plan.tasks.length;
    const completedTasks = plan.tasks.filter(t => t.completed).length;
    plan.successScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await plan.save();
    res.json(plan);
  } catch (error: any) {
    console.error('Error adding custom task:', error);
    res.status(500).json({ message: 'Server error adding task' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { taskId } = req.params;
    const dateStr = (req.query.date as string) || new Date().toISOString().split('T')[0];

    const plan = await DailyPlan.findOne({ user: user?._id, date: dateStr });
    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }

    const taskIndex = plan.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      plan.tasks.splice(taskIndex, 1);
    }

    // Update success score
    const totalTasks = plan.tasks.length;
    const completedTasks = plan.tasks.filter(t => t.completed).length;
    plan.successScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await plan.save();
    res.json(plan);
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

export const submitCheckIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { type, mood, intent, reflection, rating, date } = req.body; // type: 'morning' or 'evening'
    const dateStr = date || new Date().toISOString().split('T')[0];

    const plan = await DailyPlan.findOne({ user: user?._id, date: dateStr });
    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }

    if (type === 'morning') {
      plan.morningCheckIn = { mood, intent, completedAt: new Date() };
    } else if (type === 'evening') {
      plan.eveningReview = { reflection, rating, completedAt: new Date() };
    }

    await plan.save();
    res.json(plan);
  } catch (error: any) {
    console.error('Error submitting checkin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
