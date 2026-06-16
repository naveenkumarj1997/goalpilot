import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shirt, CheckCircle2, Briefcase, Palmtree, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logPersonalActivity } from '../../api/personal';

export default function StyleDressing() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);

  const lessons = [
    { id: 'style_1', title: 'Color Matching Basics', icon: Shirt, desc: 'Stick to neutral base colors (black, white, navy, grey) and add one pop of color.' },
    { id: 'style_2', title: 'The Perfect Fit', icon: User, desc: 'Fit is king. A cheap well-fitting shirt looks better than an expensive baggy one.' },
    { id: 'style_3', title: 'Smart Casual', icon: Briefcase, desc: 'Blend professional and relaxed. Think chinos, a clean t-shirt, and a blazer.' },
    { id: 'style_4', title: 'Everyday Casual', icon: Palmtree, desc: 'Clean sneakers, well-fitted jeans, and a solid color t-shirt. Simple but effective.' }
  ];

  const handleComplete = async (lesson: any) => {
    if (completed.includes(lesson.id) || !user?.token) return;
    
    try {
      await logPersonalActivity({
        type: 'Lesson',
        itemId: lesson.id,
        title: lesson.title,
        category: 'Style & Dressing'
      }, user.token);
      setCompleted([...completed, lesson.id]);
    } catch (err) {
      console.error('Failed to log lesson', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <Shirt className="h-12 w-12 text-rose-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Style & Dressing</h1>
        <p className="text-white/60">Dress for the person you want to become.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, idx) => (
          <motion.div 
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10 hover:border-rose-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <lesson.icon className="h-6 w-6 text-rose-400" />
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
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
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
