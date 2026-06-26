import { Request, Response } from 'express';
import CombatProfile from '../models/CombatProfile';
import CombatRoadmap from '../models/CombatRoadmap';
import CombatLesson from '../models/CombatLesson';
import CombatWorkoutLog from '../models/CombatWorkoutLog';
import User from '../models/User';
import { generateCombatRoadmapAI } from '../services/combatGeminiService';

export const getCombatProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    let profile = await CombatProfile.findOne({ user: user._id });
    if (!profile) {
      // Create empty profile if it doesn't exist
      profile = await CombatProfile.create({ user: user._id });
    }
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCombatProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const updateData = req.body;
    
    let profile = await CombatProfile.findOne({ user: user._id });
    if (!profile) {
      profile = new CombatProfile({ user: user._id, ...updateData });
      await profile.save();
    } else {
      profile = await CombatProfile.findOneAndUpdate(
        { user: user._id },
        { $set: updateData },
        { new: true }
      );
    }
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCombatRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const roadmap = await CombatRoadmap.findOne({ user: user._id, active: true });
    res.status(200).json(roadmap || null);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateCombatRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const profile = await CombatProfile.findOne({ user: user._id });
    
    if (!profile) {
       res.status(400).json({ message: 'Profile not found. Please complete onboarding first.' });
       return;
    }

    // In a full implementation, we would call geminiService here to generate the JSON.
    // For Phase 1, we will generate a stub roadmap.
    
    // Deactivate previous active roadmaps
    await CombatRoadmap.updateMany({ user: user._id, active: true }, { active: false });

    let roadmapData;
    try {
      roadmapData = await generateCombatRoadmapAI(profile);
    } catch (err) {
      // Fallback
      roadmapData = {
        title: `${profile.experienceLevel} ${profile.goals[0] || 'Combat'} Roadmap`,
        weeks: [
          {
            weekNumber: 1,
            focus: 'Fundamentals & Stance',
            tasks: [
              { title: 'Learn Stance', type: 'Lesson', duration: 15 },
              { title: 'Shadow Boxing Basics', type: 'Workout', duration: 10 }
            ]
          }
        ]
      };
    }

    const newRoadmap = new CombatRoadmap({
      user: user._id,
      active: true,
      title: roadmapData.title,
      weeks: roadmapData.weeks
    });

    await newRoadmap.save();
    res.status(201).json(newRoadmap);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCombatLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const { discipline, category } = req.query;
    let query: any = {};
    if (discipline) query.discipline = discipline;
    if (category) query.category = category;

    const lessons = await CombatLesson.find(query).sort({ order: 1, createdAt: 1 });
    res.status(200).json(lessons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { type, title, duration, rounds, punches, calories, notes } = req.body;

    const log = new CombatWorkoutLog({
      user: user._id,
      type,
      title,
      duration,
      rounds: rounds || 0,
      punches: punches || 0,
      calories: calories || 0,
      notes
    });

    await log.save();

    // Update profile stats
    await CombatProfile.findOneAndUpdate(
      { user: user._id },
      {
        $inc: {
          trainingHours: duration / 60, // approximate
          workoutsCompleted: 1,
          punchCount: punches || 0,
          roundsCompleted: rounds || 0,
          caloriesBurned: calories || 0
        },
        $set: { lastWorkoutDate: new Date() }
      }
    );

    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
