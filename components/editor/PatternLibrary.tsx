'use client';

import { MorsePixelGrid } from '@/components/MorsePixelGrid/MorsePixelGrid';
import { patternPresets } from '@/lib/patterns/presets';
import { 
  createCirclePattern, 
  createCrossPattern, 
  createHeartPattern,
  createCheckerboardPattern,
  createSpiralPattern,
  createDiagonalPattern,
  createRingPattern,
  createWavePattern
} from '@/lib/patterns/generators';
import type { Pattern } from '@/lib/types';

interface PatternLibraryProps {
  onSelectPattern: (patterns: Pattern[]) => void;
  onClose: () => void;
}

interface StaticPattern {
  name: string;
  description: string;
  pattern: Pattern;
}

export function PatternLibrary({ onSelectPattern, onClose }: PatternLibraryProps) {
  const staticPatterns: StaticPattern[] = [
    {
      name: 'Circle',
      description: 'Perfect circle shape',
      pattern: createCirclePattern(6)
    },
    {
      name: 'Cross',
      description: 'Plus sign pattern',
      pattern: createCrossPattern(6)
    },
    {
      name: 'Heart',
      description: 'Heart shape',
      pattern: createHeartPattern(6)
    },
    {
      name: 'Checkerboard',
      description: 'Alternating squares',
      pattern: createCheckerboardPattern(6)
    },
    {
      name: 'Spiral',
      description: 'Spiral pattern',
      pattern: createSpiralPattern(6)
    },
    {
      name: 'Diagonal',
      description: 'Diagonal line',
      pattern: createDiagonalPattern(6)
    },
    {
      name: 'Ring',
      description: 'Ring shape',
      pattern: createRingPattern(6)
    },
    {
      name: 'Wave',
      description: 'Wave pattern',
      pattern: createWavePattern(6)
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card rounded-3xl border shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b bg-gradient-to-b from-background to-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Pattern Library</h2>
              <p className="text-sm text-muted-foreground mt-1">Choose from presets or start with a basic shape</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-all duration-200 group"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted-foreground group-hover:text-foreground transition-colors">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-8">
          {/* Animated Presets */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                    <path d="M4 3l5 5-5 5M9 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                Animated Presets
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Pre-built animations ready to use</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patternPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onSelectPattern(preset.frames)}
                  className="group relative bg-card/50 backdrop-blur rounded-2xl p-5 hover:bg-card hover:border-primary/50 border transition-all duration-200 text-left overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex justify-center mb-4 p-4 bg-background/50 rounded-xl">
                      <MorsePixelGrid
                        patterns={preset.frames}
                        animationType="fade"
                        tempo={preset.tempo}
                        loop={true}
                        pixelSize="sm"
                      />
                    </div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{preset.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{preset.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <rect x="2" y="2" width="3" height="3" fill="currentColor"/>
                          <rect x="7" y="2" width="3" height="3" fill="currentColor" opacity="0.5"/>
                          <rect x="2" y="7" width="3" height="3" fill="currentColor" opacity="0.5"/>
                          <rect x="7" y="7" width="3" height="3" fill="currentColor"/>
                        </svg>
                        {preset.frames.length} frames
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1"/>
                          <path d="M6 3v3l2 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                        {preset.tempo}ms
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Static Patterns */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground">
                    <rect x="3" y="3" width="4" height="4" fill="currentColor"/>
                    <rect x="9" y="3" width="4" height="4" fill="currentColor"/>
                    <rect x="3" y="9" width="4" height="4" fill="currentColor"/>
                    <rect x="9" y="9" width="4" height="4" fill="currentColor"/>
                  </svg>
                </div>
                Static Patterns
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Basic shapes to start your design</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {staticPatterns.map((pattern) => (
                <button
                  key={pattern.name}
                  onClick={() => onSelectPattern([pattern.pattern])}
                  className="group bg-background/50 rounded-xl p-4 hover:bg-background hover:border-primary/50 border transition-all duration-200 text-center"
                >
                  <div className="flex justify-center mb-3 p-3 bg-muted/30 rounded-lg group-hover:bg-muted/50 transition-colors">
                    <MorsePixelGrid
                      pattern={pattern.pattern}
                      animationType="fade"
                      pixelSize="xs"
                    />
                  </div>
                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors">{pattern.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{pattern.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-gradient-to-b from-muted/50 to-muted/30 rounded-xl border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 11V8M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Pro Tips
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex gap-3">
                <span className="text-primary mt-0.5">•</span>
                <p className="text-muted-foreground">Select any pattern to load it into the editor</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary mt-0.5">•</span>
                <p className="text-muted-foreground">Animated presets will load all frames</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary mt-0.5">•</span>
                <p className="text-muted-foreground">You can modify patterns after loading</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary mt-0.5">•</span>
                <p className="text-muted-foreground">Combine multiple patterns for complex animations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}