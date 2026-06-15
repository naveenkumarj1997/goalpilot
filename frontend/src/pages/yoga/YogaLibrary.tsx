import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Search, Filter, Star } from 'lucide-react';
import { getLessons, getProfile, toggleFavorite } from '../../api/yoga';

export default function YogaLibrary() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialFilter = searchParams.get('filter'); // e.g. 'favorites'
  
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(initialFilter === 'favorites');

  const fetchData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (!token) return;

      const [lessonsData, profileData] = await Promise.all([
        getLessons({}, token),
        getProfile(token)
      ]);
      
      setLessons(lessonsData);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch library', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = lessons;

    if (showOnlyFavorites && profile) {
      const favoriteIds = profile.favorites.map((f: any) => f._id || f);
      result = result.filter(lesson => favoriteIds.includes(lesson._id));
    }

    if (searchTerm) {
      result = result.filter(lesson => 
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== 'All') {
      result = result.filter(lesson => lesson.difficulty === difficultyFilter);
    }

    if (categoryFilter !== 'All') {
      result = result.filter(lesson => lesson.category === categoryFilter);
    }

    setFilteredLessons(result);
  }, [lessons, profile, searchTerm, difficultyFilter, categoryFilter, showOnlyFavorites]);

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // prevent navigation
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (token) {
        const updatedProfile = await toggleFavorite(id, token);
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', 'Morning Yoga', 'Evening Yoga', 'Flexibility', 'Back Pain Relief', 'Relaxation', 'Stress Relief', 'Balance', 'Mobility', 'Full Body Yoga', 'Meditation'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Yoga Library</h1>
          <p className="text-text-secondary mt-1">Explore guided sessions and flows.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search lessons..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500"
          >
            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 hidden sm:block"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button 
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`px-4 py-3 border rounded-lg transition-colors flex items-center ${
              showOnlyFavorites ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Star className={`w-5 h-5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson, index) => {
          const isFavorite = profile?.favorites?.some((f: any) => (f._id || f) === lesson._id);
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={lesson._id}
              className="group glass rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-slate-900"
            >
              <Link to={`/yoga/lesson/${lesson._id}`}>
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={`https://img.youtube.com/vi/${lesson.videoId}/0.jpg`}
                    alt={lesson.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur rounded text-xs font-bold text-white flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {lesson.durationMinutes}:00
                  </div>
                  <button 
                    onClick={(e) => handleToggleFavorite(e, lesson._id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur transition-colors"
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-400 fill-current' : 'text-white'}`} />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">
                      {lesson.difficulty}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {lesson.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {lesson.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
          <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No lessons found</h3>
          <p className="text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
