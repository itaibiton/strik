import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Get current user based on Clerk authentication
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    
    return user;
  },
});

// Create or update user (used by Clerk webhook)
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        updatedAt: now,
        lastLoginAt: now,
      });
      
      return existingUser._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        totalGamesPlayed: 0,
        bestStreak: 0,
        totalScore: 0,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      });
      
      return userId;
    }
  },
});

// Update user game stats
export const updateUserGameStats = mutation({
  args: {
    score: v.number(),
    streak: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new ConvexError("User must be authenticated to update game stats");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Update user stats
    await ctx.db.patch(user._id, {
      totalGamesPlayed: user.totalGamesPlayed + 1,
      bestStreak: Math.max(user.bestStreak, args.streak),
      totalScore: user.totalScore + args.score,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Update user preferences
export const updateUserPreferences = mutation({
  args: {
    preferredTheme: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new ConvexError("User must be authenticated to update preferences");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      preferredTheme: args.preferredTheme,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Get leaderboard (top users by best streak)
export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    const topUsers = await ctx.db
      .query("users")
      .withIndex("by_best_streak")
      .order("desc")
      .take(limit);

    // Return only public information for leaderboard
    return topUsers.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      bestStreak: user.bestStreak,
      totalScore: user.totalScore,
      totalGamesPlayed: user.totalGamesPlayed,
    }));
  },
});

// Get filtered leaderboard with time period, game mode, and sorting options
export const getFilteredLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
    timePeriod: v.optional(v.string()), // 'today', 'week', 'month', 'all-time'
    gameMode: v.optional(v.string()), // 'streak', 'practice', 'versus', 'all'
    sortBy: v.optional(v.string()), // 'streak', 'winRate', 'gamesPlayed', 'totalScore'
    region: v.optional(v.string()), // country code or 'all'
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const timePeriod = args.timePeriod ?? 'all-time';
    const gameMode = args.gameMode ?? 'all';
    const sortBy = args.sortBy ?? 'streak';
    
    // Get all users with basic stats
    let allUsers = await ctx.db.query("users").collect();
    
    // Filter by region if specified
    if (args.region && args.region !== 'all') {
      allUsers = allUsers.filter(user => user.country === args.region);
    }
    
    // Get enhanced stats for each user based on filters
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        let userSessions = await ctx.db
          .query("gameSessions")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .filter((q) => q.neq(q.field("completedAt"), undefined))
          .collect();
        
        // Filter by game mode
        if (gameMode !== 'all') {
          userSessions = userSessions.filter(session => session.gameMode === gameMode);
        }
        
        // Filter by time period
        if (timePeriod !== 'all-time') {
          const now = Date.now();
          let cutoffTime: number;
          
          switch (timePeriod) {
            case 'today':
              const today = new Date();
              cutoffTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
              break;
            case 'week':
              cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
              break;
            case 'month':
              const thisMonth = new Date();
              cutoffTime = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).getTime();
              break;
            default:
              cutoffTime = 0;
          }
          
          userSessions = userSessions.filter(session => 
            session.completedAt && session.completedAt >= cutoffTime
          );
        }
        
        // Calculate stats from filtered sessions
        const totalGames = userSessions.length;
        const totalCorrect = userSessions.reduce((sum, session) => sum + session.correctAnswers, 0);
        const totalQuestions = userSessions.reduce((sum, session) => sum + session.questionsAnswered, 0);
        const bestStreakInPeriod = userSessions.reduce((max, session) => Math.max(max, session.streak), 0);
        const totalScoreInPeriod = userSessions.reduce((sum, session) => sum + session.score, 0);
        const winRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        
        // Get the most recent session for last played date
        const lastPlayed = userSessions.length > 0 
          ? Math.max(...userSessions.map(s => s.completedAt || 0))
          : user.lastLoginAt;
        
        return {
          _id: user._id,
          clerkId: user.clerkId,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          country: user.country,
          region: user.region,
          // Use period-specific stats or fall back to all-time stats
          bestStreak: timePeriod === 'all-time' ? user.bestStreak : bestStreakInPeriod,
          totalScore: timePeriod === 'all-time' ? user.totalScore : totalScoreInPeriod,
          totalGamesPlayed: timePeriod === 'all-time' ? user.totalGamesPlayed : totalGames,
          winRate,
          lastPlayed,
        };
      })
    );
    
    // Filter out users with no games in the specified period
    const activeUsers = usersWithStats.filter(user => user.totalGamesPlayed > 0);
    
    // Sort by specified criteria
    activeUsers.sort((a, b) => {
      switch (sortBy) {
        case 'winRate':
          if (b.winRate === a.winRate) {
            return b.totalGamesPlayed - a.totalGamesPlayed; // Tie-breaker
          }
          return b.winRate - a.winRate;
        case 'gamesPlayed':
          return b.totalGamesPlayed - a.totalGamesPlayed;
        case 'totalScore':
          return b.totalScore - a.totalScore;
        case 'streak':
        default:
          if (b.bestStreak === a.bestStreak) {
            return b.totalGamesPlayed - a.totalGamesPlayed; // Tie-breaker
          }
          return b.bestStreak - a.bestStreak;
      }
    });
    
    // Add rankings and return top results
    return activeUsers.slice(0, limit).map((user, index) => ({
      ...user,
      ranking: index + 1,
    }));
  },
});

// Get current user's rank in the leaderboard
export const getUserRank = query({
  args: {
    timePeriod: v.optional(v.string()),
    gameMode: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      return null;
    }

    // Get the full leaderboard to find user's position
    const fullLeaderboard = await ctx.db
      .query("users")
      .collect();
    
    const timePeriod = args.timePeriod ?? 'all-time';
    const gameMode = args.gameMode ?? 'all';
    const sortBy = args.sortBy ?? 'streak';
    
    // Filter by region if specified
    let filteredUsers = fullLeaderboard;
    if (args.region && args.region !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.country === args.region);
    }
    
    // Calculate stats for all users (similar to getFilteredLeaderboard)
    const usersWithStats = await Promise.all(
      filteredUsers.map(async (user) => {
        let userSessions = await ctx.db
          .query("gameSessions")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .filter((q) => q.neq(q.field("completedAt"), undefined))
          .collect();
        
        // Apply same filters as getFilteredLeaderboard
        if (gameMode !== 'all') {
          userSessions = userSessions.filter(session => session.gameMode === gameMode);
        }
        
        if (timePeriod !== 'all-time') {
          const now = Date.now();
          let cutoffTime: number;
          
          switch (timePeriod) {
            case 'today':
              const today = new Date();
              cutoffTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
              break;
            case 'week':
              cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
              break;
            case 'month':
              const thisMonth = new Date();
              cutoffTime = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).getTime();
              break;
            default:
              cutoffTime = 0;
          }
          
          userSessions = userSessions.filter(session => 
            session.completedAt && session.completedAt >= cutoffTime
          );
        }
        
        const totalGames = userSessions.length;
        const totalCorrect = userSessions.reduce((sum, session) => sum + session.correctAnswers, 0);
        const totalQuestions = userSessions.reduce((sum, session) => sum + session.questionsAnswered, 0);
        const bestStreakInPeriod = userSessions.reduce((max, session) => Math.max(max, session.streak), 0);
        const totalScoreInPeriod = userSessions.reduce((sum, session) => sum + session.score, 0);
        const winRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        
        return {
          _id: user._id,
          bestStreak: timePeriod === 'all-time' ? user.bestStreak : bestStreakInPeriod,
          totalScore: timePeriod === 'all-time' ? user.totalScore : totalScoreInPeriod,
          totalGamesPlayed: timePeriod === 'all-time' ? user.totalGamesPlayed : totalGames,
          winRate,
        };
      })
    );
    
    // Filter out users with no games
    const activeUsers = usersWithStats.filter(user => user.totalGamesPlayed > 0);
    
    // Sort by the same criteria
    activeUsers.sort((a, b) => {
      switch (sortBy) {
        case 'winRate':
          if (b.winRate === a.winRate) {
            return b.totalGamesPlayed - a.totalGamesPlayed;
          }
          return b.winRate - a.winRate;
        case 'gamesPlayed':
          return b.totalGamesPlayed - a.totalGamesPlayed;
        case 'totalScore':
          return b.totalScore - a.totalScore;
        case 'streak':
        default:
          if (b.bestStreak === a.bestStreak) {
            return b.totalGamesPlayed - a.totalGamesPlayed;
          }
          return b.bestStreak - a.bestStreak;
      }
    });
    
    // Find current user's position
    const userRank = activeUsers.findIndex(user => user._id === currentUser._id) + 1;
    const totalPlayers = activeUsers.length;
    
    return {
      rank: userRank || null, // null if user not found (no games played)
      totalPlayers,
    };
  },
});

// Get user stats with win rate calculation
export const getUserStatsWithWinRate = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    // Get all completed game sessions for win rate calculation
    const completedSessions = await ctx.db
      .query("gameSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.neq(q.field("completedAt"), undefined))
      .collect();
    
    const totalCorrect = completedSessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    const totalQuestions = completedSessions.reduce((sum, session) => sum + session.questionsAnswered, 0);
    const winRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    return {
      ...user,
      winRate,
      totalCorrectAnswers: totalCorrect,
      totalQuestions,
    };
  },
});