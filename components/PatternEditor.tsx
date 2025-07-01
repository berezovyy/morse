'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { EnhancedEditorCanvas } from '@/components/editor/EnhancedEditorCanvas'
import { FrameTimeline } from '@/components/editor/FrameTimeline'
import { ToolPanel } from '@/components/editor/ToolPanel'
import { DrawingToolPanel } from '@/components/editor/DrawingToolPanel'
import { CanvasSettingsPopover } from '@/components/editor/CanvasSettingsPopover'
import { ExportModal } from '@/components/editor/ExportModal'
import { ImportModal } from '@/components/editor/ImportModal'
import { PatternLibrary } from '@/components/editor/PatternLibrary'
import { MorsePixelGrid } from '@/components/MorsePixelGrid/MorsePixelGrid'
import { Settings } from 'lucide-react'
import type { Pattern } from '@/lib/types'
import type { ToolType } from '@/lib/editor/tools'

interface EditorFrame {
  pattern: Pattern
  duration: number
}

interface EditorState {
  frames: EditorFrame[]
  currentFrame: number
  isPlaying: boolean
  animationSpeed: number
}

const createEmptyPattern = (size: number): Pattern => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(false))
}

const resizePattern = (pattern: Pattern, newSize: number): Pattern => {
  const oldSize = pattern.length
  const newPattern = createEmptyPattern(newSize)
  
  for (let y = 0; y < Math.min(oldSize, newSize); y++) {
    for (let x = 0; x < Math.min(oldSize, newSize); x++) {
      newPattern[y][x] = pattern[y][x]
    }
  }
  
  return newPattern
}

export function PatternEditor() {
  const [gridSize, setGridSize] = useState(5)
  const [pixelSpacing, setPixelSpacing] = useState(2)
  const [pixelSize, setPixelSize] = useState(48)
  
  const [state, setState] = useState<EditorState>({
    frames: [
      {
        pattern: createEmptyPattern(5),
        duration: 500,
      },
    ],
    currentFrame: 0,
    isPlaying: false,
    animationSpeed: 500,
  })

  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showPatternLibrary, setShowPatternLibrary] = useState(false)
  const [showSettingsPopover, setShowSettingsPopover] = useState(false)
  const [showPreviousFrame, setShowPreviousFrame] = useState(true)
  const [selectedTool, setSelectedTool] = useState<ToolType>('pencil')
  const [fillMode, setFillMode] = useState(false)
  const [copiedFrame, setCopiedFrame] = useState<EditorFrame | null>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  
  // History stack for undo/redo
  const [history, setHistory] = useState<EditorState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [skipHistoryUpdate, setSkipHistoryUpdate] = useState(true) // Start with true to avoid double-adding initial state
  const maxHistorySize = 50

  const currentPattern =
    state.frames[state.currentFrame]?.pattern || createEmptyPattern(gridSize)
  const previousPattern =
    state.currentFrame > 0
      ? state.frames[state.currentFrame - 1]?.pattern
      : undefined

  // Track state changes and update history
  useEffect(() => {
    if (!skipHistoryUpdate) {
      // Don't add duplicate states
      if (historyIndex >= 0) {
        const currentHistoryState = history[historyIndex]
        if (JSON.stringify(currentHistoryState) === JSON.stringify(state)) {
          return
        }
      }
      
      // Add current state to history
      const newHistory = [...history.slice(0, historyIndex + 1), state]
      
      // Trim if exceeds max size
      if (newHistory.length > maxHistorySize) {
        setHistory(newHistory.slice(1))
        setHistoryIndex(newHistory.length - 2)
      } else {
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
      }
    } else {
      setSkipHistoryUpdate(false)
    }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  // Custom setState that doesn't track history (for undo/redo)
  const setStateWithoutHistory = useCallback((newState: EditorState) => {
    setSkipHistoryUpdate(true)
    setState(newState)
  }, [])

  // Custom setState that tracks history
  const setStateWithHistory = useCallback((updater: EditorState | ((prev: EditorState) => EditorState)) => {
    setState(updater)
  }, [])

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1]
      setStateWithoutHistory(previousState)
      setHistoryIndex(historyIndex - 1)
    }
  }, [history, historyIndex, setStateWithoutHistory])

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setStateWithoutHistory(nextState)
      setHistoryIndex(historyIndex + 1)
    }
  }, [history, historyIndex, setStateWithoutHistory])

  const canUndo = historyIndex > 0 && history.length > 1
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1

  const updatePattern = useCallback((pattern: Pattern) => {
    setStateWithHistory((prev) => ({
      ...prev,
      frames: prev.frames.map((frame, idx) =>
        idx === prev.currentFrame
          ? { ...frame, pattern: pattern.map((row) => [...row]) }
          : frame
      ),
    }))
  }, [setStateWithHistory])

  const addFrame = useCallback(() => {
    setStateWithHistory((prev) => ({
      ...prev,
      frames: [
        ...prev.frames,
        {
          pattern: createEmptyPattern(gridSize),
          duration: prev.animationSpeed,
        },
      ],
      currentFrame: prev.frames.length,
    }))
  }, [gridSize, setStateWithHistory])

  const removeFrame = useCallback((index: number) => {
    setStateWithHistory((prev) => {
      if (prev.frames.length <= 1) return prev
      const newFrames = prev.frames.filter((_, i) => i !== index)
      return {
        ...prev,
        frames: newFrames,
        currentFrame: Math.min(prev.currentFrame, newFrames.length - 1),
      }
    })
  }, [setStateWithHistory])

  const duplicateFrame = useCallback((index: number) => {
    setStateWithHistory((prev) => {
      const frameToDuplicate = prev.frames[index]
      const newFrames = [
        ...prev.frames.slice(0, index + 1),
        {
          ...frameToDuplicate,
          pattern: frameToDuplicate.pattern.map((row) => [...row]),
        },
        ...prev.frames.slice(index + 1),
      ]
      return {
        ...prev,
        frames: newFrames,
        currentFrame: index + 1,
      }
    })
  }, [setStateWithHistory])

  const navigateFrame = useCallback((direction: 'prev' | 'next') => {
    setState((prev) => ({
      ...prev,
      currentFrame:
        direction === 'prev'
          ? Math.max(0, prev.currentFrame - 1)
          : Math.min(prev.frames.length - 1, prev.currentFrame + 1),
    }))
  }, [])

  const setCurrentFrame = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentFrame: index,
    }))
  }, [])

  const togglePlay = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }))
  }, [])

  const setAnimationSpeed = useCallback((speed: number) => {
    setStateWithHistory((prev) => ({
      ...prev,
      animationSpeed: speed,
      frames: prev.frames.map((frame) => ({
        ...frame,
        duration: speed,
      })),
    }))
  }, [setStateWithHistory])

  const clearPattern = useCallback(() => {
    updatePattern(createEmptyPattern(gridSize))
  }, [gridSize, updatePattern])

  const fillPattern = useCallback(() => {
    updatePattern(
      Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(true))
    )
  }, [gridSize, updatePattern])

  const invertPattern = useCallback(() => {
    updatePattern(currentPattern.map((row) => row.map((cell) => !cell)))
  }, [currentPattern, updatePattern])

  const loadPattern = useCallback((patterns: Pattern[]) => {
    setStateWithHistory((prev) => ({
      ...prev,
      frames: patterns.map((pattern) => ({
        pattern: resizePattern(pattern, gridSize),
        duration: prev.animationSpeed,
      })),
      currentFrame: 0,
    }))
    setShowPatternLibrary(false)
  }, [setStateWithHistory, gridSize])

  const updateFrameDuration = useCallback((index: number, duration: number) => {
    setStateWithHistory((prev) => ({
      ...prev,
      frames: prev.frames.map((frame, idx) =>
        idx === index
          ? { ...frame, duration }
          : frame
      ),
    }))
  }, [setStateWithHistory])

  const reorderFrames = useCallback((newFrames: EditorFrame[]) => {
    setStateWithHistory((prev) => ({
      ...prev,
      frames: newFrames,
    }))
  }, [setStateWithHistory])

  const copyFrame = useCallback((index: number) => {
    const frame = state.frames[index]
    setCopiedFrame({
      ...frame,
      pattern: frame.pattern.map(row => [...row])
    })
  }, [state.frames])

  const pasteFrame = useCallback((index: number) => {
    if (!copiedFrame) return
    
    setStateWithHistory((prev) => ({
      ...prev,
      frames: prev.frames.map((frame, idx) =>
        idx === index
          ? {
              ...frame,
              pattern: copiedFrame.pattern.map(row => [...row])
            }
          : frame
      ),
    }))
  }, [copiedFrame, setStateWithHistory])

  const pasteAsNewFrame = useCallback(() => {
    if (!copiedFrame) return
    
    setStateWithHistory((prev) => ({
      ...prev,
      frames: [
        ...prev.frames.slice(0, prev.currentFrame + 1),
        {
          ...copiedFrame,
          pattern: copiedFrame.pattern.map(row => [...row])
        },
        ...prev.frames.slice(prev.currentFrame + 1),
      ],
      currentFrame: prev.currentFrame + 1,
    }))
  }, [copiedFrame, setStateWithHistory])

  const handleGridSizeChange = useCallback((newSize: number) => {
    if (newSize === gridSize) return
    
    // Resize all frames to new grid size
    setStateWithHistory((prev) => ({
      ...prev,
      frames: prev.frames.map(frame => ({
        ...frame,
        pattern: resizePattern(frame.pattern, newSize)
      }))
    }))
    setGridSize(newSize)
  }, [gridSize, setStateWithHistory])

  const importPatterns = useCallback((frames: { pattern: Pattern; duration: number }[]) => {
    setStateWithHistory({
      frames: frames.map(frame => ({
        ...frame,
        pattern: resizePattern(frame.pattern, gridSize)
      })),
      currentFrame: 0,
      isPlaying: false,
      animationSpeed: frames[0]?.duration || 500,
    })
  }, [setStateWithHistory, gridSize])

  useEffect(() => {
    const savedState = localStorage.getItem('morse-editor-state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setSkipHistoryUpdate(true)
        setState(parsed)
        // Initialize history with loaded state
        setHistory([parsed])
        setHistoryIndex(0)
      } catch (e) {
        console.error('Failed to load saved state:', e)
      }
    } else {
      // Initialize history with current state
      setHistory([state])
      setHistoryIndex(0)
      setSkipHistoryUpdate(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('morse-editor-state', JSON.stringify(state))
    }, 2000)
    return () => clearTimeout(saveTimeout)
  }, [state])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'ArrowLeft') {
        navigateFrame('prev')
      } else if (e.key === 'ArrowRight') {
        navigateFrame('next')
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          undo()
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault()
          redo()
        } else if (e.key === 'c') {
          e.preventDefault()
          copyFrame(state.currentFrame)
        } else if (e.key === 'v' && !e.shiftKey) {
          e.preventDefault()
          pasteFrame(state.currentFrame)
        } else if (e.key === 'v' && e.shiftKey) {
          e.preventDefault()
          pasteAsNewFrame()
        }
      } else if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        clearPattern()
      } else if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        fillPattern()
      } else if (e.key.toLowerCase() === 'i' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        invertPattern()
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        // Tool shortcuts
        const shortcuts: Record<string, ToolType> = {
          'p': 'pencil',
          'e': 'eraser', 
          'l': 'line',
          'r': 'rectangle',
          'o': 'circle',
          'b': 'fill'
        }
        if (shortcuts[e.key.toLowerCase()]) {
          e.preventDefault()
          setSelectedTool(shortcuts[e.key.toLowerCase()])
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [togglePlay, navigateFrame, clearPattern, fillPattern, invertPattern, undo, redo, copyFrame, pasteFrame, pasteAsNewFrame, state.currentFrame])

  return (
    <div className="relative">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Pattern Editor</h2>
          <p className="text-muted-foreground">
            Create custom animations for your Morse components
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            ref={settingsButtonRef}
            onClick={() => setShowSettingsPopover(!showSettingsPopover)}
            className={`p-2 rounded-lg border transition-all duration-200 group ${
              showSettingsPopover
                ? 'bg-accent border-accent'
                : 'border-border/50 hover:bg-accent hover:border-accent'
            }`}
            title="Canvas Settings"
          >
            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
          <div className="w-px h-8 bg-border/50" />
          <button
            onClick={() => setShowPatternLibrary(true)}
            className="text-sm font-medium hover:text-primary transition-colors px-3 py-2"
          >
            Browse Patterns
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 text-sm font-medium border border-border/50 rounded-md hover:bg-accent transition-colors"
          >
            Import
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Export
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
        {/* Left Column - Main Editor */}
        <div className="space-y-4 min-w-0">
          {/* Canvas Card */}
          <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
            <div className="border-b bg-muted/30 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-sm">Canvas</h2>
                <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                  {gridSize}×{gridSize}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {state.frames.length > 1 && (
                <button
                  onClick={() => setShowPreviousFrame(!showPreviousFrame)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    showPreviousFrame
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-background/50 text-muted-foreground border border-border/50 hover:bg-accent hover:border-accent'
                  }`}
                  title={
                    showPreviousFrame
                      ? 'Hide previous frame'
                      : 'Show previous frame'
                  }
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="transition-opacity"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="5"
                      height="5"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.4"
                      rx="0.5"
                    />
                    <rect
                      x="5"
                      y="5"
                      width="5"
                      height="5"
                      stroke="currentColor"
                      strokeWidth="1"
                      rx="0.5"
                    />
                  </svg>
                  <span>{showPreviousFrame ? 'Ghost On' : 'Ghost Off'}</span>
                </button>
                )}
              </div>
            </div>
            <div className="p-8">
              <EnhancedEditorCanvas
                pattern={currentPattern}
                onPatternChange={updatePattern}
                gridSize={gridSize}
                previousPattern={previousPattern}
                showPreviousFrame={showPreviousFrame && state.frames.length > 1}
                selectedTool={selectedTool}
                fillMode={fillMode}
                pixelSpacing={pixelSpacing}
                pixelSize={pixelSize}
              />
            </div>
          </div>

          {/* Timeline and Playback Section */}
          <div className="space-y-4">
            {/* Timeline Card */}
            <FrameTimeline
              frames={state.frames}
              currentFrame={state.currentFrame}
              onFrameSelect={setCurrentFrame}
              onAddFrame={addFrame}
              onRemoveFrame={removeFrame}
              onDuplicateFrame={duplicateFrame}
              onNavigate={navigateFrame}
              onFrameDurationChange={updateFrameDuration}
              onReorderFrames={reorderFrames}
              onCopyFrame={copyFrame}
              onPasteFrame={pasteFrame}
              hasCopiedFrame={copiedFrame !== null}
              gridSize={gridSize}
            />

            {/* Playback Controls */}
            <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
              <div className="border-b bg-muted/30 px-4 py-2.5">
                <h3 className="font-semibold text-sm">Playback</h3>
              </div>
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={togglePlay}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 text-sm transition-all duration-200 ${
                      state.isPlaying
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-background border border-border/50 hover:bg-accent hover:border-accent'
                    }`}
                  >
                  {state.isPlaying ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <rect
                          x="4"
                          y="3"
                          width="2"
                          height="8"
                          fill="currentColor"
                          rx="0.5"
                        />
                        <rect
                          x="8"
                          y="3"
                          width="2"
                          height="8"
                          fill="currentColor"
                          rx="0.5"
                        />
                      </svg>
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path d="M4.5 3v8l6-4-6-4z" fill="currentColor" />
                      </svg>
                      <span>Play</span>
                    </>
                  )}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAnimationSpeed(Math.max(100, state.animationSpeed - 100))}
                      className="p-1 rounded hover:bg-accent transition-colors disabled:opacity-50"
                      disabled={state.animationSpeed <= 100}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M8 6H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <span className="text-xs font-medium min-w-[3rem] text-center bg-muted/30 px-2 py-1 rounded">
                      {state.animationSpeed}ms
                    </span>
                    <button
                      onClick={() => setAnimationSpeed(Math.min(2000, state.animationSpeed + 100))}
                      className="p-1 rounded hover:bg-accent transition-colors disabled:opacity-50"
                      disabled={state.animationSpeed >= 2000}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 4v4M8 6H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-muted/50 rounded font-mono">Space</kbd>
                    <span>Play/Pause</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-muted/50 rounded font-mono">←→</kbd>
                    <span>Navigate</span>
                  </div>
                </div>
            </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tools & Preview */}
        <div className="space-y-4 lg:max-h-[calc(100vh-12rem)] lg:sticky lg:top-20">
          {/* Drawing Tools */}
          <DrawingToolPanel
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            fillMode={fillMode}
            onFillModeChange={setFillMode}
          />
          
          {/* Live Preview */}
          <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
            <div className="border-b bg-muted/30 px-4 py-2.5 flex items-center justify-between">
              <h2 className="font-semibold text-sm">Live Preview</h2>
              {state.isPlaying && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-background/50 rounded-md border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Live
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 flex justify-center items-center bg-gradient-to-br from-primary/5 via-transparent to-transparent">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
                <div className="relative bg-background/50 p-3 rounded-xl border border-border/50 shadow-sm">
                  <MorsePixelGrid
                    key={`preview-${JSON.stringify(state.frames.map((f) => f.pattern)).substring(0, 50)}`}
                    patterns={state.frames.map((f) => f.pattern)}
                    animationPreset="fade"
                    tempo={state.animationSpeed}
                    active={state.isPlaying}
                    pixelSize="xs"
                    iterations="infinite"
                    gridSize={gridSize}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tools */}
          <ToolPanel
            onClear={clearPattern}
            onFill={fillPattern}
            onInvert={invertPattern}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: hsl(var(--primary));
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 8px hsl(var(--primary) / 0.1);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: hsl(var(--primary));
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 8px hsl(var(--primary) / 0.1);
        }
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: hsl(var(--muted));
        }
        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: hsl(var(--muted));
        }
      `}</style>

      {showExportModal && (
        <ExportModal
          frames={state.frames}
          gridSize={gridSize}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showImportModal && (
        <ImportModal
          onImport={importPatterns}
          onClose={() => setShowImportModal(false)}
        />
      )}

      {showPatternLibrary && (
        <PatternLibrary
          onSelectPattern={loadPattern}
          onClose={() => setShowPatternLibrary(false)}
        />
      )}

      {/* Settings Popover */}
      <CanvasSettingsPopover
        isOpen={showSettingsPopover}
        onClose={() => setShowSettingsPopover(false)}
        gridSize={gridSize}
        pixelSpacing={pixelSpacing}
        pixelSize={pixelSize}
        onGridSizeChange={handleGridSizeChange}
        onPixelSpacingChange={setPixelSpacing}
        onPixelSizeChange={setPixelSize}
        buttonRef={settingsButtonRef}
      />
    </div>
  )
}
