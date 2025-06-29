"use client";

import React, { useState } from "react";
import { MorseButton, ButtonStatus } from "@/components/MorseButton";
import { MorsePixelGrid } from "@/components/MorsePixelGrid";
import { getPresetByName, Pattern } from "@/lib/patterns";

// Create sample patterns for demo
const createLoadingFrame = (): Pattern => {
  const pattern: Pattern = Array(8)
    .fill(null)
    .map(() => Array(8).fill(false));
  pattern[3][3] = true;
  pattern[3][4] = true;
  pattern[4][3] = true;
  pattern[4][4] = true;
  return pattern;
};

const statusPatterns = {
  loading: [createLoadingFrame()],
};

export default function MorseButtonDemo() {
  const [status, setStatus] = useState<ButtonStatus>("idle");
  const [showHover, setShowHover] = useState(false);

  const handleClick = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }, 3000);
  };

  const handleErrorClick = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold mb-8">Morse Button Component</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button States</h2>
          <div className="flex flex-wrap gap-4">
            <MorseButton status="idle">Idle State</MorseButton>
            <MorseButton status="loading">Loading...</MorseButton>
            <MorseButton status="success">Success!</MorseButton>
            <MorseButton status="error">Error</MorseButton>
            <MorseButton status="disabled">Disabled</MorseButton>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Interactive Examples</h2>
          <div className="flex flex-wrap gap-4">
            <MorseButton onClick={handleClick} status={status}>
              Click for Success
            </MorseButton>
            <MorseButton
              onClick={handleErrorClick}
              status={status}
              variant="destructive"
            >
              Click for Error
            </MorseButton>
            <MorseButton
              showMorseOnHover={!showHover}
              onMouseEnter={() => setShowHover(true)}
              onMouseLeave={() => setShowHover(false)}
            >
              Hover Me
            </MorseButton>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <MorseButton variant="default" status="loading">
              Default
            </MorseButton>
            <MorseButton variant="outline" status="loading">
              Outline
            </MorseButton>
            <MorseButton variant="ghost" status="loading">
              Ghost
            </MorseButton>
            <MorseButton variant="destructive" status="loading">
              Destructive
            </MorseButton>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Sizes</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <MorseButton size="sm" status="loading">
              Small
            </MorseButton>
            <MorseButton size="md" status="loading">
              Medium
            </MorseButton>
            <MorseButton size="lg" status="loading">
              Large
            </MorseButton>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Grid Display Options</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="font-medium">With Background Grid</h3>
              <MorsePixelGrid
                patterns={getPresetByName("Loading")?.frames.slice(0, 3) || []}
                gridSize={7}
                pixelSize="md"
                tempo={300}
                iterations="infinite"
                active={true}
                showGrid={true}
                colorScheme={{
                  active: "#000",
                  inactive: "transparent",
                  grid: "rgba(0,0,0,0.1)",
                  background: "#fff",
                }}
                className="border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Without Background Grid</h3>
              <MorsePixelGrid
                patterns={getPresetByName("Loading")?.frames.slice(0, 3) || []}
                gridSize={7}
                pixelSize="md"
                tempo={300}
                iterations="infinite"
                active={true}
                showGrid={false}
                className="border rounded-lg"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Compact Grid Spacing</h2>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">1px gap</p>
              <MorsePixelGrid
                patterns={[statusPatterns.loading[0]]}
                gridSize={7}
                pixelSize="xs"
                tempo={200}
                iterations={1}
                active={true}
                showGrid={true}
                colorScheme={{
                  active: "#000",
                  inactive: "transparent",
                  grid: "rgba(0,0,0,0.15)",
                }}
                className="border rounded p-2"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">2px gap</p>
              <MorsePixelGrid
                patterns={[statusPatterns.loading[0]]}
                gridSize={7}
                pixelSize="sm"
                tempo={200}
                iterations={1}
                active={true}
                showGrid={true}
                colorScheme={{
                  active: "#000",
                  inactive: "transparent",
                  grid: "rgba(0,0,0,0.15)",
                }}
                className="border rounded p-2"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">3px gap</p>
              <MorsePixelGrid
                patterns={[statusPatterns.loading[0]]}
                gridSize={7}
                pixelSize="md"
                tempo={200}
                iterations={1}
                active={true}
                showGrid={true}
                colorScheme={{
                  active: "#000",
                  inactive: "transparent",
                  grid: "rgba(0,0,0,0.15)",
                }}
                className="border rounded p-2"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
