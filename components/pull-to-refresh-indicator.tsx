"use client"

import { RefreshCw, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshIndicatorProps {
  pullDistance: number
  threshold: number
  isRefreshing: boolean
  canRefresh: boolean
  className?: string
}

export function PullToRefreshIndicator({
  pullDistance,
  threshold,
  isRefreshing,
  canRefresh,
  className,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min((pullDistance / threshold) * 100, 100)
  const opacity = Math.min(pullDistance / 40, 1)

  return (
    <div
      className={cn("flex flex-col items-center justify-center py-4 transition-all duration-200 ease-out", className)}
      style={{
        transform: `translateY(${Math.max(pullDistance - 60, 0)}px)`,
        opacity,
      }}
    >
      {/* Circular progress indicator */}
      <div className="relative w-8 h-8 mb-2">
        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/30"
          />
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={cn(
              "transition-all duration-200 ease-out",
              canRefresh ? "text-primary" : "text-muted-foreground",
            )}
            strokeDasharray={`${2 * Math.PI * 12}`}
            strokeDashoffset={`${2 * Math.PI * 12 * (1 - progress / 100)}`}
          />
        </svg>

        {/* Icon in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isRefreshing ? (
            <RefreshCw className={cn("w-4 h-4 animate-spin", canRefresh ? "text-primary" : "text-muted-foreground")} />
          ) : (
            <ArrowDown
              className={cn(
                "w-4 h-4 transition-all duration-200 ease-out",
                canRefresh ? "text-primary rotate-180" : "text-muted-foreground",
              )}
            />
          )}
        </div>
      </div>

      {/* Status text */}
      <div
        className={cn(
          "text-xs font-medium transition-colors duration-200",
          canRefresh ? "text-primary" : "text-muted-foreground",
        )}
      >
        {isRefreshing ? "Refreshing..." : canRefresh ? "Release to refresh" : "Pull to refresh"}
      </div>
    </div>
  )
}
