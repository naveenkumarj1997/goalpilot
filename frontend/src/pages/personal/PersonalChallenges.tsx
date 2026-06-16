import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, Shield, User, Heart, Brain, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logPersonalActivity, getPersonalProfile } from '../../api/personal';

export default function PersonalChallenges() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;
      const data = await getPersonalProfile(user.token);
      if (data) {
        setCompleted(data.completedChallenges || []);
      }
    };
    fetchProfile();
  }, [user]);

  const challenges = [
    { id: 'chal_1', title: 'Maintain Good Posture', category: 'Body Language', icon: User, desc: 'Keep your back straight and shoulders back for the entire day.' },
    { id: 'chal_2', title: 'Initiate a Conversation', category: 'Confidence', icon: Shield, desc: 'Talk to a stranger or someone you rarely speak to today.' },
    { id: 'chal_3', title: 'Hold Eye Contact', category: 'Communication', icon: Zap, desc: 'Hold eye contact slightly longer than usual in all your interactions today.' },
    { id: 'chal_4', title: 'Give a Genuine Compliment', category: 'Social Skills', icon: Heart, desc: 'Make someone\'s day by complimenting something specific about them.' },
    { id: 'chal_5', title: 'Read 20 Minutes', category: 'Mindset', icon: Brain, desc: 'Read a non-fiction or self-improvement book for 20 uninterrupted minutes.' }
  ];

  const handleComplete = async (challenge: any) => {
    if (completed.includes(challenge.id) || !user?.token) return;
    
    try {
      await logPersonalActivity({
        type: 'Challenge',
        itemId: challenge.id,
        title: challenge.title,
        category: challenge.category,
        xpReward: 20 // Challenges give more XP
      }, user.token);
      setCompleted([...completed, challenge.id]);
    } catch (err) {
      console.error('Failed to log challenge', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <Trophy className="h-12 w-12 text-orange-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Daily Challenges</h1>
        <p className="text-white/60">Put your knowledge into action. Complete these tasks to build habits.</p>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, idx) => (
          <motion.div 
            key={challenge.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass rounded-2xl p-6 border transition-all flex items-center gap-6 ${
              completed.includes(challenge.id) 
                ? 'border-emerald-500/30 bg-emerald-500/5' 
                : 'border-white/10 hover:border-orange-500/30'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
              completed.includes(challenge.id) ? 'bg-emerald-500/20' : 'bg-orange-500/20'
            }`}>
              <challenge.icon className={`h-8 w-8 ${completed.includes(challenge.id) ? 'text-emerald-400' : 'text-orange-400'}`} />
            </div>
            
            <div className="flex-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2 inline-block ${
                completed.includes(challenge.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'
              }`}>
                {challenge.category}
              </span>
              <h3 className="text-xl font-bold text-white mb-1">{challenge.title}</h3>
              <p className="text-white/60 text-sm">{challenge.desc}</p>
            </div>

            <div className="shrink-0">
              <button 
                onClick={() => handleComplete(challenge)}
                disabled={completed.includes(challenge.id)}
                className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  completed.includes(challenge.id) 
                    ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                }`}
              >
                {completed.includes(challenge.id) ? (
                  <><CheckCircle2 className="h-5 w-5" /> Done</>
                ) : 'Complete (+20 XP)'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
