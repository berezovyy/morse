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
    this.scheduleNext()
  }
  
  stop() {
    this.isRunning = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
  
  reset() {
    this.stop()
    this.currentIndex = 0
    this.state = {
      currentLabel: this.labels[0] || '',
      nextLabel: null,
      isTransitioning: false,
      currentPatternIndex: 0
    }
    this.emitStateChange()
  }
  
  setLabels(labels: string[]) {
    this.labels = labels
    if (this.currentIndex >= labels.length) {
      this.currentIndex = 0
    }
    this.state.currentLabel = labels[this.currentIndex] || ''
    this.emitStateChange()
  }
  
  private scheduleNext() {
    if (!this.isRunning) return
    
    this.timer = setTimeout(() => {
      this.startTransition()
    }, this.patternDuration)
  }
  
  private startTransition() {
    if (!this.isRunning) return
    
    const nextIndex = (this.currentIndex + 1) % this.labels.length
    this.state = {
      ...this.state,
      nextLabel: this.labels[nextIndex],
      isTransitioning: true
    }
    this.emitStateChange()
    
    this.timer = setTimeout(() => {
      this.completeTransition()
    }, this.transitionDuration)
  }
  
  private completeTransition() {
    if (!this.isRunning) return
    
    this.currentIndex = (this.currentIndex + 1) % this.labels.length
    this.state = {
      currentLabel: this.labels[this.currentIndex],
      nextLabel: null,
      isTransitioning: false,
      currentPatternIndex: this.currentIndex
    }
    this.emitStateChange()
    
    this.scheduleNext()
  }
  
  private emitStateChange() {
    this.onStateChange?.(this.state)
  }
  
  getCurrentState(): OrchestratorState {
    return { ...this.state }
  }
  
  destroy() {
    this.stop()
    this.onStateChange = undefined
  }
}