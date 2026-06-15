import { Request, Response } from 'express';
import YogaProfile from '../models/YogaProfile';
import YogaLesson from '../models/YogaLesson';
import YogaSessionLog from '../models/YogaSessionLog';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get or Create Yoga Profile
// @route   GET /api/yoga/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let profile = await YogaProfile.findOne({ user: req.user._id }).populate('favorites');

    if (!profile) {
      profile = await YogaProfile.create({
        user: req.user._id,
      });
    }

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Experience Level
// @route   PUT /api/yoga/profile/level
// @access  Private
export const updateExperienceLevel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { experienceLevel } = req.body;
    
    if (!experienceLevel) {
      res.status(400).json({ message: 'Please provide an experience level' });
      return;
    }

    const profile = await YogaProfile.findOneAndUpdate(
      { user: req.user._id },
      { experienceLevel },
      { new: true }
    ).populate('favorites');

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Yoga Lessons (Filtered)
// @route   GET /api/yoga/lessons
// @access  Private
export const getLessons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { difficulty, category, maxDuration } = req.query;
    
    let query: any = {};
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (maxDuration) query.durationMinutes = { $lte: Number(maxDuration) };

    const lessons = await YogaLesson.find(query).populate('poses');
    res.json(lessons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Single Lesson
// @route   GET /api/yoga/lessons/:id
// @access  Private
export const getLessonById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lesson = await YogaLesson.findById(req.params.id).populate('poses');
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }
    res.json(lesson);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Favorite Lesson
// @route   POST /api/yoga/favorites/:id
// @access  Private
export const toggleFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lessonId = req.params.id;
    const profile = await YogaProfile.findOne({ user: req.user._id });
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    const index = profile.favorites.indexOf(lessonId as any);
    if (index > -1) {
      // Remove favorite
      profile.favorites.splice(index, 1);
    } else {
      // Add favorite
      profile.favorites.push(lessonId as any);
    }
    
    await profile.save();
    await profile.populate('favorites');
    
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete a Yoga Session
// @route   POST /api/yoga/sessions
// @access  Private
export const completeSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId, durationMinutes } = req.body;
    
    // Create Log
    const log = await YogaSessionLog.create({
      user: req.user._id,
      lesson: lessonId,
      durationMinutes
    });

    // Update Profile
    let profile = await YogaProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await YogaProfile.create({ user: req.user._id });
    }

    // Check Streak Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastSession = profile.lastSessionDate ? new Date(profile.lastSessionDate) : null;
    if (lastSession) lastSession.setHours(0, 0, 0, 0);

    const diffTime = lastSession ? Math.abs(today.getTime() - lastSession.getTime()) : null;
    const diffDays = diffTime !== null ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : null;

    if (diffDays === 1) {
      // Checked in yesterday, streak continues
      profile.currentStreak = (profile.currentStreak || 0) + 1;
    } else if (diffDays === 0) {
      // Already checked in today, streak unchanged
    } else {
      // Streak broken (or first time)
      profile.currentStreak = 1;
    }

    if (profile.currentStreak > (profile.longestStreak || 0)) {
      profile.longestStreak = profile.currentStreak;
    }

    profile.sessionsCompleted = (profile.sessionsCompleted || 0) + 1;
    profile.totalMinutesPracticed = (profile.totalMinutesPracticed || 0) + Number(durationMinutes);
    profile.lastSessionDate = new Date();

    await profile.save();

    res.status(201).json({ profile, log });
  } catch (error: any) {
    console.error('Complete Session Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Session Logs
// @route   GET /api/yoga/sessions
// @access  Private
export const getSessionLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await YogaSessionLog.find({ user: req.user._id }).sort({ date: -1 }).populate('lesson');
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
