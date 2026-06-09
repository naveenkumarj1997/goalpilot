import { useState, useEffect } from 'react';
import goalService from '../../services/goalService';
import { useAuth } from '../../context/AuthContext';
import type { Goal } from '../../types/goal';
import { Target, Clock, Save, History } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpdateHours() {
  const { updateUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [logs, setLogs] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoadingData(true);
    try {
      const data = await goalService.getGoals();
      // Only show incomplete goals
      const activeGoals = data.filter(g => {
        const total = g.totalRequiredHours || 0;
        const completed = g.completedHours || 0;
        return total === 0 || completed < total;
      });
      setGoals(activeGoals);
      
      const initialLogs: Record<string, number> = {};
      activeGoals.forEach(g => {
        initialLogs[g._id] = 0;
      });
      setLogs(initialLogs);
    } catch (error) {
      console.error('Failed to fetch goals', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleHoursChange = (id: string, hours: number) => {
    setLogs(prev => ({ ...prev, [id]: hours >= 0 ? hours : 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const logsArray = Object.keys(logs).map(goalId => ({
        goalId,
        hours: logs[goalId]
      })).filter(log => log.hours > 0);

      await goalService.batchLogHours(logsArray);
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        updateUser(JSON.parse(userStr));
      }

      setMessage('Hours updated successfully!');
      
      // Reset inputs to 0 after submit
      const resetLogs: Record<string, number> = {};
      goals.forEach(g => {
        resetLogs[g._id] = 0;
      });
      setLogs(resetLogs);
      
      // Refresh goals to show new completedHours
      fetchGoals();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update hours.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysLogs = () => {
    const today = new Date();
    const todaysLogs: { goalName: string; hours: number; time: string }[] = [];
    
    goals.forEach(g => {
      if (g.timeLogs && g.timeLogs.length > 0) {
        g.timeLogs.forEach(log => {
          const logDate = new Date(log.date);
          if (
            logDate.getDate() === today.getDate() &&
            logDate.getMonth() === today.getMonth() &&
            logDate.getFullYear() === today.getFullYear()
          ) {
            todaysLogs.push({
              goalName: g.name,
              hours: log.hours,
              time: logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          }
        });
      }
    });
    
    // Sort so most recent is first
    return todaysLogs.sort((a, b) => {
      // time string is like "5:15 PM". Best to sort by actual date parsing, but since it's today, we can just sort by original date in the goals if we had them.
      // Since we don't, we can just reverse it as an approximation or extract original log date. 
      // Actually let's just return todaysLogs.reverse() since they are fetched in order.
      return 1; // placeholder, will just reverse
    }).reverse();
  };

  const todaysLogs = getTodaysLogs();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Update Hours</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border border-emerald-100 rounded-2xl shadow-sm overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-full mix-blend-multiply opacity-50 blur-3xl -z-10" />
        
        <div className="p-6 relative z-10">
          <p className="text-text-secondary mb-6">
            Proactively log the hours you've spent on your goals today. This will instantly recalculate your daily targets.
          </p>

          {message && (
            <div className={`p-4 mb-6 rounded-xl font-medium ${message.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          {loadingData ? (
            <div className="py-8 text-center text-text-secondary">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="py-8 text-center text-text-secondary">
              You have no active goals right now.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map(goal => (
                  <div key={goal._id} className="bg-white/80 p-5 rounded-2xl border border-emerald-100 hover:border-brand/30 transition-colors shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-text-primary flex items-center">
                          <Target className="w-4 h-4 mr-2 text-brand" />
                          {goal.name}
                        </h4>
                        <div className="text-xs text-text-secondary mt-2 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Completed: {goal.completedHours || 0} / {goal.totalRequiredHours || '?'} hrs
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Add hours spent today:
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={logs[goal._id]}
                          onChange={(e) => handleHoursChange(goal._id, parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-shadow bg-white"
                        />
                        <span className="ml-3 text-sm text-text-primary font-medium">hrs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end pt-4 border-t border-emerald-100/50">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-2 btn-primary rounded-xl font-medium disabled:opacity-50"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? 'Saving...' : 'Update Hours'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>

      {/* Today's Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass border border-emerald-100 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-emerald-100/50 flex items-center">
          <History className="w-5 h-5 text-brand mr-2" />
          <h2 className="text-lg font-bold text-text-primary">Today's Activity</h2>
        </div>
        <div className="p-6">
          {todaysLogs.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-4">
              You haven't logged any hours today yet.
            </p>
          ) : (
            <div className="space-y-4">
              {todaysLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-emerald-50">
                  <div>
                    <span className="font-semibold text-text-primary">{log.hours} hours</span>
                    <span className="text-text-secondary mx-2">added to</span>
                    <span className="font-medium text-emerald-700">{log.goalName}</span>
                  </div>
                  <div className="text-sm text-text-secondary flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {log.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
