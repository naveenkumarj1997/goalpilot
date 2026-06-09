import { Request, Response } from 'express';
import Resume from '../models/Resume';
import * as geminiService from '../services/geminiService';

export const getResumes = async (req: Request, res: Response): Promise<void> => {
  try {
    const resumes = await Resume.find({ userId: req.user?._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getResumeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user?._id });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json(resume);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const newResume = new Resume({
      ...req.body,
      userId: req.user?._id
    });
    const savedResume = await newResume.save();
    res.status(201).json(savedResume);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedResume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json(updatedResume);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedResume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user?._id });
    if (!deletedResume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const duplicateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const originalResume = await Resume.findOne({ _id: req.params.id, userId: req.user?._id });
    if (!originalResume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    const resumeObject = originalResume.toObject();
    delete resumeObject._id;
    delete resumeObject.createdAt;
    delete resumeObject.updatedAt;
    resumeObject.title = `${resumeObject.title} (Copy)`;

    const duplicatedResume = new Resume(resumeObject);
    const savedResume = await duplicatedResume.save();
    res.status(201).json(savedResume);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// --- AI Endpoints ---

export const generateSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { experience, projects, skills, targetRole } = req.body;
    const summary = await geminiService.generateProfessionalSummary(experience, projects, skills, targetRole);
    res.json({ summary });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to generate summary' });
  }
};

export const enhanceBullet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bullet, targetRole } = req.body;
    const enhancedBullet = await geminiService.enhanceBulletPoint(bullet, targetRole);
    res.json({ bullet: enhancedBullet });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to enhance bullet' });
  }
};

export const categorizeSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rawSkills } = req.body;
    const categorized = await geminiService.categorizeSkills(rawSkills);
    res.json({ skills: categorized });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to categorize skills' });
  }
};

export const scanATS = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeData } = req.body;
    const result = await geminiService.calculateATSScore(resumeData);
    
    // Also save the score to the DB if ID provided
    if (resumeData._id) {
      await Resume.findOneAndUpdate(
        { _id: resumeData._id, userId: req.user?._id },
        { atsScore: result.score }
      );
    }
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to scan ATS score' });
  }
};
