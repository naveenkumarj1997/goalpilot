import AvatarLoader from '../../components/ui/AvatarLoader';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Flame, Clock, Award, Star, Library, Activity } from 'lucide-react';
import { getProfile, updateExperienceLevel, getLessons } from '../../api/yoga';
import YogaExperienceModal from '../../components/yoga/YogaExperienceModal';

export default function YogaDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [recommendedLesson, setRecommendedLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (!token) return;

      const profileData = await getProfile(token);
      setProfile(profileData);

      if (!profileData.experienceLevel || profileData.experienceLevel === 'Beginner' && profileData.sessionsCompleted === 0) {
        // We can show the modal if they haven't explicitly set it or have 0 sessions
        // For simplicity, let's just trigger if sessions == 0 to be safe on first visit
        if (profileData.sessionsCompleted === 0 && !localStorage.getItem('yoga_experience_set')) {
          setShowExperienceModal(true);
        }
      }

      // Fetch a recommended lesson based on their level
      const level = profileData.experienceLevel || 'Beginner';
      const lessons = await getLessons({ difficulty: level }, token);
      
      if (lessons.length > 0) {
        // Pick a random lesson or the first one
        setRecommendedLesson(lessons[Math.floor(Math.random() * lessons.length)]);
      }

    } catch (error) {
      console.error('Failed to fetch yoga data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLevelSelect = async (level: string) => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (token) {
        const updatedProfile = await updateExperienceLevel(level, token);
        setProfile(updatedProfile);
        localStorage.setItem('yoga_experience_set', 'true');
        setShowExperienceModal(false);
        
        // Refresh recommended lesson
        const lessons = await getLessons({ difficulty: level }, token);
        if (lessons.length > 0) {
          setRecommendedLesson(lessons[0]);
        }
      }
    } catch (err) {
      console.error('Failed to update level', err);
    }
  };

  if (loading) {
    return <AvatarLoader />;
  }

  return (
    <div className="space-y-8 pb-10">
      <YogaExperienceModal 
        isOpen={showExperienceModal} 
        onSelect={handleLevelSelect} 
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Yoga Coach</h1>
          <p className="text-text-secondary mt-1">Breathe, stretch, and find your center.</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/yoga" className="glass p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 transition-colors flex items-center justify-center text-emerald-400 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Activity className="h-5 w-5 mr-2" /> Dashboard
        </Link>
        <Link to="/yoga/library" className="glass p-4 rounded-xl border border-emerald-100/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-colors flex items-center justify-center text-text-primary">
          <Library className="h-5 w-5 mr-2 text-emerald-500" /> Library
        </Link>
        <Link to="/yoga/progress" className="glass p-4 rounded-xl border border-emerald-100/20 hover:border-purple-400/50 hover:bg-purple-400/10 transition-colors flex items-center justify-center text-text-primary">
          <Award className="h-5 w-5 mr-2 text-purple-500" /> Progress
        </Link>
        <Link to="/yoga/library?filter=favorites" className="glass p-4 rounded-xl border border-emerald-100/20 hover:border-amber-400/50 hover:bg-amber-400/10 transition-colors flex items-center justify-center text-text-primary">
          <Star className="h-5 w-5 mr-2 text-amber-500" /> Favorites
        </Link>
      </div>

      {/* Recommended Lesson Hero */}
      {recommendedLesson && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl overflow-hidden border border-emerald-500/30 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent z-10" />
          <img 
            src={`https://img.youtube.com/vi/${recommendedLesson.videoId}/0.jpg`}
            alt={recommendedLesson.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="max-w-xl">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-full mb-4 inline-block backdrop-blur-md border border-emerald-500/30">
                Daily Recommendation
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {recommendedLesson.title}
              </h2>
              <div className="flex items-center space-x-6 text-slate-300 mb-8">
                <span className="flex items-center"><Clock className="w-5 h-5 mr-2 text-emerald-400" /> {recommendedLesson.durationMinutes} Min</span>
                <span className="flex items-center"><Activity className="w-5 h-5 mr-2 text-emerald-400" /> {recommendedLesson.difficulty}</span>
                <span className="flex items-center"><Flame className="w-5 h-5 mr-2 text-emerald-400" /> {recommendedLesson.category}</span>
              </div>
              <Link 
                to={`/yoga/lesson/${recommendedLesson._id}`}
                className="inline-flex items-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Start Session
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Current Streak</h3>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-4xl font-bold text-white">{profile?.currentStreak || 0} <span className="text-lg text-slate-500 font-normal">days</span></p>
        </div>
        <div className="glass p-6 rounded-2xl border border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Sessions Completed</h3>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-4xl font-bold text-white">{profile?.sessionsCompleted || 0}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Time Practiced</h3>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-4xl font-bold text-white">{profile?.totalMinutesPracticed || 0} <span className="text-lg text-slate-500 font-normal">mins</span></p>
        </div>
      </div>
    </div>
  );
}
