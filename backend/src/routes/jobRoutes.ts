import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getPreferences,
  updatePreferences,
  getJobs,
  getJobAnalytics,
  getUserJobs,
  updateJobState,
  deleteJobState,
  getSources,
  addSource,
  removeSource,
  triggerScan,
  exportJobsToSheet
} from '../controllers/jobController';

const router = express.Router();

router.use(protect);

// User Preferences
router.route('/preferences').get(getPreferences).put(updatePreferences);

// Jobs Discovery
router.get('/search', getJobs);
router.post('/export-to-sheet', exportJobsToSheet);
router.get('/analytics', getJobAnalytics);

// User Job State (Kanban / Saved)
router.route('/state').get(getUserJobs).post(updateJobState);
router.delete('/state/:id', deleteJobState);

// Admin Routes (In a real app, protect these with admin middleware)
router.route('/sources').get(getSources).post(addSource);
router.delete('/sources/:id', removeSource);
router.post('/scan', triggerScan);

export default router;
