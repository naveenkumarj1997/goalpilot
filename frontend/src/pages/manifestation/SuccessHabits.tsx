import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, CheckCircle, Flame, Target, BookOpen, Dumbbell, MonitorPlay } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getManifestationActivities, addManifestationActivity } from '../../api/manifestation';

const HABIT_PRESETS = [
  { name: 'Reading (10 Pages)', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  { name: 'Workout', icon: Dumbbell, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { name: 'Learn a Skill', icon: MonitorPlay, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  { name: 'Deep Work (2 Hours)', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
];

export default function SuccessHabits() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      if (!user?.token) return;
      const data = await getManifestationActivities(user.token);
      setActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  const handleCheckIn = async (habitName: string) => {
    try {
      if (user?.token) {
        await addManifestationActivity({ type: 'Habit', category: habitName }, user.token);
        fetchActivities();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hasCheckedInToday = (habitName: string) => {
    const today = new Date().toDateString();
    return activities.some(a => a.type === 'Habit' && a.category === habitName && new Date(a.date).toDateString() === today);
  };

  if (loading) return <div className="text-white text-center py-20">Loading Habits...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <BarChart2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Success Habits</h1>
          <p className="text-slate-400">Your future is hidden in your daily routine.</p>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-orange-500/30 flex items-center gap-4">
          <Flame className="w-10 h-10 text-orange-500" />
          <div>
            <p className="text-2xl font-black text-white">{activities.filter(a => a.type==='Habit').length}</p>
            <p className="text-xs text-orange-400 uppercase font-bold tracking-wider">Total Habits Logged</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {HABIT_PRESETS.map((habit, idx) => {
          const checkedIn = hasCheckedInToday(habit.name);
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass p-6 rounded-3xl border ${habit.bg} flex items-center justify-between transition-all duration-300 ${checkedIn ? 'opacity-70 scale-[0.98]' : 'hover:-translate-y-1'}`}
            >
              <div className="flex items-center">
                <div className={`p-4 rounded-2xl bg-slate-900/50 mr-4 ${habit.color}`}>
                  <habit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{habit.name}</h3>
                  <p className="text-slate-400 text-sm">Consistency builds empires.</p>
                </div>
              </div>
              <button
                disabled={checkedIn}
                onClick={() => handleCheckIn(habit.name)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  checkedIn ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <CheckCircle className={`w-8 h-8 ${checkedIn ? '' : 'opacity-50'}`} />
              </button>
            </motion.div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
      <div className="glass rounded-3xl p-6 border border-white/5">
        {activities.filter(a => a.type === 'Habit').slice(0, 10).map((activity, idx) => (
          <div key={activity._id} className={`flex items-center justify-between p-4 ${idx !== 0 ? 'border-t border-white/5' : ''}`}>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
              <span className="font-bold text-white">{activity.category}</span>
            </div>
            <span className="text-slate-500 text-sm">{new Date(activity.date).toLocaleDateString()}</span>
          </div>
        ))}
        {activities.filter(a => a.type === 'Habit').length === 0 && (
          <p className="text-slate-500 text-center py-4">No habits logged yet.</p>
        )}
      </div>
    </div>
  );
}