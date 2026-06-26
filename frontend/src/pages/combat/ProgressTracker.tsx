import React, { useEffect, useState } from 'react';
import { Activity, Flame, Trophy, Clock, ChevronRight } from 'lucide-react';
import { getProfile } from '../../api/combat';
import type { CombatProfileData } from '../../api/combat';
import { Link } from 'react-router-dom';

const ProgressTracker = () => {
  const [profile, setProfile] = useState<CombatProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-slide-up-fade">
      <div className="text-center mb-12">
        <Activity className="w-16 h-16 text-brand mx-auto mb-4 animate-ps-glow" />
        <h1 className="text-4xl font-bold text-white neon-text-brand mb-2">Progress Tracker</h1>
        <p className="text-slate-400">Track your training volume, streaks, and combat metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-3xl border border-emerald-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/20 rounded-full blur-xl -mr-8 -mt-8"></div>
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <div className="text-4xl font-bold text-white mb-1">{profile?.currentStreak || 0}</div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Day Streak</div>
          <div className="text-xs text-orange-400 mt-2">Best: {profile?.longestStreak || 0}</div>
        </div>
        
        <div className="glass p-6 rounded-3xl border border-emerald-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand/20 rounded-full blur-xl -mr-8 -mt-8"></div>
          <Clock className="w-8 h-8 text-brand mx-auto mb-3" />
          <div className="text-4xl font-bold text-white mb-1">{(profile?.trainingHours || 0).toFixed(1)}</div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Total Hours</div>
        </div>

        <div className="glass p-6 rounded-3xl border border-emerald-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl -mr-8 -mt-8"></div>
          <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-4xl font-bold text-white mb-1">{profile?.roundsCompleted || 0}</div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Rounds Fought</div>
        </div>

        <div className="glass p-6 rounded-3xl border border-emerald-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/20 rounded-full blur-xl -mr-8 -mt-8"></div>
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-4xl font-bold text-white mb-1">{profile?.workoutsCompleted || 0}</div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Workouts</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-emerald-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Combat Profile</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-emerald-500/10">
              <span className="text-slate-400">Experience Level</span>
              <span className="text-white font-bold">{profile?.experienceLevel || 'Not Set'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-emerald-500/10">
              <span className="text-slate-400">Weight</span>
              <span className="text-white font-bold">{profile?.weight ? `${profile.weight} kg` : 'Not Set'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-emerald-500/10">
              <span className="text-slate-400">Height</span>
              <span className="text-white font-bold">{profile?.height ? `${profile.height} cm` : 'Not Set'}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-400">Goals</span>
              <span className="text-white font-bold text-right">
                {profile?.goals?.join(', ') || 'Not Set'}
              </span>
            </div>
          </div>
          <Link to="/combat/onboarding" className="mt-8 block text-center w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
            Update Profile
          </Link>
        </div>

        <div className="glass p-8 rounded-3xl border border-emerald-500/20 flex flex-col justify-center items-center text-center">
           <Trophy className="w-20 h-20 text-yellow-500/50 mb-6" />
           <h3 className="text-2xl font-bold text-white mb-2">Achievements Coming Soon</h3>
           <p className="text-slate-400">
             Keep training! Soon you will be able to unlock badges for milestones like 100 rounds, 5 hours trained, and consistent streaks.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
