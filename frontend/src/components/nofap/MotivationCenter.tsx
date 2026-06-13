import React, { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { getMotivation } from '../../api/nofap';
import { useAuth } from '../../context/AuthContext';

interface QuoteData {
  text: string;
  author: string;
}

export default function MotivationCenter() {
  const { user } = useAuth();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotivation = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : null;
        if (token) {
          const data = await getMotivation(token);
          setQuote(data);
        }
      } catch (error) {
        console.error('Error fetching motivation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMotivation();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-32 glass rounded-xl border border-emerald-100/20"></div>;
  }

  return (
    <div className="relative overflow-hidden glass rounded-xl p-8 border border-emerald-100/20">
      {/* Background decoration */}
      <div className="absolute -top-4 -right-4 text-brand/10 transform rotate-12">
        <Quote size={120} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <Quote className="h-8 w-8 text-brand mb-4" />
        <h3 className="text-xl md:text-2xl font-serif italic text-text-primary mb-4 max-w-2xl">
          "{quote?.text || "Discipline equals freedom."}"
        </h3>
        <div className="w-12 h-1 bg-brand rounded-full mb-3"></div>
        <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">
          {quote?.author || "Jocko Willink"}
        </p>
      </div>
    </div>
  );
}
