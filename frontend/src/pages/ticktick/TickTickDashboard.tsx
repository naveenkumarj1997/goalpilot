import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../../api/ticktick';
import { Calendar, CalendarDays, CalendarRange, ListTodo, Plus, Check } from 'lucide-react';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import { motion } from 'framer-motion';
import { useTaskNotifications } from '../../hooks/useTaskNotifications';
import { getLocalDateString } from '../../utils/dateUtils';

export default function TickTickDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Initialize the automatic notification scheduler
  useTaskNotifications(tasks);

  const fetchTasks = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      // Determine date range based on active tab
      let startDateStr, endDateStr;
      
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      if (activeTab === 'day') {
        startDateStr = getLocalDateString(currentDate);
        endDateStr = startDateStr;
      } else if (activeTab === 'week') {
        const dayOfWeek = currentDate.getDay();
        const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(diff);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        startDateStr = getLocalDateString(startOfWeek);
        endDateStr = getLocalDateString(endOfWeek);
      } else if (activeTab === 'month') {
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        startDateStr = getLocalDateString(startOfMonth);
        endDateStr = getLocalDateString(endOfMonth);
      } else if (activeTab === 'year') {
        startDateStr = `${year}-01-01`;
        endDateStr = `${year}-12-31`;
      }

      const data = await getTasks(user.token, { startDate: startDateStr, endDate: endDateStr });
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user, activeTab, currentDate]);

  const handleCreateTask = async (taskData: any) => {
    if (!user?.token) return;
    try {
      const newTask = await createTask(user.token, taskData);
      setTasks([...tasks, newTask]);
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleUpdateTask = async (id: string, updates: any) => {
    if (!user?.token) return;
    try {
      const updatedTask = await updateTask(user.token, id, updates);
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!user?.token) return;
    try {
      await deleteTask(user.token, id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full bg-slate-900/60 backdrop-blur-xl text-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
      {/* Header / Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/40 gap-4">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 sm:pb-0 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('day')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'day' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <ListTodo className="w-4 h-4" /> Day
          </button>
          <button 
            onClick={() => setActiveTab('week')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'week' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <CalendarDays className="w-4 h-4" /> Week
          </button>
          <button 
            onClick={() => setActiveTab('month')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'month' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <CalendarRange className="w-4 h-4" /> Month
          </button>
          <button 
            onClick={() => setActiveTab('year')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'year' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Calendar className="w-4 h-4" /> Year
          </button>
        </div>
        
        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4">
          <span className="text-sm font-bold text-slate-300">
            {currentDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
          </span>
          <div className="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700">
            <button onClick={() => { const d = new Date(currentDate); if(activeTab==='day') d.setDate(d.getDate()-1); else if(activeTab==='week') d.setDate(d.getDate()-7); else if(activeTab==='month') d.setMonth(d.getMonth()-1); else d.setFullYear(d.getFullYear()-1); setCurrentDate(d); }} className="px-3 py-1 hover:bg-slate-700 rounded text-xs text-slate-300">&lt;</button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 hover:bg-slate-700 rounded text-xs font-bold text-white">Today</button>
            <button onClick={() => { const d = new Date(currentDate); if(activeTab==='day') d.setDate(d.getDate()+1); else if(activeTab==='week') d.setDate(d.getDate()+7); else if(activeTab==='month') d.setMonth(d.getMonth()+1); else d.setFullYear(d.getFullYear()+1); setCurrentDate(d); }} className="px-3 py-1 hover:bg-slate-700 rounded text-xs text-slate-300">&gt;</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex bg-transparent">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full overflow-y-auto custom-scrollbar"
          >
            {activeTab === 'day' && <DayView currentDate={currentDate} tasks={tasks} onCreateTask={handleCreateTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />}
            {activeTab === 'week' && <WeekView currentDate={currentDate} tasks={tasks} onCreateTask={handleCreateTask} onUpdateTask={handleUpdateTask} onDateClick={(d: any) => { setActiveTab('day'); setCurrentDate(d); }} />}
            {activeTab === 'month' && <MonthView currentDate={currentDate} tasks={tasks} onDateClick={(d: any) => { setActiveTab('day'); setCurrentDate(d); }} />}
            {activeTab === 'year' && <YearView currentDate={currentDate} tasks={tasks} onMonthClick={(m: any) => { const d = new Date(currentDate); d.setMonth(m); setActiveTab('month'); setCurrentDate(d); }} />}
          </motion.div>
        )}
      </div>
    </div>
  );
}
