import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { DEFAULT_UNLOCKED_MODULES } from '../../utils/modules';
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
  Database,
  MessageCircle,
  FileText,
  Dumbbell,
  Shield,
  Activity as YogaIcon,
  Wind,
  BookOpen,
  User,
  Sparkles,
  Lock,
  Crown,
  Ban,
  LockKeyhole,
  Rocket,
  MonitorPlay,
  ChevronDown,
  Calculator,
  Globe,
  Brain,
  Library,
  Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DailyCheckInModal from '../DailyCheckInModal';
import NoFapCheckInModal from '../nofap/NoFapCheckInModal';
import LockedModuleModal from '../LockedModuleModal';
import SupportChatWidget from '../SupportChatWidget';
import DreamDailyCheckInModal from '../wealth/DreamDailyCheckInModal';
import { getProfile as getNoFapProfile } from '../../api/nofap';

export default function DashboardLayout() {
  const { user, logout, featureFlags, refreshUser } = useAuth();
  const { unreadCount } = useSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showNoFapCheckInModal, setShowNoFapCheckInModal] = useState(false);
  const [showDreamCheckInModal, setShowDreamCheckInModal] = useState(false);
  const [lockedModule, setLockedModule] = useState<{ isOpen: boolean; name: string; status: 'Premium' | 'Disabled' }>({ isOpen: false, name: '', status: 'Premium' });
  const [noFapLastCheckIn, setNoFapLastCheckIn] = useState<Date | null>(null);
  const [hasFetchedNoFap, setHasFetchedNoFap] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    refreshUser?.();
  }, [location.pathname]);

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
      } finally {
        setHasFetchedNoFap(true);
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
      if (hasFetchedNoFap) {
        const isTodayNoFap = noFapLastCheckIn && 
          noFapLastCheckIn.getDate() === today.getDate() &&
          noFapLastCheckIn.getMonth() === today.getMonth() &&
          noFapLastCheckIn.getFullYear() === today.getFullYear();

        if (!isTodayNoFap) {
          const noFapTimeStr = user.nofapCheckInTime || '20:00';
          if (currentTimeStr >= noFapTimeStr) {
            setShowNoFapCheckInModal(true);
          }
        } else {
          setShowNoFapCheckInModal(false);
        }
      }

      // Dream Daily Check-in Modal Logic
      const lastDreamCheckInStr = localStorage.getItem('lastDreamCheckInDate');
      const lastDreamCheckIn = lastDreamCheckInStr ? new Date(lastDreamCheckInStr) : null;
      const isTodayDream = lastDreamCheckIn && 
        lastDreamCheckIn.getDate() === today.getDate() &&
        lastDreamCheckIn.getMonth() === today.getMonth() &&
        lastDreamCheckIn.getFullYear() === today.getFullYear();
      
      if (!isTodayDream) {
        const dreamTimeStr = user.dreamCheckInTime || '20:00';
        if (currentTimeStr >= dreamTimeStr) {
          setShowDreamCheckInModal(true);
        }
      } else {
        setShowDreamCheckInModal(false);
      }
    };

    checkShouldShowModal();
    
    // Check every minute in case they leave the app open
    const interval = setInterval(checkShouldShowModal, 60000);
    return () => clearInterval(interval);
  }, [user, noFapLastCheckIn, hasFetchedNoFap]);

  const baseNavigation = [
    { name: 'Mission Control', href: '/mission-control', icon: Rocket },
    { name: 'TickTick Planner', href: '/ticktick', icon: CheckCircle },
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
    { name: 'Personal Dev', href: '/personal/dashboard', icon: User },
    { name: 'Manifestation', href: '/manifestation/dashboard', icon: Sparkles },
    { 
      name: 'Watch Together', 
      href: '/watch', 
      icon: MonitorPlay,
      subMenus: [
        { name: 'Dashboard', href: '/watch' },
        { name: 'Create Room', href: '/watch/create' },
        { name: 'My Rooms', href: '/watch/my-rooms' },
        { name: 'Watch History', href: '/watch/history' }
      ]
    },
    { name: 'Intelligence Hub', href: '/intelligence', icon: Globe },
    { 
      name: 'Combat Academy', 
      href: '/combat', 
      icon: Shield,
      subMenus: [
        { name: 'Dashboard', href: '/combat/dashboard' },
        { name: 'Choose Your Path', href: '/combat/onboarding' },
        { name: 'Boxing Academy', href: '/combat/boxing' },
        { name: 'Kickboxing Academy', href: '/combat/kickboxing' },
        { name: 'MMA Fundamentals', href: '/combat/mma' },
        { name: 'Self Defense', href: '/combat/self-defense' },
        { name: 'Shadow Boxing', href: '/combat/shadow-boxing' },
        { name: 'Punch Library', href: '/combat/punches' },
        { name: 'Progress Tracker', href: '/combat/progress' },
      ]
    },
    { 
      name: 'Market Intelligence', 
      href: '/market', 
      icon: Activity,
      subMenus: [
        { name: 'Dashboard', href: '/market' },
        { name: 'Market Overview', href: '/market/overview' },
        { name: 'Breaking News', href: '/market/news' },
        { name: 'Portfolio Tracker', href: '/market/portfolio' },
        { name: 'AI Market Analyst', href: '/market/analyst' },
        { name: 'Learning Center', href: '/market/learning' }
      ]
    },
    { 
      name: 'Brain Academy', 
      href: '/brain', 
      icon: Brain,
      subMenus: [
        { name: 'Dashboard', href: '/brain/dashboard' },
        { name: 'Memory Training', href: '/brain/memory' },
        { name: 'Focus Training', href: '/brain/focus' },
        { name: 'Active Recall', href: '/brain/active-recall' },
        { name: 'Spaced Repetition', href: '/brain/spaced-repetition' },
        { name: 'Memory Palace', href: '/brain/memory-palace' },
        { name: 'Study Planner', href: '/brain/planner' },
        { name: 'Interview Recall', href: '/brain/interview' },
        { name: 'Brain Games', href: '/brain/games' },
        { name: 'Flashcards', href: '/brain/flashcards' },
        { name: 'AI Memory Coach', href: '/brain/coach' },
        { name: 'Progress Tracker', href: '/brain/progress' },
        { name: 'Analytics', href: '/brain/analytics' },
        { name: 'Achievements', href: '/brain/achievements' },
      ]
    },
    { 
      name: 'Wisdom Library', 
      href: '/wisdom', 
      icon: Library,
      subMenus: [
        { name: 'Dashboard', href: '/wisdom' },
        { name: 'Bookshelf', href: '/wisdom' },
        { name: 'Daily Wisdom', href: '/wisdom' },
        { name: 'AI Book Coach', href: '/wisdom' },
        { name: 'My Notes', href: '/wisdom' },
        { name: 'Progress', href: '/wisdom' }
      ]
    },
    { 
      name: 'Life Wealth & Dream OS', 
      href: '/wealth', 
      icon: Landmark,
      subMenus: [
        { name: 'Dashboard', href: '/wealth' },
        { name: 'Dream Planner', href: '/wealth/dreams' },
        { name: 'Bucket List', href: '/wealth/bucket-list' },
        { name: 'Financial Forecast', href: '/wealth/forecast' },
        { name: 'AI Dream Advisor', href: '/wealth/advisor' }
      ]
    },
    { name: 'Tools', href: '/tools/date-tracker', icon: Calculator },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Dynamic premium modules are loaded from feature flags

  let navigation = [...baseNavigation];
  if (user?.role === 'Admin' || user?.role === 'SuperAdmin') {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: Settings2 });
  }

  const getThemeVars = (path: string) => {
    if (path.includes('/wealth')) return { bg: '/images/earth_bg.png', color: '#10B981' }; // Emerald Green
    if (path.includes('/combat')) return { bg: '/images/combat/combat_bg.png', color: '#EF4444' }; // Red for Combat
    if (path.includes('/goals') || path.includes('/workouts')) return { bg: '/images/fire_bg.png', color: '#EF4444' }; // Red
    if (path.includes('/meditation') || path.includes('/yoga') || path.includes('/personal')) return { bg: '/images/air_bg.png', color: '#38BDF8' }; // Sky Blue
    if (path.includes('/habits') || path.includes('/tasks') || path.includes('/stoicism') || path.includes('/nofap')) return { bg: '/images/earth_bg.png', color: '#10B981' }; // Emerald Green
    if (path.includes('/chat') || path.includes('/games') || path.includes('/manifestation') || path.includes('/brain')) return { bg: '/images/water_bg.png', color: '#3B82F6' }; // Deep Blue
    if (path.includes('/mission-control') || path.includes('/ticktick')) return { bg: '/images/space_bg.png', color: '#F59E0B' }; // Amber
    return { bg: '/images/login_bg.png', color: '#8B5CF6' }; // Avatar Violet (Dashboard)
  };

  const currentTheme = getThemeVars(location.pathname);

  return (
    <div 
      className="min-h-screen bg-transparent flex relative overflow-hidden"
      style={{ '--color-brand': currentTheme.color } as React.CSSProperties}
    >
      {/* Dynamic Theme Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out z-[-2]"
        style={{ backgroundImage: `url("${currentTheme.bg}")` }}
      ></div>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none z-[-1]"></div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-float" style={{ backgroundColor: currentTheme.color }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-float-delayed" style={{ backgroundColor: currentTheme.color }} />
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
        className={`fixed inset-y-0 left-0 z-30 w-64 glass border-r border-emerald-100 flex flex-col transform lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-brand/40 neon-border-brand bg-black/20">
          <Target className="h-8 w-8 text-brand animate-ps-glow rounded-full p-1" />
          <span className="ml-2 text-xl font-bold text-text-primary tracking-tight neon-text-brand">GoalPilot</span>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 space-y-1.5 custom-scrollbar">
          <nav className="space-y-1">
            {navigation.map((item, index) => {
              const isActive = location.pathname.startsWith(item.href);
              const flag = featureFlags?.find((f: any) => f.moduleName === item.name);
              const isPremiumModule = flag ? flag.isPremium : false;
              const hasOverride = user?.moduleOverrides && user.moduleOverrides[item.name] === true;
              const isExplicitlyDenied = user?.moduleOverrides && user.moduleOverrides[item.name] === false;
              
              const isDefaultLocked = !DEFAULT_UNLOCKED_MODULES.includes(item.name) && !isPremiumModule;
              const needsUpgrade = isPremiumModule && (user?.role !== 'Premium' && user?.role !== 'Admin' && user?.role !== 'SuperAdmin') && !hasOverride;
              
              const isGloballyDisabled = flag && !flag.isEnabled;
              const isLocked = isGloballyDisabled || isExplicitlyDenied || needsUpgrade || (isDefaultLocked && !hasOverride && user?.role !== 'Admin' && user?.role !== 'SuperAdmin');
              const hasPurchasedPremium = isPremiumModule && !isLocked && !isGloballyDisabled && !isExplicitlyDenied;

              const handleModuleClick = (e: React.MouseEvent) => {
                if ((item as any).subMenus) {
                  e.preventDefault();
                  setOpenMenus(prev => ({ ...prev, [item.name]: !prev[item.name] }));
                  return;
                }

                if (isGloballyDisabled) {
                  e.preventDefault();
                  setLockedModule({ isOpen: true, name: item.name, status: 'Disabled' });
                } else if (needsUpgrade) {
                  e.preventDefault();
                  setIsSidebarOpen(false);
                  setLockedModule({ isOpen: true, name: item.name, status: 'Premium' });
                } else if (isExplicitlyDenied || (isDefaultLocked && !hasOverride && user?.role !== 'Admin' && user?.role !== 'SuperAdmin')) {
                  e.preventDefault();
                  setLockedModule({ isOpen: true, name: item.name, status: 'Disabled' });
                } else {
                  setIsSidebarOpen(false);
                }
              };

              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.name}
                >
                  <Link
                    to={isLocked ? '#' : item.href}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isGloballyDisabled || isExplicitlyDenied
                        ? 'opacity-60 cursor-not-allowed text-slate-400 bg-slate-900/30 border border-slate-700/50 hover:bg-slate-800/50'
                        : needsUpgrade
                        ? 'text-yellow-100/80 hover:bg-yellow-500/10 border border-transparent hover:border-yellow-500/30'
                        : isActive
                        ? 'bg-brand/20 text-white shadow-[0_0_15px_rgba(0,112,209,0.4)] border border-brand/50 neon-border-brand scale-[1.02]'
                        : 'text-text-secondary hover:bg-brand/10 hover:text-brand hover:scale-105'
                    }`}
                    onClick={handleModuleClick}
                  >
                    {!isLocked && <item.icon className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-emerald-400 group-hover:text-brand'}`} />}
                    {isLocked && (
                      <span className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-slate-500/70" title={
                        isGloballyDisabled ? "Globally Disabled" :
                        isExplicitlyDenied ? "Locked by Admin" :
                        needsUpgrade ? "Premium Required" :
                        "Locked by Default (Requires Admin Unlock)"
                      }>
                        {isGloballyDisabled ? <Ban className="h-5 w-5 text-red-500/50" /> :
                         isExplicitlyDenied ? <LockKeyhole className="h-5 w-5 text-red-400/70" /> :
                         <Lock className="h-5 w-5" />}
                      </span>
                    )}
                    <span className="truncate flex-1">{item.name}</span>
                    {hasPurchasedPremium && (
                      <span 
                        title="Premium Purchased" 
                        className="flex items-center ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                      >
                        <Crown className="w-3 h-3 mr-1" /> PRO
                      </span>
                    )}
                    
                    {isGloballyDisabled && !isExplicitlyDenied && (
                      <span title="Temporarily Disabled"><Ban className="w-3.5 h-3.5 text-slate-500" /></span>
                    )}
                    
                    {isExplicitlyDenied && (
                      <span title="Locked by Admin"><LockKeyhole className="w-3.5 h-3.5 text-red-500/70 group-hover:text-red-400" /></span>
                    )}
                    
                    {needsUpgrade && !(isGloballyDisabled || isExplicitlyDenied) && (
                      <span title="Premium Required"><Lock className="w-3.5 h-3.5 text-yellow-500/70 group-hover:text-yellow-400" /></span>
                    )}
                    {item.name === 'Chat' && unreadCount > 0 && !isLocked && (
                      <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                    {(item as any).subMenus && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ml-auto ${openMenus[item.name] ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Submenus Render */}
                  {(item as any).subMenus && !isLocked && (
                    <AnimatePresence>
                      {openMenus[item.name] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden bg-slate-900/30 rounded-lg mt-1 ml-4 border-l border-emerald-500/20"
                        >
                          {(item as any).subMenus.map((subItem: any) => {
                            const isSubActive = location.pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`block px-4 py-2 text-xs font-medium transition-colors ${
                                  isSubActive ? 'text-brand bg-brand/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              );
            })}

            <div className="pt-4 mt-4 border-t border-emerald-100/20">
              <span className="px-3 text-xs font-bold text-emerald-600/70 uppercase tracking-widest">Job Discovery</span>
            </div>
            
            {(() => {
              const jobFlag = featureFlags?.find((f: any) => f.moduleName === 'Job Discovery');
              const isJobPremium = jobFlag ? jobFlag.isPremium : false;
              const hasJobOverride = user?.moduleOverrides && user.moduleOverrides['Job Discovery'] === true;
              const isJobExplicitlyDenied = user?.moduleOverrides && user.moduleOverrides['Job Discovery'] === false;
              const isJobDefaultLocked = !DEFAULT_UNLOCKED_MODULES.includes('Job Discovery') && !isJobPremium;
              const jobNeedsUpgrade = isJobPremium && (user?.role !== 'Premium' && user?.role !== 'Admin' && user?.role !== 'SuperAdmin') && !hasJobOverride;
              const isJobGloballyDisabled = jobFlag && !jobFlag.isEnabled;
              const isJobLocked = isJobGloballyDisabled || isJobExplicitlyDenied || jobNeedsUpgrade || (isJobDefaultLocked && !hasJobOverride && user?.role !== 'Admin' && user?.role !== 'SuperAdmin');
              const hasJobPurchasedPremium = isJobPremium && !isJobLocked && !isJobGloballyDisabled && !isJobExplicitlyDenied;

              if (isJobLocked) {
                return (
                  <div className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg opacity-60 cursor-not-allowed text-slate-400 bg-slate-900/30 border border-slate-700/50">
                    <span className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-slate-500/70" title={
                      isJobGloballyDisabled ? "Globally Disabled" :
                      isJobExplicitlyDenied ? "Locked by Admin" :
                      jobNeedsUpgrade ? "Premium Required" :
                      "Locked by Default (Requires Admin Unlock)"
                    }>
                      {isJobGloballyDisabled ? <Ban className="h-5 w-5 text-red-500/50" /> :
                       isJobExplicitlyDenied ? <LockKeyhole className="h-5 w-5 text-red-400/70" /> :
                       <Lock className="h-5 w-5" />}
                    </span>
                    <span className="truncate flex-1">Job Discovery</span>
                    {jobNeedsUpgrade && !(isJobGloballyDisabled || isJobExplicitlyDenied) && (
                      <span title="Premium Required"><Lock className="w-3.5 h-3.5 text-yellow-500/70" /></span>
                    )}
                  </div>
                );
              }

              return (
                <>

            
            {/* Premium Upgrade Banner for Standard Users */}
            {user?.role === 'Standard' && (
              <div className="mt-4 p-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/30 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl -mr-8 -mt-8"></div>
                <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-white font-bold text-sm mb-1">Unlock Premium</h4>
                <p className="text-slate-400 text-xs mb-3">Get access to Game Lounge, Resume Builder and more.</p>
                <Link 
                  to="/upgrade" 
                  state={{ moduleName: 'VIP Premium' }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="block text-center w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Upgrade Now
                </Link>
              </div>
            )}

                  <NavLink to="/jobs" className={({ isActive }) => `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'bg-brand text-white shadow-md transform scale-[1.02]' : 'text-text-secondary hover:bg-brand-light hover:text-brand hover:scale-105'}`} onClick={() => setIsSidebarOpen(false)}>
                    <Briefcase className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors ${location.pathname === '/jobs' ? 'text-white' : 'text-emerald-400 group-hover:text-brand'}`} />
                    <span className="truncate flex-1">Job Automation</span>
                    {hasJobPurchasedPremium && (
                      <span 
                        title="Premium Purchased" 
                        className="flex items-center ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                      >
                        <Crown className="w-3 h-3 mr-1" /> PRO
                      </span>
                    )}
                  </NavLink>
            
                  {(user?.role === 'Admin' || user?.role === 'SuperAdmin') && (
                    <NavLink to="/jobs/admin" className={({ isActive }) => `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'bg-red-600 text-white shadow-md transform scale-[1.02]' : 'text-text-secondary hover:bg-brand-light hover:text-red-500 hover:scale-105'}`} onClick={() => setIsSidebarOpen(false)}>
                      <Database className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors ${location.pathname.startsWith('/jobs/admin') ? 'text-white' : 'text-red-400 group-hover:text-red-500'}`} />
                      <span className="truncate">Admin Targets</span>
                    </NavLink>
                  )}
                </>
              );
            })()}

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
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative text-emerald-600 hover:text-brand transition-colors hover:scale-110 transform"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed left-4 right-4 top-16 mt-2 sm:absolute sm:left-auto sm:-right-4 lg:right-0 sm:top-auto sm:mt-3 sm:w-80 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 shadow-2xl overflow-hidden z-50 origin-top sm:origin-top-right"
                  >
                    <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center bg-slate-800/50">
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="bg-brand/20 text-brand text-[10px] px-2 py-0.5 rounded-full border border-brand/30">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {unreadCount > 0 ? (
                        <div className="p-4 border-b border-emerald-500/10 hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => {setIsNotificationsOpen(false); /* Optional: route to chat */}}>
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center text-brand flex-shrink-0 mt-0.5">
                              <MessageCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-200">New Chat Messages</p>
                              <p className="text-xs text-slate-400 mt-1">You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''} waiting for you.</p>
                              <p className="text-[10px] text-slate-500 mt-2">Just now</p>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="p-4 border-b border-emerald-500/10 hover:bg-slate-800/30 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                            <Target className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">Welcome to GoalPilot</p>
                            <p className="text-xs text-slate-400 mt-1">Stay consistent and track your goals every day to level up!</p>
                            <p className="text-[10px] text-slate-500 mt-2">System</p>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="p-2 border-t border-emerald-500/20 bg-slate-800/50 text-center">
                      <button 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium w-full py-1"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 border-l border-emerald-200 pl-2 sm:pl-4">
              <div className="flex flex-col text-right justify-center">
                <span className="text-xs sm:text-sm font-medium text-text-primary truncate max-w-[80px] sm:max-w-[150px]">{user?.name}</span>
                <span className="text-[10px] sm:text-xs text-text-secondary truncate max-w-[80px] sm:max-w-[150px]">{user?.email}</span>
              </div>
              <div className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center text-white font-semibold shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="text-emerald-600 hover:text-red-500 transition-colors hover:scale-110 transform flex-shrink-0"
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

      <DreamDailyCheckInModal 
        isOpen={showDreamCheckInModal}
        onClose={() => setShowDreamCheckInModal(false)}
        onSuccess={() => {
          localStorage.setItem('lastDreamCheckInDate', new Date().toISOString());
        }}
      />

      <LockedModuleModal
        isOpen={lockedModule.isOpen}
        onClose={() => setLockedModule(prev => ({ ...prev, isOpen: false }))}
        moduleName={lockedModule.name}
        status={lockedModule.status}
      />

      <SupportChatWidget />
    </div>
  );
}
