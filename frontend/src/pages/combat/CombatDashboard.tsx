import AvatarLoader from '../../components/ui/AvatarLoader';
import React, { useEffect, useState } from 'react';
import { Shield, PlayCircle, Trophy, Clock, Target, Flame } from 'lucide-react';
import { getProfile, getRoadmap } from '../../api/combat';
import type { CombatProfileData } from '../../api/combat';
import { Link } from 'react-router-dom';

const CombatDashboard = () => {
  const [profile, setProfile] = useState<CombatProfileData | null>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, r] = await Promise.all([getProfile(), getRoadmap()]);
        setProfile(p);
        setRoadmap(r);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AvatarLoader />
    );
  }

  if (!profile || !profile.gender) {
    return (
      <div className="text-center py-20 animate-slide-up-fade">
        <Shield className="w-20 h-20 text-emerald-500/50 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Welcome to Combat Academy</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Choose your path, generate a personalized training roadmap, and start your journey.
        </p>
        <Link 
          to="/combat/onboarding"
          className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,112,209,0.4)]"
        >
          Build Your Roadmap
        </Link>
      </div>
    );
  }

  const getTodayTask = () => {
    if (!roadmap || !roadmap.weeks) return null;
    // Basic logic to find the first uncompleted task
    for (const week of roadmap.weeks) {
      if (!week.completed) {
        for (const task of week.tasks) {
          if (!task.completed) return task;
        }
      }
    }
    return null;
  };

  const nextTask = getTodayTask();

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-slide-up-fade space-y-8">
      
      {/* Header Overview */}
      <div className="glass p-8 rounded-3xl border border-red-500/30 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        
        {/* Background character */}
        <div className="absolute right-[20%] top-[-10%] opacity-20 pointer-events-none w-64 mix-blend-screen hidden md:block">
           <img src="/images/combat/boxer_hero.png" alt="Fighter BG" className="w-full h-auto object-contain" />
        </div>

        <div className="z-10">
          <h1 className="text-4xl font-black text-white mb-2 italic uppercase tracking-tight">Welcome Back, Fighter</h1>
          <p className="text-slate-300 font-bold text-lg">{roadmap?.title || "Your Combat Journey"}</p>
        </div>
        
        {nextTask && (
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-brand/40 flex items-center gap-4">
            <div className="p-3 bg-brand/20 rounded-xl text-brand">
              {nextTask.type === 'Lesson' ? <PlayCircle className="w-8 h-8" /> : <Target className="w-8 h-8" />}
            </div>
            <div>
              <p className="text-xs text-brand font-bold uppercase tracking-wider mb-1">Up Next</p>
              <h3 className="text-white font-bold">{nextTask.title}</h3>
              <p className="text-xs text-slate-400">{nextTask.duration} min • {nextTask.type}</p>
            </div>
            <Link 
              to={nextTask.type === 'Lesson' ? '/combat/boxing' : '/combat/shadow-boxing'} 
              className="ml-4 px-4 py-2 bg-brand text-white font-bold rounded-xl text-sm"
            >
              Start
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl border border-emerald-500/20 text-center">
            <Flame className="w-10 h-10 text-orange-500 mx-auto mb-2 animate-pulse" />
            <div className="text-3xl font-bold text-white mb-1">{profile.currentStreak || 0}</div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Day Streak</div>
          </div>
          
          <div className="glass p-6 rounded-2xl border border-emerald-500/20 text-center">
            <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white mb-1">{profile.workoutsCompleted || 0}</div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Workouts Done</div>
          </div>

          <div className="glass p-6 rounded-2xl border border-emerald-500/20 text-center">
            <Clock className="w-10 h-10 text-brand mx-auto mb-2" />
            <div className="text-3xl font-bold text-white mb-1">{(profile.trainingHours || 0).toFixed(1)}</div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Hours Trained</div>
          </div>
        </div>

        {/* Roadmap Column */}
        <div className="md:col-span-3">
          <div className="glass p-6 rounded-2xl border border-emerald-500/20 h-full">
            <h2 className="text-xl font-bold text-white mb-6">Your Roadmap</h2>
            {roadmap?.weeks?.map((week: any, idx: number) => (
              <div key={idx} className="mb-6 last:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-brand text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                    {week.weekNumber}
                  </div>
                  <h3 className="text-lg font-bold text-slate-200">{week.focus}</h3>
                </div>
                
                <div className="space-y-3 pl-11">
                  {week.tasks.map((task: any, tIdx: number) => (
                    <div 
                      key={tIdx} 
                      className={`p-4 rounded-xl border flex justify-between items-center transition-colors ${
                        task.completed 
                        ? 'bg-emerald-900/20 border-emerald-500/30' 
                        : 'bg-slate-900/50 border-emerald-500/10 hover:border-brand/40 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          task.completed ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-600'
                        }`}>
                          {task.completed && <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />}
                        </div>
                        <div>
                          <p className={`font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-500">{task.duration} mins • {task.type}</p>
                        </div>
                      </div>
                      
                      {!task.completed && (
                        <Link 
                          to={task.type === 'Lesson' ? '/combat/boxing' : '/combat/shadow-boxing'} 
                          className="text-xs font-bold text-brand hover:text-white transition-colors bg-brand/10 px-3 py-1.5 rounded-lg"
                        >
                          Start
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {!roadmap && (
               <div className="text-slate-400 text-center py-10">No roadmap found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatDashboard;
