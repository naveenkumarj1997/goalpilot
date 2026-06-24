import { Request, Response } from 'express';
import MarketNews from '../models/MarketNews';
import MarketWatchlist from '../models/MarketWatchlist';
import VirtualPortfolio from '../models/VirtualPortfolio';
import MarketNewsInteraction from '../models/MarketNewsInteraction';
import { getMarketOverview, getTickerQuote } from '../services/marketDataService';
import { getAIExplanation } from '../services/marketAiService';
import { aggregateMarketNews } from '../services/marketAggregator';

export const getNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { category, page = 1, limit = 5, filter = 'All' } = req.query; // limit 5 per page
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // First fetch interactions for the user to determine filters
    const userInteractions = await MarketNewsInteraction.find({ user: user._id });
    const readItemIds = userInteractions.filter(i => i.isRead).map(i => i.newsItem.toString());
    const savedItemIds = userInteractions.filter(i => i.isSaved).map(i => i.newsItem.toString());

    let query: any = {};
    if (category && category !== 'All') {
      query.categories = category;
    }

    if (filter === 'Read') {
      query._id = { $in: readItemIds };
    } else if (filter === 'Unread') {
      query._id = { $nin: readItemIds };
    } else if (filter === 'Saved') {
      query._id = { $in: savedItemIds };
    }

    const items = await MarketNews.find(query)
      .sort({ pubDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await MarketNews.countDocuments(query);

    // Map the interactions to the returned items
    const enrichedItems = items.map(item => {
      const interaction = userInteractions.find(i => i.newsItem.toString() === item._id.toString());
      return {
        ...item.toObject(),
        isRead: interaction ? interaction.isRead : false,
        isSaved: interaction ? interaction.isSaved : false,
      };
    });

    res.status(200).json({
      items: enrichedItems,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalItems: total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const total = await MarketNews.countDocuments();
    const readCount = await MarketNewsInteraction.countDocuments({ user: user._id, isRead: true });
    
    res.status(200).json({ total, readCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleNewsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    
    let interaction = await MarketNewsInteraction.findOne({ user: user._id, newsItem: id });
    if (!interaction) {
      interaction = new MarketNewsInteraction({ user: user._id, newsItem: id });
    }
    
    interaction.isRead = !interaction.isRead;
    await interaction.save();
    
    res.status(200).json({ isRead: interaction.isRead });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleNewsSaved = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    
    let interaction = await MarketNewsInteraction.findOne({ user: user._id, newsItem: id });
    if (!interaction) {
      interaction = new MarketNewsInteraction({ user: user._id, newsItem: id });
    }
    
    interaction.isSaved = !interaction.isSaved;
    await interaction.save();
    
    res.status(200).json({ isSaved: interaction.isSaved });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const overview = await getMarketOverview();
    res.status(200).json(overview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const askAiAnalyst = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ message: 'Question is required' });
      return;
    }
    const answer = await getAIExplanation(question);
    res.status(200).json({ answer });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Portfolio Endpoints
export const getPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const portfolio = await VirtualPortfolio.find({ user: user._id, status: 'Active' });
    
    // Fetch live prices to calculate current value
    const enriched = await Promise.all(portfolio.map(async (pos) => {
      try {
        const quote = await getTickerQuote(pos.ticker);
        const currentValue = quote.price * pos.quantity;
        const totalCost = pos.buyPrice * pos.quantity;
        return {
          ...pos.toObject(),
          currentPrice: quote.price,
          currentValue,
          profitOrLoss: currentValue - totalCost,
          profitOrLossPercent: ((currentValue - totalCost) / totalCost) * 100
        };
      } catch (err) {
        // Fallback if API fails
        return {
          ...pos.toObject(),
          currentPrice: pos.buyPrice,
          currentValue: pos.buyPrice * pos.quantity,
          profitOrLoss: 0,
          profitOrLossPercent: 0
        };
      }
    }));

    res.status(200).json(enriched);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addPortfolioItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { ticker, companyName, buyPrice, quantity } = req.body;

    const item = await VirtualPortfolio.create({
      user: user._id,
      ticker: ticker.toUpperCase(),
      companyName,
      buyPrice,
      quantity
    });

    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const triggerAggregation = async (req: Request, res: Response): Promise<void> => {
  try {
    await aggregateMarketNews();
    res.status(200).json({ message: 'Market aggregation completed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
