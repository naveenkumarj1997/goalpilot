import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, Mic, UserPlus, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logPersonalActivity } from '../../api/personal';

export default function Confidence() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);

  const lessons = [
    { id: 'conf_1', title: 'The Alter Ego Effect', icon: Star, desc: 'Create a confident persona for high-pressure situations. Step into it when needed.' },
    { id: 'conf_2', title: 'Public Speaking Basics', icon: Mic, desc: 'Speak slowly. Embrace pauses. Remember that the audience wants you to succeed.' },
    { id: 'conf_3', title: 'Overcoming Rejection', icon: Shield, desc: 'Rejection is redirection. The more you get rejected, the less you fear it.' },
    { id: 'conf_4', title: 'The 3-Second Rule', icon: UserPlus, desc: 'See someone you want to talk to? Move within 3 seconds before your brain creates excuses.' }
  ];

  const handleComplete = async (lesson: any) => {
    if (completed.includes(lesson.id) || !user?.token) return;
    
    try {
      await logPersonalActivity({
        type: 'Lesson',
        itemId: lesson.id,
        title: lesson.title,
        category: 'Confidence'
      }, user.token);
      setCompleted([...completed, lesson.id]);
    } catch (err) {
      console.error('Failed to log lesson', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Confidence Training</h1>
        <p className="text-white/60">Confidence is a skill, not a trait. Build it like a muscle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, idx) => (
          <motion.div 
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <lesson.icon className="h-6 w-6 text-blue-400" />
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
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
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
