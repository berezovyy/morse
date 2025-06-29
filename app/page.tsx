'use client'

import React, { useState } from 'react'
import { MorsePixelGrid } from '@/components/MorsePixelGrid'
import { MorseMatrixFlow } from '@/components/MorseMatrixFlow'
import { MorseButton } from '@/components/MorseButton'
import { MorseButtonDemo } from '@/components/MorseButtonDemo'
import { patternPresets } from '@/lib/patterns'
import { Github, Copy, Check, ChevronRight, Sparkles } from 'lucide-react'

export default function MorseDemoPage() {
  const [isPlaying] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activePattern, setActivePattern] = useState('Play')
  const [buttonStatus, setButtonStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const codeExamples = {
    basic: `import { MorsePixelGrid } from '@morse/react'

export default function App() {
  return (
    <MorsePixelGrid
      pattern="loading"
      active={true}
      size="md"
    />
  )
}`,
    matrix: `import { MorseMatrixFlow } from '@morse/react'

export default function App() {
  return (
    <MorseMatrixFlow
      labels={['Loading', 'Processing', 'Complete']}
      active={true}
      tempo={2000}
    />
  )
}`,
    button: `import { MorseButton } from '@morse/react'

export default function App() {
  return (
    <MorseButton
      status="loading"
      onClick={() => console.log('clicked')}
    >
      Save Changes
    </MorseButton>
  )
}`,
  }

  const patterns = [
    { id: 'Play', name: 'Play', description: 'Play button animation' },
    { id: 'Searching', name: 'Searching', description: 'Expanding circles' },
    { id: 'Syncing', name: 'Syncing', description: 'Up and down arrows' },
    { id: 'Importing', name: 'Importing', description: 'Expanding circles' },
    { id: 'Loading', name: 'Loading', description: 'Loading spinner' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-background/50 backdrop-blur text-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>WIP Animated dots that speak button states</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Morse
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              When pixels have something to say
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <MorseButton
                size="lg"
                className="gap-2"
                onClick={() =>
                  window.open('https://github.com/berezovyy/morse', '_blank')
                }
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </MorseButton>
              <MorseButton
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => handleCopyCode('install', 'pnpm install _WIP_')}
              >
                {copiedCode === 'install' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                pnpm install _WIP_
              </MorseButton>
            </div>
          </div>

          <div className="bg-card/50 border rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  Button Pattern Showcase
                </h3>
                <p className="text-muted-foreground mb-6">
                  Choose from various animated patterns for button loading
                  states
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {patterns.map((pattern) => (
                    <button
                      key={pattern.id}
                      onClick={() => setActivePattern(pattern.id)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        activePattern === pattern.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {pattern.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="space-y-4">
                  <div className="relative">
                    <MorseButton
                      status="loading"
                      customPattern={
                        patternPresets.find((p) => p.name === activePattern)
                          ?.frames
                      }
                      size="lg"
                      className="min-w-[200px]"
                      alwaysShowMorse={true}
                    >
                      {activePattern}
                    </MorseButton>
                  </div>
                  {/* <p className="text-sm text-muted-foreground text-center">
                    {patterns.find((p) => p.id === activePattern)?.description}
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get Started in Seconds</h2>
            <p className="text-xl text-muted-foreground">
              Copy, paste, and customize. It&apos;s that simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(codeExamples).map(([key, code]) => (
              <div key={key} className="group">
                <div className="rounded-xl border bg-card overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
                    <span className="text-sm font-medium">
                      {key === 'basic'
                        ? 'Basic Grid'
                        : key === 'matrix'
                          ? 'Matrix Flow'
                          : 'Interactive Button'}
                    </span>
                    <button
                      onClick={() => handleCopyCode(key, code)}
                      className="p-1.5 rounded hover:bg-muted transition-colors"
                    >
                      {copiedCode === key ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-xs">{code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <MorseButton
              size="lg"
              className="gap-2"
              onClick={() => window.open('/docs', '_blank')}
            >
              View Full Documentation
              <ChevronRight className="w-5 h-5" />
            </MorseButton>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to make your app more delightful?
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            <MorseButton
              size="lg"
              className="gap-2"
              onClick={() =>
                handleCopyCode('install-cta', 'npm install @morse/react')
              }
            >
              {copiedCode === 'install-cta' ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
              Get Started
            </MorseButton>
            <MorseButton
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() =>
                window.open('https://github.com/berezovyy/morse', '_blank')
              }
            >
              <Github className="w-5 h-5" />
              Star on GitHub
            </MorseButton>
          </div>
        </div>
      </section>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025. Made with ❤️ and probably too much coffee.
            </div>
            <div className="flex gap-6">
              <a
                href="/docs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </a>
              <a
                href="https://github.com/berezovyy/morse"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="/examples"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Examples
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
