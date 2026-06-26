import React, { useEffect, useState } from 'react';
import { Brain, Flame, Target, BookOpen, Clock, Zap, Award, ChevronRight } from 'lucide-react';
import { getBrainProfile } from '../../api/brain';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const BrainDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;
      try {
        const data = await getBrainProfile(user.token);
        if (!data) {
          navigate('/brain/onboarding');
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to load brain profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Brain className="w-12 h-12 text-blue-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 animate-slide-up-fade">
      
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-1 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
            <Brain className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-black text-white capitalize">{user?.name}'s Brain</h1>
          <p className="text-blue-400 font-medium">{profile.profession} • Level {Math.floor(profile.stats.xp / 100) + 1} Thinker</p>
          <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
            {profile.learningGoals.slice(0, 3).map((goal: string) => (
              <span key={goal} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                {goal}
              </span>
            ))}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="glass p-4 rounded-2xl border border-orange-500/20 text-center min-w-[100px]">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{profile.stats.currentStreak}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Day Streak</div>
          </div>
          <div className="glass p-4 rounded-2xl border border-blue-500/20 text-center min-w-[100px]">
            <Zap className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{profile.stats.xp}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Brain XP</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Core Training */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Today's Protocol</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/brain/flashcards" className="group glass p-6 rounded-3xl border border-indigo-500/20 hover:border-indigo-400/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all"></div>
              <BookOpen className="w-10 h-10 text-indigo-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Spaced Repetition</h3>
              <p className="text-sm text-slate-400 mb-4">Review 20 cards due today to strengthen neural pathways.</p>
              <div className="flex items-center text-indigo-400 font-medium text-sm">
                Start Review <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/brain/active-recall" className="group glass p-6 rounded-3xl border border-blue-500/20 hover:border-blue-400/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
              <Target className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Active Recall</h3>
              <p className="text-sm text-slate-400 mb-4">Force retrieval of complex topics without looking at notes.</p>
              <div className="flex items-center text-blue-400 font-medium text-sm">
                Test Knowledge <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {profile.interviewPreparation && (
              <Link to="/brain/interview" className="group glass p-6 rounded-3xl border border-emerald-500/20 hover:border-emerald-400/50 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                <Award className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Interview Trainer</h3>
                <p className="text-sm text-slate-400 mb-4">Mock technical interviews graded by programmatic keyword matching.</p>
                <div className="flex items-center text-emerald-400 font-medium text-sm">
                  Start Mock <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}

            <Link to="/brain/games" className="group glass p-6 rounded-3xl border border-purple-500/20 hover:border-purple-400/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
              <Zap className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Brain Games</h3>
              <p className="text-sm text-slate-400 mb-4">Improve working memory and sequence recall speed.</p>
              <div className="flex items-center text-purple-400 font-medium text-sm">
                Play Now <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column - Stats & Coach */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Analytics</h2>
          
          <div className="glass p-6 rounded-3xl border border-slate-700/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400">Recall Accuracy</span>
              <span className="text-emerald-400 font-bold">{profile.stats.recallAccuracy}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-emerald-500" style={{ width: `${profile.stats.recallAccuracy}%` }}></div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400">Cards Reviewed</span>
              <span className="text-white font-bold">{profile.stats.flashcardsReviewed}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Study Time</span>
              <span className="text-white font-bold">{Math.floor(profile.stats.studyTimeMinutes / 60)}h {profile.stats.studyTimeMinutes % 60}m</span>
            </div>
          </div>

          <Link to="/brain/coach" className="block glass p-6 rounded-3xl border border-blue-500/30 hover:border-blue-400 bg-gradient-to-br from-slate-900 to-blue-900/20 transition-all relative overflow-hidden group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                <Brain className="w-6 h-6 text-blue-400 group-hover:animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Memory Coach</h3>
                <p className="text-xs text-blue-300">Ask how to remember anything</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              "I'm struggling to remember the OSI model layers for my networking exam."
            </p>
            <div className="w-full py-2 bg-blue-600/20 text-blue-400 text-center rounded-lg text-sm font-medium group-hover:bg-blue-600/30 transition-colors">
              Chat with Coach
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default BrainDashboard;
