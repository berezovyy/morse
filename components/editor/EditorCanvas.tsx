'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Pattern } from '@/lib/types';

interface EditorCanvasProps {
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
  gridSize: number;
  previousPattern?: Pattern;
  showPreviousFrame?: boolean;
}

export function EditorCanvas({ pattern, onPatternChange, previousPattern, showPreviousFrame = true }: EditorCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(true);
  const [wrapAround, setWrapAround] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fixedGridSize = 6; // Always use 6x6 grid

  const togglePixel = useCallback((row: number, col: number, forceValue?: boolean) => {
    const newPattern = pattern.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx === row && cIdx === col) {
          return forceValue !== undefined ? forceValue : !c;
        }
        return c;
      })
    );
    onPatternChange(newPattern);
  }, [pattern, onPatternChange]);

  const handleMouseDown = useCallback((row: number, col: number) => {
    const newValue = !pattern[row][col];
    setDragValue(newValue);
    setIsDragging(true);
    togglePixel(row, col, newValue);
  }, [pattern, togglePixel]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (isDragging) {
      togglePixel(row, col, dragValue);
    }
  }, [isDragging, dragValue, togglePixel]);


  const handleTouchStart = useCallback((e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    handleMouseDown(row, col);
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !canvasRef.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.classList.contains('editor-pixel')) {
      const row = parseInt(element.getAttribute('data-row') || '0');
      const col = parseInt(element.getAttribute('data-col') || '0');
      togglePixel(row, col, dragValue);
    }
  }, [isDragging, dragValue, togglePixel]);

  const shiftPattern = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const newPattern = pattern.map(row => [...row]);
    const size = fixedGridSize;

    switch (direction) {
      case 'up':
        if (wrapAround) {
          const firstRow = newPattern[0];
          for (let i = 0; i < size - 1; i++) {
            newPattern[i] = newPattern[i + 1];
          }
          newPattern[size - 1] = firstRow;
        } else {
          for (let i = 0; i < size - 1; i++) {
            newPattern[i] = newPattern[i + 1];
          }
          newPattern[size - 1] = Array(size).fill(false);
        }
        break;
      case 'down':
        if (wrapAround) {
          const lastRow = newPattern[size - 1];
          for (let i = size - 1; i > 0; i--) {
            newPattern[i] = newPattern[i - 1];
          }
          newPattern[0] = lastRow;
        } else {
          for (let i = size - 1; i > 0; i--) {
            newPattern[i] = newPattern[i - 1];
          }
          newPattern[0] = Array(size).fill(false);
        }
        break;
      case 'left':
        for (let i = 0; i < size; i++) {
          if (wrapAround) {
            const first = newPattern[i][0];
            for (let j = 0; j < size - 1; j++) {
              newPattern[i][j] = newPattern[i][j + 1];
            }
            newPattern[i][size - 1] = first;
          } else {
            for (let j = 0; j < size - 1; j++) {
              newPattern[i][j] = newPattern[i][j + 1];
            }
            newPattern[i][size - 1] = false;
          }
        }
        break;
      case 'right':
        for (let i = 0; i < size; i++) {
          if (wrapAround) {
            const last = newPattern[i][size - 1];
            for (let j = size - 1; j > 0; j--) {
              newPattern[i][j] = newPattern[i][j - 1];
            }
            newPattern[i][0] = last;
          } else {
            for (let j = size - 1; j > 0; j--) {
              newPattern[i][j] = newPattern[i][j - 1];
            }
            newPattern[i][0] = false;
          }
        }
        break;
    }

    onPatternChange(newPattern);
  }, [pattern, onPatternChange, wrapAround]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if alt/option key is pressed
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            shiftPattern('up');
            break;
          case 'ArrowDown':
            e.preventDefault();
            shiftPattern('down');
            break;
          case 'ArrowLeft':
            e.preventDefault();
            shiftPattern('left');
            break;
          case 'ArrowRight':
            e.preventDefault();
            shiftPattern('right');
            break;
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [shiftPattern]);

  const pixelSize = Math.min(48, Math.floor(320 / fixedGridSize));

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Grid Canvas with controls */}
      <div className="relative">
        {/* Shift Controls */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <button
            onClick={() => shiftPattern('up')}
            className="p-2 rounded-lg bg-background border border-border/50 hover:bg-accent hover:border-accent transition-all duration-200 shadow-sm group"
            title="Shift up"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground group-hover:text-foreground transition-colors">
              <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <button
            onClick={() => shiftPattern('down')}
            className="p-2 rounded-lg bg-background border border-border/50 hover:bg-accent hover:border-accent transition-all duration-200 shadow-sm group"
            title="Shift down"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground group-hover:text-foreground transition-colors">
              <path d="M8 4v8m4-4l-4 4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="absolute top-1/2 -left-12 -translate-y-1/2">
          <button
            onClick={() => shiftPattern('left')}
            className="p-2 rounded-lg bg-background border border-border/50 hover:bg-accent hover:border-accent transition-all duration-200 shadow-sm group"
            title="Shift left"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground group-hover:text-foreground transition-colors">
              <path d="M12 8H4m4 4L4 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="absolute top-1/2 -right-12 -translate-y-1/2">
          <button
            onClick={() => shiftPattern('right')}
            className="p-2 rounded-lg bg-background border border-border/50 hover:bg-accent hover:border-accent transition-all duration-200 shadow-sm group"
            title="Shift right"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground group-hover:text-foreground transition-colors">
              <path d="M4 8h8m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {/* Canvas background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-2xl" />
        <div 
          ref={canvasRef}
          className="relative inline-grid gap-1.5 p-6 rounded-2xl select-none bg-background/50 backdrop-blur-sm border border-border/50 shadow-lg"
          style={{
            gridTemplateColumns: `repeat(${fixedGridSize}, ${pixelSize}px)`,
            gridTemplateRows: `repeat(${fixedGridSize}, ${pixelSize}px)`,
          }}
        >
          {pattern.map((row, rowIdx) =>
            row.map((isActive, colIdx) => {
              const isPreviousActive = showPreviousFrame && previousPattern?.[rowIdx]?.[colIdx];
              return (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  data-row={rowIdx}
                  data-col={colIdx}
                  className={`editor-pixel rounded-lg transition-all duration-200 transform-gpu relative overflow-hidden ${
                    isActive 
                      ? 'bg-primary shadow-lg scale-[0.95] ring-2 ring-primary/30' 
                      : isPreviousActive
                        ? 'bg-muted/80 hover:bg-muted hover:scale-105 border border-primary/20 hover:border-primary/30 shadow-sm'
                        : 'bg-muted/50 hover:bg-muted hover:scale-105 border border-border/50 hover:border-border shadow-sm'
                  }`}
                  style={{
                    width: pixelSize,
                    height: pixelSize,
                  }}
                  onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                  onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                  onTouchStart={(e) => handleTouchStart(e, rowIdx, colIdx)}
                  onTouchMove={handleTouchMove}
                  aria-label={`Pixel ${rowIdx + 1},${colIdx + 1} ${isActive ? 'on' : 'off'}${isPreviousActive ? ' (was on)' : ''}`}
                >
                  {/* Ghost indicator for previous frame */}
                  {isPreviousActive && !isActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-2 h-2 rounded-full bg-primary/30" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
        
        {/* Wrap toggle in top-right */}
        <div className="absolute -top-12 -right-12">
          <button
            onClick={() => setWrapAround(!wrapAround)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              wrapAround
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-background/50 text-muted-foreground border border-border/50 hover:bg-accent hover:border-accent'
            }`}
            title={wrapAround ? 'Wrap enabled' : 'Wrap disabled'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M9 4l3 3-3 3M5 10L2 7l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={wrapAround ? 1 : 0.5}/>
              <circle cx="12" cy="7" r="1" fill="currentColor" opacity={wrapAround ? 1 : 0}/>
              <circle cx="2" cy="7" r="1" fill="currentColor" opacity={wrapAround ? 1 : 0}/>
            </svg>
            <span>Wrap</span>
          </button>
        </div>
      </div>
      
      {/* Instructions Card */}
      <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 rounded-full border border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-primary shadow-sm ring-1 ring-primary/30" />
          <span className="text-xs font-medium">Active</span>
        </div>
        <div className="w-px h-4 bg-border/50" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-muted/50 border border-border/50 shadow-sm" />
          <span className="text-xs font-medium">Inactive</span>
        </div>
        {showPreviousFrame && previousPattern && (
          <>
            <div className="w-px h-4 bg-border/50" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-muted/80 border border-primary/20 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-primary/30" />
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground">Previous</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}