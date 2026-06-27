import React from 'react';

interface GoldenSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function GoldenSpinner({ size = 'md', className = '' }: GoldenSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-2',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-transparent border-t-[#D4AF37] border-r-[#D4AF37] ${sizeClasses[size]}`}
        style={{
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.2)',
          filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.6))'
        }}
      ></div>
    </div>
  );
}
