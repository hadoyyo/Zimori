"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "forest" | "savanna"
}

export function Loader({ 
  className, 
  size = "md", 
  variant = "default",
  ...props 
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const variantClasses = {
    default: "text-green-600",
    forest: "text-green-700",
    savanna: "text-yellow-600",
  }

  return (
    <div 
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoaderWithTextProps extends LoaderProps {
  text?: string
  textClassName?: string
}

export function LoaderWithText({ 
  text = "Ładowanie...", 
  textClassName,
  ...loaderProps 
}: LoaderWithTextProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Loader {...loaderProps} />
      {text && (
        <p className={cn("text-sm text-muted-foreground", textClassName)}>
          {text}
        </p>
      )}
    </div>
  )
}

export function EcosystemLoader({ 
  className,
  biome = "forest",
}: {
  className?: string
  biome?: "forest" | "savanna"
}) {
  const colors = biome === "forest" 
    ? ["text-green-600", "text-green-700", "text-green-800"] 
    : ["text-yellow-500", "text-yellow-600", "text-yellow-700"]

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 w-3 rounded-full animate-bounce",
            colors[i],
            i === 0 ? "animation-delay-0" : 
            i === 1 ? "animation-delay-150" : "animation-delay-300"
          )}
          style={{
            animationDuration: "1s",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  )
}