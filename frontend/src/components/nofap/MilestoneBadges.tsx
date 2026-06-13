import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Star, Trophy, Crown, Flame } from 'lucide-react';

interface MilestoneBadgesProps {
  currentStreak: number;
}

const MILESTONES = [
  { day: 1, label: 'First Step', icon: Star, color: 'text-yellow-400' },
  { day: 3, label: '3 Days', icon: Flame, color: 'text-orange-500' },
  { day: 7, label: '1 Week', icon: Shield, color: 'text-emerald-500' },
  { day: 14, label: '2 Weeks', icon: Shield, color: 'text-emerald-400' },
  { day: 21, label: '3 Weeks', icon: Award, color: 'text-blue-500' },
  { day: 30, label: '1 Month', icon: Trophy, color: 'text-indigo-500' },
  { day: 60, label: '2 Months', icon: Trophy, color: 'text-purple-500' },
  { day: 90, label: '90 Days', icon: Crown, color: 'text-fuchsia-500' },
  { day: 180, label: '6 Months', icon: Crown, color: 'text-rose-500' },
  { day: 365, label: '1 Year', icon: Crown, color: 'text-brand' },
];

export default function MilestoneBadges({ currentStreak }: MilestoneBadgesProps) {
  return (
    <div className="glass p-6 rounded-xl border border-emerald-100/20">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
        <Award className="h-5 w-5 mr-2 text-brand" />
        Achievement Badges
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {MILESTONES.map((milestone, idx) => {
          const isAchieved = currentStreak >= milestone.day;
          const Icon = milestone.icon;
          
          return (
            <motion.div
              key={milestone.day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                isAchieved 
                  ? 'border-brand/30 bg-brand/5 shadow-[0_0_10px_rgba(0,112,209,0.15)]' 
                  : 'border-gray-200/10 bg-black/20 opacity-50 grayscale'
              }`}
            >
              <div className={`p-3 rounded-full mb-2 ${isAchieved ? 'bg-brand/10' : 'bg-gray-800/50'}`}>
                <Icon className={`h-6 w-6 ${isAchieved ? milestone.color : 'text-gray-500'}`} />
              </div>
              <span className="text-xs font-medium text-text-secondary whitespace-nowrap">
                {milestone.label}
              </span>
              <span className="text-[10px] text-gray-500">
                Day {milestone.day}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
