import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/ticktickController';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
