import React, { memo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface PixelOptimizedProps {
  active: boolean;
  row: number;
  col: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  delay?: number;
  color?: string;
  inactiveColor?: string;
  showGrid?: boolean;
  gridColor?: string;
}

const sizeClasses = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

export const PixelOptimized = memo(function PixelOptimized({
  active,
  size = "md",
  delay = 0,
  color,
  inactiveColor,
  showGrid = false,
  gridColor,
}: PixelOptimizedProps) {
  const backgroundColor = active
    ? color || "rgb(0, 0, 0)" // Default to black
    : showGrid
    ? gridColor || inactiveColor || "#e5e5e5"
    : inactiveColor || "transparent";

  const inactiveOpacity = showGrid ? 1 : 0;

  return (
    <motion.div
      className={cn("rounded-sm", sizeClasses[size])}
      initial={{ scale: 1, opacity: inactiveOpacity }}
      animate={{
        scale: active ? 1 : showGrid ? 1 : 0.8,
        opacity: active ? 1 : inactiveOpacity,
      }}
      transition={{
        duration: 0.2,
        delay: active ? delay / 1000 : 0,
        ease: "easeOut",
      }}
      style={{ backgroundColor }}
    />
  );
});