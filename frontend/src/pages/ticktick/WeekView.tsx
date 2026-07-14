import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeekView({ currentDate, tasks, onCreateTask, onUpdateTask, onDateClick }: any) {
  const [addingTaskDate, setAddingTaskDate] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Calculate week days
  const dayOfWeek = currentDate.getDay();
  const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(diff);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      dateObj: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: d.toDateString() === new Date().toDateString()
    };
  });

  const handleAdd = (e: React.FormEvent, dateStr: string) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onCreateTask({
      title: newTaskTitle,
      date: dateStr,
      priority: 'None'
    });
    setNewTaskTitle('');
    setAddingTaskDate(null);
  };

  const getPriorityColor = (p: string) => {
    if (p === 'High') return 'border-red-500 bg-red-500/10 text-red-500';
    if (p === 'Medium') return 'border-yellow-500 bg-yellow-500/10 text-yellow-500';
    if (p === 'Low') return 'border-blue-500 bg-blue-500/10 text-blue-500';
    return 'border-gray-300 dark:border-gray-600 bg-transparent text-gray-400';
  };

  return (
    <div className="flex w-full h-full p-4 md:p-6 overflow-x-auto custom-scrollbar">
      <div className="flex min-w-[800px] w-full gap-4 pb-4">
        {weekDays.map((day) => {
          const dayTasks = tasks.filter((t: any) => {
            if (!t.recurrence || t.recurrence.type === 'none') {
              return t.date === day.dateStr;
            }
            if (t.date > day.dateStr) return false;
            if (t.recurrence.type === 'daily') return true;
            if (t.recurrence.type === 'weekly' || t.recurrence.type === 'custom') {
              return t.recurrence.daysOfWeek?.includes(day.dateObj.getDay());
            }
            return false;
          }).map((t: any) => ({
            ...t,
            isCompletedToday: (t.recurrence?.type && t.recurrence.type !== 'none') 
              ? t.completedDates?.includes(day.dateStr) 
              : t.completed
          }));
          
          const uncompletedCount = dayTasks.filter((t: any) => !t.isCompletedToday).length;
          const completedCount = dayTasks.filter((t: any) => t.isCompletedToday).length;
          
          return (
            <div key={day.dateStr} className={`flex-1 flex flex-col bg-slate-800/30 rounded-xl border ${day.isToday ? 'border-blue-500 shadow-sm shadow-blue-500/20' : 'border-slate-700/50'}`}>
              <div className={`p-3 border-b border-slate-700/50 flex items-center justify-between group ${day.isToday ? 'bg-blue-500/10' : ''}`}>
                <div 
                  className="flex flex-col cursor-pointer transition-transform hover:scale-105"
                  onClick={() => onDateClick(day.dateObj)}
                  title="View full day"
                >
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${day.isToday ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {day.dayName}
                    {(uncompletedCount > 0 || completedCount > 0) && (
                      <div className="flex items-center gap-1">
                        {uncompletedCount > 0 && <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500/20 border border-red-500 text-[9px] text-red-400">{uncompletedCount}</span>}
                        {completedCount > 0 && <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 text-[9px] text-emerald-400">{completedCount}</span>}
                      </div>
                    )}
                  </span>
                  <span className={`text-xl font-black ${day.isToday ? 'text-blue-400' : 'text-white'}`}>{day.dayNum}</span>
                </div>
                <button 
                  onClick={() => setAddingTaskDate(day.dateStr)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${day.isToday ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
                {addingTaskDate === day.dateStr && (
                  <form onSubmit={(e) => handleAdd(e, day.dateStr)} className="mb-2 shrink-0 relative flex items-center">
                    <input 
                      autoFocus
                      type="text" 
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onBlur={() => { 
                        // Small timeout to allow button click to register before unmounting
                        setTimeout(() => {
                          if(!newTaskTitle) setAddingTaskDate(null); 
                        }, 100);
                      }}
                      placeholder="New task..."
                      className="w-full bg-slate-900/80 border border-blue-500 rounded p-2 pr-10 text-xs text-white outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!newTaskTitle.trim()}
                      className="absolute right-1 w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded disabled:opacity-50 transition-opacity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </form>
                )}

                {dayTasks.map((task: any) => (
                  <motion.div 
                    layoutId={`${task._id}-${day.dateStr}`}
                    key={`${task._id}-${day.dateStr}`} 
                    className={`group flex items-start gap-2 p-2 bg-slate-800/80 border border-slate-700/50 rounded-lg shadow-sm shrink-0 ${task.isCompletedToday ? 'opacity-50' : ''}`}
                  >
                    <button 
                      onClick={() => {
                        const nextState = !task.isCompletedToday;
                        if (task.recurrence?.type && task.recurrence.type !== 'none') {
                          onUpdateTask(task._id, { toggleCompletedDate: day.dateStr, completed: nextState });
                        } else {
                          onUpdateTask(task._id, { completed: nextState });
                        }
                      }}
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded flex items-center justify-center border transition-all ${task.isCompletedToday ? 'bg-blue-500 border-blue-500' : getPriorityColor(task.priority)}`}
                    >
                      {task.isCompletedToday && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`text-xs break-words min-w-0 ${task.isCompletedToday ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
