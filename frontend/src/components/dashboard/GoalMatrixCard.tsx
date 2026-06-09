import { useMemo } from 'react';
import type { Goal } from '../../types/goal';
import { generateGoalMatrix } from '../../utils/matrixCalculator';
import type { MatrixCell } from '../../utils/matrixCalculator';
import { CheckCircle, XCircle, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface GoalMatrixCardProps {
  goal: Goal;
}

export default function GoalMatrixCard({ goal }: GoalMatrixCardProps) {
  const matrix = useMemo(() => generateGoalMatrix(goal), [goal]);

  if (matrix.length === 0) {
    return null;
  }

  // Calculate some basic stats
  const achievedDays = matrix.filter(c => c.status === 'achieved').length;
  const failedDays = matrix.filter(c => c.status === 'failed').length;
  const totalPastDays = achievedDays + failedDays;
  const consistency = totalPastDays > 0 ? Math.round((achievedDays / totalPastDays) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-text-primary flex items-center">
            <Target className="w-4 h-4 mr-2 text-brand" />
            {goal.name}
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            {consistency}% Consistency • {goal.completedHours || 0} / {goal.totalRequiredHours || '?'} hrs
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {matrix.map((cell, idx) => {
          let bgColor = 'bg-gray-100 border-gray-200';
          let icon = null;

          if (cell.status === 'achieved') {
            bgColor = 'bg-emerald-100 border-emerald-300 text-emerald-600';
            icon = <CheckCircle className="w-3 h-3 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />;
          } else if (cell.status === 'failed') {
            bgColor = 'bg-red-100 border-red-300 text-red-600';
            icon = <XCircle className="w-3 h-3 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />;
          }

          return (
            <div 
              key={idx} 
              className={`w-6 h-6 rounded border flex items-center justify-center relative group cursor-help transition-colors ${bgColor}`}
            >
              {icon}
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-max bg-gray-900 text-white text-xs rounded-lg py-1 px-2 shadow-xl z-10 pointer-events-none">
                <div className="font-semibold">{new Date(cell.date).toLocaleDateString()}</div>
                <div className="text-gray-300 mt-1">Required: {cell.required.toFixed(1)} hrs</div>
                <div className="text-gray-300">Logged: {cell.logged.toFixed(1)} hrs</div>
                {cell.status === 'failed' && (
                  <div className="text-red-400 mt-1">Missed by {(cell.required - cell.logged).toFixed(1)} hrs</div>
                )}
                {cell.status === 'achieved' && (
                  <div className="text-emerald-400 mt-1">Target Achieved!</div>
                )}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
