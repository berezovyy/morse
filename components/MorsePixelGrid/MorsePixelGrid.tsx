'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { Pattern, isValidPattern } from '@/lib/patterns'
import { Pixel } from './Pixel'
import { ColorScheme, AnimationPreset, PixelSize } from '@/lib/types'
import { PIXEL_SIZES, GRID_SIZES, ANIMATION_TIMING } from '@/lib/constants'
import { calculateAnimationDelay } from './animations'

export interface MorsePixelGridProps {
  patterns?: Pattern[]
  tempo?: number
  iterations?: number | 'infinite'
  active?: boolean
  onCycleComplete?: () => void
  onComplete?: () => void
  pixelSize?: PixelSize
  colorScheme?: ColorScheme
  interactive?: boolean
  className?: string
  gridSize?: number
  animationPreset?: AnimationPreset
  compact?: boolean
  showGrid?: boolean
}

const paddingClasses = {
  '2xs': 'p-1',
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
  xl: 'p-4',
} as const


export const MorsePixelGrid: React.FC<MorsePixelGridProps> = ({
  patterns = [],
  tempo = ANIMATION_TIMING.TEMPO_DEFAULT,
  iterations = 'infinite',
  active = true,
  onCycleComplete,
  onComplete,
  pixelSize = 'md',
  colorScheme,
  interactive = false,
  className,
  gridSize = GRID_SIZES.DEFAULT,
  animationPreset = 'fade',
  compact = false,
  showGrid = true,
}) => {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [pixelStates, setPixelStates] = useState<boolean[][]>(() =>
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(false))
  )

  // Calculate the current pattern's pixel states
  useEffect(() => {
    if (!active || patterns.length === 0) return

    const interval = setInterval(() => {
      setCurrentPatternIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % patterns.length

        // Check for cycle completion
        if (nextIndex === 0) {
          setCycleCount((prev) => {
            const newCount = prev + 1
            onCycleComplete?.()

            // Check for completion
            if (iterations !== 'infinite' && newCount >= iterations) {
              onComplete?.()
              return prev // Don't increment if we've completed
            }
            return newCount
          })
        }

        return nextIndex
      })
    }, tempo)

    return () => clearInterval(interval)
  }, [active, patterns.length, tempo, iterations, onCycleComplete, onComplete])

  // Update pixel states based on current pattern
  useEffect(() => {
    if (patterns.length === 0) return

    const currentPattern = patterns[currentPatternIndex]
    if (!isValidPattern(currentPattern)) return

    const newStates = Array(gridSize)
      .fill(null)
      .map((_, row) =>
        Array(gridSize)
          .fill(null)
          .map((_, col) => Boolean(currentPattern[row]?.[col]))
      )

    setPixelStates(newStates)
  }, [currentPatternIndex, patterns, gridSize])

  // Stop animation when iterations are complete
  useEffect(() => {
    if (iterations !== 'infinite' && cycleCount >= iterations) {
      setCurrentPatternIndex(0)
      setCycleCount(0)
    }
  }, [cycleCount, iterations])

  const handlePixelClick = useCallback(
    (row: number, col: number) => {
      if (!interactive || active) return

      setPixelStates((prev) => {
        const newStates = [...prev]
        newStates[row] = [...newStates[row]]
        newStates[row][col] = !newStates[row][col]
        return newStates
      })
    },
    [interactive, active]
  )

  const pixels = useMemo(() => {
    const elements = []
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const delay = calculateAnimationDelay(
          row,
          col,
          gridSize,
          animationPreset
        )
        elements.push(
          <Pixel
            key={`${row}-${col}`}
            active={pixelStates[row][col]}
            row={row}
            col={col}
            size={pixelSize}
            onClick={handlePixelClick}
            interactive={interactive && !active}
            delay={delay}
            animationPreset={animationPreset}
            color={colorScheme?.active}
            inactiveColor={colorScheme?.inactive}
            showGrid={showGrid}
            gridColor={colorScheme?.grid}
          />
        )
      }
    }
    return elements
  }, [
    gridSize,
    pixelSize,
    pixelStates,
    handlePixelClick,
    interactive,
    active,
    animationPreset,
    colorScheme,
    showGrid,
  ])

  return (
    <motion.div
      className={cn(
        'morse-pixel-grid inline-grid rounded-lg',
        !compact && 'bg-background/50 backdrop-blur-sm',
        PIXEL_SIZES[pixelSize].gap,
        compact ? 'p-0' : paddingClasses[pixelSize],
        className
      )}
      style={{
        backgroundColor: colorScheme?.background,
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {pixels}
    </motion.div>
  )
}
