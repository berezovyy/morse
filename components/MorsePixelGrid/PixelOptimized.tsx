import React, { memo } from "react";
import { cn } from "@/lib/utils";

export interface PixelOptimizedProps {
  row: number;
  col: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  animationData?: string; // CSS animation keyframes
  delay?: number;
  className?: string;
}

const sizeClasses = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

// Pure component with no state updates
export const PixelOptimized = memo(
  function PixelOptimized({
    row,
    col,
    size = "md",
    animationData,
    delay = 0,
    className,
  }: PixelOptimizedProps) {
    return (
      <div
        className={cn("morse-pixel rounded-sm", sizeClasses[size], className)}
        data-row={row}
        data-col={col}
        style={
          {
            animationDelay: `${delay}ms`,
            // CSS will handle all animations
          } as React.CSSProperties
        }
      />
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if structural props change
    return (
      prevProps.row === nextProps.row &&
      prevProps.col === nextProps.col &&
      prevProps.size === nextProps.size &&
      prevProps.className === nextProps.className
    );
  }
);
