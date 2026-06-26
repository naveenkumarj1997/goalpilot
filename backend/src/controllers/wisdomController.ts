import { Request, Response } from 'express';
import WisdomBook from '../models/WisdomBook';
import WisdomProfile from '../models/WisdomProfile';

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await WisdomBook.find().select('-lessons.explanation -lessons.example'); // Keep list lightweight
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await WisdomBook.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let profile = await WisdomProfile.findOne({ userId });
    
    if (!profile) {
      profile = await WisdomProfile.create({ userId });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateLanguage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { lang } = req.body; // 'en' | 'ta'

    const profile = await WisdomProfile.findOneAndUpdate(
      { userId },
      { languagePreference: lang },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { bookId } = req.body;

    const profile = await WisdomProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const index = profile.favorites.indexOf(bookId);
    if (index === -1) {
      profile.favorites.push(bookId);
    } else {
      profile.favorites.splice(index, 1);
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const markLessonLearned = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { bookId, lessonNumber } = req.body;

    const profile = await WisdomProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const exists = profile.lessonsLearned.find(l => l.bookId.toString() === bookId && l.lessonNumber === lessonNumber);
    if (!exists) {
      profile.lessonsLearned.push({ bookId, lessonNumber });
      profile.wisdomScore += 10;
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- ADMIN ROUTES ---

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await WisdomBook.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await WisdomBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await WisdomBook.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
