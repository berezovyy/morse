"use client";

import React, { useRef, useMemo, memo } from "react";
import { cn } from "@/lib/utils";
import { useWidth } from "@/lib/hooks/useDimensionsOptimized";

export interface LabelMorphOptimizedProps {
  currentLabel: string;
  nextLabel: string | null;
  isTransitioning: boolean;
  className?: string;
  transitionDuration?: number;
}

export const LabelMorphOptimized = memo<LabelMorphOptimizedProps>(
  ({
    currentLabel,
    nextLabel,
    isTransitioning,
    className,
    transitionDuration = 300,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentRef = useRef<HTMLElement>(null);
    const nextRef = useRef<HTMLElement>(null);

    // Use optimized width-only hook with debouncing
    const currentWidth = useWidth(currentRef, 16);
    const nextWidth = useWidth(nextRef, 16);

    // Memoize container width calculation
    const containerWidth = useMemo(() => {
      if (isTransitioning && nextLabel) {
        return nextWidth || currentWidth;
      }
      return currentWidth;
    }, [isTransitioning, currentWidth, nextWidth, nextLabel]);

    // Memoize styles to prevent recreation
    const containerStyle = useMemo(
      () => ({
        transitionDuration: `${transitionDuration}ms`,
        width: containerWidth ? `${containerWidth}px` : "auto",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }),
      [transitionDuration, containerWidth]
    );

    const currentTransform = useMemo(
      () =>
        isTransitioning
          ? "translateY(-20px) rotateX(45deg)"
          : "translateY(0) rotateX(0)",
      [isTransitioning]
    );

    const nextTransform = useMemo(
      () =>
        isTransitioning
          ? "translateY(0) rotateX(0)"
          : "translateY(20px) rotateX(-45deg)",
      [isTransitioning]
    );

    const currentStyle = useMemo(
      () => ({
        transitionDuration: `${transitionDuration}ms`,
        transform: currentTransform,
      }),
      [transitionDuration, currentTransform]
    );

    const nextStyle = useMemo(
      () => ({
        transitionDuration: `${transitionDuration}ms`,
        transform: nextTransform,
      }),
      [transitionDuration, nextTransform]
    );

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative inline-block overflow-hidden transition-all",
          className
        )}
        style={containerStyle}
      >
        <span
          ref={currentRef}
          className={cn(
            "inline-block whitespace-nowrap transition-all",
            isTransitioning && "animate-label-morph opacity-0 scale-75"
          )}
          style={currentStyle}
        >
          {currentLabel}
        </span>

        {nextLabel && (
          <span
            ref={nextRef}
            className={cn(
              "absolute inset-0 inline-block whitespace-nowrap transition-all",
              isTransitioning ? "opacity-100 scale-100" : "opacity-0 scale-125"
            )}
            style={nextStyle}
          >
            {nextLabel}
          </span>
        )}
      </div>
    );
  }
);

LabelMorphOptimized.displayName = "LabelMorphOptimized";
