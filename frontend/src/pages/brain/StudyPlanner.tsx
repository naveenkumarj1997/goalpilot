import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

const StudyPlanner = () => {
  const [examDate, setExamDate] = useState('');
  const [topics, setTopics] = useState('');
  const [dailyHours, setDailyHours] = useState(2);
  const [plan, setPlan] = useState<any[]>([]);

  const generatePlan = () => {
    if (!examDate || !topics) return;
    
    const targetDate = new Date(examDate);
    const now = new Date();
    const daysUntilExam = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExam <= 0) {
      alert("Exam date must be in the future!");
      return;
    }

    const topicList = topics.split(',').map(t => t.trim()).filter(t => t);
    if (topicList.length === 0) return;

    // Deterministic Algorithm: 
    // - 70% of days for initial learning (divided equally among topics)
    // - 20% of days for spaced repetition and active recall
    // - 10% of days for mock exams
    
    const learningDays = Math.max(1, Math.floor(daysUntilExam * 0.7));
    const reviewDays = Math.max(1, Math.floor(daysUntilExam * 0.2));
    const mockDays = Math.max(1, daysUntilExam - learningDays - reviewDays);

    const generatedPlan = [];
    
    // Phase 1: Learning
    const daysPerTopic = Math.max(1, Math.floor(learningDays / topicList.length));
    topicList.forEach(topic => {
      generatedPlan.push({
        phase: 'Learning Phase',
        topic: topic,
        duration: `${daysPerTopic} Days (${daysPerTopic * dailyHours} Hours)`,
        method: 'Feynman Technique & Note-taking',
        color: 'blue'
      });
    });

    // Phase 2: Review
    generatedPlan.push({
      phase: 'Spaced Repetition Phase',
      topic: 'All Topics',
      duration: `${reviewDays} Days (${reviewDays * dailyHours} Hours)`,
      method: 'Flashcards & Active Recall',
      color: 'indigo'
    });

    // Phase 3: Mock
    generatedPlan.push({
      phase: 'Final Polish Phase',
      topic: 'Simulated Exam Environment',
      duration: `${mockDays} Days (${mockDays * dailyHours} Hours)`,
      method: 'Mock Exams (No Notes)',
      color: 'emerald'
    });

    setPlan(generatedPlan);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-slide-up-fade">
      
      <div className="text-center mb-12">
        <Calendar className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl font-black text-white mb-4">Algorithmic Study Planner</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Input your exam date and topics. Our deterministic algorithm will map out a mathematically optimal study schedule prioritizing Spaced Repetition and Active Recall.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Form */}
        <div className="glass p-8 rounded-3xl border border-indigo-500/20 h-fit">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" /> Exam Parameters
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Exam Date</label>
              <input 
                type="date" 
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Daily Study Commitment (Hours)</label>
              <input 
                type="number" min="1" max="16"
                value={dailyHours}
                onChange={e => setDailyHours(parseInt(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Topics (Comma separated)</label>
              <textarea 
                placeholder="e.g. React Hooks, Node.js, System Design"
                value={topics}
                onChange={e => setTopics(e.target.value)}
                className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none custom-scrollbar"
              />
            </div>

            <button 
              onClick={generatePlan}
              disabled={!examDate || !topics}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors"
            >
              Generate Protocol
            </button>
          </div>
        </div>

        {/* Output Plan */}
        <div className="lg:col-span-2">
          {plan.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 glass rounded-3xl border-dashed border-indigo-500/30 text-center">
              <Clock className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">Awaiting parameters to generate schedule...</p>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up-fade">
              <h2 className="text-2xl font-bold text-white mb-6">Your Accelerated Protocol</h2>
              
              {plan.map((step, idx) => (
                <div key={idx} className={`glass p-6 rounded-2xl border border-${step.color}-500/30 relative overflow-hidden group`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-2 bg-${step.color}-500`}></div>
                  <div className="flex items-start">
                    <div className="flex-1 ml-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider text-${step.color}-400`}>
                          {step.phase}
                        </span>
                        <span className="text-sm text-slate-400 flex items-center">
                          <Clock className="w-4 h-4 mr-1" /> {step.duration}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.topic}</h3>
                      <div className="flex items-center text-slate-300 text-sm bg-slate-800 w-fit px-3 py-1 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                        Technique: {step.method}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudyPlanner;
