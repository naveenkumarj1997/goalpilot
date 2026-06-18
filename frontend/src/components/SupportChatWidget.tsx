import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserMessages, sendMessage, markAsRead } from '../services/supportService';

export default function SupportChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Exclude Admin from seeing the user widget (Admin has their own dashboard tab)
  if (user?.role === 'Admin' || user?.role === 'SuperAdmin') return null;

  const fetchMessages = async () => {
    if (!user?.token) return;
    try {
      const data = await getUserMessages(user.token);
      setMessages(data);
      const unread = data.filter((m: any) => m.sender === 'Admin' && !m.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (unreadCount > 0 && user?.token) {
        markAsRead(user.token).then(() => setUnreadCount(0));
      }
    }
  }, [isOpen, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.token) return;
    try {
      const sentMsg = await sendMessage(newMessage, user.token);
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/30 transition-transform hover:scale-110 flex items-center justify-center"
      >
        <HelpCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Admin Support</h3>
                <p className="text-slate-400 text-xs">Ask to unlock modules</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 text-sm mt-10">
                Send a message to the admin if you need help or want to request access to a locked module.
              </div>
            ) : (
              messages.map((msg: any) => {
                const isUser = msg.sender === 'User';
                return (
                  <div key={msg._id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isUser ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}`}>
                      {msg.text}
                      <div className={`text-[10px] mt-1 ${isUser ? 'text-indigo-200 text-right' : 'text-slate-500'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-slate-900 border border-slate-700 rounded-full pl-4 pr-12 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-full disabled:opacity-50 hover:bg-indigo-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
