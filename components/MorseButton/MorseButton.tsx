'use client'

import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { MorsePixelGrid } from '../MorsePixelGrid'
import { Pattern } from '@/lib/patterns'

export type ButtonStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'disabled'
  | 'importing'
  | 'searching'

export interface MorseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  status?: ButtonStatus
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  showMorseOnHover?: boolean
  alwaysShowMorse?: boolean
  customPattern?: Pattern[]
}

const createLoadingPattern = (): Pattern[] => {
  const frames: Pattern[] = []
  const positions = [
    [2, 3],
    [2, 4],
    [3, 4],
    [4, 4],
    [4, 3],
    [4, 2],
    [3, 2],
    [2, 2],
  ]

  for (let i = 0; i < positions.length; i++) {
    const pattern: Pattern = Array(7)
      .fill(null)
      .map(() => Array(7).fill(false))
    for (let j = 0; j < 3; j++) {
      const idx = (i + j) % positions.length
      const [r, c] = positions[idx]
      pattern[r][c] = true
    }
    frames.push(pattern)
  }
  return frames
}

const createSuccessPattern = (): Pattern[] => {
  const pattern: Pattern = Array(7)
    .fill(null)
    .map(() => Array(7).fill(false))
  // Checkmark
  pattern[4][1] = true
  pattern[5][2] = true
  pattern[4][3] = true
  pattern[3][4] = true
  pattern[2][5] = true
  pattern[1][4] = true
  return [pattern]
}

const createErrorPattern = (): Pattern[] => {
  const pattern: Pattern = Array(7)
    .fill(null)
    .map(() => Array(7).fill(false))
  // X shape
  for (let i = 0; i < 5; i++) {
    pattern[i + 1][i + 1] = true
    pattern[i + 1][5 - i] = true
  }
  return [pattern]
}

const createDisabledPattern = (): Pattern[] => {
  const pattern: Pattern = Array(7)
    .fill(null)
    .map(() => Array(7).fill(false))
  // Horizontal lines
  for (let r = 2; r <= 4; r += 2) {
    for (let c = 2; c <= 4; c++) {
      pattern[r][c] = true
    }
  }
  return [pattern]
}

const createEmptyPattern = (): Pattern[] => {
  const pattern: Pattern = Array(7)
    .fill(null)
    .map(() => Array(7).fill(false))
  return [pattern]
}

const createImportingPattern = (): Pattern[] => {
  const importingFrames = [
    [[2, 2]],
    [
      [1, 2],
      [2, 1],
      [2, 3],
      [3, 2],
    ],
    [
      [2, 2],
      [0, 2],
      [1, 1],
      [1, 3],
      [2, 0],
      [2, 4],
      [3, 1],
      [3, 3],
      [4, 2],
    ],
    [
      [0, 1],
      [0, 3],
      [1, 0],
      [1, 2],
      [1, 4],
      [2, 1],
      [2, 3],
      [3, 0],
      [3, 2],
      [3, 4],
      [4, 1],
      [4, 3],
    ],
    [
      [0, 0],
      [0, 2],
      [0, 4],
      [1, 1],
      [1, 3],
      [2, 0],
      [2, 2],
      [2, 4],
      [3, 1],
      [3, 3],
      [4, 0],
      [4, 2],
      [4, 4],
    ],
    [
      [0, 1],
      [0, 3],
      [1, 0],
      [1, 2],
      [1, 4],
      [2, 1],
      [2, 3],
      [3, 0],
      [3, 2],
      [3, 4],
      [4, 1],
      [4, 3],
    ],
    [
      [0, 0],
      [0, 2],
      [0, 4],
      [1, 1],
      [1, 3],
      [2, 0],
      [2, 4],
      [3, 1],
      [3, 3],
      [4, 0],
      [4, 2],
      [4, 4],
    ],
    [
      [0, 1],
      [1, 0],
      [3, 0],
      [4, 1],
      [0, 3],
      [1, 4],
      [3, 4],
      [4, 3],
    ],
    [
      [0, 0],
      [0, 4],
      [4, 0],
      [4, 4],
    ],
    [],
  ]

  return importingFrames.map((frame) => {
    const pattern: Pattern = Array(7)
      .fill(null)
      .map(() => Array(7).fill(false))
    frame.forEach(([r, c]) => {
      pattern[r][c] = true
    })
    return pattern
  })
}

const createSearchingPattern = (): Pattern[] => {
  const searchingFrames = [
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [1, 1],
      [2, 1],
      [3, 1],
      [2, 2],
    ],
    [
      [3, 0],
      [2, 1],
      [3, 1],
      [4, 1],
      [3, 2],
    ],
    [
      [3, 1],
      [2, 2],
      [3, 2],
      [4, 2],
      [3, 3],
    ],
    [
      [3, 2],
      [2, 3],
      [3, 3],
      [4, 3],
      [3, 4],
    ],
    [
      [1, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [1, 4],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [],
  ]

  return searchingFrames.map((frame) => {
    const pattern: Pattern = Array(7)
      .fill(null)
      .map(() => Array(7).fill(false))
    frame.forEach(([r, c]) => {
      pattern[r][c] = true
    })
    return pattern
  })
}

const statusPatterns: Record<ButtonStatus, Pattern[]> = {
  idle: createEmptyPattern(),
  loading: createLoadingPattern(),
  success: createSuccessPattern(),
  error: createErrorPattern(),
  disabled: createDisabledPattern(),
  importing: createImportingPattern(),
  searching: createSearchingPattern(),
}

const sizeClasses = {
  sm: 'h-8 px-3 text-sm gap-2',
  md: 'h-10 px-4 text-base gap-3',
  lg: 'h-12 px-6 text-lg gap-4',
}

const variantClasses = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
}

export const MorseButton = forwardRef<HTMLButtonElement, MorseButtonProps>(
  (
    {
      children,
      className,
      status = 'idle',
      variant = 'default',
      size = 'md',
      showMorseOnHover = false,
      alwaysShowMorse = false,
      customPattern,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const currentStatus = disabled ? 'disabled' : status
    const patterns = customPattern || statusPatterns[currentStatus]
    const showMorse =
      alwaysShowMorse ||
      currentStatus !== 'idle' ||
      (showMorseOnHover && isHovered)

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        disabled={disabled || currentStatus === 'disabled'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {showMorse && patterns.length > 0 && (
          <MorsePixelGrid
            patterns={patterns}
            gridSize={5}
            pixelSize="xs"
            tempo={
              ['loading', 'importing', 'searching'].includes(currentStatus)
                ? 200
                : 600
            }
            iterations={
              ['loading', 'importing', 'searching'].includes(currentStatus)
                ? 'infinite'
                : 1
            }
            active={true}
            animationPreset="fade"
            className="p-0 bg-transparent"
            compact={true}
            showGrid={true}
            colorScheme={{
              active: 'currentColor',
              inactive: 'rgba(128, 128, 128, 0.3)',
              grid: 'rgba(128, 128, 128, 0.3)',
              background: 'transparent',
            }}
          />
        )}
        {children}
      </button>
    )
  }
)

MorseButton.displayName = 'MorseButton'
