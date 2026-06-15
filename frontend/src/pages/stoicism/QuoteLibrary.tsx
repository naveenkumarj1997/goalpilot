import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getQuotes } from '../../api/stoicism';

export default function QuoteLibrary() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('All');

  const authors = ['All', 'Marcus Aurelius', 'Seneca', 'Epictetus'];

  useEffect(() => {
    fetchData();
  }, [user, searchQuery, selectedAuthor]);

  const fetchData = async () => {
    try {
      if (!user?.token) return;
      const data = await getQuotes({ query: searchQuery, author: selectedAuthor }, user.token);
      setQuotes(data);
    } catch (error) {
      console.error('Failed to fetch quotes', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Wisdom Library</h1>
          <p className="text-blue-200/60">Search through the timeless words of the ancient philosophers.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-4 rounded-xl border border-blue-500/20 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="Search by keyword or meaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <User className="h-4 w-4 text-white/50" />
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none [&>option]:bg-gray-900"
          >
            {authors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-10 text-white/50">Loading library...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotes.map((quote, idx) => (
            <motion.div
              key={quote._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
              className="glass p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all bg-[#1e293b]/40 flex flex-col h-full"
            >
              <Quote className="h-8 w-8 text-amber-500/20 mb-4" />
              
              <blockquote className="text-xl font-serif text-white/90 leading-relaxed mb-4 flex-1">
                "{quote.quote}"
              </blockquote>
              
              <div className="inline-block px-3 py-1 rounded bg-amber-500/10 text-amber-400 font-serif text-sm w-max mb-6">
                — {quote.author}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 mt-auto">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Meaning</span>
                  <p className="text-sm text-blue-100/70">{quote.meaning}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Application</span>
                  <p className="text-sm text-blue-100/70">{quote.practicalApplication}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {quotes.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Quote className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No quotes found</h3>
              <p className="text-white/50">Try adjusting your search or author filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
