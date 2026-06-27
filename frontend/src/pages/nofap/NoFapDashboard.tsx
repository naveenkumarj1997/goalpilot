import AvatarLoader from '../../components/ui/AvatarLoader';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Target, Calendar, BarChart2, BookOpen, Clock, Zap, Target as TargetIcon } from 'lucide-react';
import MilestoneBadges from '../../components/nofap/MilestoneBadges';
import MotivationCenter from '../../components/nofap/MotivationCenter';
import NoFapCheckInModal from '../../components/nofap/NoFapCheckInModal';
import { getProfile } from '../../api/nofap';

export default function NoFapDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const fetchProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (token) {
        const data = await getProfile(token);
        setProfile(data);

        const lastCheckIn = data.lastCheckInDate ? new Date(data.lastCheckInDate) : null;
        const today = new Date();
        const isCheckedIn = lastCheckIn && (
          lastCheckIn.getDate() === today.getDate() &&
          lastCheckIn.getMonth() === today.getMonth() &&
          lastCheckIn.getFullYear() === today.getFullYear()
        );
        setHasCheckedInToday(!!isCheckedIn);
      }
    } catch (error) {
      console.error('Failed to fetch NoFap profile', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleCheckedIn = () => {
      fetchProfile();
    };

    window.addEventListener('nofapCheckedIn', handleCheckedIn);
    return () => window.removeEventListener('nofapCheckedIn', handleCheckedIn);
  }, []);

  if (loading) {
    return <AvatarLoader />;
  }

  const currentStreak = profile?.currentStreak || 0;
  const longestStreak = profile?.longestStreak || 0;
  const targetGoal = profile?.targetGoal || 7;
  const progressPercent = Math.min((currentStreak / targetGoal) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Discipline Tracker</h1>
          <p className="text-text-secondary mt-1">Conquer yourself, conquer the world.</p>
        </div>
        <button 
          onClick={() => setIsCheckInModalOpen(true)}
          disabled={hasCheckedInToday}
          className={`flex items-center px-4 py-2 rounded-lg transition-all ${
            hasCheckedInToday 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-not-allowed'
              : 'btn-primary bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/25'
          }`}
        >
          <Shield className="h-5 w-5 mr-2" />
          {hasCheckedInToday ? 'Checked In Today' : 'Check In Now'}
        </button>
      </div>

      {/* Motivational Quote at the top */}
      <div className="w-full">
        <MotivationCenter />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/nofap" className="glass p-4 rounded-xl border border-brand/50 bg-brand/10 hover:bg-brand/20 transition-colors flex items-center justify-center text-brand font-semibold shadow-[0_0_15px_rgba(0,112,209,0.2)]">
          <Shield className="h-5 w-5 mr-2" /> Dashboard
        </Link>
        <Link to="/nofap/calendar" className="glass p-4 rounded-xl border border-emerald-100/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-colors flex items-center justify-center text-text-primary">
          <Calendar className="h-5 w-5 mr-2 text-emerald-500" /> Calendar
        </Link>
        <Link to="/nofap/analytics" className="glass p-4 rounded-xl border border-emerald-100/20 hover:border-purple-400/50 hover:bg-purple-400/10 transition-colors flex items-center justify-center text-text-primary">
          <BarChart2 className="h-5 w-5 mr-2 text-purple-500" /> Analytics
        </Link>
        <Link to="/nofap/journal" className="glass p-4 rounded-xl border border-emerald-100/20 hover:border-amber-400/50 hover:bg-amber-400/10 transition-colors flex items-center justify-center text-text-primary">
          <BookOpen className="h-5 w-5 mr-2 text-amber-500" /> Journal
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl border border-brand/30 bg-gradient-to-br from-gray-900 to-gray-800 shadow-[0_0_30px_rgba(0,112,209,0.15)] relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 opacity-10">
            <Zap size={120} className="text-brand" />
          </div>
          <h3 className="text-gray-400 font-medium mb-2 flex items-center z-10 relative">
            <Zap className="h-5 w-5 mr-2 text-brand" /> Current Streak
          </h3>
          <div className="flex items-end space-x-2 z-10 relative">
            <span className="text-6xl font-bold text-white neon-text-brand">{currentStreak}</span>
            <span className="text-xl text-gray-400 mb-1">days</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-gray-900 to-gray-800 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 opacity-10">
            <Target className="text-emerald-500" size={120} />
          </div>
          <h3 className="text-gray-400 font-medium mb-2 flex items-center z-10 relative">
            <TargetIcon className="h-5 w-5 mr-2 text-emerald-500" /> Target Goal
          </h3>
          <div className="flex items-end space-x-2 z-10 relative">
            <span className="text-5xl font-bold text-white text-shadow-emerald">{targetGoal}</span>
            <span className="text-xl text-gray-400 mb-1">days</span>
          </div>
          <div className="mt-4 z-10 relative">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-right mt-1 text-emerald-400 font-medium">{Math.round(progressPercent)}% completed</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900 to-gray-800 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden"
        >
           <div className="absolute -right-6 -top-6 opacity-10">
            <Clock size={120} className="text-purple-500" />
          </div>
          <h3 className="text-gray-400 font-medium mb-2 flex items-center z-10 relative">
            <Clock className="h-5 w-5 mr-2 text-purple-500" /> Longest Streak
          </h3>
          <div className="flex items-end space-x-2 z-10 relative">
            <span className="text-5xl font-bold text-white">{longestStreak}</span>
            <span className="text-xl text-gray-400 mb-1">days</span>
          </div>
        </motion.div>
      </div>

      <MilestoneBadges currentStreak={currentStreak} />

      <NoFapCheckInModal 
        isOpen={isCheckInModalOpen} 
        onClose={() => setIsCheckInModalOpen(false)} 
        onSuccess={() => {
          setIsCheckInModalOpen(false);
          window.dispatchEvent(new Event('nofapCheckedIn'));
        }} 
      />
    </div>
  );
}
