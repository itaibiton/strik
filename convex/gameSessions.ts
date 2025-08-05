import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Start a new game session
export const startGameSession = mutation({
  args: {
    gameMode: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new ConvexError("User must be authenticated to start a game");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const gameSessionId = await ctx.db.insert("gameSessions", {
      userId: user._id,
      score: 0,
      streak: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      startedAt: Date.now(),
      gameMode: args.gameMode,
    });

    return gameSessionId;
  },
});

// Complete a game session
export const completeGameSession = mutation({
  args: {
    sessionId: v.id("gameSessions"),
    finalScore: v.number(),
    finalStreak: v.number(),
    questionsAnswered: v.number(),
    correctAnswers: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new ConvexError("User must be authenticated");
    }

    const session = await ctx.db.get(args.sessionId);
    
    if (!session) {
      throw new ConvexError("Game session not found");
    }

    // Verify the session belongs to the current user
    const user = await ctx.db.get(session.userId);
    if (!user || user.clerkId !== identity.subject) {
      throw new ConvexError("Unauthorized to complete this game session");
    }

    // Complete the session
    await ctx.db.patch(args.sessionId, {
      score: args.finalScore,
      streak: args.finalStreak,
      questionsAnswered: args.questionsAnswered,
      correctAnswers: args.correctAnswers,
      completedAt: Date.now(),
    });

    // Update user stats
    await ctx.db.patch(user._id, {
      totalGamesPlayed: user.totalGamesPlayed + 1,
      bestStreak: Math.max(user.bestStreak, args.finalStreak),
      totalScore: user.totalScore + args.finalScore,
      updatedAt: Date.now(),
    });

    return args.sessionId;
  },
});

// Get user's game history
export const getUserGameHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
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

    const limit = args.limit ?? 20;
    
    const sessions = await ctx.db
      .query("gameSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    return sessions;
  },
});

// Get recent completed games for leaderboard/activity feed
export const getRecentCompletedGames = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    const recentGames = await ctx.db
      .query("gameSessions")
      .withIndex("by_completed_at")
      .order("desc")
      .filter((q) => q.neq(q.field("completedAt"), undefined))
      .take(limit);

    // Get user info for each game
    const gamesWithUsers = await Promise.all(
      recentGames.map(async (game) => {
        const user = await ctx.db.get(game.userId);
        return {
          ...game,
          user: user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          } : null,
        };
      })
    );

    return gamesWithUsers;
  },
});