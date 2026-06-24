import { Request, Response } from 'express';
import User from '../models/User';

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { subscription, timezone } = req.body;
    
    if (!subscription || !subscription.endpoint) {
      res.status(400).json({ message: 'Invalid subscription object' });
      return;
    }

    const updateData: any = { pushSubscription: subscription };
    if (timezone) {
      updateData.timezone = timezone;
    }

    // Save subscription to user
    await User.findByIdAndUpdate(user._id, updateData);

    res.status(200).json({ message: 'Subscription saved successfully' });
  } catch (error: any) {
    console.error('Error saving push subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
