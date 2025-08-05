'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Timer } from '@/components/game/Timer';
import { StreakCounter } from '@/components/game/StreakCounter';
import { QuestionCard } from '@/components/game/QuestionCard';
import { GameOverScreen } from '@/components/game/GameOverScreen';
import { useConvex } from 'convex/react';
import { useAuth } from '@clerk/nextjs';

export default function GamePage() {
  const router = useRouter();
  const convex = useConvex();
  const { isSignedIn } = useAuth();
  const {
    isPlaying,
    currentQuestion,
    currentStreak,
    bestStreak,
    correctAnswers,
    incorrectAnswers,
    timeRemaining,
    showResults,
    submitAnswer,
    updateTimer,
    endGame,
    startGame,
    setShowResults,
  } = useGameStore();

  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
  }>({ show: false, isCorrect: false, message: '' });

  // Initialize game if not already playing
  useEffect(() => {
    if (!isPlaying && !showResults) {
      // Pass convex client if user is signed in
      startGame('streak', isSignedIn ? convex : undefined);
    }
  }, [isPlaying, showResults, startGame, isSignedIn, convex]);

  // Timer logic is now handled by the Timer component itself

  const handleAnswer = (answer: string) => {
    const isCorrect = submitAnswer(answer);
    
    // Show feedback
    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect ? 'Correct! 🎉' : 'Wrong answer 😞'
    });

    // Hide feedback after delay
    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
    }, 2000);

    // Reset hint visibility
    setShowHint(false);
  };

  const handleTimeUp = () => {
    endGame(isSignedIn ? convex : undefined);
  };

  const handlePlayAgain = () => {
    setShowResults(false);
    startGame('streak', isSignedIn ? convex : undefined);
  };

  const handleGoHome = () => {
    setShowResults(false);
    router.push('/');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Strik - Football Trivia',
        text: `I just scored a ${currentStreak}-question streak on Strik! Can you beat it?`,
        url: window.location.origin,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `I just scored a ${currentStreak}-question streak on Strik! Can you beat it? ${window.location.origin}`
      );
    }
  };

  if (!currentQuestion && !showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl animate-float-gentle" />
        </div>
        
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-lg font-semibold text-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading question...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/3 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-amber-500/3 rounded-full blur-2xl animate-float-gentle" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-sky-500/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8 max-w-2xl mx-auto relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={handleGoHome}
          className="p-3 glass rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 group"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 text-foreground group-hover:text-primary transition-colors duration-200" />
        </motion.button>
        
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <h1 className="text-2xl font-black gradient-text tracking-tight">STRIK</h1>
          <p className="text-sm font-medium text-muted-foreground">Football Trivia</p>
        </motion.div>

        <motion.button
          onClick={() => setShowHint(!showHint)}
          className={`p-3 glass rounded-xl border transition-all duration-200 group ${
            currentQuestion?.hint 
              ? 'border-primary/20 hover:border-primary/40 hover:bg-primary/5' 
              : 'border-white/10 opacity-50 cursor-not-allowed'
          }`}
          disabled={!currentQuestion?.hint}
          whileHover={currentQuestion?.hint ? { scale: 1.05, y: -2 } : undefined}
          whileTap={currentQuestion?.hint ? { scale: 0.95 } : undefined}
        >
          <HelpCircle className={`w-5 h-5 transition-colors duration-200 ${
            currentQuestion?.hint 
              ? 'text-primary group-hover:text-primary-hover' 
              : 'text-muted-foreground'
          }`} />
        </motion.button>
      </motion.div>

      <div className="max-w-2xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div
              key="game-over"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <GameOverScreen
                finalStreak={currentStreak}
                bestStreak={bestStreak}
                totalCorrect={correctAnswers}
                totalIncorrect={incorrectAnswers}
                onPlayAgain={handlePlayAgain}
                onGoHome={handleGoHome}
                onShare={handleShare}
              />
            </motion.div>
          ) : (
            <motion.div
              key="game-play"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Timer and Streak */}
              <motion.div 
                className="flex items-center justify-between gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Timer
                  timeRemaining={timeRemaining}
                  totalTime={currentQuestion?.timeLimit || 30}
                  onTimeUp={handleTimeUp}
                  isActive={isPlaying}
                />
                
                <StreakCounter
                  currentStreak={currentStreak}
                  bestStreak={bestStreak}
                />
              </motion.div>

              {/* Question Card */}
              {currentQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    disabled={!isPlaying}
                    showHint={showHint}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Feedback Toast */}
        <AnimatePresence>
          {feedback.show && (
            <motion.div
              className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-2xl text-white font-bold shadow-floating z-50 border backdrop-blur-sm ${
                feedback.isCorrect 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400/30' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400/30'
              }`}
              initial={{ opacity: 0, y: 100, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 100, scale: 0.8, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="flex items-center gap-3"
                animate={feedback.isCorrect ? { scale: [1, 1.1, 1] } : { x: [-5, 5, -5, 0] }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="text-2xl">
                  {feedback.isCorrect ? '🎉' : '😞'}
                </span>
                <span className="text-lg">
                  {feedback.message}
                </span>
              </motion.div>
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full rounded-2xl"
                animate={{
                  translateX: ['100%', '200%'],
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}