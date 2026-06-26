import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Play, Brain, Settings, RotateCcw, Target, Loader } from 'lucide-react';
import { getDecks, createDeck, getDueCards, reviewCard, autoGenerateCards } from '../../api/brain';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Flashcards = () => {
  const { user } = useAuth();
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Deck State
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  
  // Generate State
  const [showGenerate, setShowGenerate] = useState(false);
  const [activeDeck, setActiveDeck] = useState<string>('');
  const [pastedText, setPastedText] = useState('');

  // Review State
  const [reviewing, setReviewing] = useState(false);
  const [reviewCards, setReviewCards] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, [user]);

  const fetchDecks = async () => {
    if (!user?.token) return;
    try {
      const data = await getDecks(user.token);
      setDecks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token || !newTitle.trim()) return;
    try {
      await createDeck(user.token, { title: newTitle, tags: [] });
      setNewTitle('');
      setShowCreate(false);
      fetchDecks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoGenerate = async () => {
    if (!user?.token || !activeDeck || !pastedText.trim()) return;
    try {
      await autoGenerateCards(user.token, activeDeck, pastedText);
      setPastedText('');
      setShowGenerate(false);
      fetchDecks();
      alert('Cards successfully generated programmatically!');
    } catch (err) {
      console.error(err);
      alert('Could not extract keywords. Please paste more descriptive text.');
    }
  };

  const startReview = async (deckId: string) => {
    if (!user?.token) return;
    try {
      const due = await getDueCards(user.token, deckId);
      if (due.length === 0) {
        alert("No cards due right now! Great job!");
        return;
      }
      setReviewCards(due);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setReviewing(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleScore = async (quality: number) => {
    if (!user?.token) return;
    const card = reviewCards[currentCardIndex];
    try {
      await reviewCard(user.token, card._id, quality);
      
      if (currentCardIndex < reviewCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setShowAnswer(false);
      } else {
        setReviewing(false);
        fetchDecks();
        alert('Review Session Complete!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex justify-center items-center"><Loader className="w-12 h-12 text-indigo-500 animate-spin" /></div>;
  }

  // REVIEW UI
  if (reviewing && reviewCards.length > 0) {
    const card = reviewCards[currentCardIndex];
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-slide-up-fade min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-white">Reviewing Deck</h2>
          <span className="text-indigo-400 font-bold bg-indigo-500/20 px-4 py-1 rounded-full">
            {currentCardIndex + 1} / {reviewCards.length}
          </span>
        </div>

        <div style={{ perspective: '1000px' }}>
          <div 
            className="w-full min-h-[300px] transition-transform duration-500 grid"
            style={{ transformStyle: 'preserve-3d', transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            
            {/* Front */}
            <div 
              className="glass rounded-3xl p-10 flex flex-col justify-center items-center text-center border border-indigo-500/30 w-full max-h-[60vh] overflow-y-auto custom-scrollbar"
              style={{ gridArea: '1 / 1', backfaceVisibility: 'hidden' }}
            >
              <h3 className="text-2xl md:text-3xl font-medium text-white leading-relaxed break-words">{card.front}</h3>
            </div>

            {/* Back */}
            <div 
              className="glass rounded-3xl p-10 flex flex-col justify-center items-center text-center border border-emerald-500/30 bg-emerald-900/20 w-full max-h-[60vh] overflow-y-auto custom-scrollbar"
              style={{ gridArea: '1 / 1', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 leading-relaxed break-words">{card.back}</h3>
            </div>
            
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          {!showAnswer ? (
            <button 
              onClick={() => setShowAnswer(true)}
              className="w-full max-w-md py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-lg shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
            >
              Show Answer
            </button>
          ) : (
            <div className="w-full grid grid-cols-4 gap-4 animate-slide-up-fade">
              <button onClick={() => handleScore(0)} className="py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-bold rounded-xl flex flex-col items-center">
                <span className="text-lg">Blackout</span>
                <span className="text-xs opacity-70">&lt; 1 min</span>
              </button>
              <button onClick={() => handleScore(3)} className="py-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-400 font-bold rounded-xl flex flex-col items-center">
                <span className="text-lg">Hard</span>
                <span className="text-xs opacity-70">1 day</span>
              </button>
              <button onClick={() => handleScore(4)} className="py-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 font-bold rounded-xl flex flex-col items-center">
                <span className="text-lg">Good</span>
                <span className="text-xs opacity-70">~6 days</span>
              </button>
              <button onClick={() => handleScore(5)} className="py-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 font-bold rounded-xl flex flex-col items-center">
                <span className="text-lg">Perfect</span>
                <span className="text-xs opacity-70">Auto Scale</span>
              </button>
            </div>
          )}
        </div>
        
        <button onClick={() => setReviewing(false)} className="mt-8 text-slate-500 hover:text-white mx-auto block">End Session Early</button>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="max-w-6xl mx-auto py-8 animate-slide-up-fade">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-indigo-400" /> Spaced Repetition
          </h1>
          <p className="text-slate-400 mt-1">SuperMemo-2 backed intelligent flashcards.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center shadow-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> New Deck
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map(deck => (
          <div key={deck._id} className="glass p-6 rounded-3xl border border-indigo-500/20 relative group hover:border-indigo-400/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white truncate pr-4">{deck.title}</h3>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            
            <div className="flex gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{deck.dueCount}</div>
                <div className="text-xs text-slate-400 uppercase">Due Now</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-300">{deck.totalCount}</div>
                <div className="text-xs text-slate-400 uppercase">Total Cards</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => startReview(deck._id)}
                disabled={deck.dueCount === 0}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors flex justify-center items-center"
              >
                <Play className="w-4 h-4 mr-2 fill-current" /> Review
              </button>
              <button 
                onClick={() => { setActiveDeck(deck._id); setShowGenerate(true); }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl transition-colors"
                title="Programmatic Auto-Generate"
              >
                <Target className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {decks.length === 0 && (
          <div className="col-span-full text-center py-12 glass rounded-3xl border-dashed border-indigo-500/30">
            <p className="text-slate-400">No decks found. Create one to start training your memory!</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass w-full max-w-md rounded-3xl p-8 border border-indigo-500/30">
            <h3 className="text-2xl font-bold text-white mb-6">Create Flashcard Deck</h3>
            <form onSubmit={handleCreateDeck}>
              <input 
                type="text" 
                placeholder="Deck Title (e.g. Node.js Basics)"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white mb-6 focus:border-indigo-500 focus:outline-none"
                autoFocus
              />
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Programmatic Generate Modal */}
      {showGenerate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass w-full max-w-xl rounded-3xl p-8 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-2">Programmatic Cloze Generator</h3>
            <p className="text-slate-400 text-sm mb-6">Paste any notes or article below. Our deterministic algorithm will extract key phrases and generate fill-in-the-blank cards instantly (100% free, no AI API limits).</p>
            <textarea 
              placeholder="Paste your study material here..."
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white mb-6 focus:border-blue-500 focus:outline-none custom-scrollbar"
            />
            <div className="flex gap-4">
              <button onClick={() => setShowGenerate(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl">Cancel</button>
              <button onClick={handleAutoGenerate} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 mr-2" /> Generate Cards
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Flashcards;
