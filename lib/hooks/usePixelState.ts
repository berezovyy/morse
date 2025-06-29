import { useState, useCallback, useRef, useMemo } from 'react'

export type PixelState = boolean[][]

export interface PixelUpdate {
  row: number
  col: number
  active: boolean
}

export interface UsePixelStateReturn {
  pixels: PixelState
  setPixel: (row: number, col: number, active: boolean) => void
  setPattern: (pattern: PixelState) => void
  clearGrid: () => void
  fillGrid: () => void
  togglePixel: (row: number, col: number) => void
  getPixel: (row: number, col: number) => boolean
  batchSetPixels: (updates: PixelUpdate[]) => void
  setRow: (row: number, values: boolean[]) => void
  setColumn: (col: number, values: boolean[]) => void
}

export const usePixelState = (gridSize: number = 8): UsePixelStateReturn => {
  // Memoize empty grid creation
  const createEmptyGrid = useCallback(() =>
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(false)),
    [gridSize]
  )
  
  const [pixels, setPixels] = useState<PixelState>(createEmptyGrid)
  const pixelsRef = useRef(pixels)
  pixelsRef.current = pixels
  
  // Optimized setPixel with structural sharing
  const setPixel = useCallback((row: number, col: number, active: boolean) => {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return
    
    setPixels(prev => {
      // Early return if no change
      if (prev[row][col] === active) return prev
      
      // Only copy the specific row that changes
      const newPixels = [...prev]
      newPixels[row] = [...prev[row]]
      newPixels[row][col] = active
      return newPixels
    })
  }, [gridSize])
  
  const setPattern = useCallback((pattern: PixelState) => {
    if (pattern.length !== gridSize || pattern[0]?.length !== gridSize) {
      console.warn('Pattern size does not match grid size')
      return
    }
    // Only clone if pattern is not already cloned
    setPixels(pattern.map(row => [...row]))
  }, [gridSize])
  
  // Memoize full grid to avoid recreation
  const fullGrid = useMemo(() => 
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(true)),
    [gridSize]
  )
  
  const clearGrid = useCallback(() => {
    setPixels(createEmptyGrid())
  }, [createEmptyGrid])
  
  const fillGrid = useCallback(() => {
    setPixels(fullGrid)
  }, [fullGrid])
  
  const togglePixel = useCallback((row: number, col: number) => {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return
    
    setPixels(prev => {
      // Only copy the specific row that changes
      const newPixels = [...prev]
      newPixels[row] = [...prev[row]]
      newPixels[row][col] = !newPixels[row][col]
      return newPixels
    })
  }, [gridSize])
  
  const getPixel = useCallback((row: number, col: number): boolean => {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return false
    return pixelsRef.current[row][col]
  }, [gridSize])
  
  // Batch update for multiple pixels at once
  const batchSetPixels = useCallback((updates: PixelUpdate[]) => {
    setPixels(prev => {
      // Track which rows changed to minimize copying
      const changedRows = new Set<number>()
      let hasChanges = false
      
      // Check for actual changes
      for (const update of updates) {
        if (update.row >= 0 && update.row < gridSize && 
            update.col >= 0 && update.col < gridSize &&
            prev[update.row][update.col] !== update.active) {
          changedRows.add(update.row)
          hasChanges = true
        }
      }
      
      // Early return if no changes
      if (!hasChanges) return prev
      
      // Only copy rows that actually changed
      const newPixels = [...prev]
      for (const row of changedRows) {
        newPixels[row] = [...prev[row]]
      }
      
      // Apply updates
      for (const update of updates) {
        if (update.row >= 0 && update.row < gridSize && 
            update.col >= 0 && update.col < gridSize) {
          newPixels[update.row][update.col] = update.active
        }
      }
      
      return newPixels
    })
  }, [gridSize])
  
  // Set entire row at once
  const setRow = useCallback((row: number, values: boolean[]) => {
    if (row < 0 || row >= gridSize || values.length !== gridSize) return
    
    setPixels(prev => {
      // Check if row actually changed
      const rowChanged = prev[row].some((val, idx) => val !== values[idx])
      if (!rowChanged) return prev
      
      const newPixels = [...prev]
      newPixels[row] = [...values]
      return newPixels
    })
  }, [gridSize])
  
  // Set entire column at once
  const setColumn = useCallback((col: number, values: boolean[]) => {
    if (col < 0 || col >= gridSize || values.length !== gridSize) return
    
    setPixels(prev => {
      // Check if any value in column changed
      let hasChanges = false
      for (let row = 0; row < gridSize; row++) {
        if (prev[row][col] !== values[row]) {
          hasChanges = true
          break
        }
      }
      
      if (!hasChanges) return prev
      
      // Only copy rows that change
      const newPixels = prev.map((row, idx) => {
        if (row[col] !== values[idx]) {
          const newRow = [...row]
          newRow[col] = values[idx]
          return newRow
        }
        return row
      })
      
      return newPixels
    })
  }, [gridSize])
  
  return {
    pixels,
    setPixel,
    setPattern,
    clearGrid,
    fillGrid,
    togglePixel,
    getPixel,
    batchSetPixels,
    setRow,
    setColumn
  }
}