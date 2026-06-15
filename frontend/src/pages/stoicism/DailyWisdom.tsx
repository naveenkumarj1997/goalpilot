import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, BookOpen, Quote, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDailyQuote } from '../../api/stoicism';

export default function DailyWisdom() {
  const { user } = useAuth();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user?.token) return;
      const data = await getDailyQuote(user.token);
      setQuote(data);
    } catch (error) {
      console.error('Failed to fetch quote', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white text-center py-10">Loading wisdom...</div>;
  if (!quote) return <div className="text-white text-center py-10">No wisdom found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-4">
        <Sun className="h-10 w-10 text-amber-400 mx-auto mb-4" />
        <h1 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] mb-2">
          Daily Wisdom
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass p-10 md:p-16 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#0f172a] to-[#1e293b] relative overflow-hidden shadow-2xl"
      >
        <Quote className="absolute top-10 left-10 h-24 w-24 text-white/[0.03] rotate-180" />
        
        <div className="relative z-10">
          <blockquote className="text-3xl md:text-5xl font-serif text-white leading-tight mb-8 text-center">
            "{quote.quote}"
          </blockquote>
          
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-serif text-lg">
              — {quote.author}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 border-t border-white/10 pt-10">
            <div>
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4" /> The Meaning
              </h3>
              <p className="text-blue-100/80 leading-relaxed text-lg font-serif">
                {quote.meaning}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Target className="h-4 w-4" /> Practical Application
              </h3>
              <p className="text-blue-100/80 leading-relaxed text-lg font-serif">
                {quote.practicalApplication}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
