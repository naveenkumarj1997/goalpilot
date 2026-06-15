import { Request, Response } from 'express';
import StoicProfile from '../models/StoicProfile';
import StoicLesson from '../models/StoicLesson';
import StoicQuote from '../models/StoicQuote';
import StoicJournal from '../models/StoicJournal';

// --- Profile ---
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    let profile = await StoicProfile.findOne({ user: userId });
    
    if (!profile) {
      profile = await StoicProfile.create({ user: userId });
    }
    
    // Update streak logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = new Date(profile.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      profile.currentStreak += 1;
      if (profile.currentStreak > profile.longestStreak) {
        profile.longestStreak = profile.currentStreak;
      }
    } else if (diffDays > 1) {
      profile.currentStreak = 1;
    }
    
    if (diffDays > 0) {
      profile.lastActiveDate = new Date();
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stoic profile' });
  }
};

// --- Lessons ---
export const getLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await StoicLesson.find().sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching lessons' });
  }
};

export const completeLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = (req as any).user?.id;
    
    const profile = await StoicProfile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    const id = lessonId as string;
    if (!profile.completedLessonIds.includes(id)) {
      profile.completedLessonIds.push(id);
      profile.lessonsCompleted += 1;
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error completing lesson' });
  }
};

// --- Quotes ---
export const getDailyQuote = async (req: Request, res: Response) => {
  try {
    const count = await StoicQuote.countDocuments();
    if (count === 0) return res.json(null);
    
    // Simple deterministic daily quote based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % count;
    
    const quote = await StoicQuote.findOne().skip(index);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching daily quote' });
  }
};

export const getQuotes = async (req: Request, res: Response) => {
  try {
    const { query, author } = req.query;
    let filter: any = {};
    
    if (query) {
      filter.$or = [
        { quote: { $regex: query as string, $options: 'i' } },
        { meaning: { $regex: query as string, $options: 'i' } }
      ];
    }
    if (author && author !== 'All') {
      filter.author = author as string;
    }
    
    const quotes = await StoicQuote.find(filter).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching quotes' });
  }
};

// --- Journal ---
export const getJournal = async (req: Request, res: Response) => {
  try {
    const entries = await StoicJournal.find({ user: (req as any).user?.id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching journal' });
  }
};

export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const { reflection, challenge, lessonLearned } = req.body;
    const userId = (req as any).user?.id;
    
    const entry = await StoicJournal.create({
      user: userId,
      reflection,
      challenge,
      lessonLearned
    });
    
    const profile = await StoicProfile.findOne({ user: userId });
    if (profile) {
      profile.journalEntries += 1;
      await profile.save();
    }
    
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating journal entry' });
  }
};

// --- Exercises & Challenges ---
export const completeExercise = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const profile = await StoicProfile.findOne({ user: userId });
    
    if (profile) {
      profile.exercisesCompleted += 1;
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error completing exercise' });
  }
};

export const completeChallenge = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const profile = await StoicProfile.findOne({ user: userId });
    
    if (profile) {
      profile.dailyChallengesCompleted += 1;
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error completing challenge' });
  }
};
