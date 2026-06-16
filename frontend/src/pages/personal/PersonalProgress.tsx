import { useState, useEffect } from 'react';
import { Trophy, Shield, Star, Award, Target, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPersonalProfile, getPersonalLogs } from '../../api/personal';

export default function PersonalProgress() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;
        const [profData, logData] = await Promise.all([
          getPersonalProfile(user.token),
          getPersonalLogs(user.token)
        ]);
        setProfile(profData);
        setLogs(logData);
      } catch (err) {
        console.error('Failed to fetch progress data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="text-white text-center py-20">Loading Progress...</div>;
  if (!profile) return <div className="text-white text-center py-20">Profile not found.</div>;

  const ALL_BADGES = [
    { name: 'First Challenge', icon: Star, desc: 'Completed your first daily challenge', color: 'text-yellow-400' },
    { name: '7 Day Streak', icon: Zap, desc: 'Logged activity for 7 consecutive days', color: 'text-orange-400' },
    { name: '30 Day Transformation', icon: Trophy, desc: 'Completed 30 challenges and 10 lessons', color: 'text-indigo-400' },
    { name: 'Communication Master', icon: Target, desc: 'Completed all communication lessons', color: 'text-emerald-400' },
    { name: 'Confidence Builder', icon: Shield, desc: 'Completed 10 confidence challenges', color: 'text-blue-400' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Your Progress</h1>
        <p className="text-white/60">Track your personal transformation journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Achievements Section */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-400" />
            Achievements
          </h2>
          <div className="space-y-4">
            {ALL_BADGES.map((badge, idx) => {
              const isEarned = profile.badges.includes(badge.name);
              return (
                <div 
                  key={idx} 
                  className={`flex items-center gap-4 p-4 rounded-xl border ${isEarned ? 'border-indigo-500/30 bg-indigo-500/10' : 'border-white/5 bg-black/20 opacity-50'} transition-all`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isEarned ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                    <badge.icon className={`h-6 w-6 ${isEarned ? badge.color : 'text-white/30'}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${isEarned ? 'text-white' : 'text-white/50'}`}>{badge.name}</h3>
                    <p className="text-sm text-white/40">{badge.desc}</p>
                  </div>
                  {isEarned && (
                    <div className="ml-auto">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded font-bold uppercase tracking-wider">Earned</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="glass rounded-2xl p-6 border border-white/10 flex flex-col h-[600px]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-400" />
            Recent Activity
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-center text-white/40 py-10">No activity logged yet. Start completing lessons and challenges!</div>
            ) : (
              logs.map((log) => (
                <div key={log._id} className="p-4 rounded-xl border border-white/5 bg-black/20 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        log.type === 'Lesson' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-2">{log.category}</span>
                    </div>
                    <span className="text-xs text-white/40">{new Date(log.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-white font-medium">{log.title}</h3>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-bold">
                    <span>+{log.xpReward} XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
