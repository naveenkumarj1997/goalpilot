import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactionData {
  id: string;
  emoji: string;
  userId: string;
  username: string;
  xOffset: number;
}

export default function FloatingReactions(_props: { roomId?: string }) {
  const { socket } = useSocket();
  const [reactions, setReactions] = useState<ReactionData[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleReaction = (data: { userId: string, username: string, emoji: string }) => {
      const newReaction: ReactionData = {
        id: `${Date.now()}-${Math.random()}`,
        emoji: data.emoji,
        userId: data.userId,
        username: data.username,
        xOffset: Math.random() * 80 - 40 // Random horizontal offset between -40px and +40px
      };

      setReactions(prev => [...prev, newReaction]);

      // Remove after animation completes (3 seconds)
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== newReaction.id));
      }, 3000);
    };

    socket.on('wt-reaction', handleReaction);

    return () => {
      socket.off('wt-reaction', handleReaction);
    };
  }, [socket]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              y: -200, 
              scale: [0.5, 1.2, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute bottom-20 flex flex-col items-center pointer-events-none"
            style={{ left: `calc(50% + ${reaction.xOffset}px)`, marginLeft: '-24px' }}
          >
            <div className="flex flex-col items-center">
              <span className="text-4xl drop-shadow-lg filter">{reaction.emoji}</span>
              <span className="text-[10px] font-bold text-white bg-black/50 px-1.5 rounded mt-1 truncate max-w-[60px]">
                {reaction.username.split(' ')[0]}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
