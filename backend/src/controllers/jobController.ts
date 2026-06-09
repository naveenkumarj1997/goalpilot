import { Request, Response } from 'express';
import Job from '../models/Job';
import JobPreference from '../models/JobPreference';
import CompanySource from '../models/CompanySource';
import UserJobState from '../models/UserJobState';
import { triggerManualScan } from '../services/cronService';

export interface AuthRequest extends Request {
  user?: any;
}

// --- JOB PREFERENCES ---

export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    let prefs = await JobPreference.findOne({ user: req.user.id });
    if (!prefs) {
      prefs = await JobPreference.create({ user: req.user.id, titles: [], locations: [], experiences: [] });
    }
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const prefs = await JobPreference.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// --- JOBS DISCOVERY ---

export const getJobs = async (req: AuthRequest, res: Response) => {
  try {
    // Optional filtering
    const { company, title, location } = req.query;
    let query: any = {};
    if (company) query.company = new RegExp(company as string, 'i');
    if (title) query.title = new RegExp(title as string, 'i');
    if (location) query.location = new RegExp(location as string, 'i');

    const jobs = await Job.find(query).sort({ discoveredAt: -1 }).limit(100);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getJobAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const jobsFoundToday = await Job.countDocuments({ discoveredAt: { $gte: today } });
    const totalJobs = await Job.countDocuments();
    const companiesCount = await CompanySource.countDocuments({ isActive: true });

    res.json({ jobsFoundToday, totalJobs, companiesCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// --- KANBAN & APPLICATION STATE ---

export const getUserJobs = async (req: AuthRequest, res: Response) => {
  try {
    const states = await UserJobState.find({ user: req.user.id }).populate('job');
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const updateJobState = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, status } = req.body;
    const state = await UserJobState.findOneAndUpdate(
      { user: req.user.id, job: jobId },
      { $set: { status } },
      { new: true, upsert: true }
    ).populate('job');
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const deleteJobState = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await UserJobState.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// --- ADMIN / SOURCES ---

export const getSources = async (req: Request, res: Response) => {
  try {
    const sources = await CompanySource.find();
    res.json(sources);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const addSource = async (req: Request, res: Response) => {
  try {
    const source = await CompanySource.create(req.body);
    res.json(source);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const removeSource = async (req: Request, res: Response) => {
  try {
    await CompanySource.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const triggerScan = async (req: Request, res: Response) => {
  try {
    // Non-blocking
    triggerManualScan();
    res.json({ message: 'Scan triggered successfully in background' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
