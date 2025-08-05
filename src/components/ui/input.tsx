import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full bg-surface-1 text-foreground transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "border border-input hover:border-input-hover focus:border-input-focus shadow-soft hover:shadow-medium focus:shadow-elevated focus:ring-2 focus:ring-ring/20",
        ghost: "border-0 bg-transparent hover:bg-accent focus:bg-background shadow-none",
        filled: "border-0 bg-muted hover:bg-accent focus:bg-background shadow-soft hover:shadow-medium",
        premium: "border-2 border-primary/20 bg-gradient-to-r from-surface-1 to-surface-2 hover:border-primary/40 focus:border-primary shadow-elevated hover:shadow-floating focus:shadow-floating focus:ring-2 focus:ring-primary/20"
      },
      size: {
        sm: "h-8 px-3 py-1 text-xs rounded-lg",
        default: "h-10 px-4 py-2 text-sm rounded-xl",
        lg: "h-12 px-4 py-3 text-base rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, label, error, leftIcon, rightIcon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const hasError = Boolean(error)

    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            inputVariants({ variant, size }),
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            hasError && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
        
        {/* Focus indicator */}
        {isFocused && (
          <div
            className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none transition-opacity duration-150"
          />
        )}
      </div>
    )

    if (label || error) {
      return (
        <div className="space-y-2">
          {label && (
            <label className="text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {inputElement}
          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      )
    }

    return inputElement
  }
)
Input.displayName = "Input"

export { Input }