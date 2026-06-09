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
