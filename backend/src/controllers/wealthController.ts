import { Request, Response } from 'express';
import { WealthProfile } from '../models/WealthProfile';
import { Dream } from '../models/Dream';
import { NetWorthEntry } from '../models/NetWorthEntry';
import { BudgetPlan } from '../models/BudgetPlan';
import { BucketListItem } from '../models/BucketListItem';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const getWealthProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    let profile = await WealthProfile.findOne({ userId });
    
    if (!profile) {
      profile = await WealthProfile.create({ userId });
    }
    
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateWealthProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const profile = await WealthProfile.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dreams
export const getDreams = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const dreams = await Dream.find({ userId }).sort({ targetDate: 1 });
    res.json(dreams);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createDream = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const dream = await Dream.create({ ...req.body, userId });
    res.status(201).json(dream);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateDream = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const dream = await Dream.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: req.body },
      { new: true }
    );
    res.json(dream);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDream = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    await Dream.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ message: 'Dream deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Net Worth Tracker
export const getNetWorthHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const history = await NetWorthEntry.find({ userId }).sort({ date: 1 });
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addNetWorthEntry = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const entry = await NetWorthEntry.create({ ...req.body, userId });
    res.status(201).json(entry);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// AI Dream Advisor
export const getAIDreamAdvice = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const profile = await WealthProfile.findOne({ userId });
    const dreams = await Dream.find({ userId });
    
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    const prompt = `You are a world-class financial architect and life coach.
User Profile: Age ${profile.age}, Income: ${profile.monthlyIncome}, Expenses: ${profile.monthlyExpenses}, Savings: ${profile.currentSavings}, Debt: ${profile.totalDebt}.
User Dreams: ${JSON.stringify(dreams)}

Provide strategic advice in markdown format on how this user can achieve their dreams faster. Include priority recommendations and risk warnings. Keep it extremely actionable and inspiring.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    res.json({ advice: result.response.text() });
  } catch (error: any) {
    console.error('AI error:', error);
    res.status(500).json({ message: 'AI advisor error', error: error.message });
  }
};

// Bucket List
export const getBucketList = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const items = await BucketListItem.find({ userId }).sort({ isCompleted: 1, createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createBucketListItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const item = await BucketListItem.create({ ...req.body, userId });
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBucketListItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const item = await BucketListItem.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: req.body },
      { new: true }
    );
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteBucketListItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    await BucketListItem.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ message: 'Item deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
