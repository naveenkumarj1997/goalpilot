import React, { useEffect, useState } from 'react';
import { PlayCircle, CheckCircle, Info, Lock } from 'lucide-react';
import { getLessons } from '../../api/combat';
import { logWorkout } from '../../api/combat';

interface AcademyViewProps {
  discipline: 'Boxing' | 'Kickboxing' | 'Muay Thai' | 'MMA' | 'Self Defense';
  description: string;
}

const AcademyView: React.FC<AcademyViewProps> = ({ discipline, description }) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessons(discipline);
        setLessons(data);
      } catch (err) {
        console.error('Failed to fetch lessons', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [discipline]);

  const handleCompleteLesson = async () => {
    if (!activeVideo) return;
    try {
      await logWorkout({
        type: 'Lesson',
        title: activeVideo.title,
        duration: activeVideo.duration || 15
      });
      alert('Lesson completed and logged to your progress!');
      setActiveVideo(null);
    } catch (err) {
      console.error('Failed to log lesson', err);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // Handle both youtube.com/watch?v= and youtu.be/
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  // Group lessons by category
  const groupedLessons = lessons.reduce((acc: any, lesson: any) => {
    const cat = lesson.category || 'Fundamentals';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(lesson);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-slide-up-fade">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white neon-text-brand mb-2">{discipline} Academy</h1>
        <p className="text-slate-400 max-w-2xl">{description}</p>
      </div>

      {activeVideo ? (
        <div className="mb-12">
          <div className="aspect-w-16 aspect-h-9 w-full bg-black rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,112,209,0.2)] border border-emerald-500/30">
            <iframe 
              src={getEmbedUrl(activeVideo.videoUrl)} 
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full min-h-[500px]"
            ></iframe>
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-emerald-500/10">
            <div>
              <h2 className="text-2xl font-bold text-white">{activeVideo.title}</h2>
              <p className="text-slate-400 mt-1">{activeVideo.description}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setActiveVideo(null)} className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
                Close
              </button>
              <button onClick={handleCompleteLesson} className="px-6 py-2 bg-brand text-white font-bold rounded-xl flex items-center shadow-[0_0_15px_rgba(0,112,209,0.4)]">
                <CheckCircle className="w-5 h-5 mr-2" /> Mark Complete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.keys(groupedLessons).length === 0 ? (
            <div className="text-center py-20 text-slate-400 border border-emerald-500/10 rounded-2xl bg-slate-900/30">
              No lessons available for {discipline} yet. The AI coach is preparing the curriculum.
            </div>
          ) : (
            Object.keys(groupedLessons).map((category) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-emerald-500/20 pb-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedLessons[category].map((lesson: any) => (
                    <div 
                      key={lesson._id}
                      onClick={() => setActiveVideo(lesson)}
                      className="group cursor-pointer bg-slate-900/50 rounded-2xl border border-emerald-500/20 overflow-hidden hover:border-brand/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(0,112,209,0.3)]"
                    >
                      <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                        {/* Placeholder Thumbnail. In reality, we'd extract YT thumbnail */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                        <PlayCircle className="w-16 h-16 text-white/50 group-hover:text-brand group-hover:scale-110 transition-all z-20" />
                        <img 
                          src={`https://img.youtube.com/vi/${getEmbedUrl(lesson.videoUrl).split('/').pop()}/0.jpg`}
                          alt={lesson.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80'; }}
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-lg group-hover:text-brand transition-colors">{lesson.title}</h4>
                          <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-1 rounded">{lesson.duration}m</span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">{lesson.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AcademyView;
