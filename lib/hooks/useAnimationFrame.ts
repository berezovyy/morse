import { useCallback, useEffect, useRef } from 'react'

export const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  deps: React.DependencyList = []
) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const isRunningRef = useRef(false)
  
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    if (isRunningRef.current) {
      requestRef.current = requestAnimationFrame(animate)
    }
  }, deps)
  
  const start = useCallback(() => {
    isRunningRef.current = true
    requestRef.current = requestAnimationFrame(animate)
  }, [animate])
  
  const stop = useCallback(() => {
    isRunningRef.current = false
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
  }, [])
  
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])
  
  return { start, stop }
}