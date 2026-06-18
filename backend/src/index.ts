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
import personalRoutes from './routes/personalRoutes';
import manifestationRoutes from './routes/manifestationRoutes';
import adminRoutes from './routes/adminRoutes';
import supportRoutes from './routes/supportRoutes';
import { blockCheck, checkModuleAccess } from './middleware/rbacMiddleware';
import { protect } from './middleware/authMiddleware';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Mount Routes
app.use('/api/auth', authRoutes);

// Apply auth protection and block checks to all subsequent API routes
app.use('/api', protect, blockCheck);

app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);

// Module Routes Protected by RBAC & Feature Flags
app.use('/api/goals', checkModuleAccess('Goals'), goalRoutes);
app.use('/api/tasks', checkModuleAccess('Tasks'), taskRoutes);
app.use('/api/habits', checkModuleAccess('Habits'), habitRoutes);
app.use('/api/games', checkModuleAccess('Gaming Lounge'), gameRoutes);
app.use('/api/jobs', checkModuleAccess('Job Discovery'), jobRoutes);
app.use('/api/chat', checkModuleAccess('Chat'), chatRoutes);
app.use('/api/resumes', checkModuleAccess('Resume Builder'), resumeRoutes);
app.use('/api/workouts', checkModuleAccess('Home Coach'), workoutRoutes);
app.use('/api/nofap', checkModuleAccess('Discipline'), nofapRoutes);
app.use('/api/yoga', checkModuleAccess('Yoga Coach'), yogaRoutes);
app.use('/api/meditation', checkModuleAccess('Meditation'), meditationRoutes);
app.use('/api/stoicism', checkModuleAccess('Stoicism'), stoicRoutes);
app.use('/api/personal', checkModuleAccess('Personal Dev'), personalRoutes);
app.use('/api/manifestation', checkModuleAccess('Manifestation'), manifestationRoutes);

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
