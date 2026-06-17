import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Flame, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getManifestationProfile, getManifestationGoals, getManifestationActivities } from '../../api/manifestation';

export default function ManifestationProgress() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;
        const [pData, gData, aData] = await Promise.all([
          getManifestationProfile(user.token),
          getManifestationGoals(user.token),
          getManifestationActivities(user.token)
        ]);
        setProfile(pData);
        setGoals(gData);
        setActivities(aData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="text-white text-center py-20">Loading Analytics...</div>;

  const score = profile?.manifestationScore || 0;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const activeGoals = goals.filter(g => g.status === 'Active').length;
  const totalHabits = activities.filter(a => a.type === 'Habit').length;
  const totalVisualizations = activities.filter(a => a.type === 'Visualization').length;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg shadow-emerald-500/20 transform rotate-3">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">Full Progress Report</h1>
            <p className="text-slate-400">Track your trajectory towards your dream life.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Score Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="w-24 h-24 text-amber-500" /></div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Overall Score</h3>
          <p className="text-5xl font-black text-amber-400 mb-2">{score}</p>
          <p className="text-xs text-slate-500">Based on consistency & clarity</p>
        </motion.div>

        {/* Goals Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Target className="w-24 h-24 text-emerald-500" /></div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Goals Achieved</h3>
          <p className="text-5xl font-black text-emerald-400 mb-2">{completedGoals} <span className="text-2xl text-slate-500">/ {goals.length}</span></p>
          <p className="text-xs text-slate-500">{activeGoals} currently active</p>
        </motion.div>

        {/* Habits Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-3xl border border-orange-500/30 bg-orange-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Flame className="w-24 h-24 text-orange-500" /></div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Habit Actions</h3>
          <p className="text-5xl font-black text-orange-400 mb-2">{totalHabits}</p>
          <p className="text-xs text-slate-500">Total check-ins logged</p>
        </motion.div>

        {/* Visualizations Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-3xl border border-purple-500/30 bg-purple-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-24 h-24 text-purple-500" /></div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Visualizations</h3>
          <p className="text-5xl font-black text-purple-400 mb-2">{totalVisualizations}</p>
          <p className="text-xs text-slate-500">Mental rehearsal sessions</p>
        </motion.div>
      </div>

      {/* Trajectory */}
      <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <h2 className="text-2xl font-black text-white mb-6">Your Growth Trajectory</h2>
        <div className="h-64 flex items-end justify-between gap-2 px-4 relative z-10">
          {/* Mock Chart - since we don't have a charting library, we build a CSS bar chart */}
          {[10, 25, 30, 45, 60, 50, 75, 80, 85, score].map((val, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 rounded-t-lg relative group"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs px-2 py-1 rounded transition-opacity">
                {val}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between text-slate-500 text-xs mt-4 px-4 font-bold">
          <span>Past</span>
          <span>Present</span>
        </div>
      </div>
    </div>
  );
}