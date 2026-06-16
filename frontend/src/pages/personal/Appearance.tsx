import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Droplets, Moon, Scissors } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logPersonalActivity } from '../../api/personal';

export default function Appearance() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);

  const lessons = [
    { id: 'app_1', title: 'Basic Skincare Routine', icon: Droplets, desc: 'Cleanse, Moisturize, Sunscreen (Morning & Night).' },
    { id: 'app_2', title: 'Hair & Beard Care', icon: Scissors, desc: 'Find a haircut that suits your face shape. Keep facial hair trimmed and lined up.' },
    { id: 'app_3', title: 'Oral Hygiene', icon: Sparkles, desc: 'Brush twice, floss daily, use mouthwash, and keep your lips moisturized.' },
    { id: 'app_4', title: 'Sleep & Hydration', icon: Moon, desc: '7-8 hours of sleep and 3 liters of water daily to prevent dark circles and dull skin.' }
  ];

  const handleComplete = async (lesson: any) => {
    if (completed.includes(lesson.id) || !user?.token) return;
    
    try {
      await logPersonalActivity({
        type: 'Lesson',
        itemId: lesson.id,
        title: lesson.title,
        category: 'Appearance'
      }, user.token);
      setCompleted([...completed, lesson.id]);
    } catch (err) {
      console.error('Failed to log lesson', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <Sparkles className="h-12 w-12 text-amber-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Appearance & Grooming</h1>
        <p className="text-white/60">Your appearance is the first thing people notice. Make it count.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, idx) => (
          <motion.div 
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <lesson.icon className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{lesson.title}</h3>
                <p className="text-white/60 text-sm mb-6">{lesson.desc}</p>
                <button 
                  onClick={() => handleComplete(lesson)}
                  disabled={completed.includes(lesson.id)}
                  className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                    completed.includes(lesson.id) 
                      ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  }`}
                >
                  {completed.includes(lesson.id) ? (
                    <><CheckCircle2 className="h-5 w-5" /> Completed</>
                  ) : 'Complete Lesson (+10 XP)'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
