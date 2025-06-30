'use client';

import { useState } from 'react';
import type { Pattern } from '@/lib/types';

interface EditorFrame {
  pattern: Pattern;
  duration: number;
}

interface ExportModalProps {
  frames: EditorFrame[];
  gridSize: number;
  onClose: () => void;
}

export function ExportModal({ frames, gridSize, onClose }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'typescript' | 'react' | 'json'>('typescript');
  const [copied, setCopied] = useState(false);

  const generateTypeScriptExport = () => {
    const patterns = frames.map(f => f.pattern);
    const patternName = 'customPattern';
    
    const formatPattern = (pattern: Pattern) => {
      return '[\n' + pattern.map(row => 
        '    [' + row.map(cell => cell ? '1' : '0').join(',') + ']'
      ).join(',\n') + '\n  ]';
    };

    if (patterns.length === 1) {
      return `export const ${patternName}: Pattern = ${formatPattern(patterns[0])};`;
    } else {
      return `export const ${patternName}: Pattern[] = [\n${
        patterns.map(p => '  ' + formatPattern(p)).join(',\n')
      }\n];`;
    }
  };

  const generateReactExport = () => {
    const patterns = frames.map(f => f.pattern);
    const speed = frames[0]?.duration || 500;
    
    const formatPattern = (pattern: Pattern) => {
      return '[' + pattern.map(row => 
        '[' + row.map(cell => cell ? '1' : '0').join(',') + ']'
      ).join(',') + ']';
    };

    if (patterns.length === 1) {
      return `<MorsePixelGrid
  pattern={${formatPattern(patterns[0])}}
  animationType="fade"
  tempo={${speed}}
  pixelSize="md"
/>`;
    } else {
      return `<MorsePixelGrid
  patterns={[${patterns.map(p => '\n    ' + formatPattern(p)).join(',')}\n  ]}
  animationType="fade"
  tempo={${speed}}
  loop={true}
  pixelSize="md"
/>`;
    }
  };

  const generateJSONExport = () => {
    return JSON.stringify({
      name: 'Custom Animation',
      frames: frames.map(f => ({
        pattern: f.pattern.map(row => row.map(cell => cell ? 1 : 0)),
        duration: f.duration
      })),
      gridSize,
      created: new Date().toISOString()
    }, null, 2);
  };

  const getExportContent = () => {
    switch (exportFormat) {
      case 'typescript':
        return generateTypeScriptExport();
      case 'react':
        return generateReactExport();
      case 'json':
        return generateJSONExport();
    }
  };

  const handleCopy = async () => {
    const content = getExportContent();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card rounded-3xl border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b bg-gradient-to-b from-background to-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Export Pattern</h2>
              <p className="text-sm text-muted-foreground mt-1">Choose your preferred export format</p>
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

        <div className="p-6 space-y-6">
          {/* Format Selector */}
          <div className="inline-flex rounded-xl border bg-muted/30 p-1 w-full">
            <button
              onClick={() => setExportFormat('typescript')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                exportFormat === 'typescript'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 8h3M6.5 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10 10v-2.5a.5.5 0 01.5-.5h0a.5.5 0 01.5.5V8a1 1 0 002 0V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              TypeScript
            </button>
            <button
              onClick={() => setExportFormat('react')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                exportFormat === 'react'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                <ellipse cx="8" cy="8" rx="7" ry="3" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 8 8)"/>
                <ellipse cx="8" cy="8" rx="7" ry="3" stroke="currentColor" strokeWidth="1.5" transform="rotate(-45 8 8)"/>
              </svg>
              React
            </button>
            <button
              onClick={() => setExportFormat('json')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                exportFormat === 'json'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2h8l2 2v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1h1z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 7h6M5 9h4M5 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              JSON
            </button>
          </div>

          {/* Code Preview */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-muted/50 backdrop-blur rounded-2xl border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <button
                  onClick={handleCopy}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                      : 'bg-background/50 border hover:bg-background hover:border-primary/50'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="4" y="1" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M2 4.5A1.5 1.5 0 013.5 3h4A1.5 1.5 0 019 4.5v1" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-6 overflow-x-auto max-h-96 text-sm font-mono">
                <code className="text-foreground/90">{getExportContent()}</code>
              </pre>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="p-4 bg-gradient-to-b from-muted/50 to-muted/30 rounded-xl border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Usage Instructions
            </h3>
            <div className="space-y-2 text-sm">
              {exportFormat === 'typescript' && (
                <>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">1</span>
                    <p className="text-muted-foreground">Copy the code above</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">2</span>
                    <p className="text-muted-foreground">Add it to your patterns file (e.g., <code className="px-1 py-0.5 bg-muted rounded text-xs">patterns.ts</code>)</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">3</span>
                    <p className="text-muted-foreground">Import and use with MorsePixelGrid component</p>
                  </div>
                </>
              )}
              {exportFormat === 'react' && (
                <>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">1</span>
                    <p className="text-muted-foreground">Copy the component code above</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">2</span>
                    <p className="text-muted-foreground">Paste it directly into your React component</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">3</span>
                    <p className="text-muted-foreground">Make sure to import MorsePixelGrid</p>
                  </div>
                </>
              )}
              {exportFormat === 'json' && (
                <>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">1</span>
                    <p className="text-muted-foreground">Copy the JSON above</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">2</span>
                    <p className="text-muted-foreground">Save it or share it with others</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">3</span>
                    <p className="text-muted-foreground">Import it back into the editor later</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}