export interface OrchestratorState {
  currentLabel: string
  nextLabel: string | null
  isTransitioning: boolean
  currentPatternIndex: number
}

export interface OrchestratorConfig {
  labels: string[]
  patternDuration: number
  transitionDuration: number
  onStateChange?: (state: OrchestratorState) => void
}

export class Orchestrator {
  private labels: string[]
  private currentIndex: number = 0
  private patternDuration: number
  private transitionDuration: number
  private state: OrchestratorState
  private timer: NodeJS.Timeout | null = null
  private isRunning: boolean = false
  private onStateChange?: (state: OrchestratorState) => void
  private startTime: number = 0
  private pausedTime: number = 0
  
  constructor(config: OrchestratorConfig) {
    this.labels = config.labels
    this.patternDuration = config.patternDuration
    this.transitionDuration = config.transitionDuration
    this.onStateChange = config.onStateChange
    
    this.state = {
      currentLabel: this.labels[0] || '',
      nextLabel: null,
      isTransitioning: false,
      currentPatternIndex: 0
    }
  }
  
  start() {
    if (this.isRunning || this.labels.length === 0) return
    
    this.isRunning = true
    
    if (this.pausedTime > 0) {
      // Resume from pause
      const elapsed = this.pausedTime - this.startTime
      const remaining = this.patternDuration - elapsed
      this.startTime = Date.now() - elapsed
      this.pausedTime = 0
      this.timer = setTimeout(() => this.startTransition(), Math.max(0, remaining))
    } else {
      // Fresh start
      this.startTime = Date.now()
      this.scheduleNext()
    }
  }
  
  stop() {
    this.isRunning = false
    this.clearTimer()
  }
  
  pause() {
    if (!this.isRunning) return
    
    this.isRunning = false
    this.pausedTime = Date.now()
    this.clearTimer()
  }
  
  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
  
  reset() {
    this.stop()
    this.currentIndex = 0
    this.startTime = 0
    this.pausedTime = 0
    this.updateState({
      currentLabel: this.labels[0] || '',
      nextLabel: null,
      isTransitioning: false,
      currentPatternIndex: 0
    })
  }
  
  setLabels(labels: string[]) {
    this.labels = labels
    if (this.currentIndex >= labels.length) {
      this.currentIndex = 0
    }
    this.updateState({
      ...this.state,
      currentLabel: labels[this.currentIndex] || '',
      currentPatternIndex: this.currentIndex
    })
  }
  
  private scheduleNext() {
    if (!this.isRunning) return
    
    this.clearTimer()
    this.startTime = Date.now()
    this.timer = setTimeout(() => {
      this.startTransition()
    }, this.patternDuration)
  }
  
  private startTransition() {
    if (!this.isRunning) return
    
    const nextIndex = (this.currentIndex + 1) % this.labels.length
    this.updateState({
      ...this.state,
      nextLabel: this.labels[nextIndex],
      isTransitioning: true
    })
    
    this.clearTimer()
    this.timer = setTimeout(() => {
      this.completeTransition()
    }, this.transitionDuration)
  }
  
  private completeTransition() {
    if (!this.isRunning) return
    
    this.currentIndex = (this.currentIndex + 1) % this.labels.length
    this.updateState({
      currentLabel: this.labels[this.currentIndex],
      nextLabel: null,
      isTransitioning: false,
      currentPatternIndex: this.currentIndex
    })
    
    this.scheduleNext()
  }
  
  private updateState(newState: OrchestratorState) {
    // Only update if state actually changed
    if (this.state.currentLabel !== newState.currentLabel ||
        this.state.nextLabel !== newState.nextLabel ||
        this.state.isTransitioning !== newState.isTransitioning ||
        this.state.currentPatternIndex !== newState.currentPatternIndex) {
      this.state = newState
      this.onStateChange?.(newState)
    }
  }
  
  getCurrentState(): OrchestratorState {
    return { ...this.state }
  }
  
  destroy() {
    this.stop()
    this.onStateChange = undefined
    this.labels = []
  }
  
  getProgress(): number {
    if (!this.isRunning || this.pausedTime > 0) return 0
    
    const elapsed = Date.now() - this.startTime
    const progress = Math.min(elapsed / this.patternDuration, 1)
    return progress
  }
}