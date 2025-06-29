'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface Pattern {
  id: string
  name: string
}

interface PatternSelectorProps {
  patterns: readonly Pattern[]
  activePattern: string
  onPatternChange: (patternId: string) => void
}

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  patterns,
  activePattern,
  onPatternChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {patterns.map((pattern) => (
        <button
          key={pattern.id}
          onClick={() => onPatternChange(pattern.id)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm transition-all',
            activePattern === pattern.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          )}
        >
          {pattern.name}
        </button>
      ))}
    </div>
  )
}