import { Request, Response } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dailyCheckInTime, nofapCheckInTime } = req.body;
    
    // Ensure user exists from auth middleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (dailyCheckInTime) {
      user.dailyCheckInTime = dailyCheckInTime;
    }

    if (nofapCheckInTime) {
      user.nofapCheckInTime = nofapCheckInTime;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      lastDailyLog: updatedUser.lastDailyLog,
      dailyCheckInTime: updatedUser.dailyCheckInTime,
      nofapCheckInTime: updatedUser.nofapCheckInTime,
      moduleOverrides: (updatedUser as any).moduleOverrides ? Object.fromEntries((updatedUser as any).moduleOverrides) : {},
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
