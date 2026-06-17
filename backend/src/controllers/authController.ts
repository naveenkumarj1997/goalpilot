import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const getCurrentUser = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        lastDailyLog: user.lastDailyLog,
        dailyCheckInTime: user.dailyCheckInTime,
        role: (user as any).role || 'Standard',
        moduleOverrides: (user as any).moduleOverrides ? Object.fromEntries((user as any).moduleOverrides) : {},
        token: req.headers.authorization?.split(' ')[1] // keep the same token
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        lastDailyLog: user.lastDailyLog,
        dailyCheckInTime: user.dailyCheckInTime,
        role: user.role || 'Standard',
        moduleOverrides: user.moduleOverrides ? Object.fromEntries(user.moduleOverrides) : {},
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await (user as any).matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        lastDailyLog: user.lastDailyLog,
        dailyCheckInTime: user.dailyCheckInTime,
        role: (user as any).role || 'Standard',
        moduleOverrides: (user as any).moduleOverrides ? Object.fromEntries((user as any).moduleOverrides) : {},
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};
