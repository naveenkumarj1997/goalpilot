import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}


export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.user) {
    next();
    return;
  }

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = await User.findById(decoded.id).select('-password');
      
      if (req.user) {
        // Update lastActiveAt if it's been more than 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (!req.user.lastActiveAt || req.user.lastActiveAt < fiveMinutesAgo) {
          req.user.lastActiveAt = new Date();
          await req.user.save();
        }
      }
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
