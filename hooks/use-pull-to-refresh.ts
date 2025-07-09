"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  resistance?: number
  enabled?: boolean
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [canRefresh, setCanRefresh] = useState(false)

  const startY = useRef(0)
  const currentY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || isRefreshing) return

      const container = containerRef.current
      if (!container) return

      // Only start pull-to-refresh if we're at the top of the container
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY
        setIsPulling(true)
      }
    },
    [enabled, isRefreshing],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || !enabled || isRefreshing) return

      const container = containerRef.current
      if (!container) return

      currentY.current = e.touches[0].clientY
      const deltaY = currentY.current - startY.current

      // Only allow pulling down
      if (deltaY > 0 && container.scrollTop === 0) {
        e.preventDefault()

        // Apply resistance to make pulling feel more natural
        const distance = Math.min(deltaY / resistance, threshold * 1.5)
        setPullDistance(distance)
        setCanRefresh(distance >= threshold)
      }
    },
    [isPulling, enabled, isRefreshing, threshold, resistance],
  )

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || !enabled) return

    setIsPulling(false)

    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error("Refresh failed:", error)
      } finally {
        setIsRefreshing(false)
        setCanRefresh(false)
      }
    }

    setPullDistance(0)
    setCanRefresh(false)
  }, [isPulling, enabled, canRefresh, isRefreshing, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !enabled) return

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled])

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    canRefresh,
  }
}
