import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, CheckCircle2, Users, Handshake, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logPersonalActivity } from '../../api/personal';

export default function SocialSkills() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);

  const lessons = [
    { id: 'soc_1', title: 'Remembering Names', icon: Users, desc: 'Repeat their name immediately, use it in conversation, and associate it with a visual cue.' },
    { id: 'soc_2', title: 'Effective Networking', icon: Handshake, desc: 'Focus on what you can give, not just what you can take. Build genuine connections.' },
    { id: 'soc_3', title: 'The Art of Empathy', icon: Heart, desc: 'Put yourself in their shoes. Validate their feelings before offering solutions.' },
    { id: 'soc_4', title: 'Expanding Your Circle', icon: Globe, desc: 'Join clubs, attend workshops, and say "yes" to invitations outside your comfort zone.' }
  ];

  const handleComplete = async (lesson: any) => {
    if (completed.includes(lesson.id) || !user?.token) return;
    
    try {
      await logPersonalActivity({
        type: 'Lesson',
        itemId: lesson.id,
        title: lesson.title,
        category: 'Social Skills'
      }, user.token);
      setCompleted([...completed, lesson.id]);
    } catch (err) {
      console.error('Failed to log lesson', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <Heart className="h-12 w-12 text-pink-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Social Skills</h1>
        <p className="text-white/60">Your network is your net worth. Build meaningful relationships.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, idx) => (
          <motion.div 
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0">
                <lesson.icon className="h-6 w-6 text-pink-400" />
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
                      : 'bg-pink-500 hover:bg-pink-600 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)]'
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
