import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Bot, User, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INITIAL_MESSAGE = {
  id: '1',
  text: "Hello! I'm your Programmatic Memory Coach. I don't use the cloud or cost any tokens. Tell me what you're trying to learn, and I'll use my knowledge base to give you mnemonic devices, memory palace strategies, and study plans!",
  sender: 'bot'
};

const PROGRAMMATIC_KNOWLEDGE_BASE: Record<string, string> = {
  'math': "To remember math formulas, try the 'Memory Palace' technique. Place numbers and symbols along a familiar route in your house. E.g. A giant Pi pie on your couch.",
  'code': "For programming syntax, 'Active Recall' is best. Don't re-read docs. Try to write the function from memory, check the error, and fix it. Repetition builds the neural path.",
  'react': "To remember React hooks: 'useState' is a box, 'useEffect' is an alarm clock that rings when dependencies change, and 'useRef' is a sticky note that doesn't cause a re-render.",
  'language': "For vocabulary, use 'Spaced Repetition' and vivid imagery. If learning Spanish 'perro' (dog), imagine a dog eating a pear (pear-ro).",
  'history': "Use 'Chunking' for dates. Instead of 1776, think 17-76. Link it to something personal if possible.",
  'default': "That's an interesting topic! To memorize anything effectively, break it down into chunks, test yourself without looking at notes (Active Recall), and review it over increasing intervals (Spaced Repetition)."
};

const AIMemoryCoach = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Programmatic matching logic
    setTimeout(() => {
      const lowerInput = userMsg.text.toLowerCase();
      let foundResponse = PROGRAMMATIC_KNOWLEDGE_BASE['default'];
      
      for (const [key, response] of Object.entries(PROGRAMMATIC_KNOWLEDGE_BASE)) {
        if (key !== 'default' && lowerInput.includes(key)) {
          foundResponse = response;
          break;
        }
      }

      const botMsg = { id: (Date.now() + 1).toString(), text: foundResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 600); // simulate typing delay
  };

  return (
    <div className="max-w-4xl mx-auto py-8 h-[calc(100vh-100px)] flex flex-col animate-slide-up-fade">
      <div className="flex items-center mb-6 px-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <Brain className="w-6 h-6 text-blue-400 animate-pulse-slow" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Programmatic Memory Coach</h1>
          <p className="text-sm text-blue-400">100% Client-Side • Zero API Costs</p>
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl border border-blue-500/20 mx-4 mb-6 overflow-hidden flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-700 ml-3' : 'bg-blue-600 mr-3'}`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm md:text-base ${
                  msg.sender === 'user' 
                    ? 'bg-slate-800 text-white border border-slate-700 rounded-tr-none' 
                    : 'bg-blue-500/10 border border-blue-500/30 text-blue-50 rounded-tl-none shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me how to memorize something..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-white focus:border-blue-500 focus:outline-none"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-center mt-3 text-xs text-slate-500">
            <Zap className="w-3 h-3 text-yellow-500 mr-1" /> Powered by deterministic logic mapping.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMemoryCoach;
