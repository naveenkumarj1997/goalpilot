import React, { useState, useEffect } from 'react';
import { Target, Lightbulb, Check, X, RotateCcw } from 'lucide-react';
import { getDecks, getDueCards } from '../../api/brain';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ActiveRecall = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(-1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userGuess, setUserGuess] = useState('');

  useEffect(() => {
    const fetchAllCards = async () => {
      if (!user?.token) return;
      try {
        const decks = await getDecks(user.token);
        let allCards: any[] = [];
        for (const deck of decks) {
          // just fetch due cards to act as the pool for active recall testing
          const deckCards = await getDueCards(user.token, deck._id);
          allCards = [...allCards, ...deckCards];
        }
        
        // Shuffle
        setCards(allCards.sort(() => Math.random() - 0.5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCards();
  }, [user]);

  const nextCard = () => {
    if (activeCard < cards.length - 1) {
      setActiveCard(prev => prev + 1);
      setShowAnswer(false);
      setUserGuess('');
    } else {
      // Done
      setActiveCard(-1);
      setCards([]); // force refetch or show end screen
    }
  };

  if (loading) {
    return <div className="text-white text-center py-20">Loading Neural Pathways...</div>;
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center animate-slide-up-fade">
        <Target className="w-16 h-16 text-blue-500 mx-auto mb-6" />
        <h2 className="text-3xl font-black text-white mb-4">No Material Available</h2>
        <p className="text-slate-400 mb-8">You need to create Flashcards first before you can test your Active Recall.</p>
        <Link to="/brain/flashcards" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Go to Flashcards</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-slide-up-fade">
      
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
          <Target className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Active Recall Tester</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Force your brain to retrieve information without looking at the answer. This is the most effective way to build strong neural pathways.
        </p>
      </div>

      {activeCard === -1 ? (
        <div className="text-center">
          <button 
            onClick={() => setActiveCard(0)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center mx-auto text-lg transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105"
          >
            Start Recall Session
          </button>
        </div>
      ) : (
        <div className="glass rounded-3xl p-8 border border-blue-500/30 shadow-2xl">
          <div className="mb-8">
            <span className="text-blue-400 font-bold bg-blue-500/10 px-4 py-1 rounded-full text-sm">
              Card {activeCard + 1} of {cards.length}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 text-center min-h-[100px] flex items-center justify-center">
            {cards[activeCard].front}
          </h2>

          {!showAnswer ? (
            <div className="space-y-6 animate-slide-up-fade">
              <textarea 
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Type your recall attempt here..."
                className="w-full h-32 bg-slate-900/80 border border-slate-700 rounded-2xl p-4 text-white focus:border-blue-500 focus:outline-none custom-scrollbar"
                autoFocus
              />
              <button 
                onClick={() => setShowAnswer(true)}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center"
              >
                <Lightbulb className="w-5 h-5 mr-2" /> Reveal Answer
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-slide-up-fade text-center">
              <div className="p-8 rounded-2xl bg-blue-900/20 border border-blue-500/30">
                <h4 className="text-sm font-bold text-blue-400 mb-4 uppercase tracking-widest">Actual Answer</h4>
                <p className="text-2xl font-bold text-white">{cards[activeCard].back}</p>
              </div>

              <div className="flex gap-4 max-w-md mx-auto">
                <button 
                  onClick={nextCard}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ActiveRecall;
