'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Award, Crown, Globe, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { LeaderboardEntry, LeaderboardFilters } from '@/types';
import { LeaderboardFilters as FiltersComponent } from '@/components/leaderboard/LeaderboardFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

export default function LeaderboardPage() {
  const router = useRouter();
  const { bestStreak, totalGamesPlayed, correctAnswers, incorrectAnswers } = useGameStore();

  // Filter state
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timePeriod: 'all-time',
    gameMode: 'all',
    region: 'all',
    sortBy: 'streak'
  });

  // Mock user location - in real app, this would come from geolocation or user profile
  const userCountry = 'US';
  const userRegion = 'North America';

  // Mock leaderboard data with enhanced fields
  const allLeaderboardData: LeaderboardEntry[] = [
    {
      userId: 'current-user',
      username: 'You',
      bestStreak: bestStreak,
      totalGamesPlayed: totalGamesPlayed,
      winRate: totalGamesPlayed > 0 ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) : 0,
      ranking: 1,
      country: userCountry,
      region: userRegion,
      gameMode: 'streak',
      lastPlayed: new Date(),
    },
    {
      userId: '1',
      username: 'FootballMaster',
      bestStreak: 47,
      totalGamesPlayed: 156,
      winRate: 78,
      ranking: 1,
      country: 'BR',
      region: 'South America',
      gameMode: 'streak',
      lastPlayed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      userId: '2',
      username: 'SoccerPro',
      bestStreak: 32,
      totalGamesPlayed: 89,
      winRate: 85,
      ranking: 2,
      country: 'US',
      region: 'North America',
      gameMode: 'streak',
      lastPlayed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      userId: '3',
      username: 'TriviaKing',
      bestStreak: 28,
      totalGamesPlayed: 134,
      winRate: 72,
      ranking: 3,
      country: 'GB',
      region: 'Europe',
      gameMode: 'practice',
      lastPlayed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      userId: '4',
      username: 'QuizWhiz',
      bestStreak: 21,
      totalGamesPlayed: 67,
      winRate: 81,
      ranking: 4,
      country: 'DE',
      region: 'Europe',
      gameMode: 'versus',
      lastPlayed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
    {
      userId: '5',
      username: 'FieldExpert',
      bestStreak: 19,
      totalGamesPlayed: 98,
      winRate: 69,
      ranking: 5,
      country: 'FR',
      region: 'Europe',
      gameMode: 'streak',
      lastPlayed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
    {
      userId: '6',
      username: 'LocalChamp',
      bestStreak: 25,
      totalGamesPlayed: 45,
      winRate: 88,
      ranking: 6,
      country: 'US',
      region: 'North America',
      gameMode: 'streak',
      lastPlayed: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
  ];

  // Filter the leaderboard data based on current filters
  const filteredLeaderboardData = useMemo(() => {
    let filtered = [...allLeaderboardData];

    // Filter by game mode
    if (filters.gameMode !== 'all') {
      filtered = filtered.filter(entry => entry.gameMode === filters.gameMode);
    }

    // Filter by region
    if (filters.region === 'local') {
      filtered = filtered.filter(entry => entry.country === userCountry);
    } else if (filters.region !== 'all') {
      filtered = filtered.filter(entry => entry.country === filters.region);
    }

    // Filter by time period
    if (filters.timePeriod !== 'all-time') {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (filters.timePeriod) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      filtered = filtered.filter(entry => 
        entry.lastPlayed && entry.lastPlayed >= cutoffDate
      );
    }

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'winRate':
          return b.winRate - a.winRate;
        case 'gamesPlayed':
          return b.totalGamesPlayed - a.totalGamesPlayed;
        case 'streak':
        default:
          return b.bestStreak - a.bestStreak;
      }
    });

    // Update rankings
    return filtered.map((entry, index) => ({ ...entry, ranking: index + 1 }));
  }, [allLeaderboardData, filters, userCountry]);

  const availableCountries = [...new Set(allLeaderboardData.map(entry => entry.country).filter(Boolean))] as string[];

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

  const getCountryFlag = (countryCode: string) => {
    const flagMap: Record<string, string> = {
      'US': '🇺🇸',
      'BR': '🇧🇷',
      'GB': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
    };
    return flagMap[countryCode] || '🌍';
  };

  const getGameModeIcon = (gameMode?: string) => {
    switch (gameMode) {
      case 'streak': return <TrendingUp className="w-4 h-4" />;
      case 'practice': return <Trophy className="w-4 h-4" />;
      case 'versus': return <Globe className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl animate-float-gentle"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-6 max-w-4xl mx-auto relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-black gradient-text mb-2">Leaderboard</h1>
          <p className="text-muted-foreground font-medium">Top Football Trivia Champions</p>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Filters */}
        <FiltersComponent 
          filters={filters}
          onFiltersChange={setFilters}
          userCountry={userCountry}
          availableCountries={availableCountries}
        />

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card variant="glass" className="border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold gradient-text-primary flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Your Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{bestStreak}</div>
                  <div className="text-sm text-muted-foreground font-medium">Best Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-info mb-1">{totalGamesPlayed}</div>
                  <div className="text-sm text-muted-foreground font-medium">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-1">
                    {totalGamesPlayed > 0 ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card variant="glass" className="border border-white/10 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold gradient-text-primary flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Champions
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {filteredLeaderboardData.length} player{filteredLeaderboardData.length !== 1 ? 's' : ''}
                </div>
              </div>
              {filters.timePeriod !== 'all-time' || filters.gameMode !== 'all' || filters.region !== 'all' ? (
                <p className="text-sm text-muted-foreground">
                  Filtered results - showing top performers matching your criteria
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Global leaderboard - all time best streaks
                </p>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {filteredLeaderboardData.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No players found</p>
                  <p className="text-sm">Try adjusting your filters to see more results</p>
                </div>
              ) : (
                <div className="divide-y divide-border/20">
                  {filteredLeaderboardData.map((entry, index) => (
                    <motion.div
                      key={entry.userId}
                      className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors duration-200 ${
                        entry.userId === 'current-user' ? 'bg-primary/10 border-l-4 border-primary' : ''
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Rank */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(entry.ranking)} shadow-lg`}>
                          {entry.ranking <= 3 ? getRankIcon(entry.ranking) : (
                            <span className="font-bold text-foreground">#{entry.ranking}</span>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${entry.userId === 'current-user' ? 'text-primary' : 'text-foreground'}`}>
                              {entry.username}
                            </h3>
                            {entry.country && (
                              <span className="text-lg" title={entry.country}>
                                {getCountryFlag(entry.country)}
                              </span>
                            )}
                            {entry.userId === 'current-user' && (
                              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                                You
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{entry.totalGamesPlayed} games</span>
                            <span>•</span>
                            <span>{entry.winRate}% accuracy</span>
                            {entry.gameMode && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  {getGameModeIcon(entry.gameMode)}
                                  <span className="capitalize">{entry.gameMode}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Best Streak */}
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${
                            entry.ranking === 1 ? 'text-warning' :
                            entry.ranking === 2 ? 'text-muted-foreground' :
                            entry.ranking === 3 ? 'text-orange-500' :
                            'text-foreground'
                          }`}>
                            {entry.bestStreak}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">best streak</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            onClick={() => router.push('/game')}
            variant="field"
            size="xl"
            className="font-bold text-lg px-8 py-4 relative group overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              Challenge the Champions
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full"
              animate={{ translateX: ["100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </Button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground font-medium">
            Rankings update in real-time • Compete globally or locally
          </p>
        </motion.div>
      </div>
    </div>
  );
}