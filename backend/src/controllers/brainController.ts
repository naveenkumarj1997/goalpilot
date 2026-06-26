import { Response } from 'express';
import BrainProfile from '../models/BrainProfile';
import BrainDeck from '../models/BrainDeck';
import BrainFlashcard from '../models/BrainFlashcard';
import { AuthRequest } from '../middleware/authMiddleware';
import { calculateSRS, generateProgrammaticFlashcards } from '../services/brainService';

// ==========================
// PROFILE ROUTES
// ==========================

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await BrainProfile.findOne({ user: req.user?._id });
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    profile.lastActive = new Date();
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const setupProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { age, profession, learningGoals, examPreparation, interviewPreparation, dailyStudyHours, preferredSubjects } = req.body;
    
    let profile = await BrainProfile.findOne({ user: req.user?._id });
    
    if (profile) {
      profile.age = age;
      profile.profession = profession;
      profile.learningGoals = learningGoals;
      profile.examPreparation = examPreparation;
      profile.interviewPreparation = interviewPreparation;
      profile.dailyStudyHours = dailyStudyHours;
      profile.preferredSubjects = preferredSubjects;
      await profile.save();
    } else {
      profile = await BrainProfile.create({
        user: req.user?._id,
        age,
        profession,
        learningGoals,
        examPreparation,
        interviewPreparation,
        dailyStudyHours,
        preferredSubjects,
      });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ==========================
// FLASHCARD ROUTES
// ==========================

export const getDecks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const decks = await BrainDeck.find({ user: req.user?._id }).sort({ createdAt: -1 });
    
    // Add "due count" to each deck
    const now = new Date();
    const result = await Promise.all(decks.map(async (deck) => {
      const dueCount = await BrainFlashcard.countDocuments({
        deck: deck._id,
        nextReviewDate: { $lte: now }
      });
      const totalCount = await BrainFlashcard.countDocuments({ deck: deck._id });
      return { ...deck.toObject(), dueCount, totalCount };
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createDeck = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, tags } = req.body;
    const deck = await BrainDeck.create({
      user: req.user?._id,
      title,
      description,
      tags
    });
    res.status(201).json(deck);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addFlashcard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { deckId, front, back } = req.body;
    const card = await BrainFlashcard.create({
      user: req.user?._id,
      deck: deckId,
      front,
      back
    });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const autoGenerateCards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { deckId, text } = req.body;
    const generated = generateProgrammaticFlashcards(text);
    
    if (generated.length === 0) {
      res.status(400).json({ message: 'Could not extract keywords from the provided text.' });
      return;
    }

    const cards = await Promise.all(generated.map(card => 
      BrainFlashcard.create({
        user: req.user?._id,
        deck: deckId,
        front: card.front,
        back: card.back
      })
    ));

    res.status(201).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getDueCards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { deckId } = req.params;
    const now = new Date();
    const cards = await BrainFlashcard.find({
      deck: deckId,
      user: req.user?._id,
      nextReviewDate: { $lte: now }
    }).limit(50); // limit to a 50 card review session max
    
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const reviewCard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;
    const { quality } = req.body; // 0 to 5

    const card = await BrainFlashcard.findOne({ _id: cardId, user: req.user?._id });
    if (!card) {
      res.status(404).json({ message: 'Card not found' });
      return;
    }

    const srs = calculateSRS(quality, card.easeFactor, card.interval, card.repetitions);
    
    card.easeFactor = srs.easeFactor;
    card.interval = srs.interval;
    card.repetitions = srs.repetitions;
    card.nextReviewDate = srs.nextReviewDate;
    await card.save();

    // Update Profile Stats
    await BrainProfile.findOneAndUpdate(
      { user: req.user?._id },
      { $inc: { 'stats.flashcardsReviewed': 1 } }
    );

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
