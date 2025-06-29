import React, { memo, useCallback } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { AnimationPreset, PixelSize } from '@/lib/types'
import { PIXEL_SIZES } from '@/lib/constants'

export interface PixelProps {
  active: boolean
  row: number
  col: number
  size?: PixelSize
  onClick?: (row: number, col: number) => void
  onMouseEnter?: (row: number, col: number) => void
  interactive?: boolean
  delay?: number
  animationPreset?: AnimationPreset
  color?: string
  inactiveColor?: string
  showGrid?: boolean
  gridColor?: string
}

const DEFAULT_COLORS = {
  ACTIVE: 'rgb(0, 0, 0)',
  INACTIVE_GRID: '#e5e5e5',
  TRANSPARENT: 'transparent',
} as const

const ANIMATION_CONFIG = {
  DURATION: 0.3,
  EASE: 'easeOut',
} as const

const getAnimationVariants = (preset: AnimationPreset, showGrid: boolean) => {
  const inactiveOpacity = showGrid ? 1 : 0

  switch (preset) {
    case 'fade':
      return {
        inactive: { opacity: inactiveOpacity },
        active: { opacity: 1 },
      }
    case 'scale':
      return {
        inactive: { scale: showGrid ? 1 : 0.8, opacity: inactiveOpacity },
        active: { scale: 1, opacity: 1 },
      }
    case 'slide':
      return {
        inactive: { x: 0, opacity: inactiveOpacity },
        active: { x: 0, opacity: 1 },
      }
    case 'wave':
    case 'spiral':
    case 'ripple':
    case 'cascade':
      return {
        inactive: { scale: showGrid ? 1 : 0.8, opacity: inactiveOpacity },
        active: { scale: 1, opacity: 1 },
      }
    case 'random':
      return Math.random() > 0.5
        ? {
            inactive: { scale: showGrid ? 1 : 0.8, opacity: inactiveOpacity },
            active: { scale: 1, opacity: 1 },
          }
        : {
            inactive: { opacity: inactiveOpacity },
            active: { opacity: 1 },
          }
    default:
      return {
        inactive: { opacity: inactiveOpacity },
        active: { opacity: 1 },
      }
  }
}

export const Pixel = memo(function Pixel({
  active,
  row,
  col,
  size = 'md',
  onClick,
  onMouseEnter,
  interactive = false,
  delay = 0,
  animationPreset = 'fade',
  color,
  inactiveColor,
  showGrid = false,
  gridColor,
}: PixelProps) {
  const handleClick = useCallback(() => {
    if (interactive && onClick) {
      onClick(row, col)
    }
  }, [interactive, onClick, row, col])

  const handleMouseEnter = useCallback(() => {
    if (interactive && onMouseEnter) {
      onMouseEnter(row, col)
    }
  }, [interactive, onMouseEnter, row, col])

  const variants = getAnimationVariants(animationPreset, showGrid)

  const backgroundColor = active
    ? color || DEFAULT_COLORS.ACTIVE
    : showGrid
      ? gridColor || inactiveColor || DEFAULT_COLORS.INACTIVE_GRID
      : inactiveColor || DEFAULT_COLORS.TRANSPARENT

  return (
    <motion.div
      className={cn(
        'rounded-sm block',
        PIXEL_SIZES[size].size,
        interactive && 'cursor-pointer'
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      variants={variants}
      initial="inactive"
      animate={active ? 'active' : 'inactive'}
      transition={{
        duration: ANIMATION_CONFIG.DURATION,
        delay: active ? delay / 1000 : 0,
        ease: ANIMATION_CONFIG.EASE,
      }}
      style={{
        backgroundColor,
        minWidth: '4px',
        minHeight: '4px',
      }}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? active : undefined}
      aria-label={`Pixel at row ${row + 1}, column ${col + 1}`}
    />
  )
})
