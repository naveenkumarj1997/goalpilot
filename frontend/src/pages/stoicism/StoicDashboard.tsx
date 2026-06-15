import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Compass, Sun, Shield, BookMarked, Feather } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, getDailyQuote } from '../../api/stoicism';

export default function StoicDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user?.token) return;
      const [profData, quoteData] = await Promise.all([
        getProfile(user.token),
        getDailyQuote(user.token)
      ]);
      setProfile(profData);
      setQuote(quoteData);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white text-center py-10">Loading wisdom...</div>;

  const quickLinks = [
    { name: 'Learn Stoicism', icon: BookOpen, path: '/stoicism/learn', color: 'text-blue-400', desc: '10 Beginner Lessons' },
    { name: 'Life Situations', icon: Compass, path: '/stoicism/situations', color: 'text-amber-400', desc: 'Stoic advice for daily struggles' },
    { name: 'Stoic Exercises', icon: Shield, path: '/stoicism/exercises', color: 'text-emerald-400', desc: 'Practical mind training' },
    { name: 'Journal', icon: Feather, path: '/stoicism/journal', color: 'text-purple-400', desc: 'Private reflections' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-8 rounded-3xl border border-blue-900/50 relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2">
            Stoicism For Life
          </h1>
          <p className="text-blue-200/70">Master your mind, master your life.</p>
        </div>
      </div>

      {/* Daily Quote */}
      {quote && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl border border-amber-500/20 bg-[#0f172a]/80"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sun className="h-5 w-5 text-amber-400" />
            <span className="text-amber-400/80 text-sm font-semibold uppercase tracking-widest">Daily Wisdom</span>
          </div>
          <blockquote className="text-2xl font-serif text-white/90 italic leading-relaxed mb-4">
            "{quote.quote}"
          </blockquote>
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <span className="text-amber-200 font-medium">— {quote.author}</span>
            <Link to="/stoicism/wisdom" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Read Meaning <BookMarked className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Streak', value: `${profile?.currentStreak || 0} Days`, icon: Sun, color: 'text-amber-400' },
          { label: 'Lessons Completed', value: profile?.lessonsCompleted || 0, icon: BookOpen, color: 'text-blue-400' },
          { label: 'Exercises Done', value: profile?.exercisesCompleted || 0, icon: Shield, color: 'text-emerald-400' },
          { label: 'Journal Entries', value: profile?.journalEntries || 0, icon: Feather, color: 'text-purple-400' }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-5 rounded-2xl border border-white/5 bg-[#1e293b]/50"
          >
            <stat.icon className={`h-6 w-6 ${stat.color} mb-3`} />
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Navigation */}
      <h2 className="text-xl font-serif font-bold text-white mt-8 mb-4">The Path</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path}
            className="group glass p-6 rounded-2xl border border-blue-500/20 bg-[#0f172a]/60 hover:bg-[#1e293b]/80 hover:border-amber-500/30 transition-all block relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-amber-500/5 rounded-bl-full group-hover:to-amber-500/10 transition-colors" />
            <link.icon className={`h-8 w-8 ${link.color} mb-4 group-hover:scale-110 transition-transform`} />
            <h3 className="text-lg font-bold text-white mb-2">{link.name}</h3>
            <p className="text-xs text-blue-200/60 leading-relaxed">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
