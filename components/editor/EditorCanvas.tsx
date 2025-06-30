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

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  const pixelSize = Math.min(48, Math.floor(320 / fixedGridSize));

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Grid Canvas */}
      <div className="relative">
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