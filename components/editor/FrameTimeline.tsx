'use client';

import type { Pattern } from '@/lib/types';

interface EditorFrame {
  pattern: Pattern;
  duration: number;
}

interface FrameTimelineProps {
  frames: EditorFrame[];
  currentFrame: number;
  onFrameSelect: (index: number) => void;
  onAddFrame: () => void;
  onRemoveFrame: (index: number) => void;
  onDuplicateFrame: (index: number) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function FrameTimeline({
  frames,
  currentFrame,
  onFrameSelect,
  onAddFrame,
  onRemoveFrame,
  onDuplicateFrame,
  onNavigate,
}: FrameTimelineProps) {
  const maxFrames = 10;

  return (
    <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
      <div className="border-b bg-muted/30 px-4 py-2.5 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Timeline</h3>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md bg-background/50 border">
          <span className="text-primary">{currentFrame + 1}</span>
          <span className="text-muted-foreground">of</span>
          <span>{frames.length}</span>
        </span>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onNavigate('prev')}
            disabled={currentFrame === 0}
            className="p-2 rounded-lg bg-background border border-border/50 hover:bg-accent hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group shadow-sm"
            aria-label="Previous frame"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground group-hover:text-foreground transition-colors">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Frames */}
          <div className="flex-1 flex gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {frames.map((frame, index) => (
              <div key={index} className="relative group flex-shrink-0">
                <button
                  onClick={() => onFrameSelect(index)}
                  className={`relative w-16 h-16 rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                    index === currentFrame
                      ? 'border-primary shadow-md scale-105'
                      : 'border-border hover:border-primary/50 bg-background/50'
                  }`}
                  aria-label={`Frame ${index + 1}`}
                >
                  {/* Mini Grid Preview */}
                  <div className="absolute inset-1.5 grid grid-cols-3 grid-rows-3 gap-0.5">
                    {frame.pattern.slice(0, 3).map((row, rowIdx) =>
                      row.slice(0, 3).map((isActive, colIdx) => (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          className={`rounded-sm transition-colors ${
                            isActive 
                              ? index === currentFrame ? 'bg-primary' : 'bg-primary/60'
                              : 'bg-muted-foreground/20'
                          }`}
                        />
                      ))
                    )}
                  </div>
                  {/* Frame Number */}
                  <span className={`absolute bottom-0 left-0 right-0 text-xs font-medium text-center py-0.5 transition-colors ${
                    index === currentFrame
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/80 text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                </button>
                {/* Frame Actions */}
                <div className="absolute -top-2 -right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  {/* Duplicate Button */}
                  <button
                    onClick={() => onDuplicateFrame(index)}
                    className="w-7 h-7 bg-background border border-border/50 rounded-lg flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200 shadow-md group/btn"
                    aria-label={`Duplicate frame ${index + 1}`}
                    title="Duplicate frame"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground group-hover/btn:text-foreground transition-colors">
                      <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="1.5" rx="1"/>
                      <rect x="6" y="6" width="6" height="6" stroke="currentColor" strokeWidth="1.5" rx="1" fill="white"/>
                    </svg>
                  </button>
                  {/* Delete Button */}
                  {frames.length > 1 && (
                    <button
                      onClick={() => onRemoveFrame(index)}
                      className="w-7 h-7 bg-background border border-border/50 rounded-lg flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all duration-200 shadow-md group/btn"
                      aria-label={`Remove frame ${index + 1}`}
                      title="Delete frame"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground group-hover/btn:text-destructive transition-colors">
                        <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add Frame Button */}
            {frames.length < maxFrames && (
              <button
                onClick={onAddFrame}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-200 flex items-center justify-center text-muted-foreground hover:text-primary bg-background/30 hover:bg-primary/5 group flex-shrink-0"
                aria-label="Add frame"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onNavigate('next')}
            disabled={currentFrame === frames.length - 1}
            className="p-2 rounded-lg bg-background border border-border/50 hover:bg-accent hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group shadow-sm"
            aria-label="Next frame"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground group-hover:text-foreground transition-colors">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {frames.length >= maxFrames && (
          <div className="mt-2 mx-3 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
              Max {maxFrames} frames
            </p>
          </div>
        )}
      </div>
    </div>
  );
}