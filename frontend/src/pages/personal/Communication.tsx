import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2, Mic, Ear, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logPersonalActivity } from '../../api/personal';

export default function Communication() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);

  const lessons = [
    { id: 'comm_1', title: 'Active Listening', icon: Ear, desc: 'Listen to understand, not just to reply. Nod and give verbal affirmations.' },
    { id: 'comm_2', title: 'Vocal Tonality', icon: Mic, desc: 'Speak clearly from your diaphragm. Use downward inflection at the end of statements to sound authoritative.' },
    { id: 'comm_3', title: 'The Art of Small Talk', icon: MessageCircle, desc: 'Ask open-ended questions. Use the FORD technique: Family, Occupation, Recreation, Dreams.' },
    { id: 'comm_4', title: 'Handling Silence', icon: Users, desc: 'Don\'t rush to fill the void. Pauses show confidence and give weight to your words.' }
  ];

  const handleComplete = async (lesson: any) => {
    if (completed.includes(lesson.id) || !user?.token) return;
    
    try {
      await logPersonalActivity({
        type: 'Lesson',
        itemId: lesson.id,
        title: lesson.title,
        category: 'Communication'
      }, user.token);
      setCompleted([...completed, lesson.id]);
    } catch (err) {
      console.error('Failed to log lesson', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <MessageCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Communication Skills</h1>
        <p className="text-white/60">How you say it matters just as much as what you say.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, idx) => (
          <motion.div 
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <lesson.icon className="h-6 w-6 text-emerald-400" />
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
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
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
