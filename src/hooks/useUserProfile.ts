'use client'

import { useQuery } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '../../convex/_generated/api'

export function useUserProfile() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
  // This will automatically update in real-time when user stats change
  const convexUser = useQuery(api.users.getCurrentUser)
  
  // Determine loading states
  const isSignedIn = !!clerkUser
  const isConvexUserLoaded = convexUser !== undefined
  const isFullyLoaded = isClerkLoaded && (isSignedIn ? isConvexUserLoaded : true)
  const isLoadingStats = isSignedIn && !isConvexUserLoaded
  
  return {
    // Clerk user data (authentication info)
    clerkUser,
    isClerkLoaded,
    
    // Convex user data (game stats, preferences) - real-time updates
    convexUser,
    isConvexUserLoaded,
    
    // Combined user info
    isSignedIn,
    isFullyLoaded,
    isLoadingStats,
    
    // Helper getters
    displayName: clerkUser?.firstName || clerkUser?.username || 'Player',
    fullName: clerkUser ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() : '',
    email: clerkUser?.primaryEmailAddress?.emailAddress,
    imageUrl: clerkUser?.imageUrl,
    
    // Game stats - these update in real-time from Convex
    // Return null/undefined when loading to avoid showing 0
    bestStreak: isLoadingStats ? undefined : (convexUser?.bestStreak || 0),
    totalGamesPlayed: isLoadingStats ? undefined : (convexUser?.totalGamesPlayed || 0),
    totalScore: isLoadingStats ? undefined : (convexUser?.totalScore || 0),
  }
}