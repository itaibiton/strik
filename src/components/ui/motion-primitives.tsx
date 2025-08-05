'use client';

import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Common animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Interactive hover effects
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};

export const hoverLift = {
  whileHover: { y: -2 },
  whileTap: { y: 0 }
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)" // primary color glow
  }
};

// Type-safe motion components
interface MotionBoxProps extends HTMLMotionProps<'div'> {
  className?: string;
}

export const MotionBox = forwardRef<HTMLDivElement, MotionBoxProps>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
);
MotionBox.displayName = 'MotionBox';

interface MotionButtonProps extends HTMLMotionProps<'button'> {
  className?: string;
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, ...props }, ref) => (
    <motion.button
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
);
MotionButton.displayName = 'MotionButton';

// Common transition configurations
export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const smoothTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1]
};

export const bounceTransition = {
  type: "spring",
  stiffness: 400,
  damping: 17
};

// Animation presets for different interaction states
export const buttonAnimations = {
  whileHover: { 
    scale: 1.02,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
  },
  whileTap: { scale: 0.98 },
  transition: springTransition
};

export const cardAnimations = {
  whileHover: { 
    y: -4,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
  },
  transition: smoothTransition
};