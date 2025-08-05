'use client'

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useUserProfile } from '@/hooks/useUserProfile'

export function AuthHeader() {
  const { displayName, bestStreak, totalGamesPlayed, isSignedIn, isLoadingStats } = useUserProfile()

  return (
    <header className="flex justify-between items-center p-4 h-16 border-b border-border/10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary">Strik</h1>
        {isSignedIn && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Best Streak: {isLoadingStats ? (
                <span className="inline-block w-6 h-3 bg-muted animate-pulse rounded" />
              ) : (
                bestStreak
              )}
            </span>
            <span>•</span>
            <span>
              Games: {isLoadingStats ? (
                <span className="inline-block w-6 h-3 bg-muted animate-pulse rounded" />
              ) : (
                totalGamesPlayed
              )}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm h-10 px-5 hover:bg-[#5a3dd9] transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        
        <SignedIn>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-foreground">
              Welcome, {displayName || (
                <span className="inline-block w-16 h-3 bg-muted animate-pulse rounded" />
              )}!
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        </SignedIn>
      </div>
    </header>
  )
}