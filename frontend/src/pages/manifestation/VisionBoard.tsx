import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getVisionBoard, addVisionBoardItem, deleteVisionBoardItem } from '../../api/manifestation';

export default function VisionBoard() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ imageUrl: '', category: 'Career', caption: '' });

  const fetchItems = async () => {
    try {
      if (!user?.token) return;
      const data = await getVisionBoard(user.token);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.token) {
        await addVisionBoardItem(formData, user.token);
        setShowModal(false);
        setFormData({ imageUrl: '', category: 'Career', caption: '' });
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (user?.token) {
        await deleteVisionBoardItem(id, user.token);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', 'Career', 'Fitness', 'Finance', 'Lifestyle', 'Learning', 'Travel', 'Other'];
  const [filter, setFilter] = useState('All');

  const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

  if (loading) return <div className="text-white text-center py-20">Loading Vision Board...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center mb-2">
            <ImageIcon className="w-8 h-8 mr-3 text-pink-400" />
            Vision Board
          </h1>
          <p className="text-slate-400">See your future, believe in it, and make it happen.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(236,72,153,0.4)]"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Vision
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === cat ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/5">
          <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Your board is empty</h3>
          <p className="text-slate-400">Add images that represent your goals and dreams to stay inspired.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group rounded-2xl overflow-hidden break-inside-avoid shadow-lg bg-slate-900 border border-white/5"
              >
                <img src={item.imageUrl} alt={item.caption} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">{item.category}</span>
                  <p className="text-white font-medium text-sm leading-tight">{item.caption}</p>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-white mb-6">Add to Vision Board</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Caption / Goal</label>
                <input
                  type="text"
                  required
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. My dream office in NYC"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-colors mt-4"
              >
                Add Image
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}