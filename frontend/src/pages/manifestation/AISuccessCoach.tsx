import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { askSuccessCoach } from '../../api/manifestation';

export default function AISuccessCoach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{role: 'user' | 'coach', text: string}[]>([
    { role: 'coach', text: "Hello! I am your AI Success Coach. I've reviewed your manifestation profile and goals. What would you like to focus on today? I can help with mindset shifts, strategy, or just giving you a motivational push!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user?.token) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await askSuccessCoach(userMessage, user.token);
      setMessages(prev => [...prev, { role: 'coach', text: response.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'coach', text: "I'm having trouble connecting to my neural net right now. Please try again in a moment!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col pb-6">
      <div className="mb-6 flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <h1 className="text-2xl font-black text-white leading-tight">AI Success Coach</h1>
          <p className="text-indigo-400 text-sm font-bold">Powered by Google Gemini</p>
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl border border-indigo-500/30 overflow-hidden flex flex-col shadow-2xl relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent z-10">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-emerald-500/20 ml-3' : 'bg-indigo-500/20 mr-3'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-emerald-400" /> : <Bot className="w-5 h-5 text-indigo-400" />}
                </div>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-indigo-500/20 rounded-tl-none'} whitespace-pre-wrap leading-relaxed shadow-lg`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/20 mr-3">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 text-slate-200 border border-indigo-500/20 rounded-tl-none flex gap-2 items-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-900/80 border-t border-indigo-500/30 backdrop-blur-md z-10">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for advice, strategy, or motivation..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-2xl transition-colors flex items-center justify-center min-w-[64px]"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}