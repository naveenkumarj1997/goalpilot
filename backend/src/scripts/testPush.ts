import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DailyPlan from '../models/DailyPlan';
import User from '../models/User';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const testPushLogic = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to DB');

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  console.log('Target Date:', dateStr);

  const targetTime = new Date(today.getTime() + 5 * 60000);
  const targetHours = targetTime.getHours();
  const targetMinutes = targetTime.getMinutes();
  const formattedTargetTime = `${targetHours.toString().padStart(2, '0')}:${targetMinutes.toString().padStart(2, '0')}`;
  
  console.log('Current Local Time:', today.getHours(), today.getMinutes());
  console.log('Target Local Time (now + 5m):', formattedTargetTime);

  const plans = await DailyPlan.find({ date: dateStr }).populate('user');
  console.log(`Found ${plans.length} plans for today.`);

  for (const plan of plans) {
    const user = plan.user as any;
    console.log(`Checking plan for user: ${user?.email}, pushSubscription exists: ${!!user?.pushSubscription}`);
    
    if (!user || !user.pushSubscription) continue;

    console.log(`User's tasks:`);
    plan.tasks.forEach((t: any) => {
        console.log(`  - ${t.title} | startTime: ${t.startTime} | completed: ${t.completed}`);
    });

    const upcomingTasks = plan.tasks.filter((t: any) => t.startTime === formattedTargetTime && !t.completed);
    console.log(`Found ${upcomingTasks.length} upcoming tasks for exactly ${formattedTargetTime}`);
  }

  process.exit(0);
};

testPushLogic();
