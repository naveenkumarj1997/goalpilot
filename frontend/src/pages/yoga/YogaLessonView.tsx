import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Shield, Star, CheckCircle } from 'lucide-react';
import { getLessonById, completeSession, getProfile, toggleFavorite } from '../../api/yoga';

export default function YogaLessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : null;
        if (!token || !id) return;

        const [lessonData, profileData] = await Promise.all([
          getLessonById(id, token),
          getProfile(token)
        ]);
        
        setLesson(lessonData);
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch lesson', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleComplete = async () => {
    if (!lesson || completed) return;
    setSubmitting(true);
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (token) {
        await completeSession(lesson._id, lesson.durationMinutes, token);
        setCompleted(true);
      }
    } catch (err) {
      console.error('Failed to log session', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (token && id) {
        const updatedProfile = await toggleFavorite(id, token);
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;
  }

  if (!lesson) {
    return <div className="text-center py-20 text-white">Lesson not found.</div>;
  }

  const isFavorite = profile?.favorites?.some((f: any) => (f._id || f) === lesson._id);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-400 hover:text-white transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Library
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="aspect-video relative w-full">
              <iframe 
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${lesson.videoId}?playsinline=1&rel=0&modestbranding=1`}
                title={lesson.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-lg">
                    {lesson.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg flex items-center">
                    <Clock className="w-4 h-4 mr-1.5" /> {lesson.durationMinutes} Min
                  </span>
                </div>
                <button 
                  onClick={handleToggleFavorite}
                  className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <Star className={`w-4 h-4 mr-2 ${isFavorite ? 'text-amber-400 fill-current' : ''}`} /> 
                  {isFavorite ? 'Saved to Favorites' : 'Save'}
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-3">{lesson.title}</h1>
              <p className="text-slate-400 leading-relaxed mb-8">{lesson.description}</p>
              
              {!completed ? (
                <button 
                  onClick={handleComplete}
                  disabled={submitting}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center"
                >
                  {submitting ? 'Saving...' : 'Mark as Complete'}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full py-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-xl font-bold text-lg flex items-center justify-center"
                >
                  <CheckCircle className="w-6 h-6 mr-2" /> Session Completed!
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-emerald-500" /> Lesson Poses
            </h3>
            
            {lesson.poses && lesson.poses.length > 0 ? (
              <div className="space-y-4">
                {lesson.poses.map((pose: any, index: number) => (
                  <div key={pose._id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white text-sm">{index + 1}. {pose.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        {pose.durationSeconds}s
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {pose.description}
                    </p>
                    {pose.benefits && pose.benefits.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pose.benefits.map((b: string) => (
                          <span key={b} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Pose details not available for this lesson.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
