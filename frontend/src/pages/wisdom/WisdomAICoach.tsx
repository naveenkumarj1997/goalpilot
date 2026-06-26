import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Send, Bot, Sparkles, User as UserIcon } from 'lucide-react';
import axios from 'axios';

interface WisdomAICoachProps {
  onClose: () => void;
  bookTitle: string;
  currentLesson: string | null;
  language: 'en' | 'ta';
}

const WisdomAICoach: React.FC<WisdomAICoachProps> = ({ onClose, bookTitle, currentLesson, language }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const greeting = language === 'en' 
      ? `Hello! I'm your AI Book Coach. We're currently reading "${bookTitle}". ${currentLesson ? `We are on the lesson: "${currentLesson}".` : ''} How can I help you apply this to your life?`
      : `வணக்கம்! நான் உங்கள் AI வழிகாட்டி. நாம் இப்போது "${bookTitle}" புத்தகத்தை படித்துக் கொண்டிருக்கிறோம். ${currentLesson ? `தற்போதைய பாடம்: "${currentLesson}".` : ''} இதை உங்கள் வாழ்க்கையில் எப்படி பயன்படுத்துவது என்று கேளுங்கள்.`;
    
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [bookTitle, currentLesson, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user?.token) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/intelligence/chat`,
        {
          message: userMessage,
          context: `You are an elite Wisdom Book Coach on the GoalPilot platform. 
          The user is reading the book: "${bookTitle}".
          Current Lesson context (if any): "${currentLesson || 'General Overview'}".
          USER LANGUAGE PREFERENCE: ${language === 'ta' ? 'TAMIL' : 'ENGLISH'}.
          CRITICAL INSTRUCTION: If the language is TAMIL, you MUST reply entirely in natural, colloquial Tamil. Do not use overly formal/robotic Tamil. Use everyday Tamil spoken in Tamil Nadu, with practical, culturally relevant examples (e.g. family, local jobs, studies). Act as a mentor.
          If the language is ENGLISH, reply in English like an expert executive coach.`
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: language === 'ta' ? 'மன்னிக்கவும், பிணைய பிழை ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.' : 'Sorry, there was a network error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-brand/30 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-[0_0_50px_rgba(0,112,209,0.2)] animate-slide-up-fade">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center mr-3">
              <Bot className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">AI Book Coach</h3>
              <p className="text-brand text-xs flex items-center"><Sparkles className="w-3 h-3 mr-1" /> Gemini Powered</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-emerald-500/20 text-emerald-400 ml-3' : 'bg-brand/20 text-brand mr-3'}`}>
                  {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 mr-3">
                  <Bot className="w-4 h-4 text-brand" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-none flex items-center space-x-2">
                  <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={language === 'ta' ? 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...' : 'Ask your coach how to apply this lesson...'}
              className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none h-12 custom-scrollbar"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-brand hover:bg-brand-hover text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WisdomAICoach;
