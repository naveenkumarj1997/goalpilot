import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAffirmations, addAffirmation, deleteAffirmation } from '../../api/manifestation';

const PRESET_AFFIRMATIONS = [
  "I am confident, capable, and worthy of immense success.",
  "Every action I take moves me closer to my dream life.",
  "I attract wealth, health, and amazing opportunities effortlessly.",
  "Challenges are stepping stones to my greatness.",
  "I am the architect of my life; I build its foundation and choose its contents."
];

export default function Affirmations() {
  const { user } = useAuth();
  const [affirmations, setAffirmations] = useState<string[]>(PRESET_AFFIRMATIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newText, setNewText] = useState('');

  const fetchAffirms = async () => {
    try {
      if (!user?.token) return;
      const data = await getAffirmations(user.token);
      if (data && data.length > 0) {
        setAffirmations([...PRESET_AFFIRMATIONS, ...data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAffirms();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    try {
      if (user?.token) {
        await addAffirmation(newText, user.token);
        setNewText('');
        fetchAffirms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (text: string) => {
    if (PRESET_AFFIRMATIONS.includes(text)) return; // Cannot delete presets
    try {
      if (user?.token) {
        await deleteAffirmation(text, user.token);
        fetchAffirms();
        if (currentIndex >= affirmations.length - 1) {
          setCurrentIndex(0);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const next = () => setCurrentIndex((i) => (i + 1) % affirmations.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + affirmations.length) % affirmations.length);

  const currentAffirmation = affirmations[currentIndex];
  const isCustom = !PRESET_AFFIRMATIONS.includes(currentAffirmation);

  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col items-center">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/20">
          <Quote className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Daily Affirmations</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Rewire your subconscious mind. Read these out loud with emotion and conviction.
        </p>
      </div>

      {/* Carousel */}
      <div className="w-full relative px-12 mb-16">
        <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors z-10">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="glass w-full rounded-3xl p-12 min-h-[300px] flex flex-col items-center justify-center border border-rose-500/30 relative overflow-hidden text-center shadow-[0_0_50px_rgba(244,63,94,0.1)]">
          <Quote className="absolute top-6 left-6 w-16 h-16 text-rose-500/10" />
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-3xl md:text-5xl font-black text-white leading-tight"
            >
              "{currentAffirmation}"
            </motion.h2>
          </AnimatePresence>
          
          {isCustom && (
            <button onClick={() => handleDelete(currentAffirmation)} className="absolute bottom-6 right-6 p-2 bg-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-full transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors z-10">
          <ArrowRight className="w-6 h-6" />
        </button>
        
        <div className="text-center mt-6 text-slate-500 font-bold tracking-widest">
          {currentIndex + 1} / {affirmations.length}
        </div>
      </div>

      {/* Add Custom Affirmation */}
      <div className="w-full max-w-2xl glass p-8 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold text-white mb-4">Add Custom Affirmation</h3>
        <form onSubmit={handleAdd} className="flex gap-4">
          <input
            type="text"
            required
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="I am..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none"
          />
          <button type="submit" className="px-6 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors flex items-center shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            <Plus className="w-5 h-5 mr-2" /> Add
          </button>
        </form>
      </div>
    </div>
  );
}