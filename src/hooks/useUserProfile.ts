'use client'

import { useQuery } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '../../convex/_generated/api'

export function useUserProfile() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
  const convexUser = useQuery(api.users.getCurrentUser)
  
  return {
    // Clerk user data (authentication info)
    clerkUser,
    isClerkLoaded,
    
    // Convex user data (game stats, preferences)
    convexUser,
    isConvexUserLoaded: convexUser !== undefined,
    
    // Combined user info
    isSignedIn: !!clerkUser,
    isFullyLoaded: isClerkLoaded && convexUser !== undefined,
    
    // Helper getters
    displayName: clerkUser?.firstName || 'Player',
    fullName: clerkUser ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() : '',
    email: clerkUser?.primaryEmailAddress?.emailAddress,
    imageUrl: clerkUser?.imageUrl,
    
    // Game stats
    bestStreak: convexUser?.bestStreak || 0,
    totalGamesPlayed: convexUser?.totalGamesPlayed || 0,
    totalScore: convexUser?.totalScore || 0,
  }
}