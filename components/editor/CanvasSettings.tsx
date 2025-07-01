'use client';

import { useState } from 'react';

interface CanvasSettingsProps {
  gridSize: number;
  pixelSpacing: number;
  pixelSize: number;
  onGridSizeChange: (size: number) => void;
  onPixelSpacingChange: (spacing: number) => void;
  onPixelSizeChange: (size: number) => void;
}

export function CanvasSettings({
  gridSize,
  pixelSpacing,
  pixelSize,
  onGridSizeChange,
  onPixelSpacingChange,
  onPixelSizeChange,
}: CanvasSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border-b bg-muted/30 px-4 py-2.5 flex items-center justify-between hover:bg-muted/40 transition-colors"
      >
        <h3 className="font-semibold text-sm">Canvas Settings</h3>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Grid Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Grid Size</label>
              <span className="text-xs text-muted-foreground">
                {gridSize}x{gridSize}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                <button
                  key={size}
                  onClick={() => onGridSizeChange(size)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    gridSize === size
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border/50 hover:bg-accent hover:border-accent'
                  }`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>

          {/* Pixel Spacing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="spacing" className="text-sm font-medium">
                Pixel Spacing
              </label>
              <span className="text-xs text-muted-foreground">{pixelSpacing}px</span>
            </div>
            <input
              id="spacing"
              type="range"
              min="0"
              max="10"
              step="1"
              value={pixelSpacing}
              onChange={(e) => onPixelSpacingChange(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">None</span>
              <span className="text-[10px] text-muted-foreground">Wide</span>
            </div>
          </div>

          {/* Pixel Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pixelSize" className="text-sm font-medium">
                Pixel Size
              </label>
              <span className="text-xs text-muted-foreground">{pixelSize}px</span>
            </div>
            <input
              id="pixelSize"
              type="range"
              min="20"
              max="60"
              step="5"
              value={pixelSize}
              onChange={(e) => onPixelSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">Small</span>
              <span className="text-[10px] text-muted-foreground">Large</span>
            </div>
          </div>

          {/* Presets */}
          <div className="border-t pt-3">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Presets</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onGridSizeChange(5);
                  onPixelSpacingChange(2);
                  onPixelSizeChange(48);
                }}
                className="px-3 py-2 text-xs font-medium bg-background border border-border/50 rounded-lg hover:bg-accent hover:border-accent transition-all duration-200"
              >
                Default (5x5)
              </button>
              <button
                onClick={() => {
                  onGridSizeChange(8);
                  onPixelSpacingChange(1);
                  onPixelSizeChange(32);
                }}
                className="px-3 py-2 text-xs font-medium bg-background border border-border/50 rounded-lg hover:bg-accent hover:border-accent transition-all duration-200"
              >
                Detailed (8x8)
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: hsl(var(--primary));
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 8px hsl(var(--primary) / 0.1);
        }
        input[type='range']::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: hsl(var(--primary));
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        input[type='range']::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 8px hsl(var(--primary) / 0.1);
        }
      `}</style>
    </div>
  );
}