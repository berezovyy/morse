"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
} from "react";
import { cn } from "@/lib/utils";
import {
  MorsePixelGridOptimized,
  MorsePixelGridOptimizedProps,
} from "../MorsePixelGrid";
import { LabelMorphOptimized } from "./LabelMorphOptimized";
import { Orchestrator, OrchestratorState } from "./Orchestrator";
import { Pattern, getPresetByName } from "@/lib/patterns";

export interface MorseMatrixFlowOptimizedProps {
  labels?: string[];
  patterns?: Pattern[][] | string[];
  patternDuration?: number;
  transitionDuration?: number;
  pixelGridProps?: Partial<MorsePixelGridOptimizedProps>;
  active?: boolean;
  className?: string;
  labelClassName?: string;
  showLabel?: boolean;
  gap?: "none" | "sm" | "md" | "lg";
  compact?: boolean;
}

const gapClasses = {
  none: "gap-0",
  sm: "gap-1",
  md: "gap-2",
  lg: "gap-4",
};

export const MorseMatrixFlowOptimized = memo<MorseMatrixFlowOptimizedProps>(
  ({
    labels = ["Loading", "Processing", "Scanning", "Building"],
    patterns,
    patternDuration = 3000,
    transitionDuration = 300,
    pixelGridProps = {},
    active = true,
    className,
    labelClassName,
    showLabel = true,
    gap = "md",
    compact = false,
  }) => {
    const orchestratorRef = useRef<Orchestrator | null>(null);
    const [orchestratorState, setOrchestratorState] =
      useState<OrchestratorState>({
        currentLabel: labels[0] || "",
        nextLabel: null,
        isTransitioning: false,
        currentPatternIndex: 0,
      });

    // Memoize pattern resolution
    const resolvedPatterns = useMemo((): Pattern[][] => {
      if (!patterns) {
        return labels.map((label) => {
          const preset = getPresetByName(label);
          return preset ? preset.frames : [];
        });
      }

      return patterns.map((pattern) => {
        if (typeof pattern === "string") {
          const preset = getPresetByName(pattern);
          return preset ? preset.frames : [];
        }
        return pattern;
      });
    }, [patterns, labels]);

    // Memoize current patterns
    const currentPatterns = useMemo(
      () => resolvedPatterns[orchestratorState.currentPatternIndex] || [],
      [resolvedPatterns, orchestratorState.currentPatternIndex]
    );

    // Memoize orchestrator config
    const orchestratorConfig = useMemo(
      () => ({
        labels,
        patternDuration,
        transitionDuration,
        onStateChange: setOrchestratorState,
      }),
      [labels, patternDuration, transitionDuration]
    );

    // Consolidate orchestrator lifecycle
    useEffect(() => {
      const orchestrator = new Orchestrator(orchestratorConfig);
      orchestratorRef.current = orchestrator;

      if (active) {
        orchestrator.start();
      }

      return () => {
        orchestrator.destroy();
      };
    }, [orchestratorConfig, active]);

    // Handle active state changes separately
    useEffect(() => {
      const orchestrator = orchestratorRef.current;
      if (!orchestrator) return;

      if (active) {
        orchestrator.start();
      } else {
        orchestrator.stop();
      }
    }, [active]);

    // Memoize pixel grid active state
    const pixelGridActive = useMemo(
      () => active && !orchestratorState.isTransitioning,
      [active, orchestratorState.isTransitioning]
    );

    // Memoize label morph class
    const labelMorphClassName = useMemo(
      () =>
        cn(
          compact ? "text-sm" : "text-lg",
          "font-medium text-foreground",
          labelClassName
        ),
      [compact, labelClassName]
    );

    // Memoize container class
    const containerClassName = useMemo(
      () =>
        cn(
          "inline-flex flex-col items-center justify-center",
          gapClasses[gap],
          className
        ),
      [gap, className]
    );

    return (
      <div className={containerClassName}>
        <MorsePixelGridOptimized
          patterns={currentPatterns}
          active={pixelGridActive}
          tempo={200}
          iterations="infinite"
          compact={compact}
          {...pixelGridProps}
        />

        {showLabel && (
          <LabelMorphOptimized
            currentLabel={orchestratorState.currentLabel}
            nextLabel={orchestratorState.nextLabel}
            isTransitioning={orchestratorState.isTransitioning}
            transitionDuration={transitionDuration}
            className={labelMorphClassName}
          />
        )}
      </div>
    );
  }
);

MorseMatrixFlowOptimized.displayName = "MorseMatrixFlowOptimized";
