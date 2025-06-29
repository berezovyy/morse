"use client";

import React, { useState } from "react";
import { MorsePixelGrid, AnimationPreset } from "@/components/MorsePixelGrid";
import { MorseMatrixFlow } from "@/components/MorseMatrixFlow";
import {
  patternPresets,
  createRandomPattern,
  createEmptyPattern,
} from "@/lib/patterns";

export default function MorseDemoPage() {
  const [activePreset, setActivePreset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationPreset, setAnimationPreset] =
    useState<AnimationPreset>("fade");

  const currentPreset = patternPresets[activePreset];

  const animationPresets: { value: AnimationPreset; label: string }[] = [
    { value: "fade", label: "Fade" },
    { value: "scale", label: "Scale" },
    { value: "slide", label: "Slide" },
    { value: "wave", label: "Wave" },
    { value: "spiral", label: "Spiral" },
    { value: "random", label: "Random" },
    { value: "ripple", label: "Ripple" },
    { value: "cascade", label: "Cascade" },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Morse Pixel Animation System</h1>
          <p className="text-muted-foreground text-lg">
            Interactive pixel-matrix animations with synchronized label
            transitions
          </p>
        </div>

        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">MorseMatrixFlow Demo</h2>
            <p className="text-muted-foreground">
              Orchestrated animations with automatic label transitions
            </p>
          </div>

          <div className="flex justify-center">
            <MorseMatrixFlow
              labels={[
                "Loading",
                "Processing",
                "Scanning",
                "Building",
                "Complete",
              ]}
              active={isPlaying}
              className="p-8 rounded-lg border bg-card"
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
