"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Pattern, isValidPattern } from "@/lib/patterns";
import { PixelOptimized } from "./PixelOptimized";

export interface ColorScheme {
  active: string;
  inactive: string;
  background?: string;
  grid?: string;
}

export type AnimationPreset =
  | "fade"
  | "scale"
  | "slide"
  | "wave"
  | "spiral"
  | "random"
  | "ripple"
  | "cascade";

export interface MorsePixelGridOptimizedProps {
  patterns?: Pattern[];
  tempo?: number;
  iterations?: number | "infinite";
  active?: boolean;
  onCycleComplete?: () => void;
  onComplete?: () => void;
  pixelSize?: "xs" | "sm" | "md" | "lg" | "xl";
  colorScheme?: ColorScheme;
  interactive?: boolean;
  className?: string;
  gridSize?: number;
  animationPreset?: AnimationPreset;
  compact?: boolean;
  showGrid?: boolean;
}

const gapClasses = {
  xs: "gap-[1px]",
  sm: "gap-[2px]",
  md: "gap-[3px]",
  lg: "gap-[4px]",
  xl: "gap-[5px]",
};

const paddingClasses = {
  xs: "p-1",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
  xl: "p-4",
};

function calculateAnimationDelay(
  row: number,
  col: number,
  gridSize: number,
  preset: AnimationPreset
): number {
  const center = gridSize / 2;

  switch (preset) {
    case "fade":
      return 0;
    case "scale":
      return (row + col) * 20;
    case "slide":
      return col * 30;
    case "wave":
      return Math.sin((row + col) / 2) * 100 + 100;
    case "spiral": {
      const angle = Math.atan2(row - center, col - center);
      const distance = Math.sqrt(
        Math.pow(row - center, 2) + Math.pow(col - center, 2)
      );
      return (angle + Math.PI) * 50 + distance * 30;
    }
    case "random":
      return Math.random() * 200;
    case "ripple": {
      const distance = Math.sqrt(
        Math.pow(row - center, 2) + Math.pow(col - center, 2)
      );
      return (distance / ((Math.sqrt(2) * gridSize) / 2)) * 150;
    }
    case "cascade":
      return row * 40 + col * 10;
    default:
      return 0;
  }
}

export const MorsePixelGridOptimized: React.FC<
  MorsePixelGridOptimizedProps
> = ({
  patterns = [],
  tempo = 200,
  iterations = "infinite",
  active = true,
  onCycleComplete,
  onComplete,
  pixelSize = "md",
  colorScheme,
  className,
  gridSize = 7,
  animationPreset = "fade",
  compact = false,
  showGrid = true,
}) => {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // Calculate pixel states for all patterns upfront
  const pixelStatesSequence = useMemo(() => {
    if (patterns.length === 0) return [];
    
    return patterns.map(pattern => {
      if (!isValidPattern(pattern)) {
        return Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
      }
      
      return Array(gridSize).fill(null).map((_, row) =>
        Array(gridSize).fill(null).map((_, col) => 
          Boolean(pattern[row]?.[col])
        )
      );
    });
  }, [patterns, gridSize]);

  // Pattern sequencing
  useEffect(() => {
    if (!active || patterns.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPatternIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % patterns.length;
        
        if (nextIndex === 0) {
          setCycleCount((prev) => {
            const newCount = prev + 1;
            onCycleComplete?.();
            
            if (iterations !== "infinite" && newCount >= iterations) {
              onComplete?.();
              return prev;
            }
            return newCount;
          });
        }
        
        return nextIndex;
      });
    }, tempo);

    return () => clearInterval(interval);
  }, [active, patterns.length, tempo, iterations, onCycleComplete, onComplete]);

  // Reset when iterations complete
  useEffect(() => {
    if (iterations !== "infinite" && cycleCount >= iterations) {
      setCurrentPatternIndex(0);
      setCycleCount(0);
    }
  }, [cycleCount, iterations]);

  // Current pixel states
  const currentPixelStates = pixelStatesSequence[currentPatternIndex] || 
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));

  // Generate pixels with optimized rendering
  const pixels = useMemo(() => {
    const elements = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const delay = calculateAnimationDelay(row, col, gridSize, animationPreset);
        elements.push(
          <PixelOptimized
            key={`${row}-${col}`}
            active={currentPixelStates[row][col]}
            row={row}
            col={col}
            size={pixelSize}
            delay={delay}
            color={colorScheme?.active}
            inactiveColor={colorScheme?.inactive}
            showGrid={showGrid}
            gridColor={colorScheme?.grid}
          />
        );
      }
    }
    return elements;
  }, [
    gridSize,
    pixelSize,
    currentPixelStates,
    animationPreset,
    colorScheme,
    showGrid,
  ]);

  return (
    <motion.div
      className={cn(
        "morse-pixel-grid grid rounded-lg",
        !compact && "bg-background/50 backdrop-blur-sm",
        gapClasses[pixelSize],
        compact ? "p-0" : paddingClasses[pixelSize],
        className
      )}
      style={{
        backgroundColor: colorScheme?.background,
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {pixels}
    </motion.div>
  );
};