import { useState, useEffect } from 'react';

import { Award, Zap, Activity, Flame } from 'lucide-react';
import { getProfile, getSessionLogs } from '../../api/yoga';
import AchievementBadges from '../../components/yoga/AchievementBadges';

export default function YogaProgress() {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : null;
        if (!token) return;

        const [profileData, logsData] = await Promise.all([
          getProfile(token),
          getSessionLogs(token)
        ]);

        setProfile(profileData);
        setLogs(logsData);
      } catch (error) {
        console.error('Failed to fetch progress', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Your Progress</h1>
        <p className="text-text-secondary mt-1">Track your wellness journey and celebrate milestones.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-3xl font-bold text-white mb-1">{profile?.experienceLevel || 'Beginner'}</span>
          <span className="text-sm text-slate-400">Current Level</span>
        </div>

        <div className="glass p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-3xl font-bold text-white mb-1">{profile?.sessionsCompleted || 0}</span>
          <span className="text-sm text-slate-400">Sessions Completed</span>
        </div>

        <div className="glass p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-3xl font-bold text-white mb-1">{profile?.totalMinutesPracticed || 0}</span>
          <span className="text-sm text-slate-400">Minutes Practiced</span>
        </div>

        <div className="glass p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <span className="text-3xl font-bold text-white mb-1">{profile?.currentStreak || 0}</span>
          <span className="text-sm text-slate-400">Day Streak</span>
        </div>
      </div>

      {/* Badges / Achievements */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
        <AchievementBadges profile={profile} />
      </div>

      {/* History */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          History Log
        </h2>
        
        {logs.length > 0 ? (
          <div className="glass rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="divide-y divide-slate-800">
              {logs.map((log) => (
                <div key={log._id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                  <div>
                    <h4 className="font-bold text-white text-lg">{log.lesson?.title || 'Unknown Session'}</h4>
                    <p className="text-sm text-slate-400 mt-1 flex items-center">
                      <span className="capitalize">{log.lesson?.category}</span>
                      <span className="mx-2">•</span>
                      {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 font-bold rounded-lg border border-emerald-500/20">
                      {log.durationMinutes} mins
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-2xl border border-slate-800 bg-slate-900/30">
            <p className="text-slate-400">No sessions completed yet. Start your first lesson today!</p>
          </div>
        )}
      </div>

    </div>
  );
}
