import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Filter, Star, Wind } from 'lucide-react';
import { getLessons, getProfile, toggleFavorite } from '../../api/meditation';
import { useAuth } from '../../context/AuthContext';

export default function MeditationLibrary() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');

  const categories = ['All', 'Morning Meditation', 'Sleep Meditation', 'Focus Meditation', 'Stress Relief', 'Breathing', 'Mindfulness', 'Gratitude'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchData();
  }, [user, activeCategory, activeDifficulty]);

  const fetchData = async () => {
    try {
      if (!user?.token) return;
      setLoading(true);
      const [lessonsData, profileData] = await Promise.all([
        getLessons({ category: activeCategory, difficulty: activeDifficulty }, user.token),
        getProfile(user.token)
      ]);
      setLessons(lessonsData);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch library', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!user?.token) return;
    try {
      const updatedProfile = await toggleFavorite(id, user.token);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  const isFavorite = (id: string) => {
    return profile?.favorites?.some((fav: any) => 
      typeof fav === 'string' ? fav === id : fav._id === id
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meditation Library</h1>
          <p className="text-white/60">Find the perfect session for your current state of mind.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4">
        <div className="flex-1 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <Filter className="h-4 w-4 text-white/50" />
          <select
            value={activeDifficulty}
            onChange={(e) => setActiveDifficulty(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none [&>option]:bg-gray-900"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff} Level</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-10 text-white/50">Loading library...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, idx) => (
            <motion.div
              key={lesson._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link 
                to={`/meditation/session/${lesson._id}`}
                className="group glass block rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={`https://img.youtube.com/vi/${lesson.videoId}/hqdefault.jpg`}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Favorite Button */}
                  <button 
                    onClick={(e) => handleToggleFavorite(e, lesson._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors z-10"
                  >
                    <Star className={`h-4 w-4 ${isFavorite(lesson._id) ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
                  </button>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs text-white font-medium flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.durationMinutes} min
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-2 py-1 bg-indigo-500/10 rounded-md">
                      {lesson.category}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {lesson.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-white/60 line-clamp-2">
                    {lesson.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}

          {lessons.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Wind className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No sessions found</h3>
              <p className="text-white/50">Try adjusting your filters to find more guided meditations.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
