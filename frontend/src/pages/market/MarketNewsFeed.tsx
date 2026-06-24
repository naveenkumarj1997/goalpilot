import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMarketNews, triggerMarketSync, markMarketNewsRead, toggleMarketNewsSaved, getMarketNewsStats } from '../../api/market';
import { Newspaper, ExternalLink, ShieldAlert, Activity, RefreshCw, ChevronLeft, ChevronRight, CheckCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Finance', 'Global Markets', 'Tech', 'Startups', 'Layoffs', 'Crypto'];
const FILTERS = ['All', 'Unread', 'Read', 'Saved'];

const MarketNewsFeed: React.FC = () => {
  const { user } = useAuth();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [stats, setStats] = useState({ total: 0, readCount: 0 });

  const fetchNews = async () => {
    if (user?.token) {
      setLoading(true);
      try {
        const [newsData, statsData] = await Promise.all([
          getMarketNews(user.token, activeCategory, page, activeFilter, 5),
          getMarketNewsStats(user.token)
        ]);
        setNews(newsData.items);
        setTotalPages(newsData.totalPages);
        setStats(statsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNews();
  }, [user, activeCategory, activeFilter, page]);

  const handleSync = async () => {
    if (!user?.token) return;
    setSyncing(true);
    try {
      await triggerMarketSync(user.token);
      setPage(1);
      await fetchNews();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleMarkRead = async (id: string, currentlyRead: boolean) => {
    if (!user?.token) return;
    // Optimistic UI update
    setNews(news.map(n => n._id === id ? { ...n, isRead: !currentlyRead } : n));
    setStats(prev => ({ ...prev, readCount: prev.readCount + (currentlyRead ? -1 : 1) }));
    try {
      await markMarketNewsRead(user.token, id);
    } catch (err) {
      console.error(err);
      // Revert on error
      fetchNews();
    }
  };

  const handleToggleSave = async (id: string, currentlySaved: boolean) => {
    if (!user?.token) return;
    // Optimistic UI update
    setNews(news.map(n => n._id === id ? { ...n, isSaved: !currentlySaved } : n));
    try {
      await toggleMarketNewsSaved(user.token, id);
    } catch (err) {
      console.error(err);
      fetchNews();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center">
            <Newspaper className="w-8 h-8 text-blue-400 mr-3" />
            Breaking News
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-slate-400 text-sm">Automated Sentiment Analysis</span>
            <span className="bg-slate-800 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">
              Total in DB: {stats.total}
            </span>
            <span className="bg-slate-800 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">
              You Read: {stats.readCount}
            </span>
          </div>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center transition-colors shadow-lg shadow-blue-500/20"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Scanning Web...' : 'Force Scan Now'}
        </button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-4 items-start">
        <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400 shrink-0">
          <Newspaper className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold mb-1">How do I use Breaking News?</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            The <strong>Breaking News</strong> feed automatically aggregates the latest financial and tech news from major publications around the world. 
            Our algorithm scans each article to determine its sentiment (Bullish vs Bearish) so you can quickly see if the news is positive or negative for the market. 
            Use this to stay informed, save articles for later reading, and track global events that might affect your Virtual Portfolio!
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => { setActiveFilter(f); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeFilter === f ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            {f}
          </button>
        ))}
        <div className="w-px h-8 bg-slate-800 mx-2 self-center"></div>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => { setActiveCategory(c); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeCategory === c ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Activity className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            No news found for this filter/category.
          </div>
        ) : (
          <AnimatePresence>
            {news.map((item, i) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-slate-900 border rounded-2xl overflow-hidden relative group transition-colors ${item.isRead ? 'border-slate-800 opacity-70' : 'border-blue-500/30 shadow-lg shadow-blue-500/5'}`}
              >
                {/* Sentiment Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                  item.sentiment === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  item.sentiment === 'Bearish' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {item.sentiment}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded-md">
                      {item.source}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.pubDate).toLocaleString()}
                    </span>
                    {!item.aiProcessed && (
                      <span className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1 ml-auto mr-20">
                        <ShieldAlert className="w-3 h-3" /> Keyword Fallback
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 ${item.isRead ? 'text-slate-300' : 'text-white'}`}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-start gap-2">
                      {item.title}
                      <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0" />
                    </a>
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {item.aiSummary || item.summary}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleMarkRead(item._id, item.isRead)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center transition-colors ${item.isRead ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {item.isRead ? 'Read' : 'Mark as Read'}
                      </button>
                      <button 
                        onClick={() => handleToggleSave(item._id, item.isSaved)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center transition-colors ${item.isSaved ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        {item.isSaved ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
                        {item.isSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </button>
          
          <span className="text-slate-400 text-sm font-bold">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center transition-colors"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketNewsFeed;
