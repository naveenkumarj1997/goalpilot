import { Request, Response } from 'express';
import GameStat from '../models/GameStat';
import Match from '../models/Match';

interface AuthRequest extends Request {
  user?: any;
}

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await GameStat.find()
      .populate('user', 'name email')
      .sort({ wins: -1, winRate: -1 })
      .limit(50);
      
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
       console.error("getMyStats: req.user is undefined");
       res.status(401).json({ message: 'User not found in req' });
       return;
    }
    let stats = await GameStat.findOne({ user: req.user.id }).populate('user', 'name');
    if (!stats) {
      stats = await GameStat.create({ user: req.user.id });
    }
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getMyStats:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) });
  }
};

export const getMyHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const history = await Match.find({
      $or: [{ winner: req.user.id }, { loser: req.user.id }]
    })
      .populate('winner', 'name')
      .populate('loser', 'name')
      .sort({ playedAt: -1 })
      .limit(20);

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
