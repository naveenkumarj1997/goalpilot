import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Activity, Tag, Type } from 'lucide-react';
import type { HabitFormData } from '../../types/habit';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HabitFormData) => void;
}

const BADGES = ['⭐', '💧', '🏃', '📚', '🧘', '🥗', '🏋️', '💻', '🎸', '🎨', '🔥', '🌱'];
const DURATIONS = [7, 14, 21, 30, 60, 90];

export default function CreateHabitModal({ isOpen, onClose, onSubmit }: CreateHabitModalProps) {
  const [name, setName] = useState('');
  const [badge, setBadge] = useState('⭐');
  const [duration, setDuration] = useState(30);
  const [color, setColor] = useState('#10b981'); // default emerald

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Auto-generate start date to local today
    const now = new Date();
    const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    onSubmit({
      name: name.trim(),
      badge,
      duration,
      color,
      startDate,
      frequency: 'Daily'
    });
    
    setName('');
    setBadge('⭐');
    setDuration(30);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                New Habit Challenge
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-400" />
                Habit Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Drink 2L Water"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                Select Badge
              </label>
              <div className="grid grid-cols-6 gap-2">
                {BADGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBadge(b)}
                    className={`text-2xl p-2 rounded-xl transition-all ${
                      badge === b ? 'bg-slate-700 scale-110 shadow-lg border border-slate-600' : 'bg-slate-800/50 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Challenge Duration
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      duration === d 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl px-4 py-3 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Challenge
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
