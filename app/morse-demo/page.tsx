'use client'

import React, { useState } from 'react'
import { MorsePixelGrid, AnimationPreset } from '@/components/MorsePixelGrid'
import { MorseMatrixFlow } from '@/components/MorseMatrixFlow'
import { patternPresets, createRandomPattern, createEmptyPattern } from '@/lib/patterns'

export default function MorseDemoPage() {
  const [activePreset, setActivePreset] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [animationPreset, setAnimationPreset] = useState<AnimationPreset>('fade')
  
  const currentPreset = patternPresets[activePreset]
  
  const animationPresets: { value: AnimationPreset; label: string }[] = [
    { value: 'fade', label: 'Fade' },
    { value: 'scale', label: 'Scale' },
    { value: 'slide', label: 'Slide' },
    { value: 'wave', label: 'Wave' },
    { value: 'spiral', label: 'Spiral' },
    { value: 'random', label: 'Random' },
    { value: 'ripple', label: 'Ripple' },
    { value: 'cascade', label: 'Cascade' },
  ]
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Morse Pixel Animation System</h1>
          <p className="text-muted-foreground text-lg">
            Interactive pixel-matrix animations with synchronized label transitions
          </p>
        </div>
        
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">MorseMatrixFlow Demo</h2>
            <p className="text-muted-foreground">
              Orchestrated animations with automatic label transitions
            </p>
          </div>
          
          <div className="flex justify-center">
            <MorseMatrixFlow
              labels={['Loading', 'Processing', 'Scanning', 'Building', 'Complete']}
              active={isPlaying}
              className="p-8 rounded-lg border bg-card"
            />
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </section>
        
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Animation Presets</h2>
            <p className="text-muted-foreground">
              Different animation styles for pixel appearances
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="space-y-4">
              <MorsePixelGrid
                patterns={currentPreset.frames}
                tempo={currentPreset.tempo}
                active={true}
                pixelSize="lg"
                animationPreset={animationPreset}
                className="p-8 rounded-lg border bg-card"
              />
              
              <div className="flex gap-2 flex-wrap justify-center">
                {animationPresets.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setAnimationPreset(value)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      animationPreset === value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Pattern Library</h2>
            <p className="text-muted-foreground">
              Pre-built animation patterns for various states
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patternPresets.map((preset, index) => (
              <div
                key={preset.name}
                className="p-6 rounded-lg border bg-card space-y-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActivePreset(index)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{preset.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {preset.description}
                    </p>
                  </div>
                  {index === activePreset && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Active
                    </span>
                  )}
                </div>
                
                <div className="flex justify-center">
                  <MorsePixelGrid
                    patterns={preset.frames}
                    tempo={preset.tempo}
                    active={index === activePreset}
                    pixelSize="sm"
                    animationPreset={animationPreset}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Interactive Grid</h2>
            <p className="text-muted-foreground">
              Click pixels to create your own patterns
            </p>
          </div>
          
          <div className="flex justify-center">
            <MorsePixelGrid
              patterns={[createEmptyPattern()]}
              active={false}
              interactive={true}
              pixelSize="lg"
              className="p-8 rounded-lg border bg-card"
            />
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                const randomPattern = createRandomPattern(8, 0.3)
                // This would need a ref to the grid to set the pattern
              }}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              Random Pattern
            </button>
          </div>
        </section>
        
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Size Variations</h2>
            <p className="text-muted-foreground">
              Different pixel sizes for various use cases
            </p>
          </div>
          
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Small</p>
              <MorsePixelGrid
                patterns={currentPreset.frames}
                tempo={currentPreset.tempo}
                active={true}
                pixelSize="sm"
                animationPreset={animationPreset}
              />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Medium</p>
              <MorsePixelGrid
                patterns={currentPreset.frames}
                tempo={currentPreset.tempo}
                active={true}
                pixelSize="md"
                animationPreset={animationPreset}
              />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Large</p>
              <MorsePixelGrid
                patterns={currentPreset.frames}
                tempo={currentPreset.tempo}
                active={true}
                pixelSize="lg"
                animationPreset={animationPreset}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}