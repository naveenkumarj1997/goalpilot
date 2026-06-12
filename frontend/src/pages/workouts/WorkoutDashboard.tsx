import { useState, useEffect } from 'react';
import { workoutApi } from '../../api/workoutApi';
import { useNavigate } from 'react-router-dom';
import { Activity, Flame, Clock, Trophy, Target, TrendingUp, Zap, ChevronRight } from 'lucide-react';

export default function WorkoutDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workoutApi.getStats()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-white">Loading Dashboard...</div>;

  const xpProgress = stats ? (stats.xp % 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Level Info */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full mix-blend-screen blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand to-purple-600 p-1 shadow-[0_0_30px_rgba(0,112,209,0.5)]">
              <div className="w-full h-full bg-slate-900 rounded-full flex flex-col items-center justify-center text-white">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Level</span>
                <span className="text-3xl font-black neon-text-brand leading-none">{stats?.level || 1}</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Home Coach</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-brand font-bold">{stats?.xp || 0} XP</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Next Level: {100 - xpProgress} XP</span>
              </div>
              {/* Progress Bar */}
              <div className="w-64 h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-brand" style={{ width: `${xpProgress}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => navigate('/workouts/plan')} className="px-6 py-3 bg-brand/20 hover:bg-brand/30 text-brand rounded-xl font-bold flex items-center transition-colors border border-brand/30">
              <Zap className="w-5 h-5 mr-2" /> My Plan
            </button>
            <button onClick={() => navigate('/workouts/profile')} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center transition-colors border border-white/5">
              <Target className="w-5 h-5 mr-2" /> Profile
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: 'Workouts', value: stats?.totalWorkouts || 0, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { icon: Flame, label: 'Calories Burned', value: stats?.totalCalories || 0, color: 'text-orange-400', bg: 'bg-orange-400/10' },
          { icon: Clock, label: 'Active Minutes', value: stats?.totalTime || 0, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { icon: Trophy, label: 'Day Streak', value: stats?.streak || 0, color: 'text-yellow-400', bg: 'bg-yellow-400/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col justify-between">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <span className="text-3xl font-black text-white block">{stat.value}</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div 
          onClick={() => navigate('/workouts/library')}
          className="group bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-slate-800 transition-all cursor-pointer overflow-hidden relative"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">Exercise Library</h2>
              <p className="text-slate-400 font-medium">Browse 100+ home exercises</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-brand transition-colors">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/workouts/tracker')}
          className="group bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-slate-800 transition-all cursor-pointer overflow-hidden relative"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">Body Tracker</h2>
              <p className="text-slate-400 font-medium">Track your weight and measurements</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
