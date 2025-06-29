import React, { memo } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { AnimationPreset } from './MorsePixelGrid'

export interface PixelProps {
  active: boolean
  row: number
  col: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
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

const sizeClasses = {
  '2xs': 'w-[3px] h-[3px]', // 2px
  xs: 'w-1 h-1', // 4px
  sm: 'w-1.5 h-1.5', // 6px
  md: 'w-2 h-2', // 8px
  lg: 'w-3 h-3', // 12px
  xl: 'w-4 h-4', // 16px
}

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
  const handleClick = () => {
    if (interactive && onClick) {
      onClick(row, col)
    }
  }

  const handleMouseEnter = () => {
    if (interactive && onMouseEnter) {
      onMouseEnter(row, col)
    }
  }

  const variants = getAnimationVariants(animationPreset, showGrid)

  const backgroundColor = active
    ? color || 'rgb(0, 0, 0)' // Default to black instead of currentColor
    : showGrid
      ? gridColor || inactiveColor || '#e5e5e5'
      : inactiveColor || 'transparent'

  return (
    <motion.div
      className={cn(
        'rounded-sm block',
        sizeClasses[size],
        interactive && 'cursor-pointer'
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      variants={variants}
      initial="inactive"
      animate={active ? 'active' : 'inactive'}
      transition={{
        duration: 0.3,
        delay: active ? delay / 1000 : 0,
        ease: 'easeOut',
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
