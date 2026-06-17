import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../middleware/authMiddleware';
import ManifestationProfile from '../models/ManifestationProfile';
import VisionBoard from '../models/VisionBoard';
import ManifestationGoal from '../models/ManifestationGoal';
import ManifestationJournal from '../models/ManifestationJournal';
import ManifestationActivity from '../models/ManifestationActivity';
import { chatSuccessCoach } from '../services/geminiService';

// Helper to calculate score
const calculateManifestationScore = async (userId: string) => {
  const profile = await ManifestationProfile.findOne({ user: userId });
  if (!profile) return 0;
  
  const activities = await ManifestationActivity.find({ user: userId });
  const journals = await ManifestationJournal.find({ user: userId });
  const goals = await ManifestationGoal.find({ user: userId });

  let score = 0;
  // Base score from clarity (fields filled out)
  const clarityFields = [profile.dreamCareer, profile.dreamIncome, profile.dreamBody, profile.dreamLifestyle, profile.dreamRelationships, profile.dreamHome, profile.dreamTravel];
  const filledFields = clarityFields.filter(f => f && f.length > 0).length;
  score += (filledFields / 7) * 20;

  // Add points for activities
  score += Math.min(30, activities.length * 2);
  // Add points for journals
  score += Math.min(20, journals.length * 5);
  // Add points for goals
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  score += Math.min(30, goals.length * 2 + completedGoals * 10);

  return Math.min(100, Math.round(score));
};

const updateProfileScore = async (userId: string) => {
  const score = await calculateManifestationScore(userId);
  await ManifestationProfile.findOneAndUpdate({ user: userId }, { manifestationScore: score }, { upsert: true });
  return score;
};

// Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    let profile = await ManifestationProfile.findOne({ user: req.user?._id });
    if (!profile) {
      profile = await ManifestationProfile.create({ user: req.user?._id });
    }
    await updateProfileScore(req.user?._id.toString() || '');
    const updatedProfile = await ManifestationProfile.findOne({ user: req.user?._id });
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await ManifestationProfile.findOneAndUpdate(
      { user: req.user?._id },
      req.body,
      { new: true, upsert: true }
    );
    await updateProfileScore(req.user?._id.toString() || '');
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Opportunities
export const addOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await ManifestationProfile.findOneAndUpdate(
      { user: req.user?._id },
      { $push: { opportunityTracker: req.body } },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const { oppId } = req.params;
    const profile = await ManifestationProfile.findOneAndUpdate(
      { user: req.user?._id, 'opportunityTracker._id': oppId },
      { $set: { 'opportunityTracker.$': { ...req.body, _id: oppId } } },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const { oppId } = req.params;
    const profile = await ManifestationProfile.findOneAndUpdate(
      { user: req.user?._id },
      { $pull: { opportunityTracker: { _id: oppId } } },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Vision Board
export const getVisionBoard = async (req: AuthRequest, res: Response) => {
  try {
    const items = await VisionBoard.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addVisionBoardItem = async (req: AuthRequest, res: Response) => {
  try {
    const item = await VisionBoard.create({ ...req.body, user: req.user?._id });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteVisionBoardItem = async (req: AuthRequest, res: Response) => {
  try {
    await VisionBoard.findOneAndDelete({ _id: req.params.id, user: req.user?._id });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Goals
export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await ManifestationGoal.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await ManifestationGoal.create({ ...req.body, user: req.user?._id });
    await updateProfileScore(req.user?._id.toString() || '');
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error adding goal:', error);
    fs.appendFileSync(path.join(__dirname, '../../../error.log'), new Date().toISOString() + ' Error adding goal: ' + (error instanceof Error ? error.stack : String(error)) + '\n');
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await ManifestationGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      req.body,
      { new: true }
    );
    await updateProfileScore(req.user?._id.toString() || '');
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    await ManifestationGoal.findOneAndDelete({ _id: req.params.id, user: req.user?._id });
    await updateProfileScore(req.user?._id.toString() || '');
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Journals
export const getJournals = async (req: AuthRequest, res: Response) => {
  try {
    const journals = await ManifestationJournal.find({ user: req.user?._id }).sort({ date: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addJournal = async (req: AuthRequest, res: Response) => {
  try {
    const journal = await ManifestationJournal.create({ ...req.body, user: req.user?._id });
    await updateProfileScore(req.user?._id.toString() || '');
    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Activities (Habits, Visualizations)
export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const activities = await ManifestationActivity.find({ user: req.user?._id }).sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addActivity = async (req: AuthRequest, res: Response) => {
  try {
    const activity = await ManifestationActivity.create({ ...req.body, user: req.user?._id });
    await updateProfileScore(req.user?._id.toString() || '');
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Affirmations
export const getAffirmations = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await ManifestationProfile.findOne({ user: req.user?._id });
    res.json(profile?.affirmations || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addAffirmation = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const profile = await ManifestationProfile.findOneAndUpdate(
      { user: req.user?._id },
      { $push: { affirmations: text } },
      { new: true, upsert: true }
    );
    res.json(profile.affirmations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteAffirmation = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const profile = await ManifestationProfile.findOneAndUpdate(
      { user: req.user?._id },
      { $pull: { affirmations: text } },
      { new: true }
    );
    res.json(profile?.affirmations || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const askSuccessCoach = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const profile = await ManifestationProfile.findOne({ user: req.user?._id });
    const reply = await chatSuccessCoach(message, profile);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
