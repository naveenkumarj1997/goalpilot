import AvatarLoader from '../../components/ui/AvatarLoader';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWisdom } from '../../context/WisdomContext';
import { getWisdomBookById, markLessonLearnedAPI } from '../../api/wisdom';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, MessageSquare, Target } from 'lucide-react';
import WisdomAICoach from './WisdomAICoach';

const WisdomReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, profile, refreshProfile } = useWisdom();
  
  const [book, setBook] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0); // 0 = Overview, 1+ = Lessons
  const [loading, setLoading] = useState(true);
  const [showCoach, setShowCoach] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (user?.token && id) {
        try {
          const data = await getWisdomBookById(id, user.token);
          setBook(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBook();
  }, [id, user]);

  const handleMarkLearned = async () => {
    if (user?.token && book && currentPage > 0) {
      try {
        await markLessonLearnedAPI(book._id, currentPage, user.token);
        refreshProfile();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const pushToMissionControl = () => {
    // In a real app, this would call the Mission Control API to add a task/habit
    alert(language === 'ta' ? 'செயல் திட்டம் மிஷன் கண்ட்ரோலில் சேர்க்கப்பட்டது!' : 'Action Step pushed to Mission Control!');
  };

  if (loading) return <AvatarLoader />;
  if (!book) return <div className="text-center text-white">Book not found.</div>;

  const totalPages = book.lessons.length;
  const isLearned = profile?.lessonsLearned?.some((l: any) => l.bookId === book._id && l.lessonNumber === currentPage);

  // Helper to extract text based on selected language
  const getText = (field: any) => field ? field[language] : '';

  const renderControls = () => (
    <div className="mt-8 flex flex-wrap items-center justify-between border-t border-slate-700/50 pt-6 gap-4">
      <button 
        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
        disabled={currentPage === 0}
        className="p-2 rounded-full bg-slate-800 text-white disabled:opacity-30 hover:bg-slate-700 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="flex flex-wrap gap-2 justify-center">
        {currentPage > 0 && !isLearned && (
          <button 
            onClick={handleMarkLearned}
            className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 rounded-xl font-bold flex items-center hover:bg-emerald-600/30 transition-colors text-sm"
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Mark Learned
          </button>
        )}
        {currentPage > 0 && isLearned && (
          <div className="px-4 py-2 bg-slate-800 text-emerald-500 rounded-xl font-bold flex items-center text-sm">
            <CheckCircle className="w-4 h-4 mr-1" /> Learned
          </div>
        )}
        
        <button 
          onClick={() => setShowCoach(true)}
          className="px-4 py-2 bg-brand text-white rounded-xl font-bold flex items-center shadow-[0_0_15px_rgba(0,112,209,0.4)] hover:bg-brand-hover transition-colors text-sm"
        >
          <MessageSquare className="w-4 h-4 mr-1" /> AI Coach
        </button>
      </div>

      <button 
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full bg-slate-800 text-white disabled:opacity-30 hover:bg-slate-700 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );

  const renderOverviewContent = () => (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-amber-400/80">Book Overview</h3>
        <p className="text-slate-300 text-lg leading-relaxed mb-8">{getText(book.overview)}</p>
        
        <h4 className="text-xl font-bold text-white mb-4">Top Quotes</h4>
        <div className="space-y-4">
          {book.topQuotes.map((quote: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-amber-100 italic">
              "{getText(quote)}"
            </div>
          ))}
        </div>
      </div>
      {renderControls()}
    </div>
  );

  const renderLessonContent = (lesson: any) => (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex-1 space-y-8">
        <h3 className="text-3xl font-black text-white text-amber-400">Lesson {lesson.lessonNumber}: {getText(lesson.title)}</h3>
        
        <div>
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Explanation</h4>
          <p className="text-slate-200 text-lg leading-relaxed">{getText(lesson.explanation)}</p>
        </div>

        <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Why It Matters</h4>
          <p className="text-slate-300">{getText(lesson.whyItMatters)}</p>
        </div>

        <div className="bg-blue-900/20 p-5 rounded-2xl border border-blue-500/30">
          <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Example</h4>
          <p className="text-blue-100 italic">{getText(lesson.example)}</p>
        </div>

        <div className="bg-emerald-900/20 p-5 rounded-2xl border border-emerald-500/30 relative pb-16">
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Action Step</h4>
          <p className="text-emerald-100 mb-4">{getText(lesson.actionStep)}</p>
          <button 
            onClick={pushToMissionControl}
            className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold flex items-center shadow-lg transition-transform hover:scale-105"
          >
            <Target className="w-4 h-4 mr-1 md:mr-2" /> Push to Mission Control
          </button>
        </div>

        <div className="bg-purple-900/20 p-5 rounded-2xl border border-purple-500/30">
          <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">Reflection</h4>
          <p className="text-purple-100">{getText(lesson.reflectionQuestion)}</p>
        </div>
      </div>
      {renderControls()}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-slide-up-fade relative">
      <button 
        onClick={() => navigate('/wisdom')}
        className="mb-6 flex items-center text-slate-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Library
      </button>

      {/* Reader Container */}
      <div className="glass rounded-3xl overflow-hidden border border-slate-700/50 flex flex-col md:flex-row min-h-[600px] relative">
        
        {/* Left Side: Book Cover & Navigation Index */}
        <div className="w-full md:w-1/3 bg-slate-900/50 p-6 border-r border-slate-700/50 flex flex-col items-center">
          <img src={book.coverImage} alt="cover" className="w-32 rounded-lg shadow-2xl mb-6 border border-white/10" />
          <h2 className="text-xl font-bold text-white text-center leading-tight mb-2">{book.title}</h2>
          <p className="text-amber-500 text-sm mb-6">{book.author}</p>

          <div className="w-full space-y-2 flex-1 md:overflow-y-auto custom-scrollbar md:pr-2">
            <div className="mb-2">
              <button 
                onClick={() => setCurrentPage(0)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${currentPage === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                Overview
              </button>
              {currentPage === 0 && (
                <div className="md:hidden mt-2 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  {renderOverviewContent()}
                </div>
              )}
            </div>

            {book.lessons.map((lesson: any) => {
              const learned = profile?.lessonsLearned?.some((l: any) => l.bookId === book._id && l.lessonNumber === lesson.lessonNumber);
              return (
                <div key={lesson.lessonNumber} className="mb-2">
                  <button 
                    onClick={() => setCurrentPage(lesson.lessonNumber)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${currentPage === lesson.lessonNumber ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    <span className="truncate pr-2">{lesson.lessonNumber}. {getText(lesson.title)}</span>
                    {learned && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  </button>
                  {currentPage === lesson.lessonNumber && (
                    <div className="md:hidden mt-2 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      {renderLessonContent(lesson)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Page Content (Desktop Only) */}
        <div className="hidden md:flex w-full md:w-2/3 bg-white/5 p-8 relative flex-col">
          {currentPage === 0 
            ? renderOverviewContent() 
            : book.lessons.filter((l: any) => l.lessonNumber === currentPage).map((lesson: any) => (
                <React.Fragment key={lesson.lessonNumber}>
                  {renderLessonContent(lesson)}
                </React.Fragment>
              ))
          }
        </div>
      </div>

      {showCoach && (
        <WisdomAICoach 
          onClose={() => setShowCoach(false)} 
          bookTitle={book.title} 
          currentLesson={currentPage > 0 ? getText(book.lessons[currentPage - 1].title) : null}
          language={language}
        />
      )}
    </div>
  );
};

export default WisdomReader;
