import { Pattern } from "@/lib/patterns";

export interface SequenceEngineConfig {
  patterns: Pattern[];
  tempo: number;
  iterations: number | "infinite";
  onFrameChange?: (frameIndex: number, pattern: Pattern) => void;
  onCycleComplete?: () => void;
  onComplete?: () => void;
}

export class SequenceEngine {
  private patterns: Pattern[];
  private tempo: number;
  private iterations: number | "infinite";
  private currentFrame: number = 0;
  private currentIteration: number = 0;
  private lastFrameTime: number = 0;
  private accumulatedTime: number = 0;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private startTime: number = 0;
  private pausedTime: number = 0;

  // Cache current pattern to avoid repeated array access
  private cachedPattern: Pattern | null = null;
  private cachedFrameIndex: number = -1;

  private onFrameChange?: (frameIndex: number, pattern: Pattern) => void;
  private onCycleComplete?: () => void;
  private onComplete?: () => void;

  constructor(config: SequenceEngineConfig) {
    this.patterns = config.patterns;
    this.tempo = config.tempo;
    this.iterations = config.iterations;
    this.onFrameChange = config.onFrameChange;
    this.onCycleComplete = config.onCycleComplete;
    this.onComplete = config.onComplete;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    const now = performance.now();

    if (this.pausedTime > 0) {
      // Resume from pause
      this.startTime += now - this.pausedTime;
      this.pausedTime = 0;
    } else {
      // Fresh start
      this.startTime = now;
      this.lastFrameTime = now;
    }

    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.pausedTime = performance.now();

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  reset() {
    this.stop();
    this.currentFrame = 0;
    this.currentIteration = 0;
    this.accumulatedTime = 0;
    this.pausedTime = 0;
    this.cachedFrameIndex = -1;
    this.cachedPattern = null;
    this.emitFrameChange();
  }

  setPatterns(patterns: Pattern[]) {
    this.patterns = patterns;
    if (this.currentFrame >= patterns.length) {
      this.currentFrame = 0;
    }
    // Invalidate cache
    this.cachedFrameIndex = -1;
    this.cachedPattern = null;
    this.emitFrameChange();
  }

  setTempo(tempo: number) {
    this.tempo = Math.max(16, tempo);
  }

  getProgress(): number {
    if (this.iterations === "infinite" || this.patterns.length === 0) return 0;

    const totalFrames = this.patterns.length * this.iterations;
    const currentTotalFrame =
      this.currentIteration * this.patterns.length + this.currentFrame;
    return currentTotalFrame / totalFrames;
  }

  setIterations(iterations: number | "infinite") {
    this.iterations = iterations;
  }

  getCurrentPattern(): Pattern | null {
    if (this.patterns.length === 0) return null;

    // Use cached pattern if available
    if (this.cachedFrameIndex === this.currentFrame && this.cachedPattern) {
      return this.cachedPattern;
    }

    this.cachedPattern = this.patterns[this.currentFrame];
    this.cachedFrameIndex = this.currentFrame;
    return this.cachedPattern;
  }

  private animate = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    // Accumulate time to handle frame skipping
    this.accumulatedTime += deltaTime;

    // Process multiple frames if we're behind
    if (this.accumulatedTime >= this.tempo) {
      const framesToAdvance = Math.floor(this.accumulatedTime / this.tempo);
      this.accumulatedTime %= this.tempo;

      // Skip frames if performance is poor
      if (framesToAdvance > 1) {
        // Skip to the target frame
        for (let i = 0; i < framesToAdvance; i++) {
          this.advanceFrame(i === framesToAdvance - 1);
          if (!this.isRunning) return; // Stop if completed
        }
      } else {
        this.advanceFrame(true);
      }
    }

    this.lastFrameTime = currentTime;
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private advanceFrame(emitChange: boolean) {
    this.currentFrame++;

    if (this.currentFrame >= this.patterns.length) {
      this.currentFrame = 0;
      this.currentIteration++;

      // Only emit cycle complete on actual frame updates, not skips
      if (emitChange) {
        this.onCycleComplete?.();
      }

      if (
        this.iterations !== "infinite" &&
        this.currentIteration >= this.iterations
      ) {
        this.stop();
        if (emitChange) {
          this.onComplete?.();
        }
        return;
      }
    }

    // Invalidate cache when frame changes
    if (this.cachedFrameIndex !== this.currentFrame) {
      this.cachedFrameIndex = -1;
      this.cachedPattern = null;
    }

    if (emitChange) {
      this.emitFrameChange();
    }
  }

  private emitFrameChange() {
    const pattern = this.getCurrentPattern();
    if (pattern) {
      this.onFrameChange?.(this.currentFrame, pattern);
    }
  }

  destroy() {
    this.stop();
    this.patterns = [];
    this.cachedPattern = null;
    this.cachedFrameIndex = -1;
    this.onFrameChange = undefined;
    this.onCycleComplete = undefined;
    this.onComplete = undefined;
  }
}
