'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Award, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { LeaderboardEntry } from '@/types';

export default function LeaderboardPage() {
  const router = useRouter();
  const { bestStreak, totalGamesPlayed, correctAnswers, incorrectAnswers } = useGameStore();

  // Mock leaderboard data - in a real app, this would come from a backend
  const leaderboardData: LeaderboardEntry[] = [
    {
      userId: 'current-user',
      username: 'You',
      bestStreak: bestStreak,
      totalGamesPlayed: totalGamesPlayed,
      winRate: totalGamesPlayed > 0 ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) : 0,
      ranking: bestStreak >= 15 ? 1 : bestStreak >= 10 ? 2 : bestStreak >= 5 ? 3 : 4,
    },
    {
      userId: '1',
      username: 'FootballMaster',
      bestStreak: 47,
      totalGamesPlayed: 156,
      winRate: 78,
      ranking: 1,
    },
    {
      userId: '2',
      username: 'SoccerPro',
      bestStreak: 32,
      totalGamesPlayed: 89,
      winRate: 85,
      ranking: 2,
    },
    {
      userId: '3',
      username: 'TriviaKing',
      bestStreak: 28,
      totalGamesPlayed: 134,
      winRate: 72,
      ranking: 3,
    },
    {
      userId: '4',
      username: 'QuizWhiz',
      bestStreak: 21,
      totalGamesPlayed: 67,
      winRate: 81,
      ranking: 4,
    },
    {
      userId: '5',
      username: 'FieldExpert',
      bestStreak: 19,
      totalGamesPlayed: 98,
      winRate: 69,
      ranking: 5,
    },
  ].sort((a, b) => b.bestStreak - a.bestStreak)
   .map((entry, index) => ({ ...entry, ranking: index + 1 }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-600" />;
      default: return <Trophy className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      default: return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
          <p className="text-sm text-gray-500">Top Football Trivia Players</p>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Stats Summary */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-field-600">{bestStreak}</div>
              <div className="text-sm text-gray-500">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalGamesPlayed}</div>
              <div className="text-sm text-gray-500">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalGamesPlayed > 0 ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Top Players</h2>
            <p className="text-sm text-gray-500">Ranked by highest streak achieved</p>
          </div>

          <div className="divide-y divide-gray-100">
            {leaderboardData.map((entry, index) => (
              <motion.div
                key={entry.userId}
                className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 ${
                  entry.userId === 'current-user' ? 'bg-field-50 border-l-4 border-field-500' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankColor(entry.ranking)}`}>
                    {entry.ranking <= 3 ? getRankIcon(entry.ranking) : (
                      <span className="font-bold text-gray-600">#{entry.ranking}</span>
                    )}
                  </div>

                  {/* User Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${entry.userId === 'current-user' ? 'text-field-700' : 'text-gray-800'}`}>
                        {entry.username}
                      </h3>
                      {entry.userId === 'current-user' && (
                        <span className="px-2 py-1 bg-field-500 text-white text-xs rounded-full">You</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {entry.totalGamesPlayed} games • {entry.winRate}% accuracy
                    </p>
                  </div>
                </div>

                {/* Best Streak */}
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    entry.ranking === 1 ? 'text-yellow-600' :
                    entry.ranking === 2 ? 'text-gray-600' :
                    entry.ranking === 3 ? 'text-orange-600' :
                    'text-gray-700'
                  }`}>
                    {entry.bestStreak}
                  </div>
                  <div className="text-xs text-gray-500">best streak</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={() => router.push('/game')}
            className="bg-field-500 hover:bg-field-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
          >
            Play Now to Improve Your Rank!
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p>Rankings update in real-time based on your best streak</p>
        </motion.div>
      </div>
    </div>
  );
}