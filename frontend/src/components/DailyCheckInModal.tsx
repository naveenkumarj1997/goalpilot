import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import goalService from '../services/goalService';
import { useAuth } from '../context/AuthContext';
import type { Goal } from '../types/goal';
import { Target, X, CheckCircle } from 'lucide-react';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyCheckInModal({ isOpen, onClose }: DailyCheckInModalProps) {
  const { updateUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [logs, setLogs] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchGoals();
    }
  }, [isOpen]);

  const fetchGoals = async () => {
    setLoadingData(true);
    try {
      const data = await goalService.getGoals();
      // Only show incomplete goals
      const activeGoals = data.filter(g => {
        const total = g.totalRequiredHours || 0;
        const completed = g.completedHours || 0;
        return total === 0 || completed < total; // Not 100% completed
      });
      setGoals(activeGoals);
      
      const initialLogs: Record<string, number> = {};
      activeGoals.forEach(g => {
        initialLogs[g._id] = 0;
      });
      setLogs(initialLogs);
    } catch (error) {
      console.error('Failed to fetch goals for check-in', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleHoursChange = (id: string, hours: number) => {
    setLogs(prev => ({ ...prev, [id]: hours >= 0 ? hours : 0 }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const logsArray = Object.keys(logs).map(goalId => ({
        goalId,
        hours: logs[goalId]
      })).filter(log => log.hours > 0);

      // Even if they log 0 for all, we send an empty array to update the lastDailyLog time
      await goalService.batchLogHours(logsArray);
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        updateUser(JSON.parse(userStr));
      }

      onClose();
    } catch (error) {
      console.error('Failed to log hours', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass border border-emerald-100 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-full mix-blend-multiply opacity-50 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply opacity-50 blur-3xl -z-10" />
          
          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-emerald-900 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-brand" />
                  Daily Check-In
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  How much time did you spend on your goals today?
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingData ? (
              <div className="py-8 text-center text-text-secondary">Loading goals...</div>
            ) : goals.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-text-secondary mb-4">You have no active goals right now.</p>
                <button 
                  onClick={handleSubmit} 
                  className="px-6 py-2 btn-primary rounded-xl"
                >
                  Mark Check-In as Done
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {goals.map(goal => (
                  <div key={goal._id} className="bg-white/60 p-4 rounded-2xl border border-emerald-50 flex items-center justify-between group hover:bg-white/80 transition-colors">
                    <div className="flex-1 pr-4">
                      <h4 className="font-semibold text-text-primary flex items-center">
                        <Target className="w-4 h-4 mr-2 text-brand opacity-70" />
                        {goal.name}
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Completed: {goal.completedHours || 0} / {goal.totalRequiredHours || '?'} hrs
                      </p>
                    </div>
                    <div className="w-24">
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={logs[goal._id]}
                          onChange={(e) => handleHoursChange(goal._id, parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-center border border-emerald-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-shadow bg-white"
                        />
                        <span className="ml-2 text-sm text-text-secondary font-medium">hrs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {goals.length > 0 && (
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-emerald-100/50">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 btn-primary rounded-xl font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Log Hours'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
