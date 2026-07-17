import React, { useState, useEffect } from 'react';
import { BookA, Bookmark, BookmarkPlus, Search, Volume2, Languages, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getBrainProfile, toggleSavedWord } from '../../api/brain';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import type { VocabularyWord } from '../../data/vocabulary';

const VocabularyBuilder = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'saved'>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate today's word deterministically
  // Get days since epoch to avoid repeating words
  const daysSinceEpoch = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
  const wordIndex = daysSinceEpoch % VOCABULARY_LIST.length;
  const todaysWord = VOCABULARY_LIST[wordIndex];

  const fetchProfile = async () => {
    if (user?.token) {
      const data = await getBrainProfile(user.token);
      setProfile(data);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleToggleSave = async (wordId: string) => {
    if (!user?.token) return;
    try {
      await toggleSavedWord(user.token, wordId);
      await fetchProfile(); // Refresh profile to get updated savedWords
    } catch (error) {
      console.error('Failed to toggle save status', error);
    }
  };

  const savedWordIds = profile?.savedWords?.map((sw: any) => sw.wordId) || [];
  
  const savedWordsData = VOCABULARY_LIST.filter(w => savedWordIds.includes(w.id));
  
  const filteredSavedWords = savedWordsData.filter(w => 
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.meaningEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.meaningTamil.includes(searchQuery)
  );

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-slide-up-fade">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-slate-900/50 p-8 rounded-3xl border border-slate-700/50">
        <div className="text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 border border-cyan-500/30 mx-auto md:mx-0">
            <BookA className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Daily Vocabulary</h1>
          <p className="text-slate-400 max-w-md">Learn one new powerful English word every day. Master its meaning, pronunciation, and usage in Tamil & English.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900 p-1 rounded-xl flex border border-slate-800">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'daily' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Sparkles className="w-4 h-4 mr-2" /> Word of the Day
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'saved' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Bookmark className="w-4 h-4 mr-2" /> Saved Words ({savedWordIds.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'daily' && (
        <div className="max-w-3xl mx-auto">
          <WordCard 
            word={todaysWord} 
            isSaved={savedWordIds.includes(todaysWord.id)} 
            onToggleSave={() => handleToggleSave(todaysWord.id)} 
            onSpeak={() => speak(todaysWord.word)}
          />
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="relative max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Search saved words in English or Tamil..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-4 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <Search className="w-6 h-6 text-slate-500 absolute left-4 top-4" />
          </div>

          {filteredSavedWords.length === 0 ? (
            <div className="text-center py-12 glass rounded-3xl border border-slate-800">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400">No saved words found.</h3>
              <p className="text-slate-500 mt-2">Start saving words from the 'Word of the Day' tab!</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-slate-900/50 rounded-2xl border border-slate-700/50 p-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/30">
                    <th className="p-4 text-sm font-bold text-slate-300">Word</th>
                    <th className="p-4 text-sm font-bold text-slate-300 hidden sm:table-cell">Meaning (English)</th>
                    <th className="p-4 text-sm font-bold text-cyan-400">Meaning (Tamil)</th>
                    <th className="p-4 text-sm font-bold text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSavedWords.map(word => (
                    <tr key={word.id} className="border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-lg">{word.word}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-cyan-500 font-mono text-[10px] sm:text-xs bg-cyan-900/20 px-1.5 py-0.5 rounded">{word.pronunciation}</span>
                            <span className="text-slate-500 italic text-xs">{word.partOfSpeech}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-300 hidden sm:table-cell align-top max-w-[200px] truncate group-hover:whitespace-normal group-hover:bg-slate-800/50 transition-all z-10 hover:shadow-xl">
                        {word.meaningEnglish}
                      </td>
                      <td className="p-4 text-sm text-cyan-100 align-top max-w-[200px] font-medium">
                        <span className="block">{word.tamilWord}</span>
                        <span className="text-xs text-cyan-500/70 mt-1 block truncate group-hover:whitespace-normal group-hover:bg-slate-800/50 transition-all relative z-10">{word.meaningTamil}</span>
                      </td>
                      <td className="p-4 align-top text-right whitespace-nowrap">
                        <button 
                          onClick={() => speak(word.word)} 
                          className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg mr-2 transition-colors"
                          title="Listen"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleSave(word.id)}
                          className="p-2 text-cyan-500 hover:text-red-400 bg-slate-800/50 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove from saved"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

// Sub-component for rendering the Word
const WordCard = ({ word, isSaved, onToggleSave, onSpeak, compact = false }: { word: VocabularyWord, isSaved: boolean, onToggleSave: () => void, onSpeak: () => void, compact?: boolean }) => {
  return (
    <div className={`glass rounded-3xl border ${isSaved ? 'border-cyan-500/30' : 'border-slate-700/50'} overflow-hidden relative group`}>
      <div className={`p-6 ${compact ? 'sm:p-6' : 'sm:p-10'}`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-6">
          <div className="w-full sm:w-auto">
            <h2 className={`${compact ? 'text-3xl' : 'text-4xl sm:text-5xl'} font-black text-white mb-2 flex items-center flex-wrap gap-2`}>
              <span className="break-all">{word.word}</span>
              <span className="text-cyan-400 opacity-80 text-xl sm:text-2xl font-medium ml-2">- {word.tamilWord}</span>
              <button 
                type="button"
                onClick={onSpeak} 
                style={{ touchAction: 'manipulation' }}
                className="ml-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-cyan-400 transition-colors z-10 relative"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-mono bg-cyan-900/30 px-2 py-1 rounded text-sm">{word.pronunciation}</span>
              <span className="text-slate-400 italic text-sm">{word.partOfSpeech}</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={onToggleSave}
            onTouchEnd={(e) => {
              e.preventDefault();
              onToggleSave();
            }}
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            className={`relative z-10 w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${isSaved ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700'}`}
          >
            {isSaved ? (
              <>
                <Bookmark className="w-5 h-5 fill-current" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-5 h-5" />
                <span>Save Word</span>
              </>
            )}
          </button>
        </div>

        {/* Meanings */}
        <div className="space-y-4 mb-8">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">English Meaning</h4>
            <p className="text-white text-lg">{word.meaningEnglish}</p>
          </div>
          <div className="bg-cyan-900/10 p-4 rounded-xl border border-cyan-500/20">
            <h4 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-1 flex items-center">
              <Languages className="w-3 h-3 mr-1" /> Tamil Meaning
            </h4>
            <p className="text-cyan-100 text-lg font-medium">{word.meaningTamil}</p>
          </div>
        </div>

        {/* Examples */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Examples</h4>
          <ul className="space-y-2">
            {word.examples.map((ex, idx) => (
              <li key={idx} className="text-slate-300 flex items-start">
                <span className="text-cyan-500 mr-2">•</span> {ex}
              </li>
            ))}
          </ul>
        </div>

        {/* Context */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-xl border-l-4 border-cyan-500">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">When to use it</h4>
          <p className="text-slate-300 text-sm italic">"{word.conversationalContext}"</p>
        </div>

      </div>
    </div>
  );
};

export default VocabularyBuilder;
