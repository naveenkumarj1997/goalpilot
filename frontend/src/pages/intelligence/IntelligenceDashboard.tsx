import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getIntelligenceItems, toggleBookmark, getBookmarks, triggerAggregation } from '../../api/intelligence';
import { BookOpen, Newspaper, Bookmark, RefreshCw, Search, Briefcase, TrendingUp, Monitor, Globe, ChevronLeft, ChevronRight, Activity, Clock } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'AI', 'Startups', 'Layoffs', 'Hiring', 'Salaries', 'World News', 'Indian Tech', 'Tamil Nadu Tech'];

const IntelligenceDashboard: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [readItems, setReadItems] = useState<string[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'feed' | 'saved'>('feed');

  useEffect(() => {
    if (user?._id) {
      const stored = localStorage.getItem(`intelligence_read_${user._id}`);
      if (stored) setReadItems(JSON.parse(stored));
    }
  }, [user]);

  const markAsRead = (id: string) => {
    if (!user?._id) return;
    setReadItems(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(`intelligence_read_${user._id}`, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (user?.token) {
      if (view === 'feed') {
        fetchItems();
      } else {
        fetchBookmarks();
      }
    }
  }, [user, category, page, view]);

  useEffect(() => {
    // Reset page when search or category changes
    if (view === 'feed') {
      const delayDebounceFn = setTimeout(() => {
        setPage(1);
        fetchItems();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [search]);

  const fetchItems = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await getIntelligenceItems(user.token, category, search, page);
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      console.error('Error fetching intelligence', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await getBookmarks(user.token);
      setBookmarks(data);
    } catch (err) {
      console.error('Error fetching bookmarks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (itemId: string) => {
    if (!user?.token) return;
    try {
      const data = await toggleBookmark(user.token, itemId);
      if (view === 'saved' && !data.isBookmarked) {
        setBookmarks(prev => prev.filter(b => b.item._id !== itemId));
      }
      return data.isBookmarked;
    } catch (err) {
      console.error('Error toggling bookmark', err);
      return false;
    }
  };

  const handleRefresh = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      await triggerAggregation(user.token);
      setPage(1);
      fetchItems();
    } catch (err) {
      console.error('Error refreshing', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Technology': return <Monitor className="w-4 h-4" />;
      case 'AI': return <Activity className="w-4 h-4" />;
      case 'Startups': return <TrendingUp className="w-4 h-4" />;
      case 'Hiring': return <Briefcase className="w-4 h-4" />;
      case 'Layoffs': return <Activity className="w-4 h-4 text-red-400" />;
      case 'World News': return <Globe className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some(b => b.item?._id === id);
  };

  // Ensure bookmarks are fetched on mount to check status in feed
  useEffect(() => {
    if (user?.token && view === 'feed') {
      getBookmarks(user.token).then(data => setBookmarks(data)).catch(console.error);
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-indigo-500/20 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center">
            <Globe className="w-8 h-8 text-indigo-400 mr-3" />
            Intelligence Hub
          </h1>
          <p className="text-slate-400 mt-2">Track real-time trends in Tech, AI, Hiring, and World News.</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Total News:</span>
              <span className="text-sm font-black text-indigo-400">{totalItems}</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">You Read:</span>
              <span className="text-sm font-black text-emerald-400">{readItems.length}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => { setView('feed'); setPage(1); }}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold flex items-center justify-center transition-all ${view === 'feed' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Newspaper className="w-4 h-4 mr-2" />
            Live Feed
          </button>
          <button 
            onClick={() => setView('saved')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold flex items-center justify-center transition-all ${view === 'saved' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Saved
          </button>
        </div>
      </div>

      {view === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar / Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-24">
              <h3 className="text-white font-bold mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-indigo-400" />
                Filters
              </h3>
              
              <div className="mb-6 relative">
                <input 
                  type="text" 
                  placeholder="Search keywords..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Categories</p>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${category === cat ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
                  >
                    <span className="mr-3">{getCategoryIcon(cat)}</span>
                    {cat}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleRefresh}
                className="w-full mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center justify-center transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Force Sync Now
              </button>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-4">
            {loading && items.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No news found</h3>
                <p className="text-slate-400">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <motion.div 
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all group relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row gap-5 relative z-10">
                        {item.imageUrl && (
                          <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {readItems.includes(item._id) ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">
                                  Read
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider animate-pulse">
                                  New
                                </span>
                              )}
                              {item.categories.map((c: string) => (
                                <span key={c} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                                  {c}
                                </span>
                              ))}
                              <span className="text-xs text-slate-500 flex items-center ml-auto">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(item.pubDate).toLocaleString()}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                              <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={() => markAsRead(item._id)}>
                                {item.title}
                              </a>
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                              {item.summary.replace(/<[^>]*>?/gm, '')}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-xs font-bold text-slate-500">Source: <span className="text-slate-300">{item.source}</span></span>
                            <div className="flex gap-2">
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  const saved = await handleToggleBookmark(item._id);
                                  if (saved) {
                                    setBookmarks(prev => [...prev, { item: { _id: item._id } }]);
                                  } else {
                                    setBookmarks(prev => prev.filter(b => b.item?._id !== item._id));
                                  }
                                }}
                                className={`p-2 rounded-lg transition-colors ${isBookmarked(item._id) ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                title={isBookmarked(item._id) ? "Saved" : "Save for later"}
                              >
                                <Bookmark className={`w-4 h-4 ${isBookmarked(item._id) ? 'fill-emerald-400' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-slate-400 font-bold text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {view === 'saved' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <Bookmark className="w-6 h-6 text-emerald-400 mr-2" />
              Saved Intelligence
            </h2>
            <p className="text-slate-400 text-sm">News and opportunities you've bookmarked. These will never be auto-deleted.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No saved items</h3>
              <p className="text-slate-400">Click the bookmark icon on any news feed item to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((b, idx) => {
                if (!b.item) return null; // Defensive check
                return (
                  <motion.div 
                    key={b._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                          {b.item.categories?.[0] || 'Saved'}
                        </span>
                        <button 
                          onClick={() => handleToggleBookmark(b.item._id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                          title="Remove bookmark"
                        >
                          <Bookmark className="w-4 h-4 fill-slate-500 hover:fill-red-400" />
                        </button>
                      </div>
                      {b.item.imageUrl && (
                        <img src={b.item.imageUrl} alt="" className="w-full h-32 object-cover rounded-xl mb-4 bg-slate-800" />
                      )}
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                        <a href={b.item.link} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                          {b.item.title}
                        </a>
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                        {b.item.summary?.replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <span className="text-xs text-slate-500">{new Date(b.item.pubDate).toLocaleDateString()}</span>
                      <span className="text-xs font-bold text-slate-300">{b.item.source}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IntelligenceDashboard;
