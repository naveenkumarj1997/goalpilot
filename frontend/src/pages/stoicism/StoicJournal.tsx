import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Feather, Plus, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getJournal, createJournalEntry } from '../../api/stoicism';

export default function StoicJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  
  // Form State
  const [reflection, setReflection] = useState('');
  const [challenge, setChallenge] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user?.token) return;
      const data = await getJournal(user.token);
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch journal', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token || (!reflection && !challenge && !lessonLearned)) return;

    try {
      const newEntry = await createJournalEntry({ reflection, challenge, lessonLearned }, user.token);
      setEntries([newEntry, ...entries]);
      setIsWriting(false);
      setReflection('');
      setChallenge('');
      setLessonLearned('');
    } catch (error) {
      console.error('Failed to create journal entry', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2 flex items-center gap-3">
            <Feather className="h-8 w-8 text-purple-400" />
            The Meditations
          </h1>
          <p className="text-blue-200/60">"The happiness of your life depends upon the quality of your thoughts."</p>
        </div>
        
        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="flex items-center px-6 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 hover:text-white transition-all font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Entry
          </button>
        )}
      </div>

      {isWriting && (
        <motion.form 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass p-8 rounded-3xl border border-purple-500/30 bg-[#1e293b]/80 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-amber-500" />
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">
                Daily Reflection
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What occupied your mind today?"
                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 min-h-[100px] resize-y font-serif text-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-amber-400 uppercase tracking-widest mb-2">
                Challenges Faced
              </label>
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="What tested your patience or character?"
                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 min-h-[100px] resize-y font-serif text-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">
                Lessons Learned
              </label>
              <textarea
                value={lessonLearned}
                onChange={(e) => setLessonLearned(e.target.value)}
                placeholder="How did you respond? What will you do better tomorrow?"
                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 min-h-[100px] resize-y font-serif text-lg"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsWriting(false)}
                className="px-6 py-3 text-white/50 hover:text-white transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reflection && !challenge && !lessonLearned}
                className="px-8 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Seal Entry
              </button>
            </div>
          </div>
        </motion.form>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10 text-white/50">Loading archives...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-white/5">
            <BookOpen className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-white mb-2">The pages are empty.</h3>
            <p className="text-white/50">Begin your philosophical journey by recording your first thought.</p>
          </div>
        ) : (
          entries.map((entry, idx) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-8 rounded-3xl border border-white/5 hover:border-purple-500/20 transition-all bg-[#0f172a]/80"
            >
              <div className="flex items-center gap-2 text-white/40 text-sm font-medium mb-6">
                <Calendar className="h-4 w-4" />
                {new Date(entry.date).toLocaleDateString('en-US', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </div>

              <div className="space-y-6">
                {entry.reflection && (
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-2">Reflection</span>
                    <p className="text-blue-50/90 leading-relaxed font-serif text-lg">{entry.reflection}</p>
                  </div>
                )}
                
                {entry.challenge && (
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-2">Challenge</span>
                    <p className="text-blue-50/90 leading-relaxed font-serif text-lg border-l-2 border-amber-500/30 pl-4 italic">
                      "{entry.challenge}"
                    </p>
                  </div>
                )}
                
                {entry.lessonLearned && (
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">Resolution</span>
                    <p className="text-blue-50/90 leading-relaxed font-serif text-lg">{entry.lessonLearned}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
