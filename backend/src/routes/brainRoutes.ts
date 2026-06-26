import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getProfile,
  setupProfile,
  getDecks,
  createDeck,
  addFlashcard,
  autoGenerateCards,
  getDueCards,
  reviewCard
} from '../controllers/brainController';

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.post('/setup', setupProfile);

// Flashcard Deck routes
router.get('/decks', getDecks);
router.post('/decks', createDeck);

// Flashcard routes
router.post('/flashcards', addFlashcard);
router.post('/flashcards/auto-generate', autoGenerateCards);
router.get('/flashcards/due/:deckId', getDueCards);
router.post('/flashcards/:cardId/review', reviewCard);

export default router;
