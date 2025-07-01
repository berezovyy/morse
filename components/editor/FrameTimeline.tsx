'use client'

import { useState, useRef } from 'react'
import type { Pattern } from '@/lib/types'

interface EditorFrame {
  pattern: Pattern
  duration: number
}

interface FrameTimelineProps {
  frames: EditorFrame[]
  currentFrame: number
  onFrameSelect: (index: number) => void
  onAddFrame: () => void
  onRemoveFrame: (index: number) => void
  onDuplicateFrame: (index: number) => void
  onNavigate: (direction: 'prev' | 'next') => void
  onFrameDurationChange?: (index: number, duration: number) => void
  onReorderFrames?: (frames: EditorFrame[]) => void
  onCopyFrame?: (index: number) => void
  onPasteFrame?: (index: number) => void
  hasCopiedFrame?: boolean
  gridSize?: number
}

export function FrameTimeline({
  frames,
  currentFrame,
  onFrameSelect,
  onAddFrame,
  onRemoveFrame,
  onDuplicateFrame,
  onNavigate,
  onFrameDurationChange,
  onReorderFrames,
  onCopyFrame,
  onPasteFrame,
  hasCopiedFrame = false,
  gridSize = 5,
}: FrameTimelineProps) {
  const [editingDuration, setEditingDuration] = useState<number | null>(null)
  const [durationValue, setDurationValue] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragNodeRef = useRef<HTMLDivElement | null>(null)
  const dragOverNodeRef = useRef<HTMLDivElement | null>(null)

  const startEditingDuration = (index: number) => {
    setEditingDuration(index)
    setDurationValue(frames[index].duration.toString())
  }

  const saveDuration = () => {
    if (editingDuration !== null && onFrameDurationChange) {
      const duration = parseInt(durationValue)
      if (!isNaN(duration) && duration >= 100 && duration <= 5000) {
        onFrameDurationChange(editingDuration, duration)
      }
      setEditingDuration(null)
    }
  }

  const cancelEdit = () => {
    setEditingDuration(null)
    setDurationValue('')
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index)
    dragNodeRef.current = e.currentTarget
    e.currentTarget.style.opacity = '0.5'
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1'
    setDraggedIndex(null)
    setDragOverIndex(null)
    dragNodeRef.current = null
    dragOverNodeRef.current = null
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (draggedIndex === null || draggedIndex === index) return
    setDragOverIndex(index)
    dragOverNodeRef.current = e.currentTarget
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget === dragOverNodeRef.current) {
      setDragOverIndex(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex || !onReorderFrames) return

    const draggedFrame = frames[draggedIndex]
    const newFrames = [...frames]
    
    // Remove the dragged frame
    newFrames.splice(draggedIndex, 1)
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
    newFrames.splice(insertIndex, 0, draggedFrame)
    
    onReorderFrames(newFrames)
    
    // Update current frame index if needed
    if (currentFrame === draggedIndex) {
      onFrameSelect(insertIndex)
    } else if (draggedIndex < currentFrame && insertIndex >= currentFrame) {
      onFrameSelect(currentFrame - 1)
    } else if (draggedIndex > currentFrame && insertIndex <= currentFrame) {
      onFrameSelect(currentFrame + 1)
    }
  }

  return (
    <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
      <div className="border-b bg-muted/30 px-4 py-2.5 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Timeline</h3>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md bg-background/50 border">
            <span className="text-primary">{currentFrame + 1}</span>
            <span className="text-muted-foreground">of</span>
            <span>{frames.length}</span>
          </span>
          {frames.length > 5 && (
            <span className="text-xs text-muted-foreground">
              Scroll for more →
            </span>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onNavigate('prev')}
            disabled={currentFrame === 0}
            className="p-2 rounded-lg bg-background border border-border/50 hover:bg-accent hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group shadow-sm"
            aria-label="Previous frame"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            >
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Frames */}
          <div
            className="overflow-x-auto flex gap-2 py-1 px-1 pb-6"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--border)) transparent',
              maxWidth: 'calc(100% - 100px)', // Account for nav buttons
            }}
          >
            {frames.map((frame, index) => (
              <div
                key={`frame-${index}-${JSON.stringify(frame.pattern).substring(0, 20)}`}
                className={`relative group flex-shrink-0 ${
                  dragOverIndex === index ? 'scale-110' : ''
                } transition-transform duration-200`}
                draggable={onReorderFrames !== undefined}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                style={{ cursor: onReorderFrames ? 'grab' : 'default' }}
              >
                <button
                  onClick={() => onFrameSelect(index)}
                  className={`relative w-16 h-16 rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                    index === currentFrame
                      ? 'border-primary shadow-md scale-105'
                      : 'border-border hover:border-primary/50 bg-background/50'
                  } ${
                    dragOverIndex === index && draggedIndex !== index
                      ? 'border-primary/70 bg-primary/10'
                      : ''
                  }`}
                  aria-label={`Frame ${index + 1}`}
                >
                  {/* Mini Grid Preview */}
                  <div 
                    className="absolute inset-1.5 grid gap-[1px]"
                    style={{
                      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                      gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                    }}
                  >
                    {frame.pattern
                      .slice(0, gridSize)
                      .map((row, rowIdx) =>
                        row
                          .slice(0, gridSize)
                          .map((isActive, colIdx) => (
                            <div
                              key={`${rowIdx}-${colIdx}-${index}`}
                              className={`rounded-[1px] transition-colors ${
                                isActive
                                  ? index === currentFrame
                                    ? 'bg-primary'
                                    : 'bg-primary/60'
                                  : 'bg-muted-foreground/20'
                              }`}
                            />
                          ))
                      )}
                  </div>
                  {/* Frame Number */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 text-xs font-medium text-center py-0.5 transition-colors ${
                      index === currentFrame
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background/80 text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </span>
                </button>
                
                {/* Duration Badge */}
                {onFrameDurationChange && (
                  <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
                    {editingDuration === index ? (
                      <input
                        type="number"
                        value={durationValue}
                        onChange={(e) => setDurationValue(e.target.value)}
                        onBlur={saveDuration}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveDuration()
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        className="w-14 px-1 py-0.5 text-xs text-center bg-background border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        min="100"
                        max="5000"
                        step="100"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => startEditingDuration(index)}
                        className="px-2 py-0.5 text-xs bg-muted/50 hover:bg-muted rounded transition-colors cursor-pointer"
                        title="Click to edit duration"
                      >
                        {frame.duration}ms
                      </button>
                    )}
                  </div>
                )}
                
                {/* Frame Actions */}
                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  {/* Copy Button */}
                  {onCopyFrame && (
                    <button
                      onClick={() => onCopyFrame(index)}
                      className="w-7 h-7 bg-background border border-border/50 rounded-lg flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200 shadow-md group/btn"
                      aria-label={`Copy frame ${index + 1}`}
                      title="Copy frame (Ctrl+C)"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-muted-foreground group-hover/btn:text-foreground transition-colors"
                      >
                        <rect x="4" y="4" width="8" height="8" stroke="currentColor" strokeWidth="1.5" rx="1"/>
                        <path d="M8 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v4a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  )}
                  {/* Paste Button */}
                  {onPasteFrame && hasCopiedFrame && (
                    <button
                      onClick={() => onPasteFrame(index)}
                      className="w-7 h-7 bg-background border border-border/50 rounded-lg flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200 shadow-md group/btn"
                      aria-label={`Paste to frame ${index + 1}`}
                      title="Paste frame (Ctrl+V)"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-muted-foreground group-hover/btn:text-foreground transition-colors"
                      >
                        <rect x="4" y="2" width="6" height="10" stroke="currentColor" strokeWidth="1.5" rx="1"/>
                        <rect x="2" y="5" width="10" height="1" fill="currentColor"/>
                        <path d="M6 2h2a1 1 0 011 1v0a1 1 0 01-1 1H6a1 1 0 01-1-1v0a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  )}
                  {/* Duplicate Button */}
                  <button
                    onClick={() => onDuplicateFrame(index)}
                    className="w-7 h-7 bg-background border border-border/50 rounded-lg flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200 shadow-md group/btn"
                    aria-label={`Duplicate frame ${index + 1}`}
                    title="Duplicate frame"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="text-muted-foreground group-hover/btn:text-foreground transition-colors"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="6"
                        height="6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        rx="1"
                      />
                      <rect
                        x="6"
                        y="6"
                        width="6"
                        height="6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        rx="1"
                        fill="white"
                      />
                    </svg>
                  </button>
                  {/* Delete Button */}
                  {frames.length > 1 && (
                    <button
                      onClick={() => onRemoveFrame(index)}
                      className="w-7 h-7 bg-background border border-border/50 rounded-lg flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all duration-200 shadow-md group/btn"
                      aria-label={`Remove frame ${index + 1}`}
                      title="Delete frame"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-muted-foreground group-hover/btn:text-destructive transition-colors"
                      >
                        <path
                          d="M4 4l6 6M10 4l-6 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Frame Button */}
            <button
              onClick={onAddFrame}
              className="w-16 h-16 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-200 flex items-center justify-center text-muted-foreground hover:text-primary bg-background/30 hover:bg-primary/5 group flex-shrink-0"
              aria-label="Add frame"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="group-hover:scale-110 transition-transform"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Next Button */}
          <button
            onClick={() => onNavigate('next')}
            disabled={currentFrame === frames.length - 1}
            className="p-2 rounded-lg bg-background border border-border/50 hover:bg-accent hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group shadow-sm"
            aria-label="Next frame"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            >
              <path
                d="M6 12l4-4-4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
