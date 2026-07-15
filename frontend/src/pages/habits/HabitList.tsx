import { useState, useEffect } from 'react';
import habitService from '../../services/habitService';
import type { Habit, HabitFormData } from '../../types/habit';
import { Plus, Trash2, Activity, Check, CalendarDays, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateHabitModal from './CreateHabitModal';
import HabitCalendarView from './HabitCalendarView';

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

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

  const handleCreateOrUpdate = async (data: HabitFormData) => {
    if (editingHabit) {
      try {
        const updatedHabit = await habitService.updateHabit(editingHabit._id, data);
        setHabits(habits.map(h => h._id === updatedHabit._id ? updatedHabit : h));
        setIsCreating(false);
        setEditingHabit(null);
      } catch (error) {
        console.error('Failed to update habit', error);
      }
    } else {
      try {
        const newHabit = await habitService.createHabit(data);
        setHabits([newHabit, ...habits]);
        setIsCreating(false);
      } catch (error) {
        console.error('Failed to create habit', error);
      }
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsCreating(true);
  };

  const closeModals = () => {
    setIsCreating(false);
    setEditingHabit(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await habitService.deleteHabit(id);
      setHabits(habits.filter(h => h._id !== id));
    } catch (error) {
      console.error('Failed to delete habit', error);
    }
  };

  const toLocalYYYYMMDD = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleToggleLog = async (id: string, date: Date) => {
    const today = new Date();
    const dateString = toLocalYYYYMMDD(date);
    const todayString = toLocalYYYYMMDD(today);
    
    if (dateString !== todayString) {
      return; // Do nothing if not today
    }

    const habit = habits.find(h => h._id === id);
    if (!habit) return;

    // If already logged today, disable unchecking (strict rule)
    const isAlreadyLogged = habit.logs.some(l => l.substring(0, 10) === todayString);

    if (isAlreadyLogged) return;

    // Optimistic update
    setHabits(habits.map(h => {
      if (h._id !== id) return h;
      const logs = [...h.logs];
      logs.push(`${dateString}T00:00:00.000Z`);
      return { ...h, logs };
    }));

    try {
      const updated = await habitService.toggleLogHabit(id, dateString);
      setHabits(prev => prev.map(h => h._id === id ? updated : h));
    } catch (error) {
      console.error('Failed to log habit', error);
      fetchHabits(); // Revert
    }
  };

  // Generate an array of the last 7 days (ending today)
  const getRecentDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push(d);
    }
    return days;
  };

  const recentDays = getRecentDays();

  // Calculate a habit score based on the last 30 days
  const getHabitScore = (habit: Habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const thirtyDaysAgoStr = toLocalYYYYMMDD(thirtyDaysAgo);
    const todayStr = toLocalYYYYMMDD(today);

    const recentLogs = habit.logs.filter(l => {
      const logDateStr = l.substring(0, 10);
      return logDateStr >= thirtyDaysAgoStr && logDateStr <= todayStr;
    });

    const startD = new Date(habit.createdAt || habit.startDate || new Date());
    startD.setHours(0,0,0,0);
    const diffTime = Math.abs(today.getTime() - startD.getTime());
    const daysSinceStart = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const validMax = Math.min(30, daysSinceStart);
    if (validMax <= 0) return 0;

    const score = Math.round((recentLogs.length / validMax) * 100);
    return Math.min(100, score);
  };

  const CircularProgress = ({ score, color }: { score: number, color: string }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-white">{score}%</span>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
            <Activity className="w-8 h-8 mr-3 text-blue-500" />
            Habits
          </h1>
          <p className="text-slate-400 mt-1">Track your daily progress and build strength.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowCalendar(!showCalendar)}
            className={`
              flex items-center flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-colors shadow-lg
              ${showCalendar ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' : 'bg-slate-800 hover:bg-slate-700 text-white border border-transparent'}
            `}
          >
            {showCalendar ? <X className="w-5 h-5 mr-2" /> : <CalendarDays className="w-5 h-5 mr-2" />}
            {showCalendar ? 'Close Calendar' : 'Show Calendar'}
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white flex-1 sm:flex-none justify-center flex items-center px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Habit
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showCalendar && (
          <HabitCalendarView habits={habits} onClose={() => setShowCalendar(false)} />
        )}
      </AnimatePresence>

      <CreateHabitModal 
        isOpen={isCreating} 
        onClose={closeModals}
        onSubmit={handleCreateOrUpdate}
        initialData={editingHabit}
      />

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading habits...</div>
      ) : habits.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No Habits Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">Create a new habit to start tracking your daily progress.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30">
                  <th className="py-3 px-4 sm:py-4 sm:px-6 font-semibold text-slate-400 uppercase tracking-wider text-xs sm:text-sm min-w-[200px] sm:min-w-[250px]">Habit</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 font-semibold text-slate-400 uppercase tracking-wider text-xs sm:text-sm hidden sm:table-cell">Progress</th>
                  {recentDays.map((date, i) => (
                    <th key={i} className="py-3 px-1 sm:py-4 sm:px-2 font-semibold text-slate-400 text-center min-w-[36px] sm:min-w-[40px]">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase opacity-70">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-xs mt-1">
                          {date.getDate()}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="py-4 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {habits.map(habit => {
                  const score = getHabitScore(habit);
                  const color = habit.color || '#10b981';
                  const habitStart = new Date(habit.createdAt || habit.startDate || new Date());
                  habitStart.setHours(0,0,0,0);
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  
                  const endDate = new Date(habitStart);
                  endDate.setDate(habitStart.getDate() + (habit.duration || 30) - 1);
                  const isCompleted = today > endDate;
                  
                  return (
                    <motion.tr 
                      key={habit._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`group hover:bg-slate-800/30 transition-colors ${isCompleted ? 'opacity-70' : ''}`}
                    >
                      <td className="py-3 px-4 sm:py-4 sm:px-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div 
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-inner border border-slate-700/50 shrink-0"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            {habit.badge || '⭐'}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-white text-base leading-tight truncate flex items-center gap-2">
                              {habit.name}
                              {isCompleted && (
                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                  Completed
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 truncate">{habit.frequency || 'Daily'} • {habit.duration || 30} Days</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 hidden sm:table-cell">
                        <div className="flex items-center gap-3">
                          <CircularProgress score={score} color={color} />
                          <div className="hidden sm:block w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out" 
                              style={{ width: `${score}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      </td>
                      {recentDays.map((date, i) => {
                        const dateStr = toLocalYYYYMMDD(date);
                        const isLogged = habit.logs.some(l => l.substring(0, 10) === dateStr);
                        
                        const isToday = date.getTime() === today.getTime();
                        const isFuture = date.getTime() > today.getTime();
                        const isBeforeStart = date.getTime() < habitStart.getTime();
                        const isPastEnd = date.getTime() > endDate.getTime();
                        const isMissed = !isLogged && !isFuture && !isBeforeStart && !isPastEnd && !isToday;

                        return (
                          <td key={i} className="py-4 px-1 text-center">
                            <button
                              disabled={!isToday || isLogged || isPastEnd}
                              onClick={() => handleToggleLog(habit._id, date)}
                              className={`
                                relative w-6 h-6 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center transition-all 
                                ${isLogged ? 'shadow-inner' : ''}
                                ${isToday && !isLogged && !isPastEnd ? 'cursor-pointer hover:scale-110 ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 bg-slate-800' : 'cursor-default'}
                                ${isFuture || isBeforeStart || isPastEnd ? 'opacity-20 bg-slate-800/50' : ''}
                                ${isMissed ? 'bg-red-500/20 border border-red-500/30' : ''}
                              `}
                              style={{
                                backgroundColor: isLogged ? color : undefined,
                              }}
                              title={date.toDateString()}
                            >
                              {isLogged && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white font-bold" />}
                              {isMissed && <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />}
                            </button>
                          </td>
                        );
                      })}
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(habit)}
                            className="p-2 text-slate-500 hover:text-blue-500 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit habit"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(habit._id)}
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete habit"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

