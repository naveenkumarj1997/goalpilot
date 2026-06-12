import { Request, Response } from 'express';
import WorkoutProfile from '../models/WorkoutProfile';
import Exercise from '../models/Exercise';
import WorkoutPlan from '../models/WorkoutPlan';
import WorkoutSession from '../models/WorkoutSession';
import BodyMetric from '../models/BodyMetric';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await WorkoutProfile.findOne({ user: (req as any).user.id });
    res.json(profile || null);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const profile = await WorkoutProfile.findOneAndUpdate(
      { user: (req as any).user.id },
      { ...req.body, user: (req as any).user.id },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const getExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await Exercise.find({});
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises' });
  }
};

export const generateWorkoutPlan = async (req: Request, res: Response) => {
  try {
    const profile = await WorkoutProfile.findOne({ user: (req as any).user.id });
    if (!profile) return res.status(400).json({ message: 'Please complete your fitness profile first.' });

    const exercises = await Exercise.find({
      equipment: { $in: [...profile.equipment, 'None'] }
    });

    if (exercises.length === 0) return res.status(400).json({ message: 'No exercises found for your equipment.' });

    // Local Generation (No AI)
    const weeks = [];
    const durationWeeks = 4;
    
    for (let w = 1; w <= durationWeeks; w++) {
      const days = [];
      for (let d = 1; d <= 7; d++) {
        if (d <= profile.daysPerWeek) {
           // Workout Day
           const dayExercises: any[] = [];
           // Pick 4 to 6 random exercises from the available pool
           const shuffled = [...exercises].sort(() => 0.5 - Math.random());
           const numExercises = Math.min(Math.floor(Math.random() * 3) + 4, shuffled.length);
           const selected = shuffled.slice(0, numExercises);
           
           selected.forEach(ex => {
             dayExercises.push({
               exercise: ex._id,
               sets: profile.fitnessLevel === 'Advanced' ? 4 : 3,
               reps: profile.fitnessLevel === 'Beginner' ? 8 : (profile.goal === 'Strength' ? 5 : 12),
               restTime: profile.fitnessLevel === 'Advanced' ? 45 : 60
             });
           });

           // Determine focus based on random selection or goal
           const focusAreas = ['Upper Body', 'Lower Body', 'Full Body', 'Core & Cardio'];
           const randomFocus = focusAreas[Math.floor(Math.random() * focusAreas.length)];

           days.push({
             dayNumber: d,
             focus: randomFocus,
             exercises: dayExercises
           });
        } else {
           // Rest Day
           days.push({
             dayNumber: d,
             focus: 'Rest',
             exercises: []
           });
        }
      }
      weeks.push({ weekNumber: w, days });
    }

    const title = `4-Week ${profile.goal} Plan`;
    const difficulty = profile.fitnessLevel === 'Beginner' ? 'Easy' : profile.fitnessLevel === 'Intermediate' ? 'Medium' : 'Hard';
    const populatedWeeks = weeks;

    // Disable existing plans
    await WorkoutPlan.updateMany({ user: (req as any).user.id, isActive: true }, { isActive: false });

    const newPlan = new WorkoutPlan({
      user: (req as any).user.id,
      title: title,
      difficulty: difficulty,
      durationWeeks: durationWeeks,
      goal: profile.goal,
      weeks: populatedWeeks,
      isActive: true
    });

    await newPlan.save();
    
    const populatedPlan = await WorkoutPlan.findById(newPlan._id).populate('weeks.days.exercises.exercise');
    res.json(populatedPlan);
  } catch (error: any) {
    console.error('Plan generation error:', error);
    res.status(500).json({ message: 'Error generating workout plan', error: error.message });
  }
};

export const getWorkoutPlan = async (req: Request, res: Response) => {
  try {
    const plan = await WorkoutPlan.findOne({ user: (req as any).user.id, isActive: true })
      .populate('weeks.days.exercises.exercise');
    res.json(plan || null);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan' });
  }
};

export const logSession = async (req: Request, res: Response) => {
  try {
    const { planId, durationMinutes, caloriesBurned, completedExercises } = req.body;
    
    // Calculate XP
    const baseXP = 50;
    const durationXP = Math.floor(durationMinutes * 2);
    const exerciseXP = completedExercises.length * 10;
    const totalXP = baseXP + durationXP + exerciseXP;

    const session = new WorkoutSession({
      user: (req as any).user.id,
      plan: planId,
      durationMinutes,
      caloriesBurned,
      completedExercises,
      xpEarned: totalXP
    });

    await session.save();

    // Update User Profile Level & XP
    const profile = await WorkoutProfile.findOne({ user: (req as any).user.id });
    if (profile) {
      profile.xp += totalXP;
      // Level formula: Level = floor(sqrt(XP / 100)) + 1
      const newLevel = Math.floor(Math.sqrt(profile.xp / 100)) + 1;
      profile.level = newLevel;
      await profile.save();
    }

    res.json({ session, totalXP });
  } catch (error) {
    res.status(500).json({ message: 'Error logging session' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const sessions = await WorkoutSession.find({ user: (req as any).user.id }).sort({ date: -1 });
    const profile = await WorkoutProfile.findOne({ user: (req as any).user.id });

    const totalWorkouts = sessions.length;
    const totalCalories = sessions.reduce((acc, s) => acc + s.caloriesBurned, 0);
    const totalTime = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    // Calculate Streak
    let streak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let currentDate = new Date(today);
    
    for (const session of sessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0,0,0,0);
      
      const diffTime = Math.abs(currentDate.getTime() - sessionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 0 || diffDays === 1) {
        if (diffDays === 1) streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    res.json({
      level: profile?.level || 1,
      xp: profile?.xp || 0,
      totalWorkouts,
      totalCalories,
      totalTime,
      streak
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

export const getBodyMetrics = async (req: Request, res: Response) => {
  try {
    const metrics = await BodyMetric.find({ user: (req as any).user.id }).sort({ date: 1 });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching body metrics' });
  }
};

export const addBodyMetric = async (req: Request, res: Response) => {
  try {
    const metric = new BodyMetric({
      user: (req as any).user.id,
      ...req.body
    });
    await metric.save();
    res.json(metric);
  } catch (error) {
    res.status(500).json({ message: 'Error saving body metric' });
  }
};
