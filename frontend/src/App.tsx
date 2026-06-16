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
import NoFapDashboard from './pages/nofap/NoFapDashboard';
import NoFapCalendar from './pages/nofap/NoFapCalendar';
import NoFapAnalytics from './pages/nofap/NoFapAnalytics';
import NoFapJournal from './pages/nofap/NoFapJournal';
import YogaDashboard from './pages/yoga/YogaDashboard';
import YogaLibrary from './pages/yoga/YogaLibrary';
import YogaProgress from './pages/yoga/YogaProgress';
import YogaLessonView from './pages/yoga/YogaLessonView';
import MeditationDashboard from './pages/meditation/MeditationDashboard';
import MeditationLibrary from './pages/meditation/MeditationLibrary';
import BreathingExercises from './pages/meditation/BreathingExercises';
import FocusTimer from './pages/meditation/FocusTimer';
import MeditationProgress from './pages/meditation/MeditationProgress';
import MeditationSession from './pages/meditation/MeditationSession';
import MusicMeditation from './pages/meditation/MusicMeditation';
import StoicDashboard from './pages/stoicism/StoicDashboard';
import LearnStoicism from './pages/stoicism/LearnStoicism';
import LessonView from './pages/stoicism/LessonView';
import DailyWisdom from './pages/stoicism/DailyWisdom';
import LifeSituations from './pages/stoicism/LifeSituations';
import QuoteLibrary from './pages/stoicism/QuoteLibrary';
import StoicExercises from './pages/stoicism/StoicExercises';
import StoicJournal from './pages/stoicism/StoicJournal';
import StoicProgress from './pages/stoicism/StoicProgress';

import PersonalOnboarding from './pages/personal/PersonalOnboarding';
import PersonalDashboard from './pages/personal/PersonalDashboard';
import Appearance from './pages/personal/Appearance';
import StyleDressing from './pages/personal/StyleDressing';
import BodyLanguage from './pages/personal/BodyLanguage';
import Communication from './pages/personal/Communication';
import Confidence from './pages/personal/Confidence';
import SocialSkills from './pages/personal/SocialSkills';
import Mindset from './pages/personal/Mindset';
import PersonalChallenges from './pages/personal/PersonalChallenges';
import PersonalProgress from './pages/personal/PersonalProgress';

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

              {/* NoFap / Discipline Tracker */}
              <Route path="/nofap" element={<NoFapDashboard />} />
              <Route path="/nofap/calendar" element={<NoFapCalendar />} />
              <Route path="/nofap/analytics" element={<NoFapAnalytics />} />
              <Route path="/nofap/journal" element={<NoFapJournal />} />

              {/* Yoga Coach */}
              <Route path="/yoga" element={<YogaDashboard />} />
              <Route path="/yoga/library" element={<YogaLibrary />} />
              <Route path="/yoga/progress" element={<YogaProgress />} />
              <Route path="/yoga/lesson/:id" element={<YogaLessonView />} />

              {/* Meditation Coach */}
              <Route path="/meditation" element={<MeditationDashboard />} />
              <Route path="/meditation/library" element={<MeditationLibrary />} />
              <Route path="/meditation/breathing" element={<BreathingExercises />} />
              <Route path="/meditation/focus" element={<FocusTimer />} />
              <Route path="/meditation/music" element={<MusicMeditation />} />
              <Route path="/meditation/progress" element={<MeditationProgress />} />
              <Route path="/meditation/session/:id" element={<MeditationSession />} />

              {/* Stoicism Routes */}
              <Route path="/stoicism" element={<StoicDashboard />} />
              <Route path="/stoicism/learn" element={<LearnStoicism />} />
              <Route path="/stoicism/lesson/:id" element={<LessonView />} />
              <Route path="/stoicism/wisdom" element={<DailyWisdom />} />
              <Route path="/stoicism/situations" element={<LifeSituations />} />
              <Route path="/stoicism/quotes" element={<QuoteLibrary />} />
              <Route path="/stoicism/exercises" element={<StoicExercises />} />
              <Route path="/stoicism/journal" element={<StoicJournal />} />
              <Route path="/stoicism/progress" element={<StoicProgress />} />

              {/* Personal Development & Presence */}
              <Route path="/personal/onboarding" element={<PersonalOnboarding />} />
              <Route path="/personal/dashboard" element={<PersonalDashboard />} />
              <Route path="/personal/appearance" element={<Appearance />} />
              <Route path="/personal/style" element={<StyleDressing />} />
              <Route path="/personal/body-language" element={<BodyLanguage />} />
              <Route path="/personal/communication" element={<Communication />} />
              <Route path="/personal/confidence" element={<Confidence />} />
              <Route path="/personal/social" element={<SocialSkills />} />
              <Route path="/personal/mindset" element={<Mindset />} />
              <Route path="/personal/challenges" element={<PersonalChallenges />} />
              <Route path="/personal/progress" element={<PersonalProgress />} />
            </Route>
          </Route>
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
