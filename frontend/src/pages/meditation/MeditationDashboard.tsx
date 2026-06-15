import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Target, Play, Star, BookOpen, Clock, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile, getLessons } from '../../api/meditation';
import MeditationExperienceModal from '../../components/meditation/MeditationExperienceModal';

const QUOTES = [
  "Quiet the mind, and the soul will speak.",
  "Breath is the bridge which connects life to consciousness.",
  "Mindfulness isn't difficult, we just need to remember to do it.",
  "Peace comes from within. Do not seek it without.",
  "The present moment is the only time over which we have dominion."
];

export default function MeditationDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (!user?.token) return;
      const prof = await getProfile(user.token);
      setProfile(prof);

      if (!prof.experienceLevel || !prof.primaryGoal) {
        setShowOnboarding(true);
      }

      // Fetch recommended lessons based on goal
      let category = 'Mindfulness';
      if (prof.primaryGoal === 'Better Sleep') category = 'Sleep Meditation';
      if (prof.primaryGoal === 'Better Focus') category = 'Focus Meditation';
      if (prof.primaryGoal === 'Stress Relief' || prof.primaryGoal === 'Anxiety Management') category = 'Stress Relief';

      const lessons = await getLessons({ category }, user.token);
      setRecommendations(lessons.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOnboarding = async (data: any) => {
    try {
      if (!user?.token) return;
      await updateProfile(data, user.token);
      setShowOnboarding(false);
      fetchDashboardData(); // Refresh to get right recommendations
    } catch (error) {
      console.error('Failed to save onboarding', error);
    }
  };

  if (loading) return <div className="text-white text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Quote of the Day */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-indigo-500/30 text-center relative overflow-hidden"
      >
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full" />
        <Wind className="h-8 w-8 text-indigo-400 mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-light italic text-white/90 mb-2">"{quote}"</h2>
        <p className="text-indigo-300 text-sm tracking-widest uppercase">Quote of the Day</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Streak', value: `${profile?.currentStreak || 0} Days`, icon: Zap, color: 'text-yellow-400' },
          { label: 'Total Sessions', value: profile?.sessionsCompleted || 0, icon: Target, color: 'text-indigo-400' },
          { label: 'Mindful Minutes', value: profile?.totalMinutesPracticed || 0, icon: Clock, color: 'text-emerald-400' },
          { label: 'Level', value: profile?.experienceLevel || 'Beginner', icon: Star, color: 'text-purple-400' }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center group hover:border-indigo-500/30 transition-colors"
          >
            <stat.icon className={`h-6 w-6 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-white/50">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/meditation/library" className="group glass p-6 rounded-2xl border border-indigo-500/30 hover:bg-indigo-500/10 transition-all text-center">
          <BookOpen className="h-8 w-8 text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-white mb-1">Guided Meditations</h3>
          <p className="text-xs text-white/50">Explore library</p>
        </Link>
        <Link to="/meditation/breathing" className="group glass p-6 rounded-2xl border border-emerald-500/30 hover:bg-emerald-500/10 transition-all text-center">
          <Wind className="h-8 w-8 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-white mb-1">Breathing Exercises</h3>
          <p className="text-xs text-white/50">Box, 4-7-8, Deep</p>
        </Link>
        <Link to="/meditation/focus" className="group glass p-6 rounded-2xl border border-amber-500/30 hover:bg-amber-500/10 transition-all text-center">
          <Target className="h-8 w-8 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-white mb-1">Focus Timer</h3>
          <p className="text-xs text-white/50">Distraction-free mode</p>
        </Link>
      </div>

      {/* Daily Recommendations */}
      <div className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-indigo-400" />
            Recommended For You
          </h2>
          <Link to="/meditation/library" className="text-sm text-indigo-400 hover:text-indigo-300">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((lesson) => (
            <Link 
              key={lesson._id}
              to={`/meditation/session/${lesson._id}`}
              className="group glass rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all"
            >
              <div className="relative h-32 w-full overflow-hidden">
                <img 
                  src={`https://img.youtube.com/vi/${lesson.videoId}/hqdefault.jpg`}
                  alt={lesson.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <Play className="h-10 w-10 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-[10px] text-white font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lesson.durationMinutes} min
                </div>
              </div>
              <div className="p-4">
                <div className="text-[10px] font-bold text-indigo-400 mb-1 uppercase tracking-wider">{lesson.category}</div>
                <h3 className="text-white font-medium text-sm line-clamp-1 mb-1">{lesson.title}</h3>
                <div className="text-xs text-white/50">{lesson.difficulty}</div>
              </div>
            </Link>
          ))}
          {recommendations.length === 0 && (
            <div className="col-span-3 text-center py-8 text-white/50">
              No recommendations available yet. Explore the library!
            </div>
          )}
        </div>
      </div>

      <MeditationExperienceModal 
        isOpen={showOnboarding} 
        onSave={handleSaveOnboarding} 
      />
    </div>
  );
}
