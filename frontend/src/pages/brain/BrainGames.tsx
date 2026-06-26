import React, { useState } from 'react';
import { Gamepad2, Brain, Zap, Target, Search, ArrowLeft } from 'lucide-react';

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
import { Camera, Sparkles } from 'lucide-react';

const GAMES_CATALOG = [
  {
    category: 'Memory Training',
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    color: 'purple',
    games: [
      { id: 'chimp', title: 'Chimp Test', desc: 'Memorize number sequences.', component: ChimpTest },
      { id: 'spatial', title: 'Spatial Grid', desc: 'Recall flashed tile locations.', component: SpatialGrid },
    ]
  },
  {
    category: 'Think Fast',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    color: 'yellow',
    games: [
      { id: 'stroop', title: 'Stroop Effect', desc: 'Color vs Word interference.', component: StroopTest },
      { id: 'reaction', title: 'Reaction Timer', desc: 'Click when green as fast as possible.', component: ReactionTimer },
    ]
  },
  {
    category: 'Critical Thinking',
    icon: <Target className="w-6 h-6 text-emerald-400" />,
    color: 'emerald',
    games: [
      { id: 'pattern', title: 'Pattern Matcher', desc: 'Deduce the next item in sequence.', component: PatternMatcher },
      { id: 'odd', title: 'Odd One Out', desc: 'Find the item that breaks the rule.', component: OddOneOut },
    ]
  },
  {
    category: 'Logical Deduction',
    icon: <Search className="w-6 h-6 text-blue-400" />,
    color: 'blue',
    games: [
      { id: 'logic', title: 'Logic Equations', desc: 'Rapid true/false deductive reasoning.', component: LogicEquations },
      { id: 'matrix', title: 'Number Matrix', desc: 'Solve the missing grid number.', component: NumberMatrix },
    ]
  },
  {
    category: 'Photographic Memory',
    icon: <Camera className="w-6 h-6 text-cyan-400" />,
    color: 'cyan',
    games: [
      { id: 'flash', title: 'Flash Snapshot', desc: 'Recall visual details from a millisecond flash.', component: FlashSnapshot },
      { id: 'face', title: 'Face-Name Recall', desc: 'Memorize avatars and their names.', component: FaceNameRecall },
    ]
  },
  {
    category: 'Manifestation & Mindset',
    icon: <Sparkles className="w-6 h-6 text-pink-400" />,
    color: 'pink',
    games: [
      { id: 'reframe', title: 'Positive Reframing', desc: 'Shift limiting beliefs to high-vibration thoughts.', component: PositiveReframing },
      { id: 'focus', title: '17-Second Focus', hold: true, desc: 'Hold a pure manifestation intent without distraction.', component: Focus17 },
    ]
  }
];

const BrainGames = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleBack = () => setActiveGame(null);

  if (activeGame) {
    let ActiveComponent: any = null;
    let categoryColor = 'purple';
    
    GAMES_CATALOG.forEach(cat => {
      cat.games.forEach(g => {
        if (g.id === activeGame) {
          ActiveComponent = g.component;
          categoryColor = cat.color;
        }
      });
    });

    if (ActiveComponent) {
      return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-slide-up-fade">
          <button 
            onClick={handleBack}
            className={`mb-6 flex items-center text-slate-400 hover:text-${categoryColor}-400 transition-colors`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Hub
          </button>
          <ActiveComponent onBack={handleBack} />
        </div>
      );
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-slide-up-fade">
      
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
          <Gamepad2 className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Cognitive Training Hub</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Train your brain across 6 core cognitive domains. All games are scored per-session and run entirely programmatically.
        </p>
      </div>

      <div className="space-y-12">
        {GAMES_CATALOG.map((category) => (
          <div key={category.category} className="space-y-6">
            <h2 className={`text-2xl font-bold text-white flex items-center border-b border-slate-800 pb-4`}>
              {category.icon}
              <span className="ml-3">{category.category}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.games.map(game => (
                <button 
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className={`text-left group glass p-6 rounded-3xl border border-${category.color}-500/20 hover:border-${category.color}-500/50 transition-all relative overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${category.color}-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-${category.color}-500/20 transition-all`}></div>
                  <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-sm text-slate-400">{game.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default BrainGames;
