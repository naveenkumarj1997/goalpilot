import React, { useState } from 'react';
import { Award, Code, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';

const INTERVIEW_BANKS: Record<string, any[]> = {
  "Software Engineering": [
    {
      question: "What is the Virtual DOM in React?",
      keywords: ["representation", "memory", "sync", "reconciliation", "diffing", "performance", "copy"],
      ideal: "The Virtual DOM is a lightweight memory representation of the real DOM. React uses it to improve performance by doing a 'diffing' process to only update the real DOM where changes occurred."
    },
    {
      question: "Explain Closures in JavaScript.",
      keywords: ["function", "scope", "lexical", "access", "outer", "inner", "encapsulation", "data privacy"],
      ideal: "A closure is a function that remembers its outer lexical environment even after the outer function has returned. It's often used for data privacy and encapsulation."
    },
    {
      question: "What is the difference between SQL and NoSQL databases?",
      keywords: ["relational", "tables", "schema", "document", "collections", "scale", "unstructured", "join"],
      ideal: "SQL databases are relational, table-based, and have a fixed schema. NoSQL are non-relational, document-based, and have dynamic schemas, making them better for unstructured data and horizontal scaling."
    }
  ],
  "Accounting & Finance": [
    {
      question: "What is the difference between Accounts Payable and Accounts Receivable?",
      keywords: ["liability", "owe", "asset", "receive", "customers", "vendors", "balance sheet"],
      ideal: "Accounts Payable is a liability representing money the company owes to vendors. Accounts Receivable is an asset representing money customers owe to the company."
    },
    {
      question: "Explain the matching principle in accounting.",
      keywords: ["expenses", "revenues", "period", "incurred", "earned", "accrual", "income statement"],
      ideal: "The matching principle states that expenses should be recognized and recorded in the same accounting period as the revenues they help generate, fundamental to accrual accounting."
    }
  ],
  "Medicine & Healthcare": [
    {
      question: "What are the classic symptoms of myocardial infarction (Heart Attack)?",
      keywords: ["chest pain", "pressure", "radiating", "arm", "jaw", "shortness of breath", "diaphoresis", "sweating", "nausea"],
      ideal: "Classic symptoms include crushing chest pain or pressure, often radiating to the left arm or jaw, accompanied by shortness of breath, diaphoresis (sweating), and nausea."
    },
    {
      question: "Explain the difference between Type 1 and Type 2 Diabetes.",
      keywords: ["autoimmune", "insulin", "production", "pancreas", "resistance", "lifestyle", "receptors"],
      ideal: "Type 1 is an autoimmune condition where the pancreas produces little to no insulin. Type 2 is characterized by insulin resistance, where the body produces insulin but receptors don't respond properly."
    }
  ],
  "Teaching & Education": [
    {
      question: "What is the difference between formative and summative assessment?",
      keywords: ["ongoing", "during", "feedback", "improve", "end", "evaluate", "grade", "final"],
      ideal: "Formative assessments are ongoing checks during learning to provide feedback and improve instruction. Summative assessments occur at the end of a unit to evaluate learning and assign a grade."
    },
    {
      question: "Explain Vygotsky's Zone of Proximal Development (ZPD).",
      keywords: ["difference", "independent", "guidance", "scaffolding", "support", "peer"],
      ideal: "The ZPD is the difference between what a learner can do independently and what they can do with guidance or scaffolding from a teacher or more capable peer."
    }
  ]
};

const InterviewRecall = () => {
  const [selectedBank, setSelectedBank] = useState<string>("Software Engineering");
  const [activeQuestion, setActiveQuestion] = useState(-1);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{ score: number, matched: string[], missed: string[] } | null>(null);

  const startMock = () => {
    setActiveQuestion(0);
    setAnswer('');
    setResult(null);
  };

  const nextQuestion = () => {
    const bank = INTERVIEW_BANKS[selectedBank];
    if (activeQuestion < bank.length - 1) {
      setActiveQuestion(prev => prev + 1);
      setAnswer('');
      setResult(null);
    } else {
      setActiveQuestion(-1);
    }
  };

  const submitAnswer = () => {
    if (!answer.trim()) return;

    const bank = INTERVIEW_BANKS[selectedBank];
    const currentQ = bank[activeQuestion];
    const answerLower = answer.toLowerCase();
    
    const matched: string[] = [];
    const missed: string[] = [];

    currentQ.keywords.forEach(kw => {
      if (answerLower.includes(kw)) {
        matched.push(kw);
      } else {
        missed.push(kw);
      }
    });

    const score = Math.round((matched.length / currentQ.keywords.length) * 100);
    setResult({ score, matched, missed });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-slide-up-fade">
      
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <Award className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Interview Recall Trainer</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Test your technical recall. We use a programmatic keyword matching algorithm to grade your answers instantly, simulating high-pressure interviews without API costs.
        </p>
      </div>

      {activeQuestion === -1 ? (
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8 text-left">
            <label className="block text-sm font-medium text-slate-400 mb-2">Select Your Profession / Industry</label>
            <select 
              value={selectedBank}
              onChange={e => setSelectedBank(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-white focus:border-emerald-500 focus:outline-none appearance-none"
            >
              {Object.keys(INTERVIEW_BANKS).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={startMock}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105"
          >
            <Play className="w-6 h-6 mr-2 fill-current" /> Start Mock Interview
          </button>
        </div>
      ) : (
        <div className="glass rounded-3xl p-8 border border-emerald-500/20 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-4 py-1 rounded-full text-sm">
              Question {activeQuestion + 1} of {INTERVIEW_BANKS[selectedBank].length}
            </span>
            <span className="text-slate-400 text-sm border border-slate-700 px-3 py-1 rounded-lg bg-slate-900/50">
              {selectedBank}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">
            {INTERVIEW_BANKS[selectedBank][activeQuestion].question}
          </h2>

          {!result ? (
            <div className="space-y-6 animate-slide-up-fade">
              <textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your complete answer here..."
                className="w-full h-40 bg-slate-900/80 border border-slate-700 rounded-2xl p-4 text-white focus:border-emerald-500 focus:outline-none custom-scrollbar"
                autoFocus
              />
              <button 
                onClick={submitAnswer}
                disabled={!answer.trim()}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-slide-up-fade">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Evaluation Result</h3>
                  <div className={`text-3xl font-black ${result.score >= 70 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {result.score}%
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-slate-400 mb-2">Required Technical Keywords Hit:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.matched.map(kw => (
                      <span key={kw} className="flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" /> {kw}
                      </span>
                    ))}
                    {result.missed.map(kw => (
                      <span key={kw} className="flex items-center px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                        <XCircle className="w-3 h-3 mr-1" /> {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <h4 className="text-sm font-bold text-blue-400 mb-2">Ideal Answer Structure:</h4>
                  <p className="text-blue-50 text-sm leading-relaxed">{INTERVIEW_BANKS[selectedBank][activeQuestion].ideal}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={nextQuestion}
                  className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
                >
                  {activeQuestion < INTERVIEW_BANKS[selectedBank].length - 1 ? 'Next Question' : 'Finish Interview'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default InterviewRecall;
