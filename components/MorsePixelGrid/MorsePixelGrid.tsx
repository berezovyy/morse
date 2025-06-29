"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Pattern, isValidPattern } from "@/lib/patterns";
import { usePixelState } from "@/lib/hooks/usePixelState";
import { SequenceEngine } from "./SequenceEngine";
import { Pixel } from "./Pixel";

export interface ColorScheme {
  active: string;
  inactive: string;
  background?: string;
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

export interface MorsePixelGridProps {
  patterns?: Pattern[];
  tempo?: number;
  iterations?: number | "infinite";
  active?: boolean;
  onCycleComplete?: () => void;
  onComplete?: () => void;
  pixelSize?: "sm" | "md" | "lg";
  colorScheme?: ColorScheme;
  interactive?: boolean;
  className?: string;
  gridSize?: number;
  animationPreset?: AnimationPreset;
}

export const MorsePixelGrid: React.FC<MorsePixelGridProps> = ({
  patterns = [],
  tempo = 200,
  iterations = "infinite",
  active = true,
  onCycleComplete,
  onComplete,
  pixelSize = "md",
  colorScheme,
  interactive = false,
  className,
  gridSize = 8,
  animationPreset = "fade",
}) => {
  const engineRef = useRef<SequenceEngine | null>(null);
  const { pixels, setPattern, togglePixel } = usePixelState(gridSize);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFrameChange = useCallback(
    (frameIndex: number, pattern: Pattern) => {
      if (isValidPattern(pattern)) {
        setPattern(pattern);
      }
    },
    [setPattern]
  );

  const handleCycleComplete = useCallback(() => {
    onCycleComplete?.();
  }, [onCycleComplete]);

  const handleComplete = useCallback(() => {
    setIsAnimating(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (patterns.length === 0) return;

    engineRef.current = new SequenceEngine({
      patterns,
      tempo,
      iterations,
      onFrameChange: handleFrameChange,
      onCycleComplete: handleCycleComplete,
      onComplete: handleComplete,
    });

    if (active) {
      engineRef.current.start();
      setIsAnimating(true);
    }

    return () => {
      engineRef.current?.destroy();
    };
  }, [patterns, tempo, iterations, active]);

  useEffect(() => {
    if (!engineRef.current) return;

    if (active && !isAnimating) {
      engineRef.current.start();
      setIsAnimating(true);
    } else if (!active && isAnimating) {
      engineRef.current.stop();
      setIsAnimating(false);
    }
  }, [active, isAnimating]);

  useEffect(() => {
    engineRef.current?.setTempo(tempo);
  }, [tempo]);

  useEffect(() => {
    engineRef.current?.setIterations(iterations);
  }, [iterations]);

  const handlePixelClick = useCallback(
    (row: number, col: number) => {
      if (interactive && !isAnimating) {
        togglePixel(row, col);
      }
    },
    [interactive, isAnimating, togglePixel]
  );

  const calculateAnimationDelay = useCallback(
    (row: number, col: number) => {
      const center = gridSize / 2;
      const maxDistance = (Math.sqrt(2) * gridSize) / 2;

      switch (animationPreset) {
        case "fade":
          return 0;
        case "scale":
          return (row + col) * 20;
        case "slide":
          return col * 30;
        case "wave":
          return Math.sin((row + col) / 2) * 100 + 100;
        case "spiral":
          const angle = Math.atan2(row - center, col - center);
          const distance = Math.sqrt(
            Math.pow(row - center, 2) + Math.pow(col - center, 2)
          );
          return (angle + Math.PI) * 50 + distance * 30;
        case "random":
          return Math.random() * 200;
        case "ripple":
          const rippleDistance = Math.sqrt(
            Math.pow(row - center, 2) + Math.pow(col - center, 2)
          );
          return (rippleDistance / maxDistance) * 150;
        case "cascade":
          return row * 40 + col * 10;
        default:
          return 0;
      }
    },
    [gridSize, animationPreset]
  );

  const gapClasses = {
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1.5",
  };

  return (
    <div
      className={cn(
        "inline-grid grid-cols-8 p-4 rounded-lg bg-background/50 backdrop-blur-sm",
        gapClasses[pixelSize],
        className
      )}
      style={{
        backgroundColor: colorScheme?.background,
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {pixels.map((row, rowIndex) =>
        row.map((active, colIndex) => (
          <Pixel
            key={`${rowIndex}-${colIndex}`}
            active={active}
            row={rowIndex}
            col={colIndex}
            size={pixelSize}
            onClick={handlePixelClick}
            interactive={interactive && !isAnimating}
            delay={calculateAnimationDelay(rowIndex, colIndex)}
            animationPreset={animationPreset}
          />
        ))
      )}
    </div>
  );
};
