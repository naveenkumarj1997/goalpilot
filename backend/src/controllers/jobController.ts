import { Request, Response } from 'express';
import Job from '../models/Job';
import JobPreference from '../models/JobPreference';
import CompanySource from '../models/CompanySource';
import JobKeyword from '../models/JobKeyword';
import UserJobState from '../models/UserJobState';
import { triggerManualScan } from '../services/cronService';
import { fetchTargetedJobs } from '../services/scraperService';

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

export const getKeywords = async (req: Request, res: Response) => {
  try {
    const keywords = await JobKeyword.find();
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const addKeyword = async (req: Request, res: Response) => {
  try {
    const keyword = await JobKeyword.create(req.body);
    res.json(keyword);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const removeKeyword = async (req: Request, res: Response) => {
  try {
    await JobKeyword.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const exportJobsToSheet = async (req: AuthRequest, res: Response) => {
  try {
    const { title, location, webhookUrl } = req.body;
    
    if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com/')) {
      return res.status(400).json({ success: false, message: 'Invalid webhook URL. Please ensure it starts with https://script.google.com/' });
    }

    let query: any = {};
    if (title) {
      const titleRegexStr = (title as string).split(',').map(s => s.trim()).filter(Boolean).join('|');
      query.title = new RegExp(titleRegexStr, 'i');
    }
    if (location) {
      const locationRegexStr = (location as string).split(',').map(s => s.trim()).filter(Boolean).join('|');
      query.location = new RegExp(locationRegexStr, 'i');
    }

    let jobs: any[] = await Job.find(query).sort({ discoveredAt: -1 }).limit(50);
    
    if (jobs.length === 0) {
      // Live search fallback using exact search engine integration
      const sources = await CompanySource.find({ isActive: true });
      let liveJobs = [];
      
      if (sources.length > 0) {
        const searchTitle = title ? (title as string).split(',')[0].trim() : 'Developer';
        const searchLocation = location ? (location as string).split(',')[0].trim() : '';

        for (let i = 0; i < Math.min(2, sources.length); i++) {
          const source = sources[i];
          const found = await fetchTargetedJobs(source.name, source.careerUrl, searchTitle, searchLocation);
          
          for (const job of found) {
             liveJobs.push({
               ...job,
               company: source.name,
               hash: Math.random().toString(36).substring(7),
               sourceId: source._id
             });
          }
        }
      }
      
      if (liveJobs.length > 0) {
        jobs = await Job.insertMany(liveJobs);
      } else {
        return res.json({ success: false, message: 'No jobs found matching your exact criteria at the targeted companies.' });
      }
    }

    const exportData = {
      jobs: jobs.map(j => {
        // Calculate how many days ago it was discovered
        let dateStr = 'Unknown';
        if (j.discoveredAt) {
          const daysAgo = Math.floor((new Date().getTime() - new Date(j.discoveredAt).getTime()) / (1000 * 3600 * 24));
          if (daysAgo === 0) dateStr = 'Today';
          else if (daysAgo === 1) dateStr = 'Yesterday';
          else dateStr = `${daysAgo} days ago`;
        }

        return {
          title: j.title,
          company: j.company,
          location: j.location,
          experience: j.experience || 'Not specified',
          link: j.link,
          sourceType: j.sourceId ? 'Targeted' : 'Broad',
          discoveredAt: dateStr
        };
      })
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(exportData)
    });

    const text = await response.text();
    let result = null;
    try {
      result = JSON.parse(text);
    } catch(e) {
      console.log('Non-JSON response from Apps Script:', text);
    }

    res.json({ success: true, count: jobs.length, result });

  } catch (error: any) {
    console.error('Export Error:', error);
    res.status(500).json({ success: false, message: 'Server error exporting jobs. Ensure your Apps Script is deployed to Anyone.', error: error.message });
  }
};
