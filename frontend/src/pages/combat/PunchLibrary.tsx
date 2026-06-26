import React from 'react';
import { BookOpen } from 'lucide-react';

const punches = [
  {
    number: '1',
    name: 'Jab',
    type: 'Straight',
    description: 'The most important punch. Fast, sets up distance, and disrupts the opponent.',
    mechanics: 'Step forward slightly with lead foot, rotate shoulder, keep chin tucked, snap the arm out and back fast.'
  },
  {
    number: '2',
    name: 'Cross / Straight Right',
    type: 'Straight',
    description: 'The power hand. Thrown straight down the pipe from the rear hand.',
    mechanics: 'Pivot the rear foot, rotate the hips and shoulders, extend the rear arm fully while the lead hand guards the face.'
  },
  {
    number: '3',
    name: 'Lead Hook',
    type: 'Hook',
    description: 'Devastating power punch thrown from the side, targeting the jaw or temple.',
    mechanics: 'Transfer weight to rear leg, pivot lead foot, rotate hips, swing arm horizontally with elbow bent at 90 degrees.'
  },
  {
    number: '4',
    name: 'Rear Hook',
    type: 'Hook',
    description: 'Power punch from the rear side. Less common than the lead hook but very dangerous.',
    mechanics: 'Similar to the cross but the arm loops horizontally. Requires massive hip rotation.'
  },
  {
    number: '5',
    name: 'Lead Uppercut',
    type: 'Uppercut',
    description: 'Thrown upwards through the guard, targeting the chin or solar plexus.',
    mechanics: 'Dip slightly, drop the lead shoulder, drive upward from the legs, keep the palm facing you.'
  },
  {
    number: '6',
    name: 'Rear Uppercut',
    type: 'Uppercut',
    description: 'The most powerful uppercut. Thrown from the rear hand to split the guard.',
    mechanics: 'Dip to the rear side, pivot rear foot, drive upward with the legs and hips, explode through the target.'
  }
];

const PunchLibrary = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-slide-up-fade">
      <div className="text-center mb-12">
        <BookOpen className="w-16 h-16 text-brand mx-auto mb-4 animate-ps-glow" />
        <h1 className="text-4xl font-bold text-white neon-text-brand mb-2">Punch Library</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Master the mechanics of the 6 fundamental punches of boxing and kickboxing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {punches.map((punch) => (
          <div key={punch.number} className="glass p-6 rounded-3xl border border-emerald-500/20 hover:border-brand/40 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{punch.name}</h2>
              <span className="w-10 h-10 rounded-full bg-brand/20 text-brand font-bold text-xl flex items-center justify-center border border-brand/40">
                {punch.number}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                {punch.type}
              </span>
            </div>
            <p className="text-slate-300 mb-4">{punch.description}</p>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <h4 className="text-sm font-bold text-brand mb-1">Mechanics</h4>
              <p className="text-sm text-slate-400">{punch.mechanics}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PunchLibrary;
