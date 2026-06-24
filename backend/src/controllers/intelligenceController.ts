import { Request, Response } from 'express';
import IntelligenceItem from '../models/IntelligenceItem';
import IntelligenceBookmark from '../models/IntelligenceBookmark';
import { aggregateIntelligence } from '../services/intelligenceAggregator';

export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, page = 1, limit = 5 } = req.query;
    
    const query: any = {};
    if (category && category !== 'All') {
      query.categories = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const items = await IntelligenceItem.find(query)
      .sort({ pubDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await IntelligenceItem.countDocuments(query);

    res.status(200).json({
      items,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalItems: total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookmarks = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const bookmarks = await IntelligenceBookmark.find({ user: user._id })
      .populate('item')
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookmarks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBookmark = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { itemId } = req.params;

    const existing = await IntelligenceBookmark.findOne({ user: user._id, item: itemId });

    if (existing) {
      await IntelligenceBookmark.findByIdAndDelete(existing._id);
      res.status(200).json({ message: 'Bookmark removed', isBookmarked: false });
    } else {
      await IntelligenceBookmark.create({ user: user._id, item: itemId as any });
      res.status(201).json({ message: 'Bookmark added', isBookmarked: true });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const triggerManualAggregation = async (req: Request, res: Response): Promise<void> => {
  try {
    // Only Admin or SuperAdmin should technically do this, but we'll allow it for demo
    await aggregateIntelligence();
    res.status(200).json({ message: 'Aggregation completed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
