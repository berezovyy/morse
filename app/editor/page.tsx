'use client';

import { useState, useCallback, useEffect } from 'react';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { FrameTimeline } from '@/components/editor/FrameTimeline';
import { ToolPanel } from '@/components/editor/ToolPanel';
import { ExportModal } from '@/components/editor/ExportModal';
import { PatternLibrary } from '@/components/editor/PatternLibrary';
import { MorsePixelGrid } from '@/components/MorsePixelGrid/MorsePixelGrid';
import type { Pattern } from '@/lib/types';
import Link from 'next/link';

interface EditorFrame {
  pattern: Pattern;
  duration: number;
}

interface EditorState {
  frames: EditorFrame[];
  currentFrame: number;
  isPlaying: boolean;
  animationSpeed: number;
}

const createEmptyPattern = (size: number): Pattern => {
  return Array(size).fill(null).map(() => Array(size).fill(false));
};

export default function EditorPage() {
  const gridSize = 6; // Fixed 6x6 grid
  const [state, setState] = useState<EditorState>({
    frames: [{
      pattern: createEmptyPattern(gridSize),
      duration: 500
    }],
    currentFrame: 0,
    isPlaying: false,
    animationSpeed: 500
  });
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPatternLibrary, setShowPatternLibrary] = useState(false);
  const [showPreviousFrame, setShowPreviousFrame] = useState(true);

  const currentPattern = state.frames[state.currentFrame]?.pattern || createEmptyPattern(gridSize);
  const previousPattern = state.currentFrame > 0 ? state.frames[state.currentFrame - 1]?.pattern : undefined;

  const updatePattern = useCallback((pattern: Pattern) => {
    setState(prev => ({
      ...prev,
      frames: prev.frames.map((frame, idx) => 
        idx === prev.currentFrame 
          ? { ...frame, pattern }
          : frame
      )
    }));
  }, []);

  const addFrame = useCallback(() => {
    setState(prev => ({
      ...prev,
      frames: [...prev.frames, { 
        pattern: createEmptyPattern(gridSize), 
        duration: prev.animationSpeed 
      }],
      currentFrame: prev.frames.length
    }));
  }, [gridSize]);

  const removeFrame = useCallback((index: number) => {
    setState(prev => {
      if (prev.frames.length <= 1) return prev;
      const newFrames = prev.frames.filter((_, i) => i !== index);
      return {
        ...prev,
        frames: newFrames,
        currentFrame: Math.min(prev.currentFrame, newFrames.length - 1)
      };
    });
  }, []);

  const duplicateFrame = useCallback((index: number) => {
    setState(prev => {
      if (prev.frames.length >= 10) return prev; // Max 10 frames
      const frameToDuplicate = prev.frames[index];
      const newFrames = [
        ...prev.frames.slice(0, index + 1),
        { ...frameToDuplicate, pattern: frameToDuplicate.pattern.map(row => [...row]) },
        ...prev.frames.slice(index + 1)
      ];
      return {
        ...prev,
        frames: newFrames,
        currentFrame: index + 1
      };
    });
  }, []);

  const navigateFrame = useCallback((direction: 'prev' | 'next') => {
    setState(prev => ({
      ...prev,
      currentFrame: direction === 'prev' 
        ? Math.max(0, prev.currentFrame - 1)
        : Math.min(prev.frames.length - 1, prev.currentFrame + 1)
    }));
  }, []);

  const setCurrentFrame = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentFrame: index
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  }, []);

  const setAnimationSpeed = useCallback((speed: number) => {
    setState(prev => ({
      ...prev,
      animationSpeed: speed,
      frames: prev.frames.map(frame => ({
        ...frame,
        duration: speed
      }))
    }));
  }, []);

  const clearPattern = useCallback(() => {
    updatePattern(createEmptyPattern(gridSize));
  }, [gridSize, updatePattern]);

  const fillPattern = useCallback(() => {
    updatePattern(Array(gridSize).fill(null).map(() => Array(gridSize).fill(true)));
  }, [gridSize, updatePattern]);

  const invertPattern = useCallback(() => {
    updatePattern(currentPattern.map(row => row.map(cell => !cell)));
  }, [currentPattern, updatePattern]);

  const loadPattern = useCallback((patterns: Pattern[]) => {
    setState(prev => ({
      ...prev,
      frames: patterns.map(pattern => ({
        pattern,
        duration: prev.animationSpeed
      })),
      currentFrame: 0
    }));
    setShowPatternLibrary(false);
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('morse-editor-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('morse-editor-state', JSON.stringify(state));
    }, 2000);
    return () => clearTimeout(saveTimeout);
  }, [state]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        navigateFrame('prev');
      } else if (e.key === 'ArrowRight') {
        navigateFrame('next');
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, navigateFrame]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">←</span>
            <span>Back to Morse</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPatternLibrary(true)}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Browse Patterns
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </nav>

      {/* Compact Hero Section */}
      <section className="relative py-6 px-4 border-b bg-gradient-to-b from-background via-background to-background/95">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight">Morse Pattern Editor</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Design pixel animations with ease</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span>Click</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Space</kbd>
                <span>Play</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">←→</kbd>
                <span>Navigate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Editor */}
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-[1fr,280px]">
          {/* Left Column - Main Editor */}
          <div className="space-y-4">
            {/* Canvas Card */}
            <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
              <div className="border-b bg-muted/30 px-4 py-2.5 flex items-center justify-between">
                <h2 className="font-semibold text-sm">Canvas</h2>
                {state.frames.length > 1 && (
                  <button
                    onClick={() => setShowPreviousFrame(!showPreviousFrame)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                      showPreviousFrame
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-background/50 text-muted-foreground border border-border/50 hover:bg-accent hover:border-accent'
                    }`}
                    title={showPreviousFrame ? 'Hide previous frame' : 'Show previous frame'}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-opacity">
                      <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1" opacity="0.4" rx="0.5"/>
                      <rect x="5" y="5" width="5" height="5" stroke="currentColor" strokeWidth="1" rx="0.5"/>
                    </svg>
                    <span>{showPreviousFrame ? 'Ghost On' : 'Ghost Off'}</span>
                  </button>
                )}
              </div>
              <div className="p-8">
                <EditorCanvas
                  pattern={currentPattern}
                  onPatternChange={updatePattern}
                  gridSize={gridSize}
                  previousPattern={previousPattern}
                  showPreviousFrame={showPreviousFrame && state.frames.length > 1}
                />
              </div>
            </div>

            {/* Timeline Card */}
            <FrameTimeline
              frames={state.frames}
              currentFrame={state.currentFrame}
              onFrameSelect={setCurrentFrame}
              onAddFrame={addFrame}
              onRemoveFrame={removeFrame}
              onDuplicateFrame={duplicateFrame}
              onNavigate={navigateFrame}
            />

            {/* Playback Controls */}
            <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
              <div className="border-b bg-muted/30 px-4 py-2.5">
                <h3 className="font-semibold text-sm">Playback</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-all duration-200 ${
                      state.isPlaying
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                        : 'bg-background border border-border/50 hover:bg-accent hover:border-accent'
                    }`}
                  >
                    {state.isPlaying ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="4" y="3" width="2" height="8" fill="currentColor" rx="0.5" />
                          <rect x="8" y="3" width="2" height="8" fill="currentColor" rx="0.5" />
                        </svg>
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M4.5 3v8l6-4-6-4z" fill="currentColor" />
                        </svg>
                        <span>Play</span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground">
                      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M6 3v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs font-medium">{state.animationSpeed}ms</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="speed" className="text-sm font-medium flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground">
                        <path d="M7 2L10 7L7 12M2 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Animation Speed
                    </label>
                    <span className="text-xs text-muted-foreground">100ms - 2s</span>
                  </div>
                  <div className="relative">
                    <input
                      id="speed"
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={state.animationSpeed}
                      onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">Fast</span>
                      <span className="text-[10px] text-muted-foreground">Slow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tools & Preview */}
          <div className="space-y-4">
            {/* Live Preview */}
            <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden sticky top-20">
              <div className="border-b bg-muted/30 px-4 py-2.5 flex items-center justify-between">
                <h2 className="font-semibold text-sm">Live Preview</h2>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-background/50 rounded-md border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground font-medium">Live</span>
                </div>
              </div>
              <div className="p-6 flex justify-center items-center min-h-[160px] bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <div className="relative bg-background/50 p-4 rounded-2xl border border-border/50 shadow-lg">
                    <MorsePixelGrid
                      patterns={state.frames.map(f => f.pattern)}
                      animationPreset="fade"
                      tempo={state.animationSpeed}
                      active={state.isPlaying}
                      pixelSize="sm"
                      iterations="infinite"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tools */}
            <ToolPanel
              onClear={clearPattern}
              onFill={fillPattern}
              onInvert={invertPattern}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: hsl(var(--primary));
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 8px hsl(var(--primary) / 0.1);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: hsl(var(--primary));
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 8px hsl(var(--primary) / 0.1);
        }
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: hsl(var(--muted));
        }
        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: hsl(var(--muted));
        }
      `}</style>

      {showExportModal && (
        <ExportModal
          frames={state.frames}
          gridSize={gridSize}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showPatternLibrary && (
        <PatternLibrary
          onSelectPattern={loadPattern}
          onClose={() => setShowPatternLibrary(false)}
        />
      )}
    </div>
  );
}