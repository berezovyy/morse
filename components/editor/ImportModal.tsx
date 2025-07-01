'use client'

import { useState } from 'react'
import type { Pattern } from '@/lib/types'

interface ImportModalProps {
  onImport: (frames: { pattern: Pattern; duration: number }[]) => void
  onClose: () => void
}

export function ImportModal({ onImport, onClose }: ImportModalProps) {
  const [jsonContent, setJsonContent] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<{ pattern: Pattern; duration: number }[] | null>(null)

  const validateImport = (content: string) => {
    try {
      const data = JSON.parse(content)
      
      // Validate structure
      if (!data.frames || !Array.isArray(data.frames)) {
        throw new Error('Invalid format: missing frames array')
      }

      // Validate each frame
      data.frames.forEach((frame: any, index: number) => {
        if (!frame.pattern || !Array.isArray(frame.pattern)) {
          throw new Error(`Invalid frame ${index + 1}: missing pattern`)
        }
        if (typeof frame.duration !== 'number' || frame.duration < 100 || frame.duration > 5000) {
          throw new Error(`Invalid frame ${index + 1}: duration must be between 100-5000ms`)
        }
        // Validate pattern is square and has boolean values
        const size = frame.pattern.length
        frame.pattern.forEach((row: any, rowIndex: number) => {
          if (!Array.isArray(row) || row.length !== size) {
            throw new Error(`Invalid frame ${index + 1}: pattern must be square`)
          }
          row.forEach((cell: any, colIndex: number) => {
            if (typeof cell !== 'boolean') {
              throw new Error(`Invalid frame ${index + 1}: cell [${rowIndex},${colIndex}] must be boolean`)
            }
          })
        })
      })

      setError('')
      setPreview(data.frames)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setPreview(null)
      return false
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setJsonContent(content)
      validateImport(content)
    }
    reader.readAsText(file)
  }

  const handleImport = () => {
    if (preview) {
      onImport(preview)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-lg shadow-lg border">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Import Pattern</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload JSON File</label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:font-medium hover:file:bg-primary/90 cursor-pointer"
            />
          </div>

          {/* JSON Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Or paste JSON content</label>
            <textarea
              value={jsonContent}
              onChange={(e) => {
                setJsonContent(e.target.value)
                validateImport(e.target.value)
              }}
              placeholder='{"frames": [{"pattern": [[true, false, ...], ...], "duration": 500}, ...]}'
              className="w-full h-32 px-3 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Preview ({preview.length} frames)</h3>
              <div className="flex gap-2 overflow-x-auto p-2 bg-muted/30 rounded-md">
                {preview.map((frame, index) => (
                  <div key={index} className="flex-shrink-0">
                    <div className="w-16 h-16 border rounded p-1 bg-background">
                      <div className="grid grid-cols-5 grid-rows-5 gap-[1px] w-full h-full">
                        {frame.pattern.slice(0, 5).map((row, rowIdx) =>
                          row.slice(0, 5).map((isActive, colIdx) => (
                            <div
                              key={`${rowIdx}-${colIdx}`}
                              className={`rounded-[1px] ${
                                isActive ? 'bg-primary' : 'bg-muted-foreground/20'
                              }`}
                            />
                          ))
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-center mt-1 text-muted-foreground">
                      {frame.duration}ms
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!preview}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Import {preview ? `(${preview.length} frames)` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}