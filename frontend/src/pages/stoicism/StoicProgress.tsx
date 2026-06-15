import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, BookOpen, Shield, Crown, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../api/stoicism';

export default function StoicProgress() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user?.token) return;
      const data = await getProfile(user.token);
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white text-center py-10">Loading progress...</div>;

  const stats = [
    { label: 'Current Streak', value: `${profile?.currentStreak || 0} Days`, icon: Flame, color: 'text-orange-400' },
    { label: 'Longest Streak', value: `${profile?.longestStreak || 0} Days`, icon: Target, color: 'text-amber-400' },
    { label: 'Lessons Completed', value: profile?.lessonsCompleted || 0, icon: BookOpen, color: 'text-blue-400' },
    { label: 'Exercises Done', value: profile?.exercisesCompleted || 0, icon: Shield, color: 'text-emerald-400' },
  ];

  const badges = [
    {
      id: 'first-step',
      title: 'The First Step',
      desc: 'Complete your first lesson',
      icon: Star,
      unlocked: (profile?.lessonsCompleted || 0) >= 1,
      color: 'from-amber-400 to-yellow-600'
    },
    {
      id: 'scholar',
      title: 'Stoic Scholar',
      desc: 'Complete all 10 lessons',
      icon: BookOpen,
      unlocked: (profile?.lessonsCompleted || 0) >= 10,
      color: 'from-blue-400 to-indigo-600'
    },
    {
      id: 'streak-7',
      title: '7 Day Learner',
      desc: 'Maintain a 7 day streak',
      icon: Flame,
      unlocked: (profile?.longestStreak || 0) >= 7,
      color: 'from-orange-400 to-red-600'
    },
    {
      id: 'streak-30',
      title: '30 Day Stoic',
      desc: 'Maintain a 30 day streak',
      icon: Shield,
      unlocked: (profile?.longestStreak || 0) >= 30,
      color: 'from-emerald-400 to-green-600'
    },
    {
      id: 'journal',
      title: 'The Meditator',
      desc: 'Write 10 journal entries',
      icon: Crown,
      unlocked: (profile?.journalEntries || 0) >= 10,
      color: 'from-purple-400 to-purple-700'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-white mb-4">
          Your Journey
        </h1>
        <p className="text-blue-200/70 max-w-2xl mx-auto text-lg">
          Track your discipline and consistency on the path to a resilient mind.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5 bg-[#1e293b]/50"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`p-3 rounded-2xl bg-black/30 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1 font-serif">{stat.value}</div>
            <div className="text-xs text-white/50 uppercase tracking-wider font-bold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <div className="glass rounded-3xl border border-white/5 p-8 bg-[#0f172a]/80 mt-8">
        <h2 className="text-2xl font-serif font-bold text-white mb-8">Honors of Discipline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div 
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className={`flex items-center p-6 rounded-2xl border transition-all ${
                  badge.unlocked 
                    ? 'bg-[#1e293b] border-amber-500/20' 
                    : 'bg-black/20 border-white/5 opacity-50 grayscale'
                }`}
              >
                <div className={`h-16 w-16 rounded-2xl shrink-0 mr-4 flex items-center justify-center bg-gradient-to-br ${badge.unlocked ? badge.color : 'from-gray-700 to-gray-900'} shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif mb-1">{badge.title}</h3>
                  <p className="text-sm text-blue-200/60 leading-tight">{badge.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
