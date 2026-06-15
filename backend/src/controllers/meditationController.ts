import { Request, Response } from 'express';
import MeditationProfile from '../models/MeditationProfile';
import MeditationLesson from '../models/MeditationLesson';
import MeditationLog from '../models/MeditationLog';
import { AuthRequest } from '../middleware/authMiddleware';

// Initialize or get Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    let profile = await MeditationProfile.findOne({ user: req.user?._id }).populate('favorites');
    
    if (!profile) {
      profile = await MeditationProfile.create({
        user: req.user?._id
      });
      // Re-fetch to apply population logic if needed
      profile = await MeditationProfile.findById(profile._id).populate('favorites');
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching meditation profile' });
  }
};

// Update Profile (Onboarding)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { experienceLevel, primaryGoal } = req.body;
    
    const profile = await MeditationProfile.findOneAndUpdate(
      { user: req.user?._id },
      { $set: { experienceLevel, primaryGoal } },
      { new: true }
    ).populate('favorites');

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Get Library
export const getLessons = async (req: Request, res: Response) => {
  try {
    const { difficulty, category } = req.query;
    let query: any = {};
    
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (category && category !== 'All') query.category = category;

    const lessons = await MeditationLesson.find(query).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching lessons' });
  }
};

// Get single lesson
export const getLessonById = async (req: Request, res: Response) => {
  try {
    const lesson = await MeditationLesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching lesson' });
  }
};

// Toggle Favorite
export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await MeditationProfile.findOne({ user: req.user?._id });
    
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const index = profile.favorites.findIndex(favId => favId.toString() === id);
    if (index === -1) {
      profile.favorites.push(id as any);
    } else {
      profile.favorites.splice(index, 1);
    }

    await profile.save();
    
    const updatedProfile = await MeditationProfile.findById(profile._id).populate('favorites');
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error toggling favorite' });
  }
};

// Log a completed session
export const logSession = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId, type, durationMinutes, moodBefore, moodAfter, notes } = req.body;
    
    // Create Log
    const log = await MeditationLog.create({
      user: req.user?._id,
      lesson: lessonId || undefined,
      type,
      durationMinutes,
      moodBefore,
      moodAfter,
      notes,
      date: new Date()
    });

    // Update Profile Stats
    const profile = await MeditationProfile.findOne({ user: req.user?._id });
    if (profile) {
      profile.sessionsCompleted += 1;
      profile.totalMinutesPracticed += durationMinutes;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastSession = profile.lastSessionDate ? new Date(profile.lastSessionDate) : null;
      if (lastSession) {
        lastSession.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(today.getTime() - lastSession.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          profile.currentStreak += 1;
        } else if (diffDays > 1) {
          profile.currentStreak = 1;
        }
      } else {
        profile.currentStreak = 1;
      }

      if (profile.currentStreak > profile.longestStreak) {
        profile.longestStreak = profile.currentStreak;
      }

      profile.lastSessionDate = new Date();
      await profile.save();
    }

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server error logging session' });
  }
};

// Get Session History
export const getSessionLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await MeditationLog.find({ user: req.user?._id })
      .populate('lesson')
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching logs' });
  }
};
