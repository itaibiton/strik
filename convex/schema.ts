import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Clerk user ID - used as primary identifier
    clerkId: v.string(),
    
    // Basic user information from Clerk
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    
    // Location data for regional filtering
    country: v.optional(v.string()),
    region: v.optional(v.string()),
    timezone: v.optional(v.string()),
    
    // Game-specific user data
    totalGamesPlayed: v.number(),
    bestStreak: v.number(),
    totalScore: v.number(),
    
    // User preferences
    preferredTheme: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.number(),
  })
  .index("by_clerk_id", ["clerkId"])
  .index("by_email", ["email"])
  .index("by_best_streak", ["bestStreak"])
  .index("by_total_score", ["totalScore"])
  .index("by_country", ["country"])
  .index("by_region", ["region"]),
  
  // Game sessions table for tracking individual games
  gameSessions: defineTable({
    userId: v.id("users"),
    score: v.number(),
    streak: v.number(),
    questionsAnswered: v.number(),
    correctAnswers: v.number(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    gameMode: v.string(), // "streak", "practice", "versus"
    
    // Performance metrics
    averageAnswerTime: v.optional(v.number()),
    difficultyLevel: v.optional(v.string()),
    
    // Location context (inherited from user for regional leaderboards)
    userCountry: v.optional(v.string()),
    userRegion: v.optional(v.string()),
  })
  .index("by_user", ["userId"])
  .index("by_score", ["score"])
  .index("by_streak", ["streak"])
  .index("by_completed_at", ["completedAt"])
  .index("by_game_mode", ["gameMode"])
  .index("by_user_country", ["userCountry"])
  .index("by_user_region", ["userRegion"])
  .index("by_game_mode_streak", ["gameMode", "streak"])
  .index("by_completed_at_game_mode", ["completedAt", "gameMode"]),
});