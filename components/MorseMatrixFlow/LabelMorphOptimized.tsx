"use client";

import React, { useRef, memo } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
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
    const currentRef = useRef<HTMLElement>(null);
    const nextRef = useRef<HTMLElement>(null);

    // Use optimized width-only hook with debouncing
    const currentWidth = useWidth(currentRef, 16);
    const nextWidth = useWidth(nextRef, 16);

    const containerWidth = isTransitioning && nextLabel ? nextWidth : currentWidth;

    return (
      <MotionConfig
        transition={{
          duration: transitionDuration / 1000,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <motion.div
          className={cn("relative inline-block overflow-hidden", className)}
          animate={{ width: containerWidth || "auto" }}
        >
          <AnimatePresence mode="wait">
            {!isTransitioning && (
              <motion.span
                key="current"
                ref={currentRef}
                className="inline-block whitespace-nowrap"
                initial={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -20,
                  rotateX: 45,
                  scale: 0.75,
                }}
              >
                {currentLabel}
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isTransitioning && nextLabel && (
              <motion.span
                key="next"
                ref={nextRef}
                className="absolute inset-0 inline-block whitespace-nowrap"
                initial={{
                  opacity: 0,
                  y: 20,
                  rotateX: -45,
                  scale: 1.25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                }}
              >
                {nextLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </MotionConfig>
    );
  }
);

LabelMorphOptimized.displayName = "LabelMorphOptimized";