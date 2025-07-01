'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Settings } from 'lucide-react'

interface CanvasSettingsPopoverProps {
  isOpen: boolean
  onClose: () => void
  gridSize: number
  pixelSpacing: number
  pixelSize: number
  onGridSizeChange: (size: number) => void
  onPixelSpacingChange: (spacing: number) => void
  onPixelSizeChange: (size: number) => void
  buttonRef: React.RefObject<HTMLButtonElement>
}

// Constants
const GRID_SIZES = [3, 4, 5, 6, 7, 8, 9, 10] as const
const Z_INDEX = 1000000

const PRESETS = [
  {
    name: 'Default',
    description: '5×5 grid, balanced',
    gridSize: 5,
    spacing: 2,
    pixelSize: 48,
  },
  {
    name: 'Detailed',
    description: '8×8 grid, compact',
    gridSize: 8,
    spacing: 1,
    pixelSize: 32,
  },
  {
    name: 'Simple',
    description: '3×3 grid, large',
    gridSize: 3,
    spacing: 4,
    pixelSize: 60,
  },
  {
    name: 'Complex',
    description: '10×10 grid, tiny',
    gridSize: 10,
    spacing: 1,
    pixelSize: 24,
  },
] as const

// Slider styles
const sliderStyles = `
  .canvas-settings-slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: hsl(var(--primary));
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .canvas-settings-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 0 0 8px hsl(var(--primary) / 0.1);
  }
  .canvas-settings-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: hsl(var(--primary));
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .canvas-settings-slider::-moz-range-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 0 0 8px hsl(var(--primary) / 0.1);
  }
`

export function CanvasSettingsPopover({
  isOpen,
  onClose,
  gridSize,
  pixelSpacing,
  pixelSize,
  onGridSizeChange,
  onPixelSpacingChange,
  onPixelSizeChange,
  buttonRef,
}: CanvasSettingsPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Inject styles
  useEffect(() => {
    if (!isOpen) return

    const styleId = 'canvas-settings-slider-styles'
    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      styleElement.innerHTML = sliderStyles
      document.head.appendChild(styleElement)
    }

    return () => {
      // Keep styles in DOM as they might be used by other instances
    }
  }, [isOpen])

  // Handle positioning and events
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const clickedOutside =
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)

      if (clickedOutside) {
        onClose()
      }
    }

    const updatePosition = () => {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      })
    }

    // Initial position
    updatePosition()

    // Event listeners
    const events = [
      ['mousedown', handleClickOutside] as const,
      ['scroll', updatePosition, true] as const,
      ['resize', updatePosition] as const,
    ]

    events.forEach(([event, handler, options]) => {
      window.addEventListener(event, handler as EventListener, options)
    })

    return () => {
      events.forEach(([event, handler, options]) => {
        window.removeEventListener(event, handler as EventListener, options)
      })
    }
  }, [isOpen, onClose, buttonRef])

  if (!isOpen || !buttonRef.current) return null

  const handlePresetClick = (preset: (typeof PRESETS)[number]) => {
    onGridSizeChange(preset.gridSize)
    onPixelSpacingChange(preset.spacing)
    onPixelSizeChange(preset.pixelSize)
  }

  return createPortal(
    <div
      ref={popoverRef}
      className="absolute bg-white rounded-xl shadow-2xl border w-96 max-h-[80vh] overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(calc(-100% + 40px))',
        zIndex: Z_INDEX,
      }}
    >
      {/* Header */}
      <header className="border-b bg-muted/30 px-5 py-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold">Canvas Settings</h3>
      </header>

      {/* Content */}
      <div className="p-5 space-y-5 overflow-y-auto">
        {/* Grid Size Section */}
        <section className="space-y-3">
          <SettingHeader
            label="Grid Size"
            description="Number of pixels in width and height"
            value={`${gridSize}×${gridSize}`}
          />
          <div className="grid grid-cols-4 gap-2">
            {GRID_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => onGridSizeChange(size)}
                className={`
                  px-3 py-2 text-sm font-medium rounded-lg border 
                  transition-all duration-200
                  ${
                    gridSize === size
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background border-border hover:bg-accent hover:border-accent'
                  }
                `}
              >
                {size}×{size}
              </button>
            ))}
          </div>
        </section>

        {/* Pixel Spacing Section */}
        <section className="space-y-3">
          <SettingHeader
            label="Pixel Spacing"
            description="Gap between pixels in the grid"
            value={`${pixelSpacing}px`}
            htmlFor="spacing"
          />
          <RangeSlider
            id="spacing"
            min={0}
            max={10}
            step={1}
            value={pixelSpacing}
            onChange={onPixelSpacingChange}
            labelMin="None"
            labelMax="Wide"
          />
        </section>

        {/* Pixel Size Section */}
        <section className="space-y-3">
          <SettingHeader
            label="Pixel Size"
            description="Size of individual pixels"
            value={`${pixelSize}px`}
            htmlFor="pixelSize"
          />
          <RangeSlider
            id="pixelSize"
            min={20}
            max={60}
            step={5}
            value={pixelSize}
            onChange={onPixelSizeChange}
            labelMin="Small"
            labelMax="Large"
          />
        </section>

        {/* Presets Section */}
        <section className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Quick Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetClick(preset)}
                className="
                  px-3 py-2 text-sm font-medium bg-background 
                  border border-border rounded-lg 
                  hover:bg-accent hover:border-accent 
                  transition-all duration-200 text-left
                "
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-muted-foreground">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>,
    document.body
  )
}

// Sub-components
interface SettingHeaderProps {
  label: string
  description: string
  value: string
  htmlFor?: string
}

function SettingHeader({
  label,
  description,
  value,
  htmlFor,
}: SettingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="text-sm font-medium" htmlFor={htmlFor}>
          {label}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
        {value}
      </span>
    </div>
  )
}

interface RangeSliderProps {
  id: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  labelMin: string
  labelMax: string
}

function RangeSlider({
  id,
  min,
  max,
  step,
  value,
  onChange,
  labelMin,
  labelMax,
}: RangeSliderProps) {
  return (
    <div className="space-y-2">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer canvas-settings-slider"
      />
      <div className="flex justify-between">
        <span className="text-[10px] text-muted-foreground">{labelMin}</span>
        <span className="text-[10px] text-muted-foreground">{labelMax}</span>
      </div>
    </div>
  )
}
