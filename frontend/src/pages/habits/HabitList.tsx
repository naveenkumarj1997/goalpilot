import { useState, useEffect } from 'react';
import habitService from '../../services/habitService';
import type { Habit } from '../../types/habit';
import { Plus, Trash2, Activity, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHabitName, setNewHabitName] = useState('');
  const [color, setColor] = useState('#10b981');
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    try {
      const newHabit = await habitService.createHabit({ name: newHabitName, color });
      setHabits([newHabit, ...habits]);
      setNewHabitName('');
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
    // Optimistic update
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

  // Generate last 7 days (including today)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const getActiveStreak = (habit: Habit) => {
    let streak = 0;
    const sortedLogs = [...habit.logs].map(l => {
      const d = new Date(l);
      d.setHours(0,0,0,0);
      return d.getTime();
    }).sort((a, b) => b - a); // Descending

    if (sortedLogs.length === 0) return 0;

    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let currentDate = sortedLogs[0] === today.getTime() ? today : yesterday;
    
    // If the latest log is older than yesterday, streak is 0
    if (sortedLogs[0] < yesterday.getTime()) return 0;

    for (let i = 0; i < sortedLogs.length; i++) {
      if (sortedLogs[i] === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center">
            <Activity className="w-8 h-8 mr-3 text-brand" />
            Habit Tracker
          </h1>
          <p className="text-text-secondary mt-1">Build consistency. Transform your life.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary flex items-center px-4 py-2 rounded-xl"
        >
          {isCreating ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {isCreating ? 'Cancel' : 'New Habit'}
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreate} className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 mb-6 flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-text-secondary mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Read 10 pages"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Color</label>
                <div className="flex gap-2 p-1">
                  {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary px-6 py-2.5 rounded-xl font-medium">Save</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading habits...</div>
        ) : habits.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-brand" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-1">No Habits Yet</h3>
            <p className="text-text-secondary max-w-md mx-auto">Create your first habit to start tracking your daily progress and building your streaks.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/50 border-b border-emerald-100">
                  <th className="py-4 px-6 font-semibold text-text-primary">Habit</th>
                  {last7Days.map((date, i) => (
                    <th key={i} className="py-4 px-2 text-center text-xs font-medium text-text-secondary">
                      <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="mt-1 font-semibold text-text-primary">{date.getDate()}</div>
                    </th>
                  ))}
                  <th className="py-4 px-6 text-center font-semibold text-text-primary">Streak</th>
                  <th className="py-4 px-4 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {habits.map(habit => {
                  const streak = getActiveStreak(habit);
                  return (
                    <tr key={habit._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: habit.color || '#10b981' }} />
                        <span className="font-medium text-text-primary">{habit.name}</span>
                      </td>
                      
                      {last7Days.map((date, i) => {
                        const isLogged = habit.logs.some(l => {
                          const logDate = new Date(l);
                          logDate.setHours(0,0,0,0);
                          return logDate.getTime() === date.getTime();
                        });

                        return (
                          <td key={i} className="py-4 px-2 text-center">
                            <button
                              onClick={() => handleToggleLog(habit._id, date)}
                              className="group relative inline-flex items-center justify-center w-8 h-8 rounded-full transition-all focus:outline-none"
                            >
                              <div 
                                className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                                  isLogged 
                                    ? 'scale-100 opacity-100' 
                                    : 'scale-90 opacity-40 hover:scale-100 hover:opacity-100 border-gray-300'
                                }`}
                                style={{
                                  borderColor: isLogged ? habit.color || '#10b981' : undefined,
                                  backgroundColor: isLogged ? habit.color || '#10b981' : 'transparent'
                                }}
                              />
                              {isLogged && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <Check className="w-4 h-4 text-white relative z-10" />
                                </motion.div>
                              )}
                            </button>
                          </td>
                        );
                      })}
                      
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                          🔥 {streak}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => handleDelete(habit._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
