import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, Flame, BookOpen } from 'lucide-react';
import { getProfile, getSessionLogs } from '../../api/meditation';
import { useAuth } from '../../context/AuthContext';
import AchievementBadges from '../../components/meditation/AchievementBadges';

export default function MeditationProgress() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user?.token) return;
      const [profData, logsData] = await Promise.all([
        getProfile(user.token),
        getSessionLogs(user.token)
      ]);
      setProfile(profData);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to fetch progress data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-white py-20">Loading Progress...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Progress</h1>
        <p className="text-white/60">Track your journey to mindfulness and inner peace.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Streak', value: `${profile?.currentStreak || 0} Days`, icon: Flame, color: 'text-orange-400' },
          { label: 'Longest Streak', value: `${profile?.longestStreak || 0} Days`, icon: Target, color: 'text-amber-400' },
          { label: 'Total Sessions', value: profile?.sessionsCompleted || 0, icon: Calendar, color: 'text-indigo-400' },
          { label: 'Mindful Minutes', value: profile?.totalMinutesPracticed || 0, icon: Clock, color: 'text-emerald-400' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-2xl border border-white/5"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-3 rounded-xl bg-black/20 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </div>
            <div className="text-sm text-white/50">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Achievement Badges Component */}
      <AchievementBadges profile={profile} />

      {/* Journal History */}
      <div className="glass rounded-2xl border border-white/5 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-400" />
          Recent Journal Entries
        </h2>

        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log._id} className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-indigo-500/30 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-white text-lg">
                    {log.lesson ? log.lesson.title : `${log.type} Session`}
                  </h3>
                  <div className="text-sm text-white/50 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(log.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <Clock className="h-3 w-3" />
                    {log.durationMinutes} min
                  </div>
                </div>
                {log.moodBefore && log.moodAfter && (
                  <div className="flex items-center gap-2 text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-white/60">{log.moodBefore}</span>
                    <span className="text-indigo-400">→</span>
                    <span className="text-white font-medium">{log.moodAfter}</span>
                  </div>
                )}
              </div>
              
              {log.notes && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg text-sm text-white/80 italic border-l-2 border-indigo-500">
                  "{log.notes}"
                </div>
              )}
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center py-10 text-white/50">
              No sessions logged yet. Complete your first meditation to start your journal!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
