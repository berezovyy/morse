'use client'

import React from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeExampleProps {
  title: string
  code: string
  isActive: boolean
  onCopy: () => void
}

export const CodeExample: React.FC<CodeExampleProps> = ({
  title,
  code,
  isActive,
  onCopy,
}) => {
  return (
    <div className="group">
      <div className="rounded-xl border bg-card overflow-hidden hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
          <span className="text-sm font-medium">{title}</span>
          <button
            onClick={onCopy}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            aria-label={isActive ? 'Copied' : 'Copy code'}
          >
            {isActive ? (
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
  )
}