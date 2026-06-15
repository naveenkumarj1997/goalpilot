import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Briefcase, HeartCrack, Brain, Flame, Skull, CloudRain, AlertCircle, HelpCircle } from 'lucide-react';

const SITUATIONS = [
  {
    id: 'job_loss',
    icon: Briefcase,
    title: 'Rejected from Job / Job Loss',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    advice: "A Stoic recognizes that the hiring decision is outside their control. Your only control lies in your preparation, your effort, and how you respond. Instead of feeling unworthy, view it as the universe redirecting you. Epictetus would say: 'Don't demand that things happen as you wish, but wish that they happen as they do happen, and you will go on well.'"
  },
  {
    id: 'breakup',
    icon: HeartCrack,
    title: 'Breakup or Rejection',
    color: 'text-pink-400',
    border: 'border-pink-500/30',
    advice: "You cannot force someone to love you. A Stoic accepts that people are free to make their own choices. The pain comes from the story you tell yourself ('I am unlovable', 'I will be alone forever'), not the event itself. Focus on loving yourself and being a good person. The right companion will naturally align with that."
  },
  {
    id: 'stress',
    icon: Brain,
    title: 'Overwhelming Stress',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    advice: "Stress is caused by carrying the weight of the future into the present. A Stoic breaks problems down. Ask yourself: 'What is the immediate next step in front of me?' Focus entirely on that single step. Seneca wrote: 'True happiness is to enjoy the present, without anxious dependence upon the future.'"
  },
  {
    id: 'anger',
    icon: Flame,
    title: 'Anger at Someone',
    color: 'text-red-400',
    border: 'border-red-500/30',
    advice: "Anger is temporary madness. When someone wrongs you, a Stoic believes they do so out of ignorance of what is good. Instead of retaliating, which harms your own character, respond with patience or silence. Marcus Aurelius said: 'The best revenge is to be unlike him who performed the injury.'"
  },
  {
    id: 'failure',
    icon: AlertCircle,
    title: 'Failing at a Goal',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    advice: "Failure is just feedback. A Stoic separates their self-worth from the outcome. Did you try your best? Did you act with virtue? If yes, then you succeeded in what was under your control. The external result is indifferent. Learn the lesson, adjust your strategy, and try again without emotional baggage."
  },
  {
    id: 'anxiety',
    icon: CloudRain,
    title: 'General Anxiety / Overthinking',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    advice: "Anxiety stems from imagination running wild about scenarios that haven't occurred. Bring yourself back to the physical present. 'We suffer more often in imagination than in reality.' Ask yourself: 'Is there anything I can do about this right now?' If yes, do it. If no, worrying is useless."
  },
  {
    id: 'grief',
    icon: Skull,
    title: 'Fear of Loss / Grief',
    color: 'text-gray-400',
    border: 'border-gray-500/30',
    advice: "Everything we have is borrowed from Fortune, and eventually, it must be returned. A Stoic practices gratitude for the time they had with what was lost, rather than bitterness that it was taken away. 'He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.'"
  }
];

export default function LifeSituations() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="text-center mb-12">
        <Compass className="h-10 w-10 text-amber-400 mx-auto mb-4" />
        <h1 className="text-4xl font-serif font-bold text-white mb-4">
          Life Situation Guide
        </h1>
        <p className="text-blue-200/70 max-w-2xl mx-auto text-lg">
          Select a situation you are currently struggling with to see how an ancient Stoic would approach the problem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SITUATIONS.map((sit) => {
          const Icon = sit.icon;
          const isSelected = selectedId === sit.id;

          return (
            <motion.div
              key={sit.id}
              layout
              onClick={() => setSelectedId(isSelected ? null : sit.id)}
              className={`cursor-pointer glass rounded-2xl border transition-all duration-300 ${
                isSelected 
                  ? `col-span-1 md:col-span-2 lg:col-span-3 bg-[#1e293b] ${sit.border} shadow-[0_0_30px_rgba(0,0,0,0.3)]` 
                  : `bg-[#0f172a]/60 hover:bg-[#1e293b]/80 hover:border-amber-500/30 border-white/5`
              }`}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-3 rounded-xl bg-black/30 ${sit.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white font-serif">{sit.title}</h2>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-black/20 rounded-xl border border-white/5 relative">
                        <HelpCircle className={`absolute top-4 right-4 h-16 w-16 opacity-5 ${sit.color}`} />
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3">The Stoic Perspective</h3>
                        <p className="text-blue-50/90 text-lg leading-relaxed font-serif">
                          {sit.advice}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
