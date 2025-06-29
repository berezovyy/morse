import { useState, useCallback, useRef } from 'react'

export type PixelState = boolean[][]

export interface UsePixelStateReturn {
  pixels: PixelState
  setPixel: (row: number, col: number, active: boolean) => void
  setPattern: (pattern: PixelState) => void
  clearGrid: () => void
  fillGrid: () => void
  togglePixel: (row: number, col: number) => void
  getPixel: (row: number, col: number) => boolean
}

export const usePixelState = (gridSize: number = 8): UsePixelStateReturn => {
  const createEmptyGrid = () =>
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(false))
  
  const [pixels, setPixels] = useState<PixelState>(createEmptyGrid)
  const pixelsRef = useRef(pixels)
  pixelsRef.current = pixels
  
  const setPixel = useCallback((row: number, col: number, active: boolean) => {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return
    
    setPixels(prev => {
      const newPixels = prev.map(r => [...r])
      newPixels[row][col] = active
      return newPixels
    })
  }, [gridSize])
  
  const setPattern = useCallback((pattern: PixelState) => {
    if (pattern.length !== gridSize || pattern[0]?.length !== gridSize) {
      console.warn('Pattern size does not match grid size')
      return
    }
    setPixels(pattern.map(row => [...row]))
  }, [gridSize])
  
  const clearGrid = useCallback(() => {
    setPixels(createEmptyGrid())
  }, [gridSize])
  
  const fillGrid = useCallback(() => {
    setPixels(Array(gridSize).fill(null).map(() => Array(gridSize).fill(true)))
  }, [gridSize])
  
  const togglePixel = useCallback((row: number, col: number) => {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return
    
    setPixels(prev => {
      const newPixels = prev.map(r => [...r])
      newPixels[row][col] = !newPixels[row][col]
      return newPixels
    })
  }, [gridSize])
  
  const getPixel = useCallback((row: number, col: number): boolean => {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return false
    return pixelsRef.current[row][col]
  }, [gridSize])
  
  return {
    pixels,
    setPixel,
    setPattern,
    clearGrid,
    fillGrid,
    togglePixel,
    getPixel
  }
}