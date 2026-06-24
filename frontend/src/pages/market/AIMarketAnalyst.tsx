import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { askAiAnalyst } from '../../api/market';
import { BrainCircuit, Send, User, ShieldAlert } from 'lucide-react';

const AIMarketAnalyst: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your AI Market Analyst. What financial or tech trends would you like to understand today? Please remember, I provide educational insights, not financial advice.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user?.token) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const data = await askAiAnalyst(user.token, userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, my server is currently overloaded or the AI quota was exceeded. Try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col space-y-4">
      {/* Disclaimer */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 flex-shrink-0">
        <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-400 font-bold text-sm">Strictly Educational</h3>
          <p className="text-red-300/80 text-xs mt-1">
            This AI Analyst will not provide financial advice, predict stock prices, or guarantee returns. It is designed to explain economic concepts and market trends.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-fuchsia-400" />
          <h2 className="text-white font-bold">AI Market Analyst</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-300 rounded-tl-sm border border-slate-700'}`}>
                  {msg.text.split('\n').map((line, j) => (
                    <React.Fragment key={j}>
                      {line}<br/>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                  <BrainCircuit className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-700 flex space-x-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about markets, tech trends, or economic concepts..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-50 disabled:hover:bg-fuchsia-500 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIMarketAnalyst;
