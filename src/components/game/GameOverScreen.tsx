'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Clock, RotateCcw, Home, Share2 } from 'lucide-react';
import { GameSession } from '@/types';
import { getStreakMessage, calculateScore } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

interface GameOverScreenProps {
  finalStreak: number;
  bestStreak: number;
  totalCorrect: number;
  totalIncorrect: number;
  gameSession?: GameSession;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onShare?: () => void;
  className?: string;
}

export function GameOverScreen({
  finalStreak,
  bestStreak,
  totalCorrect,
  totalIncorrect,
  gameSession,
  onPlayAgain,
  onGoHome,
  onShare,
  className = ''
}: GameOverScreenProps) {
  const isNewBest = finalStreak === bestStreak && finalStreak > 0;
  const totalQuestions = totalCorrect + totalIncorrect;
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const score = calculateScore(finalStreak, 0, 30); // Simplified score calculation

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`max-w-md mx-auto ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="glass border-2 border-primary/20 shadow-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <motion.div
            className="text-center mb-6"
            variants={itemVariants}
          >
            <div className="relative mb-4">
              <motion.div
                className={`text-6xl font-bold gradient-text ${isNewBest ? 'animate-pulse' : ''}`}
                animate={isNewBest ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 1, repeat: isNewBest ? 2 : 0 }}
                style={{
                  textShadow: isNewBest ? '0 0 20px hsl(var(--trophy-gold))' : 
                             finalStreak >= 10 ? '0 0 15px hsl(var(--primary))' : 'none'
                }}
              >
                {finalStreak}
              </motion.div>
          
          {isNewBest && (
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Trophy className="w-8 h-8 text-yellow-500" />
            </motion.div>
          )}
        </div>

            <motion.h2
              className={`text-2xl font-bold mb-2 ${isNewBest ? 'text-amber-500' : ''}`}
              variants={itemVariants}
            >
              {isNewBest ? 'New Personal Best!' : 'Game Over'}
            </motion.h2>
            
            <motion.p
              className="text-lg text-muted-foreground"
              variants={itemVariants}
            >
              {getStreakMessage(finalStreak)}
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-6"
            variants={itemVariants}
          >
            <Card className="bg-muted/50 text-center">
              <CardContent className="p-4">
                <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50 text-center">
              <CardContent className="p-4">
                <Clock className="w-6 h-6 text-sky-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50 text-center">
              <CardContent className="p-4">
                <div className="w-6 h-6 bg-emerald-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div className="text-2xl font-bold text-emerald-500">{totalCorrect}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50 text-center">
              <CardContent className="p-4">
                <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✕</span>
                </div>
                <div className="text-2xl font-bold text-red-500">{totalIncorrect}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Previous Best */}
          {bestStreak > finalStreak && (
            <motion.div variants={itemVariants} className="mb-6">
              <Card className="bg-muted/30 text-center">
                <CardContent className="p-3">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Personal Best: {bestStreak}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="space-y-3"
            variants={itemVariants}
          >
            <Button
              onClick={onPlayAgain}
              variant="field"
              size="lg"
              className="w-full"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={onGoHome}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <Home className="w-5 h-5" />
                Home
              </Button>

              {onShare && (
                <Button
                  onClick={onShare}
                  variant="stadium"
                  size="lg"
                  className="flex-1"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Enhanced Confetti Effect for New Best */}
      {isNewBest && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-4 h-4 rounded-full ${
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
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1.5, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              style={{
                boxShadow: '0 0 15px currentColor'
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}