import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Repeat, Tag, AlignLeft, Bookmark } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
  defaultDate?: string;
  initialData?: any;
}

export default function CreateTaskModal({ isOpen, onClose, onSubmit, defaultDate, initialData }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [badge, setBadge] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<'none' | 'daily' | 'weekly' | 'custom'>('none');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setDate(initialData.date || defaultDate || new Date().toISOString().split('T')[0]);
        setTime(initialData.time || '');
        setEndTime(initialData.endTime || '');
        setBadge(initialData.badge || '');
        if (initialData.recurrence) {
          setRecurrenceType(initialData.recurrence.type || 'none');
          setDaysOfWeek(initialData.recurrence.daysOfWeek || []);
        } else {
          setRecurrenceType('none');
          setDaysOfWeek([]);
        }
      } else {
        setTitle('');
        setDescription('');
        setDate(defaultDate || new Date().toISOString().split('T')[0]);
        setTime('');
        setEndTime('');
        setBadge('');
        setRecurrenceType('none');
        setDaysOfWeek([]);
      }
    }
  }, [isOpen, initialData, defaultDate]);

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      date,
      time: time || undefined,
      endTime: endTime || undefined,
      badge: badge || undefined,
      priority: 'None',
      recurrence: {
        type: recurrenceType,
        daysOfWeek: recurrenceType === 'custom' || recurrenceType === 'weekly' ? daysOfWeek : []
      }
    });

    setTitle('');
    setDescription('');
    setTime('');
    setEndTime('');
    setBadge('');
    setRecurrenceType('none');
    setDaysOfWeek([]);
    onClose();
  };

  const toggleDay = (dayIndex: number) => {
    if (daysOfWeek.includes(dayIndex)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== dayIndex));
    } else {
      setDaysOfWeek([...daysOfWeek, dayIndex]);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (!endTime && newTime) {
      const [h, m] = newTime.split(':');
      const nextH = (parseInt(h) + 1) % 24;
      setEndTime(`${nextH.toString().padStart(2, '0')}:${m}`);
    }
  };

  const badges = [
    { name: 'Work', color: 'bg-blue-500/20 text-blue-400 border-blue-500' },
    { name: 'Travel', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500' },
    { name: 'Meetings', color: 'bg-orange-500/20 text-orange-400 border-orange-500' },
    { name: 'Free Time', color: 'bg-teal-500/20 text-teal-400 border-teal-500' },
    { name: 'Learning', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500' },
    { name: 'Health', color: 'bg-green-500/20 text-green-400 border-green-500' },
    { name: 'Career', color: 'bg-purple-500/20 text-purple-400 border-purple-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="w-full sm:max-w-lg bg-slate-900 border border-slate-700/80 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h2 className="text-lg font-bold text-white">{initialData ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden max-h-[80vh]">
              <div className="flex flex-col p-4 overflow-y-auto custom-scrollbar flex-1">
                <input
                autoFocus
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-xl font-medium text-white placeholder-slate-500 outline-none mb-6"
              />

              <div className="flex items-center gap-3 mb-4 text-slate-400 text-sm border border-slate-700/50 rounded-lg p-2.5 bg-slate-800/30">
                <AlignLeft className="w-4 h-4" />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="flex items-center gap-2 border border-slate-700/50 rounded-lg p-2.5 bg-slate-800/30">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-slate-200 text-sm outline-none custom-time-input"
                  />
                </div>
                <div className="flex items-center gap-2 border border-slate-700/50 rounded-lg p-2.5 bg-slate-800/30">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                    className="w-full bg-transparent text-slate-200 text-sm outline-none custom-time-input"
                  />
                </div>
                <div className="flex items-center gap-2 border border-slate-700/50 rounded-lg p-2.5 bg-slate-800/30">
                  <span className="text-slate-400 text-xs font-bold shrink-0">TO</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-transparent text-slate-200 text-sm outline-none custom-time-input"
                  />
                </div>
              </div>

              {/* Badge Selection */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                  <Bookmark className="w-4 h-4" /> Category Badge
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setBadge('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      !badge
                        ? 'bg-slate-600/50 border-slate-500 text-slate-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    None
                  </button>
                  {badges.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => setBadge(b.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        badge === b.name
                          ? b.color
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                  <Repeat className="w-4 h-4" /> Repeat
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['none', 'daily', 'weekly', 'custom'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setRecurrenceType(type as any);
                        if (type === 'weekly') {
                          // Default to the current day of the week
                          const d = new Date(date);
                          setDaysOfWeek([d.getUTCDay()]);
                        } else if (type !== 'custom') {
                          setDaysOfWeek([]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${
                        recurrenceType === type
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {recurrenceType === 'custom' && (
                  <div className="flex gap-1 mt-2">
                    {weekDays.map((day, index) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                          daysOfWeek.includes(index)
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              </div>

              <div className="p-4 border-t border-slate-700/50 shrink-0 bg-slate-900">
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-opacity"
                >
                  {initialData ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
