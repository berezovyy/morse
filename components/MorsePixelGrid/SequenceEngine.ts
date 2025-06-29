import { Pattern } from '@/lib/patterns'

export interface SequenceEngineConfig {
  patterns: Pattern[]
  tempo: number
  iterations: number | 'infinite'
  onFrameChange?: (frameIndex: number, pattern: Pattern) => void
  onCycleComplete?: () => void
  onComplete?: () => void
}

export class SequenceEngine {
  private patterns: Pattern[]
  private tempo: number
  private iterations: number | 'infinite'
  private currentFrame: number = 0
  private currentIteration: number = 0
  private lastFrameTime: number = 0
  private isRunning: boolean = false
  private animationFrameId: number | null = null
  
  private onFrameChange?: (frameIndex: number, pattern: Pattern) => void
  private onCycleComplete?: () => void
  private onComplete?: () => void
  
  constructor(config: SequenceEngineConfig) {
    this.patterns = config.patterns
    this.tempo = config.tempo
    this.iterations = config.iterations
    this.onFrameChange = config.onFrameChange
    this.onCycleComplete = config.onCycleComplete
    this.onComplete = config.onComplete
  }
  
  start() {
    if (this.isRunning) return
    
    this.isRunning = true
    this.lastFrameTime = performance.now()
    this.animate()
  }
  
  stop() {
    this.isRunning = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }
  
  reset() {
    this.stop()
    this.currentFrame = 0
    this.currentIteration = 0
    this.emitFrameChange()
  }
  
  setPatterns(patterns: Pattern[]) {
    this.patterns = patterns
    if (this.currentFrame >= patterns.length) {
      this.currentFrame = 0
    }
    this.emitFrameChange()
  }
  
  setTempo(tempo: number) {
    this.tempo = Math.max(16, tempo)
  }
  
  setIterations(iterations: number | 'infinite') {
    this.iterations = iterations
  }
  
  getCurrentPattern(): Pattern | null {
    if (this.patterns.length === 0) return null
    return this.patterns[this.currentFrame]
  }
  
  private animate = () => {
    if (!this.isRunning) return
    
    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastFrameTime
    
    if (deltaTime >= this.tempo) {
      this.lastFrameTime = currentTime
      this.nextFrame()
    }
    
    this.animationFrameId = requestAnimationFrame(this.animate)
  }
  
  private nextFrame() {
    this.currentFrame++
    
    if (this.currentFrame >= this.patterns.length) {
      this.currentFrame = 0
      this.currentIteration++
      this.onCycleComplete?.()
      
      if (this.iterations !== 'infinite' && this.currentIteration >= this.iterations) {
        this.stop()
        this.onComplete?.()
        return
      }
    }
    
    this.emitFrameChange()
  }
  
  private emitFrameChange() {
    const pattern = this.getCurrentPattern()
    if (pattern) {
      this.onFrameChange?.(this.currentFrame, pattern)
    }
  }
  
  destroy() {
    this.stop()
    this.patterns = []
    this.onFrameChange = undefined
    this.onCycleComplete = undefined
    this.onComplete = undefined
  }
}