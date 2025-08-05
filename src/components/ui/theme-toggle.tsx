"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from 'framer-motion'

import { Button } from "@/components/ui/Button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="glass"
      size="icon"
      className="relative overflow-hidden border border-white/10 hover:border-white/20 backdrop-blur-xl"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <motion.div
        className="relative flex items-center justify-center"
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Sun 
          className={`h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} 
        />
        <Moon 
          className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
        />
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/20 to-sky-400/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}