import { Request, Response } from 'express';
import NoFapProfile from '../models/NoFapProfile';
import NoFapLog from '../models/NoFapLog';
import NoFapJournal from '../models/NoFapJournal';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get or Create NoFap Profile
// @route   GET /api/nofap/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let profile = await NoFapProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await NoFapProfile.create({
        user: req.user._id,
      });
    }

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Target Goal
// @route   PUT /api/nofap/target
// @access  Private
export const updateTargetGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { targetGoal } = req.body;
    
    if (!targetGoal) {
      res.status(400).json({ message: 'Please provide a target goal' });
      return;
    }

    const profile = await NoFapProfile.findOneAndUpdate(
      { user: req.user._id },
      { targetGoal },
      { new: true }
    );

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process Daily Check-in
// @route   POST /api/nofap/checkin
// @access  Private
export const dailyCheckIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { success, date } = req.body;
    const checkInDate = date ? new Date(date) : new Date();
    checkInDate.setHours(0, 0, 0, 0); // Normalize to start of day

    let profile = await NoFapProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await NoFapProfile.create({ user: req.user._id });
    }

    // Check if a log already exists for this date
    const existingLog = await NoFapLog.findOne({
      user: req.user._id,
      date: {
        $gte: checkInDate,
        $lt: new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingLog) {
      res.status(400).json({ message: 'Already checked in for this date' });
      return;
    }

    // Create log
    const log = await NoFapLog.create({
      user: req.user._id,
      date: checkInDate,
      success
    });

    // Update Profile
    if (success) {
      profile.currentStreak = (profile.currentStreak || 0) + 1;
      profile.totalSuccessfulDays = (profile.totalSuccessfulDays || 0) + 1;
      if (profile.currentStreak > (profile.longestStreak || 0)) {
        profile.longestStreak = profile.currentStreak;
      }
    } else {
      profile.currentStreak = 0;
      profile.relapseCount = (profile.relapseCount || 0) + 1;
    }

    profile.lastCheckInDate = new Date();
    await profile.save();

    res.status(201).json({ profile, log });
  } catch (error: any) {
    console.error('Daily Check-In Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Check-in Logs
// @route   GET /api/nofap/logs
// @access  Private
export const getLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await NoFapLog.find({ user: req.user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add Journal Entry
// @route   POST /api/nofap/journal
// @access  Private
export const addJournalEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mood, energy, motivation, notes } = req.body;

    const entry = await NoFapJournal.create({
      user: req.user._id,
      mood,
      energy,
      motivation,
      notes
    });

    res.status(201).json(entry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Journal Entries
// @route   GET /api/nofap/journal
// @access  Private
export const getJournalEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entries = await NoFapJournal.find({ user: req.user._id }).sort({ date: -1 });
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const MOTIVATION_QUOTES = [
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "We must all suffer one of two things: the pain of discipline or the pain of regret.", author: "Jim Rohn" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The first and best victory is to conquer self.", author: "Plato" },
  { text: "He who conquers himself is the mightiest warrior.", author: "Confucius" },
  { text: "Rule your mind or it will rule you.", author: "Horace" },
  { text: "If you do not conquer self, you will be conquered by self.", author: "Napoleon Hill" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" }
];

// @desc    Get Daily Motivation
// @route   GET /api/nofap/motivation
// @access  Private
export const getMotivation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Generate a quote based on the day of the year so it rotates daily but is the same for everyone
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date().getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const quoteIndex = dayOfYear % MOTIVATION_QUOTES.length;
    
    res.json(MOTIVATION_QUOTES[quoteIndex]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
