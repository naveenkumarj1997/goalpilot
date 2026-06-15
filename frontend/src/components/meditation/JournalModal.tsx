import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Frown, Meh, Smile, Heart, Zap } from 'lucide-react';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { moodBefore: string; moodAfter: string; notes: string }) => void;
}

export default function JournalModal({ isOpen, onClose, onSave }: JournalModalProps) {
  const [moodBefore, setMoodBefore] = useState('');
  const [moodAfter, setMoodAfter] = useState('');
  const [notes, setNotes] = useState('');

  const moods = [
    { value: 'Stressed', icon: Frown, color: 'text-red-400' },
    { value: 'Anxious', icon: Zap, color: 'text-orange-400' },
    { value: 'Neutral', icon: Meh, color: 'text-gray-400' },
    { value: 'Calm', icon: Smile, color: 'text-blue-400' },
    { value: 'Happy', icon: Heart, color: 'text-pink-400' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass w-full max-w-md rounded-2xl border border-indigo-500/30 overflow-hidden relative"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Session Journal</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Mood Before */}
              <div>
                <label className="block text-sm text-indigo-200/70 mb-3">How did you feel before?</label>
                <div className="flex justify-between">
                  {moods.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.value}
                        onClick={() => setMoodBefore(m.value)}
                        className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                          moodBefore === m.value ? 'bg-indigo-500/20 scale-110' : 'hover:bg-white/5 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${m.color}`} />
                        <span className="text-[10px] text-white/70">{m.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mood After */}
              <div>
                <label className="block text-sm text-indigo-200/70 mb-3">How do you feel now?</label>
                <div className="flex justify-between">
                  {moods.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.value}
                        onClick={() => setMoodAfter(m.value)}
                        className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                          moodAfter === m.value ? 'bg-indigo-500/20 scale-110' : 'hover:bg-white/5 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${m.color}`} />
                        <span className="text-[10px] text-white/70">{m.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-indigo-200/70 mb-2">Any thoughts? (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="My mind was racing but I eventually settled..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 resize-none h-24"
                />
              </div>

              <button
                onClick={() => onSave({ moodBefore, moodAfter, notes })}
                disabled={!moodBefore || !moodAfter}
                className="w-full bg-indigo-500 text-white font-medium py-3 rounded-xl hover:bg-indigo-400 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              >
                Save Entry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
