import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"
import { cardAnimations, fadeInUp } from "./motion-primitives"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'interactive' | 'premium'
  hover?: boolean
  animated?: boolean
}

interface MotionCardProps extends Omit<HTMLMotionProps<'div'>, 'children' | 'className'> {
  variant?: 'default' | 'glass' | 'elevated' | 'interactive' | 'premium'
  children?: React.ReactNode
  className?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, animated = false, ...props }, ref) => {
    const variants = {
      default: "rounded-xl border bg-card text-card-foreground shadow-soft transition-all duration-200",
      glass: "rounded-xl glass-card text-card-foreground border-0 shadow-soft backdrop-blur-xl",
      elevated: "rounded-xl border-0 bg-card text-card-foreground shadow-elevated hover:shadow-floating transition-all duration-200",
      interactive: "rounded-xl border bg-card text-card-foreground shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-200 cursor-pointer interactive",
      premium: "rounded-2xl border-0 bg-gradient-to-br from-surface-1 to-surface-2 text-card-foreground shadow-floating hover:shadow-modal transition-all duration-300 relative overflow-hidden"
    }

    const baseClassName = cn(variants[variant], className);

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={baseClassName}
          {...cardAnimations}
          {...props}
        />
      )
    }

    if (hover) {
      return (
        <div
          ref={ref}
          className={cn(baseClassName, "transition-transform hover:scale-105 hover:-translate-y-1")}
          {...props}
        />
      )
    }
    
    return (
      <div
        ref={ref}
        className={baseClassName}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

// Motion Card component
const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, variant = 'default', children, ...motionProps }, ref) => {
    const variants = {
      default: "rounded-xl border bg-card text-card-foreground shadow-soft transition-all duration-200",
      glass: "rounded-xl glass-card text-card-foreground border-0 shadow-soft backdrop-blur-xl",
      elevated: "rounded-xl border-0 bg-card text-card-foreground shadow-elevated hover:shadow-floating transition-all duration-200",
      interactive: "rounded-xl border bg-card text-card-foreground shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-200 cursor-pointer interactive",
      premium: "rounded-2xl border-0 bg-gradient-to-br from-surface-1 to-surface-2 text-card-foreground shadow-floating hover:shadow-modal transition-all duration-300 relative overflow-hidden"
    }

    return (
      <motion.div
        ref={ref}
        className={cn(variants[variant], className)}
        {...cardAnimations}
        {...motionProps}
      >
        {children}
      </motion.div>
    )
  }
)
MotionCard.displayName = "MotionCard"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-bold leading-tight tracking-tight text-foreground", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 pb-6 pt-2", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between px-6 pb-6 pt-2", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, MotionCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }