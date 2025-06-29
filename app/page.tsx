'use client'

import React, { useState, useCallback } from 'react'
import { MorseButton } from '@/components/MorseButton'
import { patternPresets } from '@/lib/patterns'
import { Github, Copy, Check, ChevronRight, Sparkles } from 'lucide-react'
import { DEMO_PATTERNS, CODE_EXAMPLES, EXTERNAL_LINKS, COPY_TIMEOUT } from './constants'
import { CodeExample } from './components/CodeExample'
import { PatternSelector } from './components/PatternSelector'

export default function MorseDemoPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activePattern, setActivePattern] = useState('Play')

  const handleCopyCode = useCallback((id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), COPY_TIMEOUT)
  }, [])

  const handleOpenGithub = useCallback(() => {
    window.open(EXTERNAL_LINKS.GITHUB, '_blank')
  }, [])

  const handleOpenDocs = useCallback(() => {
    window.open(EXTERNAL_LINKS.DOCS, '_blank')
  }, [])

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
                onClick={handleOpenGithub}
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
                <PatternSelector
                  patterns={DEMO_PATTERNS}
                  activePattern={activePattern}
                  onPatternChange={setActivePattern}
                />
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
                    {DEMO_PATTERNS.find((p) => p.id === activePattern)?.description}
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
            {Object.entries(CODE_EXAMPLES).map(([key, code]) => (
              <CodeExample
                key={key}
                title={
                  key === 'basic'
                    ? 'Basic Grid'
                    : key === 'matrix'
                      ? 'Matrix Flow'
                      : 'Interactive Button'
                }
                code={code}
                isActive={copiedCode === key}
                onCopy={() => handleCopyCode(key, code)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <MorseButton
              size="lg"
              className="gap-2"
              onClick={handleOpenDocs}
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
              onClick={handleOpenGithub}
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
                href={EXTERNAL_LINKS.DOCS}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </a>
              <a
                href={EXTERNAL_LINKS.GITHUB}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href={EXTERNAL_LINKS.EXAMPLES}
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
