import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Activity, Tag, Type } from 'lucide-react';
import type { HabitFormData, Habit } from '../../types/habit';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HabitFormData) => void;
  initialData?: Habit | null;
}

const BADGES = ['⭐', '💧', '🏃', '📚', '🧘', '🥗', '🏋️', '💻', '🎸', '🎨', '🔥', '🌱'];
const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#14b8a6', '#6366f1'];

export default function CreateHabitModal({ isOpen, onClose, onSubmit, initialData }: CreateHabitModalProps) {
  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const [name, setName] = useState('');
  const [badge, setBadge] = useState('⭐');
  const [startDate, setStartDate] = useState(getTodayStr());
  const [endDate, setEndDate] = useState('');
  const [color, setColor] = useState('#10b981'); // default emerald

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setBadge(initialData.badge || '⭐');
        setColor(initialData.color || '#10b981');
        
        const startD = new Date(initialData.startDate || initialData.createdAt);
        setStartDate(`${startD.getFullYear()}-${String(startD.getMonth() + 1).padStart(2, '0')}-${String(startD.getDate()).padStart(2, '0')}`);
        
        if (initialData.duration) {
          const endD = new Date(startD);
          endD.setDate(startD.getDate() + initialData.duration - 1);
          setEndDate(`${endD.getFullYear()}-${String(endD.getMonth() + 1).padStart(2, '0')}-${String(endD.getDate()).padStart(2, '0')}`);
        } else {
          setEndDate('');
        }
      } else {
        setStartDate(getTodayStr());
        setEndDate('');
        setName('');
        setBadge('⭐');
        setColor('#10b981');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let computedDuration = 30; // default 1 month

    if (endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      computedDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
    }

    onSubmit({
      name: name.trim(),
      badge,
      duration: computedDuration,
      color,
      startDate,
      frequency: 'Daily'
    });
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
                {initialData ? 'Edit Habit' : 'New Habit Challenge'}
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
                <Tag className="w-4 h-4 text-slate-400" />
                Select Color
              </label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      color === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1 pl-1">Leave empty for 1 month default</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl px-4 py-3 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialData ? 'Save Changes' : 'Start Challenge'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
