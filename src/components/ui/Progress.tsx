'use client';

import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const progressVariants = cva(
  "w-full overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-secondary rounded-full",
        glass: "glass rounded-full backdrop-blur-sm",
        premium: "bg-gradient-to-r from-surface-2 to-surface-3 rounded-full shadow-inner",
        stadium: "bg-slate-200 dark:bg-slate-800 rounded-lg",
      },
      size: {
        sm: "h-2",
        default: "h-3",
        lg: "h-4",
        xl: "h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const progressBarVariants = cva(
  "h-full transition-all duration-500 ease-out relative overflow-hidden",
  {
    variants: {
      color: {
        primary: "bg-primary",
        field: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        trophy: "bg-gradient-to-r from-amber-400 to-amber-500",
        stadium: "bg-gradient-to-r from-sky-500 to-sky-600",
        success: "bg-gradient-to-r from-green-500 to-green-600",
        warning: "bg-gradient-to-r from-orange-500 to-orange-600",
        error: "bg-gradient-to-r from-red-500 to-red-600",
        rainbow: "bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-500",
      },
      variant: {
        default: "rounded-full",
        glass: "rounded-full backdrop-blur-sm",
        premium: "rounded-full shadow-sm",
        stadium: "rounded-md",
      },
    },
    defaultVariants: {
      color: "primary",
      variant: "default",
    },
  }
)

interface ProgressProps extends VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  color?: 'primary' | 'field' | 'trophy' | 'stadium' | 'success' | 'warning' | 'error' | 'rainbow';
  animated?: boolean;
  showPercentage?: boolean;
  showGlow?: boolean;
}

export function Progress({ 
  value, 
  max = 100, 
  className, 
  showLabel = false,
  label,
  color = 'primary',
  variant = 'default',
  size = 'default',
  animated = true,
  showPercentage = false,
  showGlow = false
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isComplete = percentage === 100;

  return (
    <div className={cn('w-full space-y-2', className)}>
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center">
          {showLabel && (
            <motion.span 
              className="text-sm font-medium text-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {label || 'Progress'}
            </motion.span>
          )}
          {showPercentage && (
            <motion.span 
              className="text-sm font-semibold text-muted-foreground tabular-nums"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {Math.round(percentage)}%
            </motion.span>
          )}
        </div>
      )}
      
      <div className={cn(progressVariants({ variant, size }))}>
        <motion.div
          className={cn(
            progressBarVariants({ color, variant }),
            showGlow && percentage > 0 && 'shadow-lg',
            isComplete && 'animate-pulse-glow'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          {/* Shimmer effect for animated progress */}
          {animated && percentage > 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
          
          {/* Completion sparkle effect */}
          {isComplete && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '100%', opacity: 1 }}
              transition={{
                duration: 0.6,
                ease: "easeOut"
              }}
            />
          )}
        </motion.div>
      </div>
      
      {/* Progress indicators for premium variant */}
      {variant === 'premium' && (
        <div className="flex justify-between mt-1">
          {[0, 25, 50, 75, 100].map((mark) => (
            <motion.div
              key={mark}
              className={cn(
                "w-1 h-1 rounded-full transition-colors duration-300",
                percentage >= mark ? "bg-primary" : "bg-muted"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: percentage >= mark ? 1.2 : 1 }}
              transition={{ duration: 0.2, delay: mark * 0.01 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}