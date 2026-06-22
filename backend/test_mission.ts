import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './src/models/Task';
import Habit from './src/models/Habit';
import Goal from './src/models/Goal';
import WorkoutPlan from './src/models/WorkoutPlan';
import { generateMissionControlPlan } from './src/services/geminiService';
import User from './src/models/User';

dotenv.config();

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('connected');
  
  const user = await User.findOne();
  if (!user) return console.log('no user');
  
  const tasks = await Task.find({ user: user._id, completed: false });
  const habits = await Habit.find({ user: user._id });
  const goals = await Goal.find({ user: user._id });
  const workouts = await WorkoutPlan.find({ user: user._id });

  console.log('tasks', tasks.length);
  
  const aggregatedData = {
    tasks: tasks.map(t => ({ id: t._id, title: t.title })),
    habits: habits.map(h => ({ id: h._id, title: h.name })),
    goals: goals.map(g => ({ id: g._id, title: g.name })),
    wellness: workouts.map(w => ({ id: w._id, title: w.title || 'Workout' }))
  };

  try {
    const aiResponse = await generateMissionControlPlan(aggregatedData, user.name);
    console.log(aiResponse);
  } catch (err) {
    console.error(err);
  }
  
  process.exit();
};

test();
