import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Calendar, Plus, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getManifestationGoals, addManifestationGoal, updateGoal } from '../../api/manifestation';

export default function GoalManifestor() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [yearly, setYearly] = useState(['']);
  const [monthly, setMonthly] = useState(['']);
  const [weekly, setWeekly] = useState(['']);
  const [daily, setDaily] = useState(['']);

  const fetchGoals = async () => {
    try {
      if (!user?.token) return;
      const data = await getManifestationGoals(user.token);
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitting... user:', user);
    try {
      setError(null);
      if (!title || !deadline) {
        setError('Please fill in the Ultimate Goal and Deadline fields.');
        alert('Please fill in the Ultimate Goal and Deadline fields.');
        return;
      }
      if (!user?.token) {
        setError('User token missing. Please log in again.');
        alert('User token missing. Please log in again.');
        return;
      }
      const payload = {
        title,
        deadline,
        priority,
        yearlyPlan: yearly.filter(x => x.trim()),
        monthlyPlan: monthly.filter(x => x.trim()),
        weeklyPlan: weekly.filter(x => x.trim()),
        dailyTasks: daily.filter(x => x.trim()).map(task => ({ task, completed: false }))
      };
      await addManifestationGoal(payload, user.token);
      alert('Success! Your goal was saved.');
      setShowModal(false);
      resetForm();
      fetchGoals();
    } catch (err) {
      console.error('Error caught in handleSubmit:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to save goal';
      setError(errMsg);
      alert('Error: ' + errMsg);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDeadline('');
    setPriority('Medium');
    setYearly(['']);
    setMonthly(['']);
    setWeekly(['']);
    setDaily(['']);
  };

  const handleArrayChange = (setter: any, array: string[], index: number, value: string) => {
    const newArray = [...array];
    newArray[index] = value;
    if (index === array.length - 1 && value.trim()) {
      newArray.push('');
    }
    setter(newArray);
  };

  const toggleTask = async (goalId: string, taskIndex: number, currentGoal: any) => {
    try {
      if (!user?.token) return;
      const updatedTasks = [...currentGoal.dailyTasks];
      updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
      await updateGoal(goalId, { dailyTasks: updatedTasks }, user.token);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const markComplete = async (goalId: string) => {
    try {
      if (!user?.token) return;
      await updateGoal(goalId, { status: 'Completed' }, user.token);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading Goals...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center mb-2">
            <Target className="w-8 h-8 mr-3 text-emerald-400" />
            Goal Manifestor
          </h1>
          <p className="text-slate-400">Break down your biggest dreams into daily actionable steps.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          <Plus className="w-5 h-5 mr-2" /> New Goal
        </button>
      </div>

      <div className="space-y-6">
        {goals.map(goal => (
          <motion.div
            key={goal._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass border rounded-2xl overflow-hidden transition-all duration-300 ${goal.status === 'Completed' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10'}`}
          >
            <div 
              className="p-6 cursor-pointer flex items-center justify-between"
              onClick={() => setExpandedGoal(expandedGoal === goal._id ? null : goal._id)}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    goal.priority === 'High' ? 'bg-red-500/20 text-red-400' : 
                    goal.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {goal.priority} Priority
                  </span>
                  {goal.status === 'Completed' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" /> Completed
                    </span>
                  )}
                </div>
                <h2 className={`text-2xl font-bold ${goal.status === 'Completed' ? 'text-emerald-400 line-through opacity-70' : 'text-white'}`}>{goal.title}</h2>
                <div className="flex items-center text-slate-400 mt-2 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Target: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-2xl font-black text-emerald-400">
                    {goal.dailyTasks.length > 0 ? Math.round((goal.dailyTasks.filter((t:any) => t.completed).length / goal.dailyTasks.length) * 100) : 0}%
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Progress</p>
                </div>
                {expandedGoal === goal._id ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedGoal === goal._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 pt-2 border-t border-white/5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* The Plan */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-amber-400 font-bold mb-2 text-sm uppercase tracking-wider">Yearly Milestones</h4>
                        <ul className="space-y-2">
                          {goal.yearlyPlan.map((p: string, i: number) => <li key={i} className="text-slate-300 text-sm flex items-start"><span className="mr-2 text-amber-500">•</span>{p}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider">Monthly Goals</h4>
                        <ul className="space-y-2">
                          {goal.monthlyPlan.map((p: string, i: number) => <li key={i} className="text-slate-300 text-sm flex items-start"><span className="mr-2 text-blue-500">•</span>{p}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-purple-400 font-bold mb-2 text-sm uppercase tracking-wider">Weekly Focus</h4>
                        <ul className="space-y-2">
                          {goal.weeklyPlan.map((p: string, i: number) => <li key={i} className="text-slate-300 text-sm flex items-start"><span className="mr-2 text-purple-500">•</span>{p}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* Daily Action */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                      <h4 className="text-emerald-400 font-bold mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" /> Daily Action Checklist
                      </h4>
                      <div className="space-y-3">
                        {goal.dailyTasks.map((task: any, index: number) => (
                          <div 
                            key={index} 
                            onClick={(e) => { e.stopPropagation(); toggleTask(goal._id, index, goal); }}
                            className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors border ${task.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800 border-slate-700 hover:border-emerald-500/50'}`}
                          >
                            <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
                              {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${task.completed ? 'text-emerald-400 line-through opacity-70' : 'text-slate-300'}`}>{task.task}</span>
                          </div>
                        ))}
                      </div>

                      {goal.status !== 'Completed' && (
                        <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/5">
                          <button 
                            onClick={(e) => { e.stopPropagation(); markComplete(goal._id); }}
                            className="text-emerald-400 hover:text-emerald-300 font-bold text-sm transition-colors"
                          >
                            Mark Goal as Achieved 🏆
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-2xl w-full my-8 shadow-2xl relative"
          >
            <h2 className="text-3xl font-black text-white mb-6">Manifest a New Goal</h2>
            {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl mb-6">{error}</div>}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-slate-400 text-sm font-bold mb-2">The Ultimate Goal</label>
                  <input type="text" required value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="What do you want to achieve?" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-bold mb-2">Deadline</label>
                  <input type="date" required value={deadline} onChange={e=>setDeadline(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-bold mb-2">Priority</label>
                  <select value={priority} onChange={e=>setPriority(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
              </div>

              <hr className="border-slate-800" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-amber-400 text-sm font-bold mb-2">Yearly Milestones</label>
                  {yearly.map((v,i) => <input key={i} value={v} onChange={e=>handleArrayChange(setYearly, yearly, i, e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white mb-2" placeholder="Major milestone..." />)}
                </div>
                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2">Monthly Targets</label>
                  {monthly.map((v,i) => <input key={i} value={v} onChange={e=>handleArrayChange(setMonthly, monthly, i, e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white mb-2" placeholder="Monthly target..." />)}
                </div>
                <div>
                  <label className="block text-purple-400 text-sm font-bold mb-2">Weekly Focus</label>
                  {weekly.map((v,i) => <input key={i} value={v} onChange={e=>handleArrayChange(setWeekly, weekly, i, e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white mb-2" placeholder="This week's focus..." />)}
                </div>
                <div>
                  <label className="block text-emerald-400 text-sm font-bold mb-2">Daily Action Items</label>
                  {daily.map((v,i) => <input key={i} value={v} onChange={e=>handleArrayChange(setDaily, daily, i, e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white mb-2" placeholder="Daily task..." />)}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold">Cancel</button>
                <button type="button" onClick={handleSubmit} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors">Manifest Goal</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}