'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Target, Clock } from 'lucide-react';
import { Question } from '@/types';
import { getDifficultyColor } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MotionButton } from '@/components/ui/Button';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  showHint?: boolean;
  className?: string;
}

export function QuestionCard({ 
  question, 
  onAnswer, 
  disabled = false,
  showHint = false,
  className = '' 
}: QuestionCardProps) {
  const [answer, setAnswer] = useState('');
  const [showHintText, setShowHintText] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setAnswer('');
    setShowHintText(false);
    setSuggestions([]);
  }, [question.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !disabled) {
      onAnswer(answer.trim());
    }
  };

  const handleInputChange = (value: string) => {
    setAnswer(value);
    
    // Simple suggestion logic - in a real app, this would be more sophisticated
    if (value.length >= 2) {
      const filtered = question.acceptedAnswers
        .filter(accepted => 
          accepted.toLowerCase().includes(value.toLowerCase()) ||
          value.toLowerCase().includes(accepted.toLowerCase())
        )
        .slice(0, 3);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setAnswer(suggestion);
    setSuggestions([]);
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      layout
    >
      <Card className="glass border-2 border-primary/20 shadow-xl">
        <CardHeader>
          {/* Question Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {question.category}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Difficulty Badge */}
              <span className={`
                px-3 py-1 rounded-full text-xs font-semibold border
                ${question.difficulty === 'easy' 
                  ? 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800'
                  : question.difficulty === 'medium'
                  ? 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-800'
                  : 'text-red-700 bg-red-100 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-800'
                }
              `}>
                {question.difficulty.toUpperCase()}
              </span>
              
              {/* Time Limit */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-xs">{question.timeLimit}s</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Question Text */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl md:text-2xl font-bold leading-relaxed">
              {question.text}
            </h2>
          </motion.div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-label="Answer submission form">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Type your answer..."
                  className="text-lg py-3 h-auto"
                  disabled={disabled}
                  autoComplete="off"
                  autoFocus
                  aria-label="Your answer"
                  aria-describedby="answer-help"
                />
              </motion.div>
          
              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {suggestions.length > 0 && !disabled && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <MotionButton
                type="submit"
                disabled={!answer.trim() || disabled}
                variant="field"
                size="lg"
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                Submit Answer
              </MotionButton>
            </motion.div>
          </form>

          {/* Hint Section */}
          {question.hint && showHint && (
            <motion.div
              className="mt-4 pt-4 border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <MotionButton
                type="button"
                onClick={() => setShowHintText(!showHintText)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 p-0 h-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: showHintText ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HelpCircle className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium">
                  {showHintText ? 'Hide Hint' : 'Show Hint'}
                </span>
              </MotionButton>
              
              <AnimatePresence>
                {showHintText && (
                  <motion.div
                    className="mt-2 p-3 bg-muted rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-muted-foreground">
                      💡 {question.hint}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}