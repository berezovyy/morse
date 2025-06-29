import React, { memo } from "react";
import { cn } from "@/lib/utils";
import type { AnimationPreset } from './MorsePixelGrid'

export interface PixelProps {
  active: boolean;
  row: number;
  col: number;
  size?: "sm" | "md" | "lg";
  onClick?: (row: number, col: number) => void;
  onMouseEnter?: (row: number, col: number) => void;
  interactive?: boolean;
  delay?: number;
  animationPreset?: AnimationPreset;
}

const sizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export const Pixel = memo(function Pixel({
  active,
  row,
  col,
  size = "md",
  onClick,
  onMouseEnter,
  interactive = false,
  delay = 0,
  animationPreset = 'fade',
}: PixelProps) {
  const handleClick = () => {
    if (interactive && onClick) {
      onClick(row, col);
    }
  };

  const handleMouseEnter = () => {
    if (interactive && onMouseEnter) {
      onMouseEnter(row, col);
    }
  };

  const getAnimationClasses = () => {
    if (!active) return ''
    
    switch (animationPreset) {
      case 'fade':
        return 'animate-fade-in'
      case 'scale':
        return 'animate-scale-in'
      case 'slide':
        return 'animate-slide-in'
      case 'wave':
      case 'spiral':
      case 'ripple':
      case 'cascade':
        return 'animate-scale-fade-in'
      case 'random':
        return Math.random() > 0.5 ? 'animate-scale-in' : 'animate-fade-in'
      default:
        return 'animate-fade-in'
    }
  }

  return (
    <div
      className={cn(
        "rounded-sm transition-all duration-300",
        sizeClasses[size],
        interactive && "cursor-pointer",
        active ? "bg-black" : "bg-gray-300",
        active && getAnimationClasses()
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      style={{
        animationDelay: active ? `${delay}ms` : undefined,
        animationFillMode: 'backwards'
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? active : undefined}
      aria-label={`Pixel at row ${row + 1}, column ${col + 1}`}
    />
  );
});
