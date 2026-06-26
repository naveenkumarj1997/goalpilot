import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getCombatProfile,
  updateCombatProfile,
  getCombatRoadmap,
  generateCombatRoadmap,
  getCombatLessons,
  logWorkout
} from '../controllers/combatController';

const router = Router();

// Protect all combat routes
router.use(protect);

router.route('/profile')
  .get(getCombatProfile)
  .post(updateCombatProfile); // used for both create and update

router.route('/roadmap')
  .get(getCombatRoadmap)
  .post(generateCombatRoadmap);

router.get('/lessons', getCombatLessons);

router.post('/log-workout', logWorkout);

export default router;
