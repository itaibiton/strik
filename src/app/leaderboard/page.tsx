'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Award, Crown, Globe, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LeaderboardFilters } from '@/types';
import { LeaderboardFilters as FiltersComponent } from '@/components/leaderboard/LeaderboardFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

export default function LeaderboardPage() {
  const router = useRouter();

  // Filter state
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timePeriod: 'all-time',
    gameMode: 'all',
    region: 'all',
    sortBy: 'streak'
  });

  // Get real user data from Convex
  const currentUserStats = useQuery(api.users.getUserStatsWithWinRate);
  const userRank = useQuery(api.users.getUserRank, {
    timePeriod: filters.timePeriod,
    gameMode: filters.gameMode,
    sortBy: filters.sortBy,
    region: filters.region === 'local' ? currentUserStats?.country || 'all' : filters.region,
  });
  const leaderboardData = useQuery(api.users.getFilteredLeaderboard, {
    limit: 50,
    timePeriod: filters.timePeriod,
    gameMode: filters.gameMode,
    sortBy: filters.sortBy,
    region: filters.region === 'local' ? currentUserStats?.country || 'all' : filters.region,
  });

  // User location from database
  const userCountry = currentUserStats?.country || 'US';
  const userRegion = currentUserStats?.region || 'North America';

  // Transform Convex data to match expected format
  const transformedLeaderboardData = useMemo(() => {
    if (!leaderboardData) return [];
    
    return leaderboardData.map((user, index) => {
      const displayName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || 'Anonymous Player';
      
      return {
        userId: user._id,
        username: displayName,
        avatar: user.imageUrl,
        bestStreak: user.bestStreak,
        totalGamesPlayed: user.totalGamesPlayed,
        winRate: user.winRate,
        ranking: user.ranking,
        country: user.country,
        region: user.region,
        gameMode: 'streak' as const, // Default game mode for display
        lastPlayed: user.lastPlayed ? new Date(user.lastPlayed) : undefined,
        isCurrentUser: currentUserStats ? user.clerkId === currentUserStats.clerkId : false,
      };
    });
  }, [leaderboardData, currentUserStats]);

  // Data is already filtered and sorted by Convex queries
  const filteredLeaderboardData = transformedLeaderboardData;
  
  // Get available countries from the data
  const availableCountries = useMemo(() => {
    if (!leaderboardData) return [];
    return [...new Set(leaderboardData.map(entry => entry.country).filter(Boolean))] as string[];
  }, [leaderboardData]);

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

        {/* User Stats Loading or Display */}
        {currentUserStats === undefined ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Card variant="glass" className="border border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-lg text-muted-foreground">Loading your stats...</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : currentUserStats === null ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Card variant="glass" className="border border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-lg text-muted-foreground mb-2">Sign in to view your stats</div>
                  <p className="text-sm text-muted-foreground">
                    Create an account to track your progress and compete on the leaderboard!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* User Ranking Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Card variant="glass" className="border border-white/10">
                <CardContent className="pt-6">
                  <div className="text-center">
                    {userRank === undefined ? (
                      <div className="text-lg text-muted-foreground">Loading your rank...</div>
                    ) : userRank && userRank.rank ? (
                      <div className="text-2xl font-bold gradient-text-primary mb-2">
                        Your Rank: #{userRank.rank} out of {userRank.totalPlayers} players
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-muted-foreground mb-2">
                          Unranked
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {currentUserStats.totalGamesPlayed === 0 
                            ? "Play your first game to get ranked!" 
                            : "Complete more games to improve your ranking!"}
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

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
                      <div className="text-3xl font-bold text-primary mb-1">{currentUserStats.bestStreak}</div>
                      <div className="text-sm text-muted-foreground font-medium">Best Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-info mb-1">{currentUserStats.totalGamesPlayed}</div>
                      <div className="text-sm text-muted-foreground font-medium">Games Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-warning mb-1">
                        {currentUserStats.winRate}%
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Accuracy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}


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
              {!leaderboardData ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Loading leaderboard...</p>
                </div>
              ) : filteredLeaderboardData.length === 0 ? (
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
                        entry.isCurrentUser ? 'bg-primary/10 border-l-4 border-primary' : ''
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
                            <h3 className={`font-semibold ${entry.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                              {entry.username}
                            </h3>
                            {entry.country && (
                              <span className="text-lg" title={entry.country}>
                                {getCountryFlag(entry.country)}
                              </span>
                            )}
                            {entry.isCurrentUser && (
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