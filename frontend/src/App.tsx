import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import GoalList from './pages/goals/GoalList';
import CreateGoal from './pages/goals/CreateGoal';
import EditGoal from './pages/goals/EditGoal';
import UpdateHours from './pages/goals/UpdateHours';
import TaskList from './pages/tasks/TaskList';
import HabitList from './pages/habits/HabitList';
import MiniGamesDashboard from './pages/games/MiniGamesDashboard';
import GameLobby from './pages/games/GameLobby';
import GamePlay from './pages/games/GamePlay';
import JobDashboard from './pages/jobs/JobDashboard';
import JobPreferences from './pages/jobs/JobPreferences';
import JobKanban from './pages/jobs/JobKanban';
import JobAnalytics from './pages/jobs/JobAnalytics';
import AdminCompanySources from './pages/jobs/AdminCompanySources';
import Settings from './pages/settings/Settings';
import ChatDashboard from './pages/chat/ChatDashboard';
import ResumeDashboard from './pages/resume/ResumeDashboard';
import ResumeBuilder from './pages/resume/ResumeBuilder';
import ResumePreview from './pages/resume/ResumePreview';
import WorkoutDashboard from './pages/workouts/WorkoutDashboard';
import FitnessProfile from './pages/workouts/FitnessProfile';
import WorkoutPlanView from './pages/workouts/WorkoutPlanView';
import ActiveSession from './pages/workouts/ActiveSession';
import ExerciseLibrary from './pages/workouts/ExerciseLibrary';
import BodyTracker from './pages/workouts/BodyTracker';
import DashboardLayout from './components/layout/DashboardLayout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SocketProvider>
          <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/goals" element={<GoalList />} />
              <Route path="/goals/create" element={<CreateGoal />} />
              <Route path="/goals/edit/:id" element={<EditGoal />} />
              <Route path="/goals/update-hours" element={<UpdateHours />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/habits" element={<HabitList />} />
              <Route path="/games" element={<MiniGamesDashboard />} />
              <Route path="/games/lobby/:roomId" element={<GameLobby />} />
              <Route path="/games/play/:roomId" element={<GamePlay />} />
              
              {/* Job Modules */}
              <Route path="/jobs" element={<JobDashboard />} />
              <Route path="/jobs/preferences" element={<JobPreferences />} />
              <Route path="/jobs/tracker" element={<JobKanban />} />
              <Route path="/jobs/analytics" element={<JobAnalytics />} />
              <Route path="/jobs/admin" element={<AdminCompanySources />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<ChatDashboard />} />
              
              {/* Resume Builder */}
              <Route path="/resume" element={<ResumeDashboard />} />
              <Route path="/resume/:id/edit" element={<ResumeBuilder />} />
              <Route path="/resume/:id/preview" element={<ResumePreview />} />

              {/* Workouts */}
              <Route path="/workouts" element={<WorkoutDashboard />} />
              <Route path="/workouts/profile" element={<FitnessProfile />} />
              <Route path="/workouts/plan" element={<WorkoutPlanView />} />
              <Route path="/workouts/session" element={<ActiveSession />} />
              <Route path="/workouts/library" element={<ExerciseLibrary />} />
              <Route path="/workouts/tracker" element={<BodyTracker />} />
            </Route>
          </Route>
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
