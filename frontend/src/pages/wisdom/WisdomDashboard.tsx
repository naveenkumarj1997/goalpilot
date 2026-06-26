import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWisdom } from '../../context/WisdomContext';
import { getWisdomBooks } from '../../api/wisdom';
import { BookOpen, Search, Filter, Languages, Sparkles, Star } from 'lucide-react';

const WisdomDashboard = () => {
  const { user } = useAuth();
  const { language, toggleLanguage, profile } = useWisdom();
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      if (user?.token) {
        try {
          const data = await getWisdomBooks(user.token);
          setBooks(data);
        } catch (err) {
          console.error('Error fetching wisdom books', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBooks();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[500px]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div></div>;
  }

  const TEXT = {
    en: {
      title: "Wisdom Library",
      subtitle: "The world's greatest lessons, organized for your growth.",
      search: "Search books or authors...",
      read: "Read Now",
      streak: "Reading Streak",
      score: "Wisdom Score"
    },
    ta: {
      title: "ஞான நூலகம் (Wisdom Library)",
      subtitle: "உலகின் சிறந்த புத்தகங்களின் பாடங்கள், உங்கள் வளர்ச்சிக்காக.",
      search: "புத்தகங்களை தேடுங்கள்...",
      read: "படிக்க தொடங்கு",
      streak: "தொடர் வாசிப்பு",
      score: "ஞான மதிப்பெண்"
    }
  };

  const t = TEXT[language];

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-slide-up-fade">
      {/* Header & Language Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 flex items-center">
            <BookOpen className="w-8 h-8 text-amber-500 mr-3" />
            {t.title}
          </h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-4 border border-amber-500/20">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{t.streak}</p>
              <p className="text-lg font-bold text-amber-400 flex items-center justify-center">
                🔥 {profile?.readingStreak || 0}
              </p>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{t.score}</p>
              <p className="text-lg font-bold text-blue-400 flex items-center justify-center">
                🧠 {profile?.wisdomScore || 0}
              </p>
            </div>
          </div>

          <button 
            onClick={toggleLanguage}
            className="flex items-center px-4 py-3 glass hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors"
          >
            <Languages className="w-5 h-5 text-amber-400 mr-2" />
            <span className="font-bold text-white">
              {language === 'en' ? 'தமிழ்' : 'English'}
            </span>
          </button>
        </div>
      </div>

      {/* Realistic Bookshelf */}
      <div className="relative p-8 rounded-3xl overflow-hidden bg-[#2D1B13] border-[12px] border-[#3E2723] shadow-2xl">
        {/* Wood Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 gap-y-16 relative z-10">
          {books.map((book) => {
            const isFavorite = profile?.favorites?.includes(book._id);
            return (
              <div 
                key={book._id} 
                className="group relative cursor-pointer flex flex-col items-center"
                onClick={() => navigate(`/wisdom/book/${book._id}`)}
              >
                {/* Book Cover with 3D Effect */}
                <div className="relative w-40 h-56 transition-transform duration-300 transform group-hover:-translate-y-4 group-hover:scale-105 perspective-1000">
                  <div className="absolute inset-0 bg-black/40 rounded-r-lg blur-md translate-x-2 translate-y-2"></div>
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover rounded-r-xl border-l-4 border-white/20 shadow-[inset_4px_0_10px_rgba(0,0,0,0.5)] z-10 relative"
                  />
                  {/* Book spine simulation */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/60 to-transparent z-20 rounded-l-sm"></div>
                  
                  {isFavorite && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg z-30">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>
                
                {/* Book Details (Hover) */}
                <div className="absolute -bottom-12 opacity-0 group-hover:opacity-100 group-hover:-bottom-16 transition-all duration-300 w-full text-center bg-black/80 backdrop-blur-sm p-2 rounded-lg border border-amber-500/30 z-40">
                  <h3 className="text-white font-bold text-sm truncate">{book.title}</h3>
                  <p className="text-amber-400 text-xs truncate">{book.author}</p>
                </div>

                {/* Wooden Shelf Base */}
                <div className="absolute -bottom-4 left-[-10%] right-[-10%] h-4 bg-[#4E342E] rounded-sm border-t border-[#5D4037] shadow-[0_4px_10px_rgba(0,0,0,0.8)] z-0"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WisdomDashboard;
