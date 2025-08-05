'use client'

import { motion } from 'framer-motion';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Trophy, Target, Zap } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile'

export function AuthHeader() {
  const { displayName, bestStreak, totalGamesPlayed, isSignedIn, isLoadingStats } = useUserProfile()

  return (
    <motion.header 
      className="sticky top-0 z-50 backdrop-filter backdrop-blur-md bg-glass-bg border-b border-glass-border shadow-glass"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center p-4 h-16 max-w-7xl mx-auto">
        {/* Left Side - Logo and Stats */}
        <div className="flex items-center gap-6">
          {/* Football Logo matching main page */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-floating border-2 border-white/20 relative overflow-hidden">
                <span className="text-lg filter drop-shadow-sm">⚽</span>
                
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                  animate={{
                    translateX: ["100%", "200%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-2xl font-black gradient-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              STRIK
            </motion.h1>
          </motion.div>

          {/* User Stats - Enhanced Design */}
          {isSignedIn && (
            <motion.div 
              className="hidden lg:flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium text-foreground">
                    {isLoadingStats ? (
                      <motion.span 
                        className="inline-block w-6 h-3 bg-muted/50 rounded"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    ) : (
                      <span className="tabular-nums">{bestStreak}</span>
                    )}
                  </span>
                </div>
                
                <div className="w-px h-4 bg-border/30" />
                
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium text-foreground">
                    {isLoadingStats ? (
                      <motion.span 
                        className="inline-block w-6 h-3 bg-muted/50 rounded"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      />
                    ) : (
                      <span className="tabular-nums">{totalGamesPlayed}</span>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Right Side - Authentication */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SignedOut>
            <SignInButton>
              <motion.button 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </SignInButton>
            <SignUpButton>
              <motion.button 
                className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full font-medium text-sm h-10 px-6 shadow-lg relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Sign Up</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full"
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <div className="flex items-center gap-4">
              {/* Welcome Message - Enhanced */}
              <motion.div 
                className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="text-sm">
                  <span className="text-muted-foreground">Welcome,</span>{' '}
                  <span className="font-semibold text-foreground">
                    {displayName || (
                      <motion.span 
                        className="inline-block w-16 h-3 bg-muted/50 rounded"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </span>
                </div>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              </motion.div>
              
              {/* Enhanced User Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 shadow-lg border-2 border-white/20"
                    }
                  }}
                />
              </motion.div>
            </div>
          </SignedIn>
        </motion.div>
      </div>
    </motion.header>
  )
}