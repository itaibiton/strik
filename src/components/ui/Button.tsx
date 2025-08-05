'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, type HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"
import { buttonAnimations, springTransition } from "./motion-primitives"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 interactive relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-elevated hover:bg-primary-hover active:bg-primary-active hover:shadow-floating rounded-xl btn-premium",
        destructive:
          "bg-destructive text-destructive-foreground shadow-elevated hover:bg-destructive-hover hover:shadow-floating rounded-xl btn-premium",
        outline:
          "border-2 border-primary bg-background text-primary shadow-soft hover:bg-primary hover:text-primary-foreground hover:shadow-elevated rounded-xl btn-premium",
        secondary:
          "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary-hover hover:shadow-elevated rounded-xl btn-premium",
        ghost: 
          "text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary-hover p-0 h-auto",
        // Premium Football themed variants
        field: 
          "bg-field-grass text-white shadow-elevated hover:shadow-floating hover:glow-primary rounded-xl btn-premium bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
        trophy: 
          "bg-trophy-gold text-amber-950 shadow-elevated hover:shadow-floating hover:glow-warning rounded-xl btn-premium bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600",
        stadium: 
          "bg-stadium-sky text-white shadow-elevated hover:shadow-floating hover:glow-info rounded-xl btn-premium bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700",
        glass:
          "glass-card text-foreground hover:bg-accent/50 border-0 backdrop-blur-xl rounded-xl",
        premium:
          "bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-500 text-white shadow-floating hover:shadow-modal hover:from-emerald-600 hover:via-amber-500 hover:to-sky-600 rounded-xl btn-premium animate-gradient-x",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        default: "h-10 px-6 py-2.5 rounded-xl",
        lg: "h-12 px-8 text-base rounded-xl",
        xl: "h-14 px-10 text-lg rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  animated?: boolean
}

// Separate interface for motion buttons
export interface MotionButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children' | 'className'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  children?: React.ReactNode
  className?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, disabled, animated = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    const buttonContent = isLoading ? (
      <>
        <motion.div
          className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="ml-2">Loading...</span>
      </>
    ) : (
      children
    );

    if (animated) {
      const { 
        onDrag, 
        onDragStart, 
        onDragEnd,
        onAnimationStart,
        onAnimationEnd,
        onAnimationIteration,
        ...restProps 
      } = props;
      return (
        <motion.button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={disabled || isLoading}
          {...buttonAnimations}
          {...restProps}
        >
          {buttonContent}
        </motion.button>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)
Button.displayName = "Button"

// Enhanced motion button component
const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...motionProps }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...buttonAnimations}
        {...motionProps}
      >
        {isLoading ? (
          <>
            <motion.div
              className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="ml-2">Loading...</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)
MotionButton.displayName = "MotionButton"

export { Button, MotionButton, buttonVariants }