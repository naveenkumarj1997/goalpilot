import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPlan, updateTask, submitCheckIn, generatePlan, addCustomTask, removeTask } from '../../api/missionControl';
import TimelineSchedule from './TimelineSchedule';
import { motion } from 'framer-motion';
import { Bot, Sun, Moon, Flame, Trophy, ListTodo, AlertCircle } from 'lucide-react';
import { subscribeToPushNotifications } from '../../services/pushNotificationService';

export default function MissionControlDashboard() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMode, setLoadingMode] = useState<'fetching' | 'ai' | 'manual'>('fetching');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Check-in states
  const [morningMood, setMorningMood] = useState('');
  const [eveningReflection, setEveningReflection] = useState('');
  const [eveningRating, setEveningRating] = useState(5);

  const fetchPlan = async () => {
    if (!user?.token) return;
    try {
      setLoadingMode('fetching');
      setLoading(true);
      const data = await getPlan(user.token, selectedDate);
      setPlan(data); // data will be null if no plan exists
    } catch (err: any) {
      console.error(err);
      const serverMessage = err.response?.data?.message || err.message;
      setError(`Failed to load Mission Control plan. Server says: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async (mode: 'ai' | 'manual') => {
    if (!user?.token) return;
    try {
      setLoadingMode(mode);
      setLoading(true);
      const data = await generatePlan(user.token, mode, selectedDate);
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to generate ${mode} plan.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
    if (user?.token) {
      // Small delay to not block initial render
      setTimeout(() => {
        subscribeToPushNotifications(user.token);
      }, 2000);
    }
  }, [user, selectedDate]);

  const handleTaskDrop = async (taskId: string, newStartTime: string | null, newEndTime?: string, color?: string) => {
    if (!user?.token || !plan) return;
    
    // Optimistic UI Update
    const updatedTasks = plan.tasks.map((t: any) => 
      t.id === taskId ? { ...t, ...(newStartTime !== undefined && { startTime: newStartTime }), ...(newEndTime !== undefined && { endTime: newEndTime }), ...(color && { color }) } : t
    );
    setPlan({ ...plan, tasks: updatedTasks });

    try {
      const updates: any = {};
      if (newStartTime !== undefined) updates.startTime = newStartTime;
      if (newEndTime !== undefined) updates.endTime = newEndTime;
      if (color) updates.color = color;

      const updatedPlan = await updateTask(user.token, taskId, updates, selectedDate);
      setPlan(updatedPlan);
    } catch (err) {
      console.error(err);
      fetchPlan(); // Revert on failure
    }
  };

  const handleCreateCustomTask = async (title: string, newStartTime: string, newEndTime: string | undefined, color: string) => {
    if (!user?.token || !plan) return;
    
    // Optimistic UI Update
    const newTask = {
      id: 'temp-' + Date.now(),
      title,
      sourceModule: 'Custom',
      startTime: newStartTime,
      endTime: newEndTime,
      completed: false,
      priority: 'Medium',
      color
    };
    setPlan({ ...plan, tasks: [...plan.tasks, newTask] });

    // API Call
    try {
      const data = await addCustomTask(user.token, title, newStartTime, newEndTime, color, selectedDate);
      setPlan(data);
    } catch (err) {
      console.error(err);
      fetchPlan(); // revert
    }
  };

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    if (!user?.token || !plan) return;

    // Optimistic UI Update
    const updatedTasks = plan.tasks.map((t: any) => 
      t.id === taskId ? { ...t, completed } : t
    );
    setPlan({ ...plan, tasks: updatedTasks });

    try {
      const updatedPlan = await updateTask(user.token, taskId, { completed }, selectedDate);
      setPlan(updatedPlan);
    } catch (err) {
      console.error(err);
      fetchPlan();
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    if (!user?.token || !plan) return;

    // Optimistic UI Update
    setPlan({ ...plan, tasks: plan.tasks.filter((t: any) => t.id !== taskId) });

    // API Call
    try {
      const data = await removeTask(user.token, taskId, selectedDate);
      setPlan(data);
    } catch (err) {
      console.error(err);
      fetchPlan();
    }
  };

  const handleCheckIn = async (type: 'morning' | 'evening') => {
    if (!user?.token) return;
    try {
      const payload = type === 'morning' 
        ? { type, mood: morningMood }
        : { type, reflection: eveningReflection, rating: eveningRating, date: selectedDate };
      
      const updatedPlan = await submitCheckIn(user.token, payload as any);
      setPlan(updatedPlan);
    } catch (err) {
      console.error('Checkin failed', err);
    }
  };

  if (loading) {
    const isAi = loadingMode === 'ai';
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-t-4 border-brand rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-emerald-500 rounded-full animate-spin-slow"></div>
          {isAi ? (
            <Bot className="absolute inset-0 m-auto text-brand w-8 h-8 animate-pulse" />
          ) : (
            <ListTodo className="absolute inset-0 m-auto text-emerald-400 w-8 h-8 animate-pulse" />
          )}
        </div>
        <h2 className={`text-2xl font-black text-white tracking-widest ${isAi ? 'neon-text-brand' : 'drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}>
          {isAi ? "AI IS PLANNING YOUR DAY" : "LOADING MISSION PLAN"}
        </h2>
        <p className="text-slate-400 mt-2 font-medium">
          {isAi ? "Aggregating tasks, habits, and workouts..." : "Retrieving your data..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">System Error</h2>
        <p className="text-slate-400">{error}</p>
        <button onClick={fetchPlan} className="mt-6 px-6 py-2 bg-brand text-white rounded-lg font-bold hover:bg-brand-hover">Retry</button>
      </div>
    );
  }

  // If no plan exists for today yet, show the choice screen
  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-10 max-w-2xl mx-auto text-center px-4">
        <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,112,209,0.3)] shrink-0">
          <Bot className="w-10 h-10 text-brand" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-wide">START YOUR DAY</h1>
        <p className="text-slate-400 text-lg mb-6">How would you like to plan your mission?</p>
        
        <div className="mb-8 flex items-center justify-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700 w-full max-w-md">
          <label className="text-slate-300 font-bold">Select Date:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-brand outline-none flex-1"
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* AI Auto-Plan */}
          <button 
            onClick={() => handleGeneratePlan('ai')}
            className="flex-1 bg-gradient-to-br from-indigo-900/50 to-brand/30 border border-brand/50 p-6 rounded-2xl flex flex-col items-center gap-4 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,112,209,0.4)] transition-all group"
          >
            <div className="p-4 bg-brand/20 rounded-full group-hover:scale-110 transition-transform">
              <Sun className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Auto-Plan with AI</h3>
              <p className="text-sm text-indigo-200">Gemini will automatically schedule your tasks, habits, and workouts into a timeline.</p>
            </div>
          </button>

          {/* Manual Plan */}
          <button 
            onClick={() => handleGeneratePlan('manual')}
            className="flex-1 bg-slate-800/50 border border-slate-600 p-6 rounded-2xl flex flex-col items-center gap-4 hover:scale-105 hover:bg-slate-700/50 hover:border-slate-500 transition-all group"
          >
            <div className="p-4 bg-slate-700 rounded-full group-hover:scale-110 transition-transform">
              <ListTodo className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Manual Plan</h3>
              <p className="text-sm text-slate-400">Pull everything into your Inbox and tap the timeline slots to manually schedule them.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const unscheduledTasks = plan?.tasks.filter((t: any) => !t.startTime) || [];
  const scheduledTasks = plan?.tasks.filter((t: any) => !!t.startTime) || [];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-120px)] pb-20 lg:pb-0">
      
      {/* LEFT COLUMN: INBOX */}
      <div className={`w-full lg:w-1/4 flex flex-col gap-4 overflow-y-auto custom-scrollbar bg-slate-900/40 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 shadow-xl shrink-0 ${unscheduledTasks.length === 0 ? 'hidden lg:flex' : 'max-h-[35vh] lg:max-h-none'}`}>
        {plan.isFallback && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-start gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-400">AI Limit Exceeded</p>
              <p className="text-xs text-yellow-500/90 mt-1 leading-relaxed">
                The AI couldn't generate your schedule right now. You can schedule these items manually by tapping the timeline slots, or click <strong>Reset Plan</strong> on the right to start over and select <strong>Manual Plan</strong>.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <ListTodo className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-black text-white tracking-wider">TASK INBOX</h2>
        </div>
        <p className="text-xs text-slate-400 font-medium mb-2 pb-2 border-b border-slate-700 hidden lg:block">Drag tasks to the timeline or tap a timeline slot on mobile.</p>
        <p className="text-xs text-slate-400 font-medium mb-2 pb-2 border-b border-slate-700 lg:hidden">Tap an empty timeline slot below to schedule these tasks.</p>
        
        {unscheduledTasks.length === 0 ? (
          <div className="text-center p-6 text-slate-500 text-sm font-medium border border-dashed border-slate-700 rounded-xl">
            All tasks are scheduled!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {unscheduledTasks.map((task: any) => (
              <motion.div
                layout
                key={task.id}
                draggable
                onDragStart={(e: any) => {
                  e.dataTransfer.setData('taskId', task.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                className={`p-3 rounded-xl border cursor-grab active:cursor-grabbing backdrop-blur-sm shadow-md transition-transform hover:scale-105 ${task.priority === 'High' ? 'bg-red-500/10 border-red-500/30' : task.priority === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{task.title}</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">{task.sourceModule}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CENTER COLUMN: TIMELINE */}
      <div className="flex-1 flex flex-col bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

        <div className="flex items-center justify-between mb-6 relative z-10 border-b border-slate-700/50 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Sun className="w-6 h-6 text-yellow-400" />
              {selectedDate === new Date().toISOString().split('T')[0] ? "TODAY'S MISSION" : "MISSION PLAN"}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-white px-2 py-1 rounded text-sm focus:border-brand outline-none"
              />
              <button 
                onClick={() => setPlan(null)}
                className="text-[10px] bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 px-2 py-1 rounded uppercase tracking-widest font-bold transition-colors"
              >
                Reset Plan
              </button>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{plan.successScore}%</span>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Success Score</p>
          </div>
        </div>

        <TimelineSchedule 
          tasks={scheduledTasks} 
          unscheduledTasks={unscheduledTasks}
          onTaskDrop={handleTaskDrop}
          onTaskComplete={handleTaskComplete}
          onCreateCustomTask={handleCreateCustomTask}
          onRemoveTask={handleRemoveTask}
        />
      </div>

      {/* RIGHT COLUMN: AI & CHECK-INS */}
      <div className="w-full lg:w-1/4 flex flex-col gap-4 overflow-y-auto custom-scrollbar shrink-0">
        
        {/* AI COACH WIDGET */}
        <div className="bg-gradient-to-br from-indigo-900/80 to-brand/40 border border-brand/50 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,112,209,0.2)]">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-indigo-300" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">AI Copilot</h3>
          </div>
          <p className="text-sm text-indigo-100/90 leading-relaxed font-medium italic">
            "{plan.aiCoaching}"
          </p>
        </div>

        {/* STREAK & STATS */}
        <div className="bg-slate-900/50 border border-orange-500/20 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Streak</p>
              <p className="text-xl font-black text-white">{user?.stats?.currentStreak || 0} Days</p>
            </div>
          </div>
          <Trophy className="w-8 h-8 text-yellow-500 opacity-20" />
        </div>

        {/* MORNING CHECKIN */}
        <div className={`bg-slate-900/50 border ${plan.morningCheckIn?.completedAt ? 'border-emerald-500/20' : 'border-yellow-500/30'} rounded-2xl p-5 shadow-lg transition-colors`}>
          <div className="flex items-center gap-2 mb-3">
            <Sun className={`w-5 h-5 ${plan.morningCheckIn?.completedAt ? 'text-emerald-400' : 'text-yellow-400'}`} />
            <h3 className="font-bold text-white text-sm">Morning Protocol</h3>
          </div>
          
          {plan.morningCheckIn?.completedAt ? (
            <div className="text-sm text-slate-300 font-medium">
              <span className="text-emerald-400 block mb-1">✓ Completed</span>
              Mood: {plan.morningCheckIn.mood}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="How do you feel?" 
                value={morningMood}
                onChange={e => setMorningMood(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
              />
              <button 
                onClick={() => handleCheckIn('morning')}
                disabled={!morningMood}
                className="w-full bg-brand/20 hover:bg-brand/40 text-brand font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Start Day
              </button>
            </div>
          )}
        </div>

        {/* EVENING REVIEW */}
        <div className={`bg-slate-900/50 border ${plan.eveningReview?.completedAt ? 'border-emerald-500/20' : 'border-indigo-500/30'} rounded-2xl p-5 shadow-lg transition-colors`}>
          <div className="flex items-center gap-2 mb-3">
            <Moon className={`w-5 h-5 ${plan.eveningReview?.completedAt ? 'text-emerald-400' : 'text-indigo-400'}`} />
            <h3 className="font-bold text-white text-sm">Evening Review</h3>
          </div>
          
          {plan.eveningReview?.completedAt ? (
            <div className="text-sm text-slate-300 font-medium">
              <span className="text-emerald-400 block mb-1">✓ Completed</span>
              Rating: {plan.eveningReview.rating}/10
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="Reflections on today?" 
                value={eveningReflection}
                onChange={e => setEveningReflection(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Rating:</span>
                <input 
                  type="range" min="1" max="10" 
                  value={eveningRating} 
                  onChange={e => setEveningRating(Number(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <span className="text-xs text-white font-bold">{eveningRating}/10</span>
              </div>
              <button 
                onClick={() => handleCheckIn('evening')}
                disabled={!eveningReflection}
                className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400 font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-50 mt-1"
              >
                Close Day
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
