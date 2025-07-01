'use client'

import { X, Settings } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  gridSize: number
  pixelSpacing: number
  pixelSize: number
  onGridSizeChange: (size: number) => void
  onPixelSpacingChange: (spacing: number) => void
  onPixelSizeChange: (size: number) => void
}

export function SettingsModal({
  isOpen,
  onClose,
  gridSize,
  pixelSpacing,
  pixelSize,
  onGridSizeChange,
  onPixelSpacingChange,
  onPixelSizeChange,
}: SettingsModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl border shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="border-b bg-muted/30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Canvas Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Grid Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Grid Size</label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Number of pixels in width and height
                  </p>
                </div>
                <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                  {gridSize}×{gridSize}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                  <button
                    key={size}
                    onClick={() => onGridSizeChange(size)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                      gridSize === size
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-background border-border/50 hover:bg-accent hover:border-accent'
                    }`}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </div>

            {/* Pixel Spacing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="spacing" className="text-sm font-medium">
                    Pixel Spacing
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Gap between pixels in the grid
                  </p>
                </div>
                <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                  {pixelSpacing}px
                </span>
              </div>
              <div className="space-y-2">
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
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    None
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Wide
                  </span>
                </div>
              </div>
            </div>

            {/* Pixel Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="pixelSize" className="text-sm font-medium">
                    Pixel Size
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Size of individual pixels
                  </p>
                </div>
                <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                  {pixelSize}px
                </span>
              </div>
              <div className="space-y-2">
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
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    Small
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Large
                  </span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Quick Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onGridSizeChange(5)
                    onPixelSpacingChange(2)
                    onPixelSizeChange(48)
                  }}
                  className="px-4 py-2.5 text-sm font-medium bg-background border border-border/50 rounded-lg hover:bg-accent hover:border-accent transition-all duration-200 text-left"
                >
                  <div className="font-medium">Default</div>
                  <div className="text-xs text-muted-foreground">
                    5×5 grid, balanced
                  </div>
                </button>
                <button
                  onClick={() => {
                    onGridSizeChange(8)
                    onPixelSpacingChange(1)
                    onPixelSizeChange(32)
                  }}
                  className="px-4 py-2.5 text-sm font-medium bg-background border border-border/50 rounded-lg hover:bg-accent hover:border-accent transition-all duration-200 text-left"
                >
                  <div className="font-medium">Detailed</div>
                  <div className="text-xs text-muted-foreground">
                    8×8 grid, compact
                  </div>
                </button>
                <button
                  onClick={() => {
                    onGridSizeChange(3)
                    onPixelSpacingChange(4)
                    onPixelSizeChange(60)
                  }}
                  className="px-4 py-2.5 text-sm font-medium bg-background border border-border/50 rounded-lg hover:bg-accent hover:border-accent transition-all duration-200 text-left"
                >
                  <div className="font-medium">Simple</div>
                  <div className="text-xs text-muted-foreground">
                    3×3 grid, large
                  </div>
                </button>
                <button
                  onClick={() => {
                    onGridSizeChange(10)
                    onPixelSpacingChange(1)
                    onPixelSizeChange(24)
                  }}
                  className="px-4 py-2.5 text-sm font-medium bg-background border border-border/50 rounded-lg hover:bg-accent hover:border-accent transition-all duration-200 text-left"
                >
                  <div className="font-medium">Complex</div>
                  <div className="text-xs text-muted-foreground">
                    10×10 grid, tiny
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </>
  )
}
