'use client'

import React, { forwardRef, ButtonHTMLAttributes, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { MorsePixelGrid } from '../MorsePixelGrid'
import { Pattern, ButtonStatus, ButtonVariant, ButtonSize } from '@/lib/types'
import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  ANIMATION_TIMING,
  DEFAULT_COLOR_SCHEME,
} from '@/lib/constants'
import * as patterns from './patterns'

export interface MorseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  status?: ButtonStatus
  variant?: ButtonVariant
  size?: ButtonSize
  showMorseOnHover?: boolean
  alwaysShowMorse?: boolean
  customPattern?: Pattern[]
}

const statusPatterns: Record<ButtonStatus, () => Pattern[]> = {
  idle: patterns.createEmptyPattern,
  loading: patterns.createLoadingPattern,
  success: patterns.createSuccessPattern,
  error: patterns.createErrorPattern,
  disabled: patterns.createDisabledPattern,
  importing: patterns.createImportingPattern,
  searching: patterns.createSearchingPattern,
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

    const patterns = useMemo(() => {
      return customPattern || statusPatterns[currentStatus]()
    }, [customPattern, currentStatus])

    const showMorse = useMemo(() => {
      return (
        alwaysShowMorse ||
        currentStatus !== 'idle' ||
        (showMorseOnHover && isHovered)
      )
    }, [alwaysShowMorse, currentStatus, showMorseOnHover, isHovered])

    const isAnimating = useMemo(() => {
      return ['loading', 'importing', 'searching'].includes(currentStatus)
    }, [currentStatus])

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors p-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          BUTTON_SIZES[size].class,
          BUTTON_VARIANTS[variant],
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
            pixelSize="2xs"
            tempo={
              isAnimating ? ANIMATION_TIMING.FAST : ANIMATION_TIMING.NORMAL
            }
            iterations={isAnimating ? 'infinite' : 1}
            active={true}
            animationPreset="fade"
            className="p-0 bg-transparent"
            compact={true}
            showGrid={true}
            colorScheme={DEFAULT_COLOR_SCHEME}
          />
        )}
        {children}
      </button>
    )
  }
)

MorseButton.displayName = 'MorseButton'
