import React, { useState, useEffect } from 'react';
import { Gamepad2, Brain, Zap, Target, Search, ArrowLeft, Play, Trophy, Calendar, Medal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getBrainProfile, saveGameScore, saveGauntletScore } from '../../api/brain';

import ChimpTest from './games/ChimpTest';
import SpatialGrid from './games/SpatialGrid';
import StroopTest from './games/StroopTest';
import ReactionTimer from './games/ReactionTimer';
import PatternMatcher from './games/PatternMatcher';
import OddOneOut from './games/OddOneOut';
import LogicEquations from './games/LogicEquations';
import NumberMatrix from './games/NumberMatrix';
import FlashSnapshot from './games/FlashSnapshot';
import FaceNameRecall from './games/FaceNameRecall';
import PositiveReframing from './games/PositiveReframing';
import Focus17 from './games/Focus17';
import NBackTest from './games/NBackTest';
import SpeedMatch from './games/SpeedMatch';
import WeightBalance from './games/WeightBalance';
import CodeBreaker from './games/CodeBreaker';
import ShapeCount from './games/ShapeCount';
import GratitudeCatcher from './games/GratitudeCatcher';
import DualTasking from './games/DualTasking';
import ColorShapeClash from './games/ColorShapeClash';
import { Camera, Sparkles, Dna } from 'lucide-react';

const GAMES_CATALOG = [
  {
    category: 'Memory Training',
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    color: 'purple',
    games: [
      { id: 'chimp', title: 'Chimp Test', desc: 'Memorize number sequences.', component: ChimpTest },
      { id: 'spatial', title: 'Spatial Grid', desc: 'Recall flashed tile locations.', component: SpatialGrid },
      { id: 'nback', title: 'N-Back Test', desc: 'Match the current item with one N steps ago.', component: NBackTest },
    ]
  },
  {
    category: 'Think Fast',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    color: 'yellow',
    games: [
      { id: 'stroop', title: 'Stroop Effect', desc: 'Color vs Word interference.', component: StroopTest },
      { id: 'reaction', title: 'Reaction Timer', desc: 'Click when green as fast as possible.', component: ReactionTimer },
      { id: 'speed', title: 'Speed Match', desc: 'Rapidly identify matching subsequent symbols.', component: SpeedMatch },
    ]
  },
  {
    category: 'Critical Thinking',
    icon: <Target className="w-6 h-6 text-emerald-400" />,
    color: 'emerald',
    games: [
      { id: 'pattern', title: 'Pattern Matcher', desc: 'Deduce the next item in sequence.', component: PatternMatcher },
      { id: 'odd', title: 'Odd One Out', desc: 'Find the item that breaks the rule.', component: OddOneOut },
      { id: 'balance', title: 'Weight Balance', desc: 'Determine the heaviest object from scales.', component: WeightBalance },
    ]
  },
  {
    category: 'Logical Deduction',
    icon: <Search className="w-6 h-6 text-blue-400" />,
    color: 'blue',
    games: [
      { id: 'logic', title: 'Logic Equations', desc: 'Rapid true/false deductive reasoning.', component: LogicEquations },
      { id: 'matrix', title: 'Number Matrix', desc: 'Solve the missing grid number.', component: NumberMatrix },
      { id: 'code', title: 'Code Breaker', desc: 'Crack the secret 3-digit combination.', component: CodeBreaker },
    ]
  },
  {
    category: 'Photographic Memory',
    icon: <Camera className="w-6 h-6 text-cyan-400" />,
    color: 'cyan',
    games: [
      { id: 'flash', title: 'Flash Snapshot', desc: 'Recall visual details from a millisecond flash.', component: FlashSnapshot },
      { id: 'face', title: 'Face-Name Recall', desc: 'Memorize avatars and their names.', component: FaceNameRecall },
      { id: 'shape', title: 'Shape Count', desc: 'Count specific objects from a chaotic 1-second flash.', component: ShapeCount },
    ]
  },
  {
    category: 'Manifestation & Mindset',
    icon: <Sparkles className="w-6 h-6 text-pink-400" />,
    color: 'pink',
    games: [
      { id: 'reframe', title: 'Positive Reframing', desc: 'Shift limiting beliefs to high-vibration thoughts.', component: PositiveReframing },
      { id: 'focus', title: '17-Second Focus', hold: true, desc: 'Hold a pure manifestation intent without distraction.', component: Focus17 },
      { id: 'gratitude', title: 'Gratitude Catcher', desc: 'Catch positive words, dodge negative ones.', component: GratitudeCatcher },
    ]
  },
  {
    category: 'Neural Connectivity',
    icon: <Dna className="w-6 h-6 text-fuchsia-400" />,
    color: 'fuchsia',
    games: [
      { id: 'dual', title: 'Dual Tasking', desc: 'Split your brain: Hover a target while doing math.', component: DualTasking },
      { id: 'clash', title: 'Color Shape Clash', desc: 'Cross-hemisphere linguistic and spatial challenge.', component: ColorShapeClash },
    ]
  }
];

const BrainGames = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // Gauntlet State
  const [isGauntlet, setIsGauntlet] = useState(false);
  const [gauntletSequence, setGauntletSequence] = useState<{ category: string, id: string }[]>([]);
  const [gauntletIndex, setGauntletIndex] = useState(0);
  const [gauntletScores, setGauntletScores] = useState<{ category: string, score: number }[]>([]);
  const [transitionScore, setTransitionScore] = useState<number | null>(null);
  const [gauntletFinished, setGauntletFinished] = useState(false);

  const fetchProfile = async () => {
    if (user?.token) {
      const data = await getBrainProfile(user.token);
      setProfile(data);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleBack = () => {
    setActiveGame(null);
    setIsGauntlet(false);
    setTransitionScore(null);
    setGauntletFinished(false);
    fetchProfile();
  };

  const startGauntlet = () => {
    const sequence = GAMES_CATALOG.map(cat => {
      const randomGame = cat.games[Math.floor(Math.random() * cat.games.length)];
      return { category: cat.category, id: randomGame.id };
    });
    
    setGauntletSequence(sequence);
    setGauntletIndex(0);
    setGauntletScores([]);
    setIsGauntlet(true);
    setTransitionScore(null);
    setGauntletFinished(false);
    setActiveGame(sequence[0].id);
  };

  const handleGameOver = async (score: number, category: string, gameId: string) => {
    if (isGauntlet) {
      // Show transition screen
      setTransitionScore(score);
    } else {
      // Single game mode, just save score in background
      if (user?.token) {
        await saveGameScore(user.token, category, gameId, score);
        fetchProfile(); // Refresh scoreboard silently
      }
    }
  };

  const nextGauntletGame = async () => {
    if (transitionScore === null) return;

    const currentCat = gauntletSequence[gauntletIndex].category;
    const newScores = [...gauntletScores, { category: currentCat, score: transitionScore }];
    setGauntletScores(newScores);
    setTransitionScore(null);

    if (gauntletIndex + 1 < gauntletSequence.length) {
      setGauntletIndex(gauntletIndex + 1);
      setActiveGame(gauntletSequence[gauntletIndex + 1].id);
    } else {
      // Finished all 7
      setActiveGame(null);
      setGauntletFinished(true);
      
      const total = newScores.reduce((acc, curr) => acc + curr.score, 0);
      if (user?.token) {
        await saveGauntletScore(user.token, total, newScores);
        fetchProfile();
      }
    }
  };

  if (gauntletFinished) {
    const totalScore = gauntletScores.reduce((acc, curr) => acc + curr.score, 0);
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-slide-up-fade text-center">
        <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-4xl font-black text-white mb-2">Gauntlet Complete!</h2>
        <p className="text-xl text-slate-400 mb-8">You trained across all 7 cognitive domains.</p>
        
        <div className="text-6xl font-black text-yellow-400 mb-8">{totalScore}</div>
        
        <div className="space-y-3 mb-8 text-left max-w-sm mx-auto bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
          {gauntletScores.map((s, i) => (
            <div key={i} className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-300">{s.category}</span>
              <span className="text-white font-bold">{s.score}</span>
            </div>
          ))}
        </div>

        <button onClick={handleBack} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xl transition-all">
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (isGauntlet && transitionScore !== null) {
    return (
      <div className="max-w-md mx-auto py-32 px-4 animate-slide-up-fade text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Stage {gauntletIndex + 1} Complete</h2>
        <div className="text-5xl font-black text-emerald-400 mb-8">Score: {transitionScore}</div>
        <button onClick={nextGauntletGame} className="w-full px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xl transition-all">
          {gauntletIndex + 1 < gauntletSequence.length ? 'Next Category' : 'Finish Gauntlet'}
        </button>
      </div>
    );
  }

  if (activeGame) {
    let ActiveComponent: any = null;
    let categoryColor = 'purple';
    let categoryName = '';
    
    GAMES_CATALOG.forEach(cat => {
      cat.games.forEach(g => {
        if (g.id === activeGame) {
          ActiveComponent = g.component;
          categoryColor = cat.color;
          categoryName = cat.category;
        }
      });
    });

    if (ActiveComponent) {
      return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-slide-up-fade">
          {!isGauntlet && (
            <button 
              onClick={handleBack}
              className={`mb-6 flex items-center text-slate-400 hover:text-${categoryColor}-400 transition-colors`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Hub
            </button>
          )}
          {isGauntlet && (
            <div className="mb-6 flex justify-between items-center text-slate-400">
              <span className="font-bold uppercase tracking-wider text-sm">Gauntlet Mode: Stage {gauntletIndex + 1}/7</span>
              <span className="text-emerald-400 font-bold">{categoryName}</span>
            </div>
          )}
          
          <ActiveComponent 
            onBack={handleBack} 
            onGameOver={(score: number) => handleGameOver(score, categoryName, activeGame)} 
          />
        </div>
      );
    }
  }

  // --- SCOREBOARD CALCULATIONS ---
  const topGauntlets = profile?.gauntletScores?.sort((a: any, b: any) => b.totalScore - a.totalScore).slice(0, 5) || [];
  
  const getTopScoresForCategory = (catName: string) => {
    if (!profile?.gameScores) return [];
    return profile.gameScores
      .filter((s: any) => s.category === catName)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3); // Top 3 per category to save space
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-slide-up-fade">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-slate-900/50 p-8 rounded-3xl border border-slate-700/50">
        <div className="text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 border border-indigo-500/30 mx-auto md:mx-0">
            <Gamepad2 className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Cognitive Hub</h1>
          <p className="text-slate-400 max-w-md">Train your brain across 7 domains. Play individual games or test your limits in the full Gauntlet.</p>
        </div>
        
        <div className="flex-shrink-0">
          <button 
            onClick={startGauntlet}
            className="flex items-center px-8 py-5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-black rounded-2xl text-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all hover:-translate-y-1"
          >
            <Play className="w-6 h-6 mr-3 fill-current" /> Play Gauntlet (All 7)
          </button>
        </div>
      </div>

      {/* Top Scoreboards */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white flex items-center mb-6">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" /> Global Scoreboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gauntlet Scores */}
          <div className="glass p-6 rounded-3xl border border-yellow-500/20 bg-slate-900/80">
            <h3 className="text-yellow-400 font-bold uppercase tracking-wider text-sm mb-4">Top 5 Gauntlet Runs</h3>
            {topGauntlets.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No gauntlet runs yet.</p>
            ) : (
              <div className="space-y-3">
                {topGauntlets.map((g: any, i: number) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-700/50 pb-2 last:border-0">
                    <span className="text-slate-400 text-sm flex items-center">
                      <Medal className={`w-4 h-4 mr-2 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-400' : 'text-slate-600'}`} />
                      {new Date(g.date).toLocaleDateString()}
                    </span>
                    <span className="text-white font-bold">{g.totalScore}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Scores */}
          <div className="glass p-6 rounded-3xl border border-slate-700">
            <h3 className="text-slate-300 font-bold uppercase tracking-wider text-sm mb-4">Top Scores by Category</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {GAMES_CATALOG.map(cat => {
                const top3 = getTopScoresForCategory(cat.category);
                if (top3.length === 0) return null;
                return (
                  <div key={cat.category}>
                    <div className={`text-${cat.color}-400 text-xs font-bold uppercase mb-2`}>{cat.category}</div>
                    <div className="space-y-1">
                      {top3.map((s: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-500">{new Date(s.date).toLocaleDateString()}</span>
                          <span className="text-slate-300 font-medium">{s.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {profile?.gameScores?.length === 0 && (
                <p className="text-slate-500 text-sm italic col-span-2">Play individual games to rank up!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Training */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white mb-6">Individual Training</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GAMES_CATALOG.map((category) => (
            <div key={category.category} className="space-y-4">
              <h3 className={`text-xl font-bold text-slate-300 flex items-center`}>
                {category.icon}
                <span className="ml-3">{category.category}</span>
              </h3>
              
              <div className="flex flex-col gap-4">
                {category.games.map(game => (
                  <button 
                    key={game.id}
                    onClick={() => setActiveGame(game.id)}
                    className={`text-left group glass p-5 rounded-2xl border border-${category.color}-500/20 hover:border-${category.color}-500/50 transition-all relative overflow-hidden`}
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${category.color}-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-${category.color}-500/20 transition-all`}></div>
                    <h4 className="text-lg font-bold text-white mb-1">{game.title}</h4>
                    <p className="text-xs text-slate-400">{game.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrainGames;
