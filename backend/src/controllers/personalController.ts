import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import PersonalProfile from '../models/PersonalProfile';
import PersonalLog from '../models/PersonalLog';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await PersonalProfile.findOne({ user: req.user?._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createOrUpdateProfile = async (req: AuthRequest, res: Response) => {
  try {
    let profile = await PersonalProfile.findOne({ user: req.user?._id });
    
    if (profile) {
      profile = await PersonalProfile.findOneAndUpdate(
        { user: req.user?._id },
        { $set: req.body },
        { new: true }
      );
    } else {
      profile = new PersonalProfile({
        user: req.user?._id,
        ...req.body
      });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { type, itemId, title, category, xpReward } = req.body;
    
    // Create the log entry
    const log = new PersonalLog({
      user: req.user?._id,
      type,
      itemId,
      title,
      category,
      xpReward: xpReward || 10
    });
    await log.save();
    
    // Update profile
    const profile = await PersonalProfile.findOne({ user: req.user?._id });
    if (profile) {
      if (type === 'Lesson' && !profile.completedLessons.includes(itemId)) {
        profile.completedLessons.push(itemId);
      } else if (type === 'Challenge' && !profile.completedChallenges.includes(itemId)) {
        profile.completedChallenges.push(itemId);
      }
      
      // Check for first challenge badge
      if (profile.completedChallenges.length === 1 && !profile.badges.includes('First Challenge')) {
        profile.badges.push('First Challenge');
      }
      
      // Check for 30 Day Transformation
      if (profile.completedChallenges.length >= 30 && profile.completedLessons.length >= 10 && !profile.badges.includes('30 Day Transformation')) {
        profile.badges.push('30 Day Transformation');
      }
      
      // Update streak (simple implementation)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (!profile.lastCheckInDate) {
        profile.streak = 1;
        profile.lastCheckInDate = new Date();
      } else {
        const lastCheckIn = new Date(profile.lastCheckInDate);
        lastCheckIn.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(today.getTime() - lastCheckIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          profile.streak += 1;
          profile.lastCheckInDate = new Date();
          
          if (profile.streak === 7 && !profile.badges.includes('7 Day Streak')) {
            profile.badges.push('7 Day Streak');
          }
        } else if (diffDays > 1) {
          profile.streak = 1;
          profile.lastCheckInDate = new Date();
        }
      }
      
      await profile.save();
    }
    
    res.json({ message: 'Activity logged successfully', profile });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await PersonalLog.find({ user: req.user?._id }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
