import { useState, useEffect } from 'react';
import habitService from '../../services/habitService';
import type { Habit, HabitFormData } from '../../types/habit';
import { Plus, Trash2, Activity, Check, Flame, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateHabitModal from './CreateHabitModal';

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const data = await habitService.getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Failed to fetch habits', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: HabitFormData) => {
    try {
      const newHabit = await habitService.createHabit(data);
      setHabits([newHabit, ...habits]);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create habit', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await habitService.deleteHabit(id);
      setHabits(habits.filter(h => h._id !== id));
    } catch (error) {
      console.error('Failed to delete habit', error);
    }
  };

  const handleToggleLog = async (id: string, date: Date) => {
    const targetTime = new Date(date);
    targetTime.setHours(0, 0, 0, 0);

    setHabits(habits.map(h => {
      if (h._id !== id) return h;
      const logs = [...h.logs];
      const index = logs.findIndex(logStr => {
        const d = new Date(logStr);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === targetTime.getTime();
      });

      if (index >= 0) {
        logs.splice(index, 1);
      } else {
        logs.push(date.toISOString());
      }
      return { ...h, logs };
    }));

    try {
      const updated = await habitService.toggleLogHabit(id, date.toISOString());
      setHabits(prev => prev.map(h => h._id === id ? updated : h));
    } catch (error) {
      console.error('Failed to log habit', error);
      fetchHabits(); // Revert
    }
  };

  const getDayDate = (startDateStr: string | undefined, dayIndex: number) => {
    const d = startDateStr ? new Date(startDateStr) : new Date();
    d.setDate(d.getDate() + dayIndex);
    d.setHours(0,0,0,0);
    return d;
  };

  const getStreaks = (habit: Habit) => {
    const sortedLogs = [...habit.logs].map(l => {
      const d = new Date(l);
      d.setHours(0,0,0,0);
      return d.getTime();
    }).sort((a, b) => b - a); // Descending

    if (sortedLogs.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Calculate longest streak
    for (let i = 0; i < sortedLogs.length - 1; i++) {
      const diffDays = (sortedLogs[i] - sortedLogs[i+1]) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    // Calculate current streak
    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (sortedLogs[0] < yesterday.getTime()) {
      currentStreak = 0;
    } else {
      let currentDate = sortedLogs[0] === today.getTime() ? today : yesterday;
      currentStreak = 0;
      for (let i = 0; i < sortedLogs.length; i++) {
        if (sortedLogs[i] === currentDate.getTime()) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return { current: currentStreak, longest: Math.max(longestStreak, currentStreak) };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Activity className="w-8 h-8 mr-3 text-blue-500" />
            Habit Challenges
          </h1>
          <p className="text-slate-400 mt-1">Build consistency. Transform your life.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Challenge
        </button>
      </div>

      <CreateHabitModal 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreate}
      />

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading habits...</div>
      ) : habits.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No Challenges Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">Start a 21-day or 30-day challenge to build consistency and achieve your goals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map(habit => {
            const { current, longest } = getStreaks(habit);
            const duration = habit.duration || 30; // fallback to 30

            return (
              <motion.div 
                key={habit._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: habit.color || '#10b981' }} />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shadow-inner border border-slate-700">
                      {habit.badge || '⭐'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{habit.name}</h3>
                      <p className="text-sm text-slate-400">{duration}-Day Challenge</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(habit._id)}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-6 mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Current</div>
                      <div className="text-lg font-bold text-white">{current} Days</div>
                    </div>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Longest</div>
                      <div className="text-lg font-bold text-white">{longest} Days</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
                  {Array.from({ length: duration }).map((_, i) => {
                    const date = getDayDate(habit.startDate, i);
                    const isLogged = habit.logs.some(l => {
                      const logDate = new Date(l);
                      logDate.setHours(0,0,0,0);
                      return logDate.getTime() === date.getTime();
                    });
                    
                    // Highlight if date is today
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const isToday = date.getTime() === today.getTime();
                    
                    // Check if date is in future
                    const isFuture = date.getTime() > today.getTime();

                    return (
                      <button
                        key={i}
                        disabled={isFuture}
                        onClick={() => handleToggleLog(habit._id, date)}
                        className={`
                          relative aspect-square rounded-lg flex items-center justify-center transition-all text-xs font-bold
                          ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
                          ${isLogged ? 'text-white' : 'text-slate-500'}
                          ${!isLogged && isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''}
                        `}
                        style={{
                          backgroundColor: isLogged ? (habit.color || '#10b981') : '#1e293b',
                        }}
                        title={date.toDateString()}
                      >
                        {isLogged ? <Check className="w-3 h-3" /> : i + 1}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
