import { useCallback, useEffect, useRef, useLayoutEffect } from 'react'

export const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  deps: React.DependencyList = []
) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const isRunningRef = useRef(false)
  const callbackRef = useRef(callback)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  
  // Update callback ref to avoid stale closures
  useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  // Stable animate function that doesn't depend on callback
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      // Use ref to ensure we always call the latest callback
      callbackRef.current(deltaTime)
    }
    previousTimeRef.current = time
    if (isRunningRef.current) {
      requestRef.current = requestAnimationFrame(animate)
    }
  }, []) // No dependencies - stable callback
  
  const start = useCallback(() => {
    if (isRunningRef.current) return // Already running
    
    isRunningRef.current = true
    
    // Handle resume from pause
    if (pausedTimeRef.current > 0 && startTimeRef.current > 0) {
      const pauseDuration = performance.now() - pausedTimeRef.current
      startTimeRef.current += pauseDuration
      pausedTimeRef.current = 0
    } else {
      startTimeRef.current = performance.now()
    }
    
    // Reset previous time to avoid large delta on start
    previousTimeRef.current = undefined
    requestRef.current = requestAnimationFrame(animate)
  }, [animate])
  
  const stop = useCallback(() => {
    isRunningRef.current = false
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      requestRef.current = undefined
    }
    previousTimeRef.current = undefined
  }, [])
  
  const pause = useCallback(() => {
    if (!isRunningRef.current) return
    
    isRunningRef.current = false
    pausedTimeRef.current = performance.now()
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      requestRef.current = undefined
    }
  }, [])
  
  const reset = useCallback(() => {
    stop()
    startTimeRef.current = 0
    pausedTimeRef.current = 0
    previousTimeRef.current = undefined
  }, [stop])
  
  const getElapsedTime = useCallback(() => {
    if (!startTimeRef.current) return 0
    
    if (pausedTimeRef.current > 0) {
      // Currently paused
      return pausedTimeRef.current - startTimeRef.current
    }
    
    if (isRunningRef.current) {
      // Currently running
      return performance.now() - startTimeRef.current
    }
    
    return 0
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])
  
  return { 
    start, 
    stop, 
    pause, 
    reset, 
    getElapsedTime,
    isRunning: isRunningRef.current 
  }
}

// Optimized version for simple animations that don't need pause/resume
export const useSimpleAnimationFrame = (
  callback: (deltaTime: number) => void
) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const callbackRef = useRef(callback)
  
  // Update callback ref
  useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callbackRef.current(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, [])
  
  const start = useCallback(() => {
    if (requestRef.current) return // Already running
    previousTimeRef.current = undefined
    requestRef.current = requestAnimationFrame(animate)
  }, [animate])
  
  const stop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      requestRef.current = undefined
    }
    previousTimeRef.current = undefined
  }, [])
  
  useEffect(() => {
    return stop
  }, [stop])
  
  return { start, stop }
}