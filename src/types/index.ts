export interface Player {
  id: string;
  name: string;
  nationality: string;
  position: string;
  currentTeam?: string;
  formerTeams: string[];
  achievements: string[];
  imageUrl?: string;
}

export interface Question {
  id: string;
  text: string;
  acceptedAnswers: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hint?: string;
  timeLimit: number; // in seconds
  relatedPlayers?: string[];
}

export interface GameState {
  isPlaying: boolean;
  currentQuestion: Question | null;
  currentStreak: number;
  bestStreak: number;
  totalGamesPlayed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeRemaining: number;
  gameMode: 'streak' | 'versus' | 'practice';
  difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  stats: UserStats;
  achievements: Achievement[];
  friends: string[];
  preferences: UserPreferences;
}

export interface UserStats {
  totalGamesPlayed: number;
  bestStreak: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  averageAnswerTime: number;
  winRate: number;
  currentRating: number;
  gamesWon: number;
  gamesLost: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserPreferences {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
  preferredCategories: string[];
  theme: 'light' | 'dark' | 'auto';
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  bestStreak: number;
  totalGamesPlayed: number;
  winRate: number;
  ranking: number;
}

export interface GameSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  questionsAnswered: QuestionResult[];
  finalStreak: number;
  gameMode: 'streak' | 'versus' | 'practice';
  opponentId?: string;
  result?: 'win' | 'loss' | 'draw';
}

export interface QuestionResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeToAnswer: number;
  streakAtTime: number;
}

export interface GameConfig {
  defaultTimeLimit: number;
  streakMilestones: number[];
  difficultyThresholds: {
    easy: number;
    medium: number;
    hard: number;
  };
  achievementTriggers: Record<string, (stats: UserStats) => boolean>;
}