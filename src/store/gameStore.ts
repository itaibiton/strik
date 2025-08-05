import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Question, User, UserStats, Achievement } from '@/types';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface GameStore extends GameState {
  // Game actions
  startGame: (mode?: 'streak' | 'versus' | 'practice', convexClient?: any) => Promise<void>;
  endGame: (convexClient?: any) => Promise<void>;
  nextQuestion: () => void;
  submitAnswer: (answer: string) => boolean;
  updateTimer: (time: number) => void;
  resetStreak: () => void;
  incrementStreak: () => void;
  
  // User management
  user: User | null;
  setUser: (user: User) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  
  // UI state
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Question management
  availableQuestions: Question[];
  setAvailableQuestions: (questions: Question[]) => void;
  usedQuestionIds: string[];
  addUsedQuestion: (questionId: string) => void;
  clearUsedQuestions: () => void;
  
  // Convex session tracking
  currentSessionId: Id<'gameSessions'> | null;
  setCurrentSessionId: (id: Id<'gameSessions'> | null) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial game state
      isPlaying: false,
      currentQuestion: null,
      currentStreak: 0,
      bestStreak: 0,
      totalGamesPlayed: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      timeRemaining: 30,
      gameMode: 'streak',
      difficulty: 'adaptive',
      
      // UI state
      showResults: false,
      isLoading: false,
      
      // User state
      user: null,
      
      // Question state
      availableQuestions: [],
      usedQuestionIds: [],
      
      // Convex session tracking
      currentSessionId: null,
      
      // Game actions
      startGame: async (mode = 'streak', convexClient?) => {
        const state = get();
        const availableQuestions = state.availableQuestions.filter(
          q => !state.usedQuestionIds.includes(q.id)
        );
        
        if (availableQuestions.length === 0) {
          // Reset used questions if we've exhausted the pool
          set({ usedQuestionIds: [] });
        }
        
        const nextQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)] || state.availableQuestions[0];
        
        set({
          isPlaying: true,
          gameMode: mode,
          currentQuestion: nextQuestion,
          currentStreak: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          timeRemaining: nextQuestion?.timeLimit || 30,
          showResults: false,
        });
        
        // Create game session in Convex if client is provided
        if (convexClient) {
          try {
            const sessionId = await convexClient.mutation(api.gameSessions.startGameSession, {
              gameMode: mode,
            });
            set({ currentSessionId: sessionId });
          } catch (error) {
            console.error('Failed to create game session:', error);
          }
        }
        
        if (nextQuestion) {
          get().addUsedQuestion(nextQuestion.id);
        }
      },
      
      endGame: async (convexClient?) => {
        const state = get();
        const newBestStreak = Math.max(state.currentStreak, state.bestStreak);
        
        set({
          isPlaying: false,
          currentQuestion: null,
          bestStreak: newBestStreak,
          totalGamesPlayed: state.totalGamesPlayed + 1,
          showResults: true,
        });
        
        // Complete game session and update user stats in Convex
        if (convexClient && state.currentSessionId) {
          try {
            // Complete the game session
            await convexClient.mutation(api.gameSessions.completeGameSession, {
              sessionId: state.currentSessionId,
              finalScore: state.correctAnswers * 10,
              finalStreak: state.currentStreak,
              questionsAnswered: state.correctAnswers + state.incorrectAnswers,
              correctAnswers: state.correctAnswers,
            });
            
            // Update user game stats
            await convexClient.mutation(api.users.updateUserGameStats, {
              score: state.correctAnswers * 10,
              streak: state.currentStreak,
            });
            
            set({ currentSessionId: null });
          } catch (error) {
            console.error('Failed to complete game session:', error);
          }
        }
        
        // Update local user stats if user exists
        if (state.user) {
          get().updateUserStats({
            totalGamesPlayed: state.totalGamesPlayed + 1,
            bestStreak: newBestStreak,
          });
        }
      },
      
      nextQuestion: () => {
        const state = get();
        const availableQuestions = state.availableQuestions.filter(
          q => !state.usedQuestionIds.includes(q.id)
        );
        
        if (availableQuestions.length === 0) {
          // Reset used questions if we've exhausted the pool
          set({ usedQuestionIds: [] });
          const nextQuestion = state.availableQuestions[Math.floor(Math.random() * state.availableQuestions.length)];
          set({
            currentQuestion: nextQuestion,
            timeRemaining: nextQuestion?.timeLimit || 30,
          });
          if (nextQuestion) {
            get().addUsedQuestion(nextQuestion.id);
          }
        } else {
          const nextQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
          set({
            currentQuestion: nextQuestion,
            timeRemaining: nextQuestion?.timeLimit || 30,
          });
          if (nextQuestion) {
            get().addUsedQuestion(nextQuestion.id);
          }
        }
      },
      
      submitAnswer: (answer: string) => {
        const state = get();
        const question = state.currentQuestion;
        
        if (!question) return false;
        
        const normalizedAnswer = answer.toLowerCase().trim();
        const isCorrect = question.acceptedAnswers.some(
          acceptedAnswer => acceptedAnswer.toLowerCase().includes(normalizedAnswer) ||
          normalizedAnswer.includes(acceptedAnswer.toLowerCase())
        );
        
        if (isCorrect) {
          set({
            correctAnswers: state.correctAnswers + 1,
            currentStreak: state.currentStreak + 1,
          });
          get().nextQuestion();
        } else {
          set({
            incorrectAnswers: state.incorrectAnswers + 1,
          });
          get().endGame();
        }
        
        return isCorrect;
      },
      
      updateTimer: (time: number) => {
        set({ timeRemaining: time });
        if (time <= 0) {
          get().endGame();
        }
      },
      
      resetStreak: () => {
        set({ currentStreak: 0 });
      },
      
      incrementStreak: () => {
        const state = get();
        set({ currentStreak: state.currentStreak + 1 });
      },
      
      // User management
      setUser: (user: User) => {
        set({ user });
      },
      
      updateUserStats: (stats: Partial<UserStats>) => {
        const state = get();
        if (state.user) {
          set({
            user: {
              ...state.user,
              stats: {
                ...state.user.stats,
                ...stats,
              },
            },
          });
        }
      },
      
      unlockAchievement: (achievement: Achievement) => {
        const state = get();
        if (state.user) {
          const existingAchievement = state.user.achievements.find(a => a.id === achievement.id);
          if (!existingAchievement) {
            set({
              user: {
                ...state.user,
                achievements: [...state.user.achievements, { ...achievement, unlockedAt: new Date() }],
              },
            });
          }
        }
      },
      
      // UI state
      setShowResults: (show: boolean) => {
        set({ showResults: show });
      },
      
      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      // Question management
      setAvailableQuestions: (questions: Question[]) => {
        set({ availableQuestions: questions });
      },
      
      addUsedQuestion: (questionId: string) => {
        const state = get();
        if (!state.usedQuestionIds.includes(questionId)) {
          set({ usedQuestionIds: [...state.usedQuestionIds, questionId] });
        }
      },
      
      clearUsedQuestions: () => {
        set({ usedQuestionIds: [] });
      },
      
      setCurrentSessionId: (id: Id<'gameSessions'> | null) => {
        set({ currentSessionId: id });
      },
    }),
    {
      name: 'strik-game-store',
      partialize: (state) => ({
        bestStreak: state.bestStreak,
        totalGamesPlayed: state.totalGamesPlayed,
        correctAnswers: state.correctAnswers,
        incorrectAnswers: state.incorrectAnswers,
        user: state.user,
        usedQuestionIds: state.usedQuestionIds,
      }),
    }
  )
);