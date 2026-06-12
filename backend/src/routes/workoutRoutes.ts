import express from 'express';
import { 
  getProfile, updateProfile, getExercises, 
  generateWorkoutPlan, getWorkoutPlan, logSession, 
  getDashboardStats, getBodyMetrics, addBodyMetric 
} from '../controllers/workoutController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All workout routes are protected
router.use(protect);

// Profile
router.route('/profile')
  .get(getProfile)
  .post(updateProfile);

// Exercises
router.get('/exercises', getExercises);

// AI Plan
router.post('/generate-plan', generateWorkoutPlan);
router.get('/plan', getWorkoutPlan);

// Sessions & Stats
router.post('/session', logSession);
router.get('/stats', getDashboardStats);

// Body Tracker
router.route('/body-metrics')
  .get(getBodyMetrics)
  .post(addBodyMetric);

export default router;
