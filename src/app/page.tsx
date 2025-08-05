"use client";

import { motion } from "framer-motion";
import { Play, Trophy, Users, Target, Zap } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { sampleQuestions } from "@/data/questions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConvex } from 'convex/react';
import { useAuth } from '@clerk/nextjs';

export default function HomePage() {
  const router = useRouter();
  const convex = useConvex();
  const { isSignedIn } = useAuth();
  const { bestStreak, totalGamesPlayed, setAvailableQuestions, startGame } =
    useGameStore();

  useEffect(() => {
    // Initialize questions when the app loads
    setAvailableQuestions(sampleQuestions);
  }, [setAvailableQuestions]);

  const handleStartGame = async () => {
    await startGame("streak", isSignedIn ? convex : undefined);
    router.push("/game");
  };

  const handleGoToLeaderboard = () => {
    router.push("/leaderboard");
  };

  const stats = [
    {
      icon: Trophy,
      label: "Best Streak",
      value: bestStreak,
      color: "text-yellow-500 bg-yellow-50",
    },
    {
      icon: Target,
      label: "Games Played",
      value: totalGamesPlayed,
      color: "text-blue-500 bg-blue-50",
    },
    {
      icon: Zap,
      label: "Questions Available",
      value: sampleQuestions.length,
      color: "text-purple-500 bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl animate-float-gentle"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Theme Toggle - Top Right */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        {/* <ThemeToggle /> */}
      </motion.div>

      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6 relative"
            animate={{
              rotate: [0, 3, -3, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-floating border-4 border-white/20 relative overflow-hidden">
                <span
                  className="text-4xl filter drop-shadow-lg animate-bounce-gentle"
                  style={{ animationDelay: "0.5s" }}
                >
                  ⚽
                </span>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                  animate={{
                    translateX: ["100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 w-24 h-24 mx-auto border-2 border-emerald-400/30 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl font-black mb-3 gradient-text tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            STRIK
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Football Trivia Challenge
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              className="group"
            >
              <Card
                variant="glass"
                className="h-full border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <CardContent className="p-4 text-center relative overflow-hidden">
                  <div className="mb-3 transform transition-transform hover:scale-110 hover:rotate-3">
                    <stat.icon className="w-6 h-6 mx-auto text-primary drop-shadow-sm" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1 tabular-nums transform transition-transform hover:scale-110">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {stat.label}
                  </div>

                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.0,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="mb-6"
        >
          <Button
            onClick={handleStartGame}
            variant="field"
            size="xl"
            className="w-full text-xl py-4 h-auto font-bold tracking-wide relative group overflow-hidden"
          >
            <div className="flex items-center justify-center gap-3 transform transition-transform group-hover:scale-105">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Play className="w-6 h-6 fill-current drop-shadow-sm" />
              </motion.div>
              Start Game
            </div>

            {/* Premium glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Button>
        </motion.div>

        {/* Secondary Actions */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Button
            onClick={handleGoToLeaderboard}
            variant="outline"
            size="lg"
            className="w-full group relative overflow-hidden"
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Users className="w-5 h-5 group-hover:text-primary transition-colors duration-200" />
              Leaderboard
            </motion.div>
          </Button>
        </motion.div>

        {/* Game Description */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <Card variant="glass" className="border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-center gradient-text-primary">
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {[
                  {
                    icon: "🎯",
                    text: "Answer football trivia questions correctly",
                  },
                  { icon: "⚡", text: "Build your streak as high as possible" },
                  {
                    icon: "⏰",
                    text: "Each question has a 30-second time limit",
                  },
                  { icon: "❌", text: "One wrong answer ends your streak" },
                  { icon: "🏆", text: "Compete for the highest score!" },
                ].map((rule, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.6 + index * 0.1 }}
                  >
                    <span className="text-lg">{rule.icon}</span>
                    <span className="font-medium">{rule.text}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.0 }}
        >
          <motion.p
            className="text-sm text-muted-foreground font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Test your football knowledge • Build epic streaks
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
