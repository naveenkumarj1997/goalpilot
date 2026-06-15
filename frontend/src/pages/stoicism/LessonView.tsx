import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, BookOpen, Key, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLessons, completeLesson } from '../../api/stoicism';

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, [id, user]);

  const fetchLesson = async () => {
    try {
      if (!user?.token) return;
      const data = await getLessons(user.token);
      const current = data.find((l: any) => l._id === id);
      if (current) setLesson(current);
      else navigate('/stoicism/learn');
    } catch (error) {
      console.error('Failed to fetch lesson', error);
      navigate('/stoicism/learn');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!user?.token || !lesson) return;
    try {
      await completeLesson(lesson._id, user.token);
      navigate('/stoicism/learn');
    } catch (error) {
      console.error('Failed to complete lesson', error);
    }
  };

  if (loading) return <div className="text-center text-white py-20">Loading Lesson...</div>;
  if (!lesson) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/stoicism/learn')}
        className="flex items-center text-amber-400 hover:text-amber-300 transition-colors mb-4 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Path
      </button>

      <div className="text-center mb-8">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.3em] mb-4 block">
          Lesson {lesson.order}
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
          {lesson.title}
        </h1>
        <p className="text-blue-200/60 text-lg">
          {lesson.description}
        </p>
      </div>

      <div className="space-y-6">
        {/* Explanation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl border border-white/10 bg-[#1e293b]/50"
        >
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-xl font-bold font-serif">The Philosophy</h2>
          </div>
          <p className="text-blue-100/90 leading-relaxed text-lg">
            {lesson.explanation}
          </p>
        </motion.div>

        {/* Real Life Example */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl border border-white/10 bg-[#1e293b]/50"
        >
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <Activity className="h-5 w-5" />
            <h2 className="text-xl font-bold font-serif">Real World Application</h2>
          </div>
          <p className="text-blue-100/90 leading-relaxed text-lg italic">
            "{lesson.realLifeExample}"
          </p>
        </motion.div>

        {/* Reflection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-8 rounded-2xl border border-amber-500/30 bg-amber-500/5"
        >
          <h2 className="text-xl font-bold font-serif text-amber-400 mb-2">Self Reflection</h2>
          <p className="text-white leading-relaxed text-lg font-medium">
            {lesson.reflectionQuestion}
          </p>
        </motion.div>

        {/* Key Takeaway */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-8 rounded-2xl border border-white/10 bg-[#1e293b]/50 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4 text-amber-400">
            <Key className="h-5 w-5" />
            <h2 className="text-xl font-bold font-serif">Key Takeaway</h2>
          </div>
          <p className="text-2xl text-white font-serif font-bold">
            {lesson.keyTakeaway}
          </p>
        </motion.div>
      </div>

      <div className="flex justify-center pt-8 border-t border-white/10 mt-8">
        <button
          onClick={handleComplete}
          className="flex items-center px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0f172a] font-bold rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        >
          <CheckCircle2 className="h-6 w-6 mr-3" />
          Mark as Completed
        </button>
      </div>
    </div>
  );
}
