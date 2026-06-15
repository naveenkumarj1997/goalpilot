import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLessons, getProfile } from '../../api/stoicism';

export default function LearnStoicism() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user?.token) return;
      const [lessonsData, profData] = await Promise.all([
        getLessons(user.token),
        getProfile(user.token)
      ]);
      setLessons(lessonsData);
      setProfile(profData);
    } catch (error) {
      console.error('Failed to fetch lessons', error);
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = (lessonId: string) => {
    return profile?.completedLessonIds?.includes(lessonId);
  };

  if (loading) return <div className="text-white text-center py-10">Loading path...</div>;

  // Calculate progress
  const completedCount = lessons.filter(l => isCompleted(l._id)).length;
  const progressPercent = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-4">
          The Beginner's Path
        </h1>
        <p className="text-blue-200/70 max-w-2xl mx-auto text-lg">
          Master the fundamental principles of Stoicism. Complete these 10 core lessons to build an unshakable mindset.
        </p>
      </div>

      <div className="glass p-6 rounded-2xl border border-blue-500/20 bg-[#0f172a]/60 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">Path Progress</span>
          <span className="text-amber-400 font-bold">{completedCount} / {lessons.length}</span>
        </div>
        <div className="w-full bg-[#1e293b] rounded-full h-3 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      <div className="space-y-4 relative">
        {/* Connecting Line */}
        <div className="absolute left-[27px] top-8 bottom-8 w-1 bg-gradient-to-b from-amber-500/50 to-blue-500/20 z-0 hidden md:block" />

        {lessons.map((lesson, idx) => {
          const completed = isCompleted(lesson._id);
          // Unlock the first lesson, or any lesson if the previous one is completed
          const isUnlocked = idx === 0 || isCompleted(lessons[idx - 1]?._id) || completed;

          return (
            <motion.div
              key={lesson._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative z-10 flex items-start gap-6"
            >
              <div className="hidden md:flex flex-col items-center mt-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#0f172a] shadow-xl ${
                  completed ? 'bg-amber-500 text-white' : 
                  isUnlocked ? 'bg-[#1e293b] text-blue-400 border-amber-500/30' : 
                  'bg-[#0f172a] text-gray-600 border-gray-800'
                }`}>
                  {completed ? <CheckCircle className="h-6 w-6" /> : 
                   isUnlocked ? <BookOpen className="h-6 w-6" /> : 
                   <Lock className="h-6 w-6" />}
                </div>
              </div>

              <div className={`flex-1 glass p-6 rounded-2xl border transition-all ${
                completed ? 'border-amber-500/30 bg-[#0f172a]/80' : 
                isUnlocked ? 'border-blue-500/30 bg-[#1e293b]/50 hover:bg-[#1e293b] hover:border-amber-500/50' : 
                'border-white/5 bg-black/20 opacity-60 grayscale'
              }`}>
                {isUnlocked ? (
                  <Link to={`/stoicism/lesson/${lesson._id}`} className="block">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-2 py-1 bg-amber-500/10 rounded">
                        Lesson {idx + 1} • {lesson.category}
                      </span>
                      {completed && <span className="text-xs text-amber-400 font-medium">Completed</span>}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 font-serif">{lesson.title}</h2>
                    <p className="text-blue-100/60 text-sm leading-relaxed line-clamp-2">
                      {lesson.description}
                    </p>
                  </Link>
                ) : (
                  <div>
                     <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 py-1 bg-gray-800 rounded">
                        Lesson {idx + 1}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-400 mb-2 font-serif">{lesson.title}</h2>
                    <p className="text-gray-600 text-sm">Complete the previous lesson to unlock.</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
