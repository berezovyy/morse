"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MorsePixelGrid, MorsePixelGridProps } from "../MorsePixelGrid";
import { LabelMorph } from "./LabelMorph";
import { Orchestrator, OrchestratorState } from "./Orchestrator";
import { Pattern, getPresetByName } from "@/lib/patterns";

export interface MorseMatrixFlowProps {
  labels?: string[];
  patterns?: Pattern[][] | string[];
  patternDuration?: number;
  transitionDuration?: number;
  pixelGridProps?: Partial<MorsePixelGridProps>;
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

export const MorseMatrixFlow: React.FC<MorseMatrixFlowProps> = ({
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
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState>(
    {
      currentLabel: labels[0] || "",
      nextLabel: null,
      isTransitioning: false,
      currentPatternIndex: 0,
    }
  );

  const resolvePatterns = useCallback((): Pattern[][] => {
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

  const [resolvedPatterns] = useState(resolvePatterns);
  const currentPatterns =
    resolvedPatterns[orchestratorState.currentPatternIndex] || [];

  useEffect(() => {
    orchestratorRef.current = new Orchestrator({
      labels,
      patternDuration,
      transitionDuration,
      onStateChange: setOrchestratorState,
    });

    if (active) {
      orchestratorRef.current.start();
    }

    return () => {
      orchestratorRef.current?.destroy();
    };
  }, [labels, patternDuration, transitionDuration, active]);

  useEffect(() => {
    if (!orchestratorRef.current) return;

    if (active) {
      orchestratorRef.current.start();
    } else {
      orchestratorRef.current.stop();
    }
  }, [active]);

  useEffect(() => {
    orchestratorRef.current?.setLabels(labels);
  }, [labels]);

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center",
        gapClasses[gap],
        className
      )}
    >
      <MorsePixelGrid
        patterns={currentPatterns}
        active={active && !orchestratorState.isTransitioning}
        tempo={200}
        iterations="infinite"
        compact={compact}
        {...pixelGridProps}
      />

      {showLabel && (
        <LabelMorph
          currentLabel={orchestratorState.currentLabel}
          nextLabel={orchestratorState.nextLabel}
          isTransitioning={orchestratorState.isTransitioning}
          transitionDuration={transitionDuration}
          className={cn(
            compact ? "text-sm" : "text-lg",
            "font-medium text-foreground",
            labelClassName
          )}
        />
      )}
    </div>
  );
};
