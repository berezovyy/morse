"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  const currentRef = useRef<HTMLElement>(null);
  const nextRef = useRef<HTMLElement>(null);
  const { width: currentWidth } = useDimensions(currentRef);
  const { width: nextWidth } = useDimensions(nextRef);

  const containerWidth = isTransitioning && nextLabel ? nextWidth : currentWidth;

  return (
    <motion.div
      className={cn("relative inline-block overflow-hidden", className)}
      animate={{ width: containerWidth || "auto" }}
      transition={{
        duration: transitionDuration / 1000,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.span
            key="current"
            ref={currentRef}
            className="inline-block whitespace-nowrap"
            initial={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{
              opacity: 0,
              y: -20,
              rotateX: 45,
              scale: 0.75,
            }}
            transition={{
              duration: transitionDuration / 1000,
              ease: [0.4, 0, 0.2, 1],
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
            transition={{
              duration: transitionDuration / 1000,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {nextLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};