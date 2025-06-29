"use client";

import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Pattern, isValidPattern } from "@/lib/patterns";

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

export interface MorsePixelGridProps {
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

const sizeClasses = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

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
  gridSize = 7,
  animationPreset = "fade",
  compact = false,
  showGrid = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<Animation[]>([]);

  // Pre-calculate the animation sequence for all pixels
  const animationData = useMemo(() => {
    if (patterns.length === 0) return null;

    const totalFrames = patterns.length;
    const totalDuration = totalFrames * tempo;
    const pixelAnimations: Map<string, number[]> = new Map();

    // For each pixel position, calculate its state across all frames
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const states: number[] = [];
        patterns.forEach((pattern) => {
          if (isValidPattern(pattern)) {
            states.push(pattern[row]?.[col] ? 1 : 0);
          }
        });
        pixelAnimations.set(`${row}-${col}`, states);
      }
    }

    return { pixelAnimations, totalDuration, totalFrames };
  }, [patterns, tempo, gridSize]);

  // Initialize CSS animations using Web Animations API
  const initializeAnimations = useCallback(() => {
    if (!gridRef.current || !animationData || !active) return;

    // Clear existing animations
    animationsRef.current.forEach((anim) => anim.cancel());
    animationsRef.current = [];

    const pixels = gridRef.current.querySelectorAll(".morse-pixel");
    const { pixelAnimations, totalDuration } = animationData;

    pixels.forEach((pixel, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const states = pixelAnimations.get(`${row}-${col}`);

      if (!states) return;

      // Create keyframes for background color changes
      const keyframes = states.map((state, frameIndex) => ({
        offset: frameIndex / states.length,
        backgroundColor: state
          ? colorScheme?.active || "currentColor"
          : showGrid
          ? colorScheme?.grid || colorScheme?.inactive || "#e5e5e5"
          : colorScheme?.inactive || "transparent",
      }));

      // Add final keyframe to ensure smooth loop
      keyframes.push({
        offset: 1,
        backgroundColor: keyframes[0].backgroundColor,
      });

      // Calculate animation delay based on preset
      const delay = calculateAnimationDelay(
        row,
        col,
        gridSize,
        animationPreset
      );

      const animation = pixel.animate(keyframes, {
        duration: totalDuration,
        iterations: iterations === "infinite" ? Infinity : iterations,
        delay,
        easing: "steps(" + states.length + ", end)",
        fill: "forwards",
      });

      // Track cycle completion
      if (row === 0 && col === 0) {
        animation.addEventListener("finish", () => {
          if (iterations !== "infinite") {
            onComplete?.();
          }
        });

        // Use the Web Animations API timeline to track cycles
        let lastCycle = 0;
        const checkCycle = () => {
          if (!animation.currentTime) return;
          const currentCycle = Math.floor(
            animation.currentTime / totalDuration
          );
          if (currentCycle > lastCycle) {
            lastCycle = currentCycle;
            onCycleComplete?.();
          }
          if (animation.playState === "running") {
            requestAnimationFrame(checkCycle);
          }
        };
        requestAnimationFrame(checkCycle);
      }

      animationsRef.current.push(animation);
    });
  }, [
    animationData,
    active,
    colorScheme,
    gridSize,
    iterations,
    animationPreset,
    showGrid,
    onCycleComplete,
    onComplete,
  ]);

  // Initialize animations when component mounts or patterns change
  useEffect(() => {
    initializeAnimations();

    return () => {
      animationsRef.current.forEach((anim) => anim.cancel());
      animationsRef.current = [];
    };
  }, [initializeAnimations]);

  // Control playback state
  useEffect(() => {
    animationsRef.current.forEach((anim) => {
      if (active) {
        anim.play();
      } else {
        anim.pause();
      }
    });
  }, [active]);

  // Update playback rate when tempo changes
  useEffect(() => {
    if (!animationData) return;
    const playbackRate = 200 / tempo; // Normalize to base tempo
    animationsRef.current.forEach((anim) => {
      anim.playbackRate = playbackRate;
    });
  }, [tempo, animationData]);

  const handlePixelClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || active) return;

      const pixel = e.target as HTMLElement;
      if (!pixel.classList.contains("morse-pixel")) return;

      const index = Array.from(pixel.parentElement!.children).indexOf(pixel);
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;

      // Toggle pixel state in CSS
      const currentState = pixel.dataset.state === "1";
      pixel.dataset.state = currentState ? "0" : "1";
    },
    [interactive, active, gridSize]
  );

  // Render static grid with data attributes
  const pixels = useMemo(() => {
    const elements = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        elements.push(
          <div
            key={`${row}-${col}`}
            className={cn(
              "morse-pixel rounded-sm",
              sizeClasses[pixelSize],
              interactive && !active && "cursor-pointer",
              `preset-${animationPreset}`
            )}
            data-row={row}
            data-col={col}
            data-state="0"
            style={
              {
                "--pixel-active-color": colorScheme?.active || "currentColor",
                "--pixel-inactive-color": showGrid
                  ? colorScheme?.grid || colorScheme?.inactive || "#e5e5e5"
                  : colorScheme?.inactive || "transparent",
                "--pixel-transition-duration": "300ms",
              } as React.CSSProperties
            }
            role={interactive ? "button" : undefined}
            tabIndex={interactive && !active ? 0 : undefined}
            aria-label={`Pixel at row ${row + 1}, column ${col + 1}`}
          />
        );
      }
    }
    return elements;
  }, [
    gridSize,
    pixelSize,
    interactive,
    active,
    animationPreset,
    colorScheme,
    showGrid,
  ]);

  return (
    <div
      ref={gridRef}
      className={cn(
        "morse-pixel-grid grid rounded-lg",
        !compact && "bg-background/50 backdrop-blur-sm",
        gapClasses[pixelSize],
        compact ? "p-0" : paddingClasses[pixelSize],
        className
      )}
      style={
        {
          backgroundColor: colorScheme?.background,
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          "--pattern-duration": `${animationData?.totalDuration}ms`,
          "--pattern-iterations":
            iterations === "infinite" ? "infinite" : iterations,
        } as React.CSSProperties
      }
      onClick={handlePixelClick}
    >
      {pixels}
    </div>
  );
};

// Optimized delay calculation function
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
