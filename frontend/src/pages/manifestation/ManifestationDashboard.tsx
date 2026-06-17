import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, Image as ImageIcon, CheckCircle, Brain, BookOpen, MessageCircle, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getManifestationProfile } from '../../api/manifestation';

export default function ManifestationDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.token) return;
        const data = await getManifestationProfile(user.token);
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch manifestation profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) return <div className="text-white text-center py-20">Loading Manifestation Lab...</div>;

  const modules = [
    { name: 'Dream Life Builder', icon: Sparkles, link: '/manifestation/dream-life', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'hover:bg-amber-500/10' },
    { name: 'Vision Board', icon: ImageIcon, link: '/manifestation/vision-board', color: 'text-pink-400', border: 'border-pink-500/30', bg: 'hover:bg-pink-500/10' },
    { name: 'Goal Manifestor', icon: Target, link: '/manifestation/goals', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'hover:bg-emerald-500/10' },
    { name: 'Daily Visualization', icon: Brain, link: '/manifestation/visualization', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'hover:bg-purple-500/10' },
    { name: 'Success Journal', icon: BookOpen, link: '/manifestation/journal', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'hover:bg-blue-500/10' },
    { name: 'Affirmations', icon: CheckCircle, link: '/manifestation/affirmations', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'hover:bg-rose-500/10' },
    { name: 'Success Habits', icon: BarChart2, link: '/manifestation/habits', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'hover:bg-orange-500/10' },
    { name: 'AI Success Coach', icon: MessageCircle, link: '/manifestation/coach', color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'hover:bg-indigo-500/10' }
  ];

  const score = profile?.manifestationScore || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="glass rounded-3xl p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-20 -mb-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-amber-400" />
              Manifestation & Success Lab
            </h1>
            <p className="text-slate-300 text-lg max-w-xl">
              Your personal command center for turning dreams into reality through clarity, visualization, and consistent action.
            </p>
          </div>
          
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center min-w-[200px]">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Manifestation Score</span>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" stroke="currentColor" 
                  className="text-amber-400" 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Success Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod, idx) => (
            <Link 
              to={mod.link} 
              key={idx}
            >
              <motion.div
                whileHover={{ y: -5 }}
                className={`glass rounded-2xl p-6 border ${mod.border} ${mod.bg} transition-all duration-300 h-full flex flex-col`}
              >
                <div className="flex-1">
                  <mod.icon className={`w-10 h-10 mb-4 ${mod.color}`} />
                  <h3 className="text-xl font-bold text-white mb-2">{mod.name}</h3>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <span className="text-white text-sm">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links for Tracker & Stories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/manifestation/opportunities" className="glass p-6 rounded-2xl border border-indigo-500/30 hover:bg-indigo-500/10 transition-colors flex items-center justify-between">
          <span className="font-bold text-white">Opportunity Tracker</span>
          <span className="text-indigo-400">→</span>
        </Link>
        <Link to="/manifestation/stories" className="glass p-6 rounded-2xl border border-rose-500/30 hover:bg-rose-500/10 transition-colors flex items-center justify-between">
          <span className="font-bold text-white">Success Stories</span>
          <span className="text-rose-400">→</span>
        </Link>
        <Link to="/manifestation/progress" className="glass p-6 rounded-2xl border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors flex items-center justify-between">
          <span className="font-bold text-white">Full Progress Report</span>
          <span className="text-emerald-400">→</span>
        </Link>
      </div>
    </div>
  );
}