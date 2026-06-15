import { motion } from 'framer-motion';
import { Star, Zap, Flame, Crown, Heart, Shield } from 'lucide-react';

interface AchievementBadgesProps {
  profile: any;
}

export default function AchievementBadges({ profile }: AchievementBadgesProps) {
  const sessions = profile?.sessionsCompleted || 0;

  const longestStreak = profile?.longestStreak || 0;
  const minutes = profile?.totalMinutesPracticed || 0;

  const badges = [
    {
      id: 'first_session',
      name: 'First Step',
      description: 'Complete your first yoga session',
      icon: Star,
      unlocked: sessions >= 1,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30'
    },
    {
      id: 'streak_7',
      name: 'Consistent Flow',
      description: 'Reach a 7-day streak',
      icon: Flame,
      unlocked: longestStreak >= 7,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
      border: 'border-orange-400/30'
    },
    {
      id: 'streak_30',
      name: 'Dedicated Yogi',
      description: 'Reach a 30-day streak',
      icon: Crown,
      unlocked: longestStreak >= 30,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/30'
    },
    {
      id: 'sessions_10',
      name: 'Finding Balance',
      description: 'Complete 10 sessions',
      icon: Heart,
      unlocked: sessions >= 10,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
      border: 'border-pink-400/30'
    },
    {
      id: 'sessions_50',
      name: 'Inner Peace',
      description: 'Complete 50 sessions',
      icon: Zap,
      unlocked: sessions >= 50,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30'
    },
    {
      id: 'minutes_1000',
      name: 'Zen Master',
      description: 'Practice for 1000 total minutes',
      icon: Shield,
      unlocked: minutes >= 1000,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl border ${badge.unlocked ? `glass ${badge.bg} ${badge.border}` : 'bg-slate-900 border-slate-800 opacity-60'} flex flex-col items-center text-center transition-all`}
          >
            <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${badge.unlocked ? badge.bg : 'bg-slate-800'}`}>
              <Icon className={`w-6 h-6 ${badge.unlocked ? badge.color : 'text-slate-600'}`} />
            </div>
            <h4 className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>
              {badge.name}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              {badge.description}
            </p>
            {!badge.unlocked && (
              <div className="mt-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Locked</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
