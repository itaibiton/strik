'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Star } from 'lucide-react';
import { getStreakMessage, getStreakColor } from '@/lib/utils';

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
  className?: string;
}

export function StreakCounter({ 
  currentStreak, 
  bestStreak, 
  className = '' 
}: StreakCounterProps) {
  const streakMessage = getStreakMessage(currentStreak);
  const streakColor = getStreakColor(currentStreak);
  
  const getStreakIcon = (streak: number) => {
    if (streak >= 50) return Trophy;
    if (streak >= 10) return Star;
    if (streak >= 3) return Flame;
    return null;
  };

  const StreakIcon = getStreakIcon(currentStreak);
  const milestones = [5, 10, 20, 50];
  const nextMilestone = milestones.find(m => m > currentStreak);

  return (
    <div className={`text-center ${className}`}>
      {/* Current Streak Display */}
      <motion.div
        className="relative mb-4"
        key={currentStreak} // Re-animate when streak changes
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <motion.div
          className={`text-6xl font-bold tabular-nums gradient-text`}
          animate={currentStreak > 0 ? { 
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.6 }}
          style={{
            textShadow: currentStreak >= 10 ? '0 0 20px hsl(var(--trophy-gold))' :
                       currentStreak >= 5 ? '0 0 15px hsl(var(--field-grass))' :
                       currentStreak > 0 ? '0 0 10px hsl(var(--primary))' : 'none'
          }}
        >
          {currentStreak}
        </motion.div>
        
        {/* Streak Icon */}
        <AnimatePresence>
          {StreakIcon && (
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <StreakIcon className={`w-8 h-8 ${streakColor}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Streak Message */}
      <motion.div
        className="mb-3"
        key={streakMessage}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-lg font-semibold text-muted-foreground">
          {streakMessage}
        </p>
      </motion.div>

      {/* Progress to Next Milestone */}
      {nextMilestone && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-sm text-muted-foreground mb-2">
            Next milestone: {nextMilestone}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(currentStreak / nextMilestone) * 100}%` 
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                boxShadow: '0 0 10px hsl(var(--primary) / 0.5)'
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {currentStreak} / {nextMilestone}
          </div>
        </motion.div>
      )}

      {/* Best Streak */}
      {bestStreak > 0 && (
        <motion.div
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Best: {bestStreak}</span>
        </motion.div>
      )}

      {/* Milestone Celebration */}
      <AnimatePresence>
        {milestones.includes(currentStreak) && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            {/* Enhanced confetti-like particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-3 h-3 rounded-full ${
                  i % 3 === 0 ? 'bg-amber-400' : 
                  i % 3 === 1 ? 'bg-emerald-400' : 
                  'bg-sky-400'
                }`}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 300}%`,
                  y: `${50 + (Math.random() - 0.5) * 300}%`,
                  scale: [0, 1.5, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                style={{
                  boxShadow: '0 0 10px currentColor'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}