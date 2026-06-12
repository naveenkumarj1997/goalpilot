import { useState, useEffect } from 'react';
import { workoutApi } from '../../api/workoutApi';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Calendar, Zap, AlertCircle, Play, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkoutPlanView() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = () => {
    setLoading(true);
    workoutApi.getPlan()
      .then(res => setPlan(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await workoutApi.generatePlan();
      setPlan(res.data);
    } catch (error: any) {
      if (error.response?.data?.message === 'Please complete your fitness profile first.') {
        navigate('/workouts/profile');
      } else {
        alert('Failed to generate plan. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="text-white p-8 text-center animate-pulse">Loading Plan...</div>;

  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-brand/20 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none" />
          
          <Dumbbell className="w-24 h-24 mx-auto text-brand mb-6 animate-bounce" />
          <h1 className="text-4xl font-black text-white mb-4">No Active Plan Found</h1>
          <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto">
            Ready to transform your body? Let our AI analyze your fitness profile and build the ultimate personalized home workout plan for you.
          </p>
          
          <button 
            onClick={generatePlan}
            disabled={generating}
            className="px-8 py-4 bg-brand hover:bg-brand-hover text-white rounded-full font-black text-lg transition-all shadow-[0_0_30px_rgba(0,112,209,0.5)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center mx-auto"
          >
            {generating ? (
              <><Zap className="w-6 h-6 mr-3 animate-pulse text-yellow-400" /> Generating Plan (This takes ~15s)...</>
            ) : (
              <><Zap className="w-6 h-6 mr-3 text-yellow-400" /> Generate My AI Plan</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-brand/10 transform skew-x-12 translate-x-10 blur-xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-2 neon-text-brand">{plan.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-bold mt-4">
            <span className="px-3 py-1 bg-brand/20 text-brand rounded-full flex items-center"><Zap className="w-4 h-4 mr-1" /> {plan.difficulty}</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full flex items-center"><Calendar className="w-4 h-4 mr-1" /> {plan.durationWeeks} Weeks</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center"><Target className="w-4 h-4 mr-1" /> {plan.goal}</span>
          </div>
        </div>
        <button 
          onClick={generatePlan}
          className="mt-6 md:mt-0 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center transition-colors border border-white/5 relative z-10"
        >
          <Zap className="w-5 h-5 mr-2 text-yellow-400" /> Regenerate Plan
        </button>
      </div>

      <div className="space-y-12">
        {plan.weeks.map((week: any) => (
          <div key={week.weekNumber}>
            <h2 className="text-2xl font-black text-white mb-6 border-b border-white/10 pb-2">Week {week.weekNumber}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {week.days.map((day: any) => (
                <motion.div 
                  key={day.dayNumber}
                  whileHover={{ y: -5 }}
                  className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-lg flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Day {day.dayNumber}</span>
                      <h3 className="text-xl font-bold text-white mt-1">{day.focus}</h3>
                    </div>
                  </div>

                  {day.focus.toLowerCase() === 'rest' ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                      <AlertCircle className="w-12 h-12 text-slate-600 mb-3" />
                      <p className="text-slate-400 font-medium">Recovery Day</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 space-y-3 mb-6">
                        {day.exercises.map((ex: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-slate-300 font-medium">{ex.exercise?.name || 'Exercise'}</span>
                            <span className="text-brand font-bold bg-brand/10 px-2 py-1 rounded">{ex.sets}x{ex.reps}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => navigate('/workouts/session', { state: { day, planId: plan._id } })}
                        className="w-full py-3 bg-brand/20 hover:bg-brand/30 text-brand rounded-xl font-bold flex items-center justify-center transition-colors border border-brand/30"
                      >
                        <Play className="w-5 h-5 mr-2" /> Start Workout
                      </button>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
