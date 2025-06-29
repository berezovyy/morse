'use client'

import React, { useState } from 'react'
import { MorsePixelGrid, AnimationPreset } from '@/components/MorsePixelGrid'
import { MorseMatrixFlow } from '@/components/MorseMatrixFlow'
import { MorseButton } from '@/components/MorseButton'
import { MorseButtonDemo } from '@/components/MorseButtonDemo'
import { patternPresets } from '@/lib/patterns'

export default function MorseDemoPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [activePattern, setActivePattern] = useState(0)
  const [buttonStatus, setButtonStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const patterns = [
    { name: 'Loading', pattern: patternPresets[0].pattern },
    { name: 'Processing', pattern: patternPresets[1].pattern },
    { name: 'Scanning', pattern: patternPresets[2].pattern },
    { name: 'Building', pattern: patternPresets[3].pattern },
    { name: 'Pulse', pattern: patternPresets[4].pattern },
  ]

  const handleButtonClick = () => {
    setButtonStatus('loading')
    setTimeout(() => {
      setButtonStatus('success')
      setTimeout(() => setButtonStatus('idle'), 2000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Morse
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            When pixels have something to say.
          </p>

          <div className="inline-flex items-center justify-center p-1 rounded-xl bg-background/50 backdrop-blur border">
            <MorseMatrixFlow
              labels={['Hello', 'World', 'Ready?', "Let's", 'Go!']}
              active={isPlaying}
              className="p-6"
              gridSize={12}
              tempo={2000}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Use</h2>
            <p className="text-muted-foreground">
              Drop these into your app and watch the magic happen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Animated State Button */}
            <div className="space-y-6 p-8 rounded-xl border bg-card">
              <h3 className="text-xl font-semibold">Live Status Updates</h3>
              <p className="text-sm text-muted-foreground">
                Watch the button animate through different states
              </p>
              <MorseButtonDemo />
            </div>

            {/* MorseButton Showcase */}
            <div className="space-y-6 p-8 rounded-xl border bg-card">
              <h3 className="text-xl font-semibold">Buttons That Talk Back</h3>
              <p className="text-sm text-muted-foreground">
                Click them. They'll show you what's happening.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <MorseButton
                    onClick={handleButtonClick}
                    status={buttonStatus}
                    variant="primary"
                  >
                    Submit
                  </MorseButton>
                  <MorseButton variant="secondary">Cancel</MorseButton>
                  <MorseButton variant="ghost">More</MorseButton>
                </div>

                <div className="flex gap-3">
                  <MorseButton size="sm" variant="primary">
                    Small
                  </MorseButton>
                  <MorseButton size="md" variant="primary">
                    Medium
                  </MorseButton>
                  <MorseButton size="lg" variant="primary">
                    Large
                  </MorseButton>
                </div>
              </div>
            </div>

            {/* Pattern Showcase */}
            <div className="space-y-6 p-8 rounded-xl border bg-card">
              <h3 className="text-xl font-semibold">Pick Your Pattern</h3>
              <p className="text-sm text-muted-foreground">
                From subtle to "whoa, did you see that?"
              </p>

              <div className="grid grid-cols-3 gap-3">
                {patterns.map((pattern, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePattern(index)}
                    className={`p-3 rounded-lg border transition-all ${
                      activePattern === index
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <MorsePixelGrid
                      gridSize={5}
                      pattern={pattern.pattern}
                      activePixelColor="rgb(var(--primary-rgb))"
                      tempo={1500}
                      animationPreset="fade"
                      className="w-full h-12"
                    />
                    <p className="text-xs mt-2">{pattern.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Get Started in 30 Seconds
            </h2>
            <p className="text-muted-foreground">Seriously, it's this easy</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-sm text-muted-foreground">
                  App.tsx
                </span>
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm">{`import { MorseMatrixFlow } from '@morse/react'

export default function App() {
  return (
    <MorseMatrixFlow
      labels={['Loading', 'Processing', 'Complete']}
      active={true}
      tempo={2000}
    />
  )
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          <p>Made with ❤️ and probably too much coffee</p>
        </div>
      </footer>
    </div>
  )
}
