import express from 'express';
import { 
  getBooks, 
  getBookById, 
  getProfile, 
  updateLanguage, 
  toggleFavorite, 
  markLessonLearned,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/wisdomController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = express.Router();

router.use(protect);

router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.get('/profile', getProfile);
router.put('/profile/language', updateLanguage);
router.put('/profile/favorite', toggleFavorite);
router.put('/profile/lesson', markLessonLearned);

// Admin Routes
const adminProtect = requireRole(['Admin', 'SuperAdmin']);
router.post('/books', adminProtect, createBook);
router.put('/books/:id', adminProtect, updateBook);
router.delete('/books/:id', adminProtect, deleteBook);

export default router;
