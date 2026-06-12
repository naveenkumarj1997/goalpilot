import { useState, useEffect } from 'react';
import { workoutApi } from '../../api/workoutApi';
import { Search, Dumbbell, Activity, Filter, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => {
    workoutApi.getExercises()
      .then(res => setExercises(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(exercises.map(e => e.category)))];

  const filtered = exercises.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.targetMuscles.join(' ').toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'All' || e.category === filterCat;
    return matchesSearch && matchesCat;
  });

  if (loading) return <div className="p-8 text-center text-white">Loading library...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Exercise Library</h1>
          <p className="text-slate-400">Browse {exercises.length} home workouts.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search exercises..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-brand"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select 
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-white focus:ring-2 focus:ring-brand"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((ex, i) => (
          <motion.div 
            key={ex._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.5) }}
            className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:bg-slate-800 transition-all flex flex-col"
          >
            <div className="aspect-video bg-slate-800 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden group">
              <Dumbbell className="w-12 h-12 text-slate-600 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12 text-white drop-shadow-md" />
              </div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white leading-tight">{ex.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                ex.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                ex.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>{ex.difficulty}</span>
            </div>

            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{ex.description}</p>

            <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-800 rounded text-xs font-medium text-slate-300 flex items-center"><Activity className="w-3 h-3 mr-1" /> {ex.equipment}</span>
              {ex.targetMuscles.map((m: string) => (
                <span key={m} className="px-2 py-1 bg-brand/10 text-brand rounded text-xs font-medium">{m}</span>
              ))}
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No exercises found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
