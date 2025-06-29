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

// Memoized pixel component for better performance
const Pixel = React.memo<{
  row: number;
  col: number;
  size: string;
  interactive: boolean;
  active: boolean;
  animationDelay: number;
  animationName: string;
  animationDuration: number;
  iterations: number | "infinite";
  colorScheme?: ColorScheme;
  showGrid: boolean;
}>(
  ({
    row,
    col,
    size,
    interactive,
    active,
    animationDelay,
    animationName,
    animationDuration,
    iterations,
    colorScheme,
    showGrid,
  }) => {
    const pixelRef = useRef<HTMLDivElement>(null);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        if (!interactive || active) return;
        e.stopPropagation();

        const pixel = pixelRef.current;
        if (!pixel) return;

        const currentState = pixel.dataset.state === "1";
        pixel.dataset.state = currentState ? "0" : "1";
        pixel.style.backgroundColor = currentState
          ? showGrid
            ? colorScheme?.grid || colorScheme?.inactive || "#e5e5e5"
            : colorScheme?.inactive || "transparent"
          : colorScheme?.active || "currentColor";
      },
      [interactive, active, colorScheme, showGrid]
    );

    return (
      <div
        ref={pixelRef}
        className={cn(
          "morse-pixel rounded-sm transition-colors",
          size,
          interactive && !active && "cursor-pointer hover:opacity-80"
        )}
        data-row={row}
        data-col={col}
        data-state="0"
        style={{
          backgroundColor: showGrid
            ? colorScheme?.grid || colorScheme?.inactive || "#e5e5e5"
            : colorScheme?.inactive || "transparent",
          animationName: active ? animationName : "none",
          animationDuration: `${animationDuration}ms`,
          animationDelay: `${animationDelay}ms`,
          animationIterationCount:
            iterations === "infinite" ? "infinite" : iterations,
          animationTimingFunction: "steps(1, end)",
          animationFillMode: "forwards",
        }}
        onClick={handleClick}
        role={interactive ? "button" : undefined}
        tabIndex={interactive && !active ? 0 : undefined}
        aria-label={`Pixel at row ${row + 1}, column ${col + 1}`}
      />
    );
  }
);

Pixel.displayName = "Pixel";

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
  interactive = false,
  className,
  gridSize = 7,
  animationPreset = "fade",
  compact = false,
  showGrid = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const cycleTrackerRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Generate CSS keyframes for each pixel
  const { keyframes, animationNames, totalDuration } = useMemo(() => {
    if (patterns.length === 0)
      return { keyframes: "", animationNames: new Map(), totalDuration: 0 };

    const totalFrames = patterns.length;
    const totalDuration = totalFrames * tempo;
    const keyframesMap = new Map<string, string>();
    const animationNames = new Map<string, string>();

    const activeColor = colorScheme?.active || "currentColor";
    const inactiveColor = showGrid
      ? colorScheme?.grid || colorScheme?.inactive || "#e5e5e5"
      : colorScheme?.inactive || "transparent";

    // Generate keyframes for each unique pixel pattern
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const states: boolean[] = [];
        patterns.forEach((pattern) => {
          if (isValidPattern(pattern)) {
            states.push(pattern[row]?.[col] || false);
          }
        });

        // Create a unique ID for this state sequence
        const stateKey = states.map((s) => (s ? "1" : "0")).join("");
        const animName = `morse-${stateKey}`;

        if (!keyframesMap.has(stateKey)) {
          // Generate keyframes for this unique pattern
          const keyframeRules: string[] = [];
          states.forEach((state, index) => {
            const percent = (index / states.length) * 100;
            const nextPercent = ((index + 1) / states.length) * 100;
            keyframeRules.push(
              `${percent}%, ${nextPercent - 0.01}% { background-color: ${
                state ? activeColor : inactiveColor
              }; }`
            );
          });

          keyframesMap.set(
            stateKey,
            `@keyframes ${animName} { ${keyframeRules.join(" ")} }`
          );
        }

        animationNames.set(`${row}-${col}`, animName);
      }
    }

    return {
      keyframes: Array.from(keyframesMap.values()).join("\n"),
      animationNames,
      totalDuration,
    };
  }, [patterns, tempo, gridSize, colorScheme, showGrid]);

  // Inject CSS keyframes
  useEffect(() => {
    if (!keyframes) return;

    // Create or update style element
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      styleRef.current.id = "morse-pixel-grid-animations";
      document.head.appendChild(styleRef.current);
    }

    styleRef.current.textContent = keyframes;

    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [keyframes]);

  // Track cycle completion
  useEffect(() => {
    if (!active || !onCycleComplete || totalDuration === 0) return;

    const startTime = performance.now();
    cycleTrackerRef.current = 0;

    const checkCycle = () => {
      const elapsed = performance.now() - startTime;
      const currentCycle = Math.floor(elapsed / totalDuration);

      if (currentCycle > cycleTrackerRef.current) {
        cycleTrackerRef.current = currentCycle;
        onCycleComplete();

        if (iterations !== "infinite" && currentCycle >= iterations) {
          onComplete?.();
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(checkCycle);
    };

    animationFrameRef.current = requestAnimationFrame(checkCycle);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, onCycleComplete, onComplete, totalDuration, iterations]);

  // Calculate animation delays
  const animationDelays = useMemo(() => {
    const delays = new Map<string, number>();
    const center = gridSize / 2;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        let delay = 0;

        switch (animationPreset) {
          case "scale":
            delay = (row + col) * 20;
            break;
          case "slide":
            delay = col * 30;
            break;
          case "wave":
            delay = Math.sin((row + col) / 2) * 100 + 100;
            break;
          case "spiral": {
            const angle = Math.atan2(row - center, col - center);
            const distance = Math.sqrt(
              Math.pow(row - center, 2) + Math.pow(col - center, 2)
            );
            delay = (angle + Math.PI) * 50 + distance * 30;
            break;
          }
          case "random":
            delay = Math.random() * 200;
            break;
          case "ripple": {
            const distance = Math.sqrt(
              Math.pow(row - center, 2) + Math.pow(col - center, 2)
            );
            delay = (distance / ((Math.sqrt(2) * gridSize) / 2)) * 150;
            break;
          }
          case "cascade":
            delay = row * 40 + col * 10;
            break;
        }

        delays.set(`${row}-${col}`, delay);
      }
    }

    return delays;
  }, [gridSize, animationPreset]);

  // Render pixels
  const pixels = useMemo(() => {
    const elements = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const key = `${row}-${col}`;
        elements.push(
          <Pixel
            key={key}
            row={row}
            col={col}
            size={sizeClasses[pixelSize]}
            interactive={interactive}
            active={active}
            animationDelay={animationDelays.get(key) || 0}
            animationName={animationNames.get(key) || ""}
            animationDuration={totalDuration}
            iterations={iterations}
            colorScheme={colorScheme}
            showGrid={showGrid}
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
    animationDelays,
    animationNames,
    totalDuration,
    iterations,
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
      style={{
        backgroundColor: colorScheme?.background,
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {pixels}
    </div>
  );
};
