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