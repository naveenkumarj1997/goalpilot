import express from 'express';
import { getTodayPlan, generatePlan, updateTask, addTask, deleteTask, submitCheckIn } from '../controllers/missionControlController';
import { protect } from '../middleware/authMiddleware';
import { checkModuleAccess } from '../middleware/rbacMiddleware';

const router = express.Router();

router.use(protect);
router.use(checkModuleAccess('Mission Control'));

router.get('/today', getTodayPlan);
router.post('/generate', generatePlan);
router.put('/task', updateTask);
router.post('/task', addTask);
router.delete('/task/:taskId', deleteTask);
router.post('/checkin', submitCheckIn);

export default router;
