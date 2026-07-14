import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Save, DollarSign } from 'lucide-react';
import { useWealth } from '../../context/WealthContext';
import { useAuth } from '../../context/AuthContext';
import { updateDream } from '../../api/wealth';

interface DreamDailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DreamDailyCheckInModal({ isOpen, onClose, onSuccess }: DreamDailyCheckInModalProps) {
  const { user } = useAuth();
  const { dreams, refreshWealthData, formatCurrency } = useWealth();
  const [amounts, setAmounts] = useState<{ [key: string]: number | '' }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get active dreams (not yet fully funded)
  const activeDreams = dreams.filter(d => d.savedAmount < d.targetCost && d.status !== 'Achieved');

  useEffect(() => {
    if (isOpen) {
      // Initialize inputs to empty string so it's blank by default
      const initialAmounts: { [key: string]: number | '' } = {};
      activeDreams.forEach(dream => {
        initialAmounts[dream._id] = '';
      });
      setAmounts(initialAmounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setIsSubmitting(true);
    try {
      const updatePromises = activeDreams.map(async (dream) => {
        const amount = amounts[dream._id];
        // If they entered a valid number (even 0), we update. If it's 0, it's a valid check-in.
        if (typeof amount === 'number') {
          return updateDream(dream._id, { savedAmount: dream.savedAmount + amount }, user.token);
        }
      });

      await Promise.all(updatePromises);
      await refreshWealthData();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update dream savings:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDailyTarget = (dream: any) => {
    const remainingAmount = Math.max(0, dream.targetCost - dream.savedAmount);
    const targetDate = new Date(dream.targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    let daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (daysLeft < 1) daysLeft = 1; // Avoid division by zero, at least 1 day left

    return remainingAmount / daysLeft;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 md:rounded-3xl border-y md:border border-emerald-500/30 shadow-2xl z-50 overflow-hidden flex flex-col h-full max-h-[100vh] md:max-h-[90vh]"
          >
            <div className="p-6 border-b border-emerald-500/20 bg-emerald-900/10 flex justify-between items-center shrink-0">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mr-3">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Daily Dream Savings</h2>
                  <p className="text-sm text-slate-400">Did you save the required amount today?</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {activeDreams.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Active Dreams</h3>
                  <p className="text-slate-400">You don't have any pending dreams to save for right now.</p>
                </div>
              ) : (
                <form id="dream-checkin-form" onSubmit={handleSubmit} className="space-y-4">
                  {activeDreams.map(dream => {
                    const dailyTarget = getDailyTarget(dream);
                    return (
                      <div key={dream._id} className="bg-slate-800/50 p-4 rounded-2xl border border-emerald-500/10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-white font-bold text-lg">{dream.title}</h3>
                            <p className="text-sm text-slate-400">Target: {formatCurrency(dream.targetCost)} • By: {new Date(dream.targetDate).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Required Today</p>
                            <p className="text-xl font-black text-emerald-400">{formatCurrency(dailyTarget)}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <label className="text-sm font-medium text-slate-300">Amount saved today:</label>
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <span className="text-slate-500 text-lg">$</span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              required
                              placeholder={dailyTarget.toFixed(2)}
                              className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl py-3 pl-8 pr-4 text-lg text-white focus:outline-none focus:border-emerald-500"
                              value={amounts[dream._id] ?? ''}
                              onChange={(e) => setAmounts({
                                ...amounts,
                                [dream._id]: e.target.value === '' ? '' : Number(e.target.value)
                              })}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setAmounts({ ...amounts, [dream._id]: Math.round(dailyTarget * 100) / 100 })}
                            className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-xl border border-emerald-500/20 transition-colors"
                          >
                            Fill Target
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-3 italic">
                          * If you save more or less than the required amount, tomorrow's target will automatically adjust.
                        </p>
                      </div>
                    );
                  })}
                </form>
              )}
            </div>

            <div className="p-6 border-t border-emerald-500/20 bg-emerald-900/10 shrink-0">
              <button
                type="submit"
                form="dream-checkin-form"
                disabled={isSubmitting || activeDreams.length === 0}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Log Today's Savings
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
