import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import JournalModal from '../../components/meditation/JournalModal';
import { useAuth } from '../../context/AuthContext';
import { getLessonById, logSession } from '../../api/meditation';

export default function MeditationSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showJournal, setShowJournal] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [id, user]);

  const fetchLesson = async () => {
    try {
      if (!user?.token || !id) return;
      const data = await getLessonById(id, user.token);
      setLesson(data);
    } catch (error) {
      console.error('Failed to fetch lesson', error);
      navigate('/meditation/library');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    setShowJournal(true);
  };

  const handleSaveJournal = async (journalData: any) => {
    if (!user?.token || !lesson) return;

    try {
      await logSession({
        lessonId: lesson._id,
        type: 'Guided',
        durationMinutes: lesson.durationMinutes,
        ...journalData
      }, user.token);
      
      setShowJournal(false);
      navigate('/meditation/progress');
    } catch (error) {
      console.error('Failed to log session', error);
    }
  };

  if (loading) return <div className="text-center text-white py-20">Loading Session...</div>;
  if (!lesson) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Library
      </button>

      <div className="glass rounded-2xl overflow-hidden border border-indigo-500/30">
        <div className="aspect-video w-full bg-black relative">
          <iframe
            src={`https://www.youtube.com/embed/${lesson.videoId}?autoplay=0&rel=0&modestbranding=1`}
            title={lesson.title}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium uppercase tracking-wider">
              {lesson.category}
            </span>
            <span className="px-3 py-1 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium">
              {lesson.difficulty}
            </span>
            <span className="flex items-center text-white/50 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {lesson.durationMinutes} min
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">{lesson.title}</h1>
          <p className="text-white/70 leading-relaxed mb-8">
            {lesson.description}
          </p>

          <div className="flex justify-center border-t border-white/10 pt-8 mt-8">
            <button
              onClick={handleComplete}
              className="flex items-center px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              <CheckCircle2 className="h-6 w-6 mr-3" />
              Complete Session
            </button>
          </div>
        </div>
      </div>

      <JournalModal
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
        onSave={handleSaveJournal}
      />
    </div>
  );
}
