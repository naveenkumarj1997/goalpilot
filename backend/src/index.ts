import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import goalRoutes from './routes/goalRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import habitRoutes from './routes/habitRoutes';
import gameRoutes from './routes/gameRoutes';
import friendRoutes from './routes/friendRoutes';
import chatRoutes from './routes/chatRoutes';
import { connectDB } from './config/db';
import { createServer } from 'http';
import { setupSocket } from './socket';
import { initCronJobs } from './services/cronService';
import jobRoutes from './routes/jobRoutes';
import resumeRoutes from './routes/resumeRoutes';
import workoutRoutes from './routes/workoutRoutes';
import nofapRoutes from './routes/nofapRoutes';
import yogaRoutes from './routes/yogaRoutes';
import meditationRoutes from './routes/meditationRoutes';
import stoicRoutes from './routes/stoicRoutes';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nofap', nofapRoutes);
app.use('/api/yoga', yogaRoutes);
app.use('/api/meditation', meditationRoutes);
app.use('/api/stoicism', stoicRoutes);

app.get('/', (req, res) => {
  res.send('GoalPilot Backend API is running!');
});

const server = createServer(app);

// Initialize Socket.io
setupSocket(server);

// Initialize Cron Jobs
initCronJobs();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
