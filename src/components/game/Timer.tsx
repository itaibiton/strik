'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '@/lib/utils';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  onTimeUp: () => void;
  isActive: boolean;
  className?: string;
}

export function Timer({ 
  timeRemaining, 
  totalTime, 
  onTimeUp, 
  isActive,
  className = ''
}: TimerProps) {
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  
  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setDisplayTime((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const percentage = (displayTime / totalTime) * 100;
  const isWarning = displayTime <= 5;
  const isCritical = displayTime <= 3;

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative ${className}`} role="timer" aria-live="polite">
      <motion.div
        className="relative w-24 h-24 mx-auto"
        animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
        aria-label={`Time remaining: ${displayTime} seconds`}
      >
        {/* Background circle */}
        <svg
          className="w-24 h-24 transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`
              ${isCritical ? 'text-red-500 drop-shadow-lg' : 
                isWarning ? 'text-amber-500 drop-shadow-md' : 
                'text-primary drop-shadow-sm'}
            `}
            style={{
              filter: isCritical ? 'drop-shadow(0 0 8px rgb(239 68 68))' : 
                      isWarning ? 'drop-shadow(0 0 6px rgb(245 158 11))' : 
                      'drop-shadow(0 0 4px hsl(var(--primary)))'
            }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`text-2xl font-bold tabular-nums ${
              isCritical ? 'text-red-500' : 
              isWarning ? 'text-amber-500' : 
              'text-foreground'
            }`}
            animate={isCritical ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3, repeat: isCritical ? Infinity : 0 }}
            style={{
              textShadow: isCritical ? '0 0 10px rgb(239 68 68)' : 
                         isWarning ? '0 0 8px rgb(245 158 11)' : 
                         '0 0 4px hsl(var(--primary) / 0.3)'
            }}
          >
            {formatTime(displayTime)}
          </motion.span>
        </div>
      </motion.div>

      {/* Warning indicators */}
      {isWarning && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(239, 68, 68, 0.4)',
              '0 0 0 20px rgba(239, 68, 68, 0)',
            ],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </div>
  );
}