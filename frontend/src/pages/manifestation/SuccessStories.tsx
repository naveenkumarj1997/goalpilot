import { motion } from 'framer-motion';
import { Star, Trophy, ArrowRight } from 'lucide-react';

export default function SuccessStories() {
  const stories = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Software Engineer to Tech Lead",
      story: "I manifested my promotion to Tech Lead within 8 months using the Goal Manifestor and daily affirmations. I broke my goal into weekly targets, upskilled aggressively, and visualized the promotion conversation every single morning.",
      duration: "8 Months",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      id: 2,
      name: "David Chen",
      role: "Freelancer to Agency Owner",
      story: "The Opportunity Tracker changed my life. By logging every small lead and following up relentlessly while keeping my Vision Board front and center, I turned my solo freelancing gig into a 5-person agency.",
      duration: "1.5 Years",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      role: "Achieved Dream Physique",
      story: "Combining the Success Habits tracker with my workout routine kept me accountable. The AI Success Coach gave me the harsh truths I needed when I wanted to quit. Down 40lbs and running my first marathon next month!",
      duration: "10 Months",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-yellow-500/20 text-yellow-400 rounded-full mb-6">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-black text-white mb-6">Success Stories</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Proof that manifestation works when combined with relentless, focused action. Read how others used the lab to transform their lives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stories.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-3xl p-8 border border-white/5 hover:border-yellow-500/30 transition-all duration-300 relative group overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-yellow-500/20 transition-colors" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 group-hover:border-yellow-400 transition-colors" />
              <div>
                <h3 className="text-xl font-bold text-white">{story.name}</h3>
                <p className="text-yellow-400 text-sm font-bold">{story.role}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 mb-4 text-yellow-400 relative z-10">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>

            <p className="text-slate-300 leading-relaxed mb-8 flex-1 relative z-10 italic">
              "{story.story}"
            </p>

            <div className="flex items-center justify-between text-sm font-bold text-slate-500 mt-auto border-t border-white/5 pt-4 relative z-10">
              <span className="uppercase tracking-wider">Timeframe:</span>
              <span className="text-white bg-slate-800 px-3 py-1 rounded-full">{story.duration}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 glass rounded-3xl p-12 border border-blue-500/30 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 pointer-events-none" />
        <h2 className="text-3xl font-black text-white mb-4 relative z-10">You are next.</h2>
        <p className="text-slate-300 max-w-xl mx-auto mb-8 relative z-10">
          The only difference between you and them is time and execution. Stay consistent with your goals and habits.
        </p>
        <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors inline-flex items-center relative z-10 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          Go To Goal Manifestor <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}