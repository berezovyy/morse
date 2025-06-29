"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDimensions } from "@/lib/hooks/useDimensions";

export interface LabelMorphProps {
  currentLabel: string;
  nextLabel: string | null;
  isTransitioning: boolean;
  className?: string;
  transitionDuration?: number;
}

export const LabelMorph: React.FC<LabelMorphProps> = ({
  currentLabel,
  nextLabel,
  isTransitioning,
  className,
  transitionDuration = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLElement>(null);
  const nextRef = useRef<HTMLElement>(null);
  const { width: currentWidth } = useDimensions(currentRef);
  const { width: nextWidth } = useDimensions(nextRef);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    if (isTransitioning && nextLabel) {
      setContainerWidth(nextWidth);
    } else {
      setContainerWidth(currentWidth);
    }
  }, [isTransitioning, currentWidth, nextWidth, nextLabel]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-block overflow-hidden transition-all",
        className
      )}
      style={{
        transitionDuration: `${transitionDuration}ms`,
        width: containerWidth ? `${containerWidth}px` : "auto",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <span
        ref={currentRef}
        className={cn(
          "inline-block whitespace-nowrap transition-all",
          isTransitioning && "animate-label-morph opacity-0 scale-75"
        )}
        style={{
          transitionDuration: `${transitionDuration}ms`,
          transform: isTransitioning
            ? "translateY(-20px) rotateX(45deg)"
            : "translateY(0) rotateX(0)",
        }}
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
          style={{
            transitionDuration: `${transitionDuration}ms`,
            transform: isTransitioning
              ? "translateY(0) rotateX(0)"
              : "translateY(20px) rotateX(-45deg)",
          }}
        >
          {nextLabel}
        </span>
      )}
    </div>
  );
};
