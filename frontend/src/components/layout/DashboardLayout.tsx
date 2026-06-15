import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { 
  LayoutDashboard, 
  Target, 
  CheckCircle, 
  Settings, 
  Menu,
  Bell,
  LogOut,
  Clock,
  Activity,
  Gamepad2,
  Briefcase,
  Settings2,
  Columns,
  BarChart3,
  Database,
  MessageCircle,
  FileText,
  Dumbbell,
  Shield,
  Activity as YogaIcon,
  Wind,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DailyCheckInModal from '../DailyCheckInModal';
import NoFapCheckInModal from '../nofap/NoFapCheckInModal';
import { getProfile as getNoFapProfile } from '../../api/nofap';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showNoFapCheckInModal, setShowNoFapCheckInModal] = useState(false);
  const [noFapLastCheckIn, setNoFapLastCheckIn] = useState<Date | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    // Fetch NoFap profile once to get lastCheckInDate
    const fetchNoFapInfo = async () => {
      try {
        if (user?.token) {
          const profile = await getNoFapProfile(user.token);
          if (profile?.lastCheckInDate) {
            setNoFapLastCheckIn(new Date(profile.lastCheckInDate));
          }
        }
      } catch (err) {
        console.error('Failed to fetch NoFap profile for layout', err);
      }
    };
    fetchNoFapInfo();

    const handleNoFapCheckedIn = () => setNoFapLastCheckIn(new Date());
    window.addEventListener('nofapCheckedIn', handleNoFapCheckedIn);
    
    return () => window.removeEventListener('nofapCheckedIn', handleNoFapCheckedIn);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const checkShouldShowModal = () => {
      const today = new Date();
      const currentTimeStr = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

      // Daily Check-in Modal Logic
      const lastLog = user.lastDailyLog ? new Date(user.lastDailyLog) : null;
      const isTodayDaily = lastLog && 
        lastLog.getDate() === today.getDate() &&
        lastLog.getMonth() === today.getMonth() &&
        lastLog.getFullYear() === today.getFullYear();

      if (!isTodayDaily) {
        const checkInTimeStr = user.dailyCheckInTime || '20:00';
        if (currentTimeStr >= checkInTimeStr) {
          setShowCheckInModal(true);
        }
      } else {
        setShowCheckInModal(false);
      }

      // NoFap Check-in Modal Logic
      const isTodayNoFap = noFapLastCheckIn && 
        noFapLastCheckIn.getDate() === today.getDate() &&
        noFapLastCheckIn.getMonth() === today.getMonth() &&
        noFapLastCheckIn.getFullYear() === today.getFullYear();

      if (!isTodayNoFap) {
        const noFapTimeStr = user.nofapCheckInTime || '20:00';
        if (currentTimeStr >= noFapTimeStr) {
          // Don't show both modals at exactly the same time, prioritize DailyCheckIn if both are true
          // Wait, they can be stacked or just independent. Let's just set it to true.
          setShowNoFapCheckInModal(true);
        }
      } else {
        setShowNoFapCheckInModal(false);
      }
    };

    checkShouldShowModal();
    
    // Check every minute in case they leave the app open
    const interval = setInterval(checkShouldShowModal, 60000);
    return () => clearInterval(interval);
  }, [user, noFapLastCheckIn]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Update Hours', href: '/goals/update-hours', icon: Clock },
    { name: 'Tasks', href: '/tasks', icon: CheckCircle },
    { name: 'Habits', href: '/habits', icon: Activity },
    { name: 'Gaming Lounge', href: '/games', icon: Gamepad2 },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Resume Builder', href: '/resume', icon: FileText },
    { name: 'Home Coach', href: '/workouts', icon: Dumbbell },
    { name: 'Discipline', href: '/nofap', icon: Shield },
    { name: 'Yoga Coach', href: '/yoga', icon: YogaIcon },
    { name: 'Meditation', href: '/meditation', icon: Wind },
    { name: 'Stoicism', href: '/stoicism', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-transparent flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#0070D1]/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-900/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-float-delayed" />
      </div>

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-30 w-64 glass border-r border-emerald-100 transform lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-brand/40 neon-border-brand bg-black/20">
          <Target className="h-8 w-8 text-brand animate-ps-glow rounded-full p-1" />
          <span className="ml-2 text-xl font-bold text-text-primary tracking-tight neon-text-brand">GoalPilot</span>
        </div>
        <div className="overflow-y-auto h-full p-4">
          <nav className="space-y-1">
            {navigation.map((item, index) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.name}
                >
                  <Link
                    to={item.href}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-brand/20 text-white shadow-[0_0_15px_rgba(0,112,209,0.4)] border border-brand/50 neon-border-brand scale-[1.02]'
                        : 'text-text-secondary hover:bg-brand/10 hover:text-brand hover:scale-105'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon
                      className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors ${
                        isActive ? 'text-white' : 'text-emerald-400 group-hover:text-brand'
                      }`}
                    />
                    <span className="truncate flex-1">{item.name}</span>
                    {item.name === 'Chat' && unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}

            <div className="pt-4 mt-4 border-t border-emerald-100/20">
              <span className="px-3 text-xs font-bold text-emerald-600/70 uppercase tracking-widest">Job Discovery</span>
            </div>
            
            <NavLink to="/jobs" className={({ isActive }) => `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'bg-brand text-white shadow-md transform scale-[1.02]' : 'text-text-secondary hover:bg-brand-light hover:text-brand hover:scale-105'}`} onClick={() => setIsSidebarOpen(false)}>
              <Briefcase className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors ${location.pathname === '/jobs' ? 'text-white' : 'text-emerald-400 group-hover:text-brand'}`} />
              <span className="truncate">Job Feed</span>
            </NavLink>
            
            <NavLink to="/jobs/tracker" className={({ isActive }) => `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'bg-brand text-white shadow-md transform scale-[1.02]' : 'text-text-secondary hover:bg-brand-light hover:text-brand hover:scale-105'}`} onClick={() => setIsSidebarOpen(false)}>
              <Columns className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors ${location.pathname.startsWith('/jobs/tracker') ? 'text-white' : 'text-emerald-400 group-hover:text-brand'}`} />
              <span className="truncate">App Tracker</span>
            </NavLink>
            
            <NavLink to="/jobs/preferences" className={({ isActive }) => `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'bg-brand text-white shadow-md transform scale-[1.02]' : 'text-text-secondary hover:bg-brand-light hover:text-brand hover:scale-105'}`} onClick={() => setIsSidebarOpen(false)}>
              <Settings2 className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors ${location.pathname.startsWith('/jobs/preferences') ? 'text-white' : 'text-emerald-400 group-hover:text-brand'}`} />
              <span className="truncate">Preferences</span>
            </NavLink>
            
            <NavLink to="/jobs/analytics" className={({ isActive }) => `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'bg-brand text-white shadow-md transform scale-[1.02]' : 'text-text-secondary hover:bg-brand-light hover:text-brand hover:scale-105'}`} onClick={() => setIsSidebarOpen(false)}>
              <BarChart3 className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors ${location.pathname.startsWith('/jobs/analytics') ? 'text-white' : 'text-emerald-400 group-hover:text-brand'}`} />
              <span className="truncate">Analytics</span>
            </NavLink>
            
            <NavLink to="/jobs/admin" className={({ isActive }) => `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'bg-red-600 text-white shadow-md transform scale-[1.02]' : 'text-text-secondary hover:bg-brand-light hover:text-red-500 hover:scale-105'}`} onClick={() => setIsSidebarOpen(false)}>
              <Database className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors ${location.pathname.startsWith('/jobs/admin') ? 'text-white' : 'text-red-400 group-hover:text-red-500'}`} />
              <span className="truncate">Admin Targets</span>
            </NavLink>

          </nav>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Navigation */}
        <header className="glass border-b border-emerald-100/50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden text-text-secondary hover:text-brand focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-text-primary capitalize neon-text-brand tracking-wider">
                {location.pathname.split('/')[1] || 'Dashboard'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-emerald-600 hover:text-brand transition-colors hover:scale-110 transform">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3 border-l border-emerald-200 pl-4">
              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-sm font-medium text-text-primary">{user?.name}</span>
                <span className="text-xs text-text-secondary">{user?.email}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center text-white font-semibold shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="ml-2 text-emerald-600 hover:text-red-500 transition-colors hover:scale-110 transform"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Mobile Page Title */}
            <div className="lg:hidden mb-6">
              <h1 className="text-2xl font-semibold text-text-primary capitalize">
                {location.pathname.split('/')[1] || 'Dashboard'}
              </h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      <DailyCheckInModal 
        isOpen={showCheckInModal} 
        onClose={() => setShowCheckInModal(false)} 
      />

      <NoFapCheckInModal 
        isOpen={showNoFapCheckInModal} 
        onClose={() => setShowNoFapCheckInModal(false)} 
        onSuccess={() => {
          setNoFapLastCheckIn(new Date());
          window.dispatchEvent(new Event('nofapCheckedIn'));
        }} 
      />
    </div>
  );
}
