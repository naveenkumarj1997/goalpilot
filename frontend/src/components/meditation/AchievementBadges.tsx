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
      id: 'first-session',
      title: 'First Step',
      desc: 'Complete 1 session',
      icon: Star,
      unlocked: sessions >= 1,
      color: 'from-amber-400 to-yellow-600'
    },
    {
      id: 'streak-7',
      title: 'Consistency',
      desc: '7 Day Streak',
      icon: Flame,
      unlocked: longestStreak >= 7,
      color: 'from-orange-400 to-red-600'
    },
    {
      id: 'streak-30',
      title: 'Dedication',
      desc: '30 Day Streak',
      icon: Zap,
      unlocked: longestStreak >= 30,
      color: 'from-blue-400 to-indigo-600'
    },
    {
      id: 'sessions-100',
      title: 'Centurion',
      desc: '100 Sessions',
      icon: Crown,
      unlocked: sessions >= 100,
      color: 'from-purple-400 to-purple-700'
    },
    {
      id: 'minutes-1000',
      title: 'Deep Mind',
      desc: '1000 Minutes',
      icon: Heart,
      unlocked: minutes >= 1000,
      color: 'from-pink-400 to-rose-600'
    },
    {
      id: 'advanced',
      title: 'Zen Master',
      desc: 'Reach Advanced Level',
      icon: Shield,
      unlocked: profile?.experienceLevel === 'Advanced',
      color: 'from-emerald-400 to-green-600'
    }
  ];

  return (
    <div className="glass rounded-2xl border border-white/5 p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-6">Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div 
              key={badge.id}
              className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                badge.unlocked 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-black/20 border-white/5 opacity-50 grayscale'
              }`}
            >
              <div className={`h-12 w-12 rounded-full mb-3 flex items-center justify-center bg-gradient-to-br ${badge.unlocked ? badge.color : 'from-gray-600 to-gray-800'}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{badge.title}</h3>
              <p className="text-[10px] text-white/50 leading-tight">{badge.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
