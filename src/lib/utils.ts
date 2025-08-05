import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  return seconds.toString().padStart(2, '0');
}

export function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize whitespace
}

export function calculateScore(streak: number, timeRemaining: number, totalTime: number): number {
  const baseScore = 100;
  const streakBonus = streak * 10;
  const timeBonus = Math.floor((timeRemaining / totalTime) * 50);
  return baseScore + streakBonus + timeBonus;
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Let's get started!";
  if (streak < 3) return "Good start!";
  if (streak < 5) return "You're on fire!";
  if (streak < 10) return "Incredible streak!";
  if (streak < 20) return "Unstoppable!";
  if (streak < 50) return "Football genius!";
  return "LEGENDARY!";
}

export function getStreakColor(streak: number): string {
  if (streak === 0) return "text-gray-500";
  if (streak < 3) return "text-blue-500";
  if (streak < 5) return "text-green-500";
  if (streak < 10) return "text-orange-500";
  if (streak < 20) return "text-red-500";
  if (streak < 50) return "text-purple-500";
  return "text-yellow-500";
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-green-500 bg-green-50';
    case 'medium': return 'text-yellow-500 bg-yellow-50';
    case 'hard': return 'text-red-500 bg-red-50';
    default: return 'text-gray-500 bg-gray-50';
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}