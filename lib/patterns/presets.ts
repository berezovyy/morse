import {
  createCirclePattern,
  createRingPattern,
  createCrossPattern,
  createDiagonalPattern,
  createSpiralPattern,
  createWavePattern,
  createHeartPattern,
  createEmptyPattern,
  Pattern
} from './generators'

export interface PatternPreset {
  name: string
  description: string
  frames: Pattern[]
  tempo: number
}

const createExpandingCircles = (): Pattern[] => {
  const frames: Pattern[] = []
  for (let i = 0; i <= 4; i++) {
    frames.push(createCirclePattern(8, i))
  }
  for (let i = 3; i >= 1; i--) {
    frames.push(createCirclePattern(8, i))
  }
  return frames
}

const createRotatingCross = (): Pattern[] => {
  const frames: Pattern[] = []
  const base = createCrossPattern(8)
  frames.push(base)
  
  for (let angle = 0; angle < 360; angle += 45) {
    const pattern = createEmptyPattern(8)
    const center = 3.5
    const rad = (angle * Math.PI) / 180
    
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (base[r][c]) {
          const x = c - center
          const y = r - center
          const newX = x * Math.cos(rad) - y * Math.sin(rad) + center
          const newY = x * Math.sin(rad) + y * Math.cos(rad) + center
          const newR = Math.round(newY)
          const newC = Math.round(newX)
          
          if (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {
            pattern[newR][newC] = true
          }
        }
      }
    }
    frames.push(pattern)
  }
  
  return frames
}

const createRadarSweep = (): Pattern[] => {
  const frames: Pattern[] = []
  const steps = 16
  
  for (let step = 0; step < steps; step++) {
    const pattern = createEmptyPattern(8)
    const angle = (step / steps) * Math.PI * 2
    const center = 3.5
    
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const x = c - center
        const y = r - center
        const pixelAngle = Math.atan2(y, x)
        const distance = Math.sqrt(x * x + y * y)
        
        const angleDiff = Math.abs(pixelAngle - angle)
        const normalizedDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff)
        
        if (normalizedDiff < Math.PI / 8 && distance <= 3.5) {
          pattern[r][c] = true
        }
      }
    }
    
    frames.push(pattern)
  }
  
  return frames
}

const createBuildingBlocks = (): Pattern[] => {
  const frames: Pattern[] = []
  
  for (let row = 7; row >= 0; row--) {
    const pattern = createEmptyPattern(8)
    for (let r = row; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        pattern[r][c] = true
      }
    }
    frames.push(pattern)
  }
  
  for (let row = 1; row < 8; row++) {
    const pattern = createEmptyPattern(8)
    for (let r = row; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        pattern[r][c] = true
      }
    }
    frames.push(pattern)
  }
  
  return frames
}

const createPulseWave = (): Pattern[] => {
  const frames: Pattern[] = []
  
  for (let radius = 0; radius <= 4; radius++) {
    frames.push(createRingPattern(8, radius + 0.5, Math.max(0, radius - 0.5)))
  }
  
  return frames
}

const createMorseSignal = (code: string): Pattern[] => {
  const frames: Pattern[] = []
  const dotDuration = 2
  const dashDuration = 6
  const pauseDuration = 2
  
  for (const char of code) {
    if (char === '.') {
      for (let i = 0; i < dotDuration; i++) {
        const pattern = createEmptyPattern(8)
        for (let r = 3; r <= 4; r++) {
          for (let c = 3; c <= 4; c++) {
            pattern[r][c] = true
          }
        }
        frames.push(pattern)
      }
    } else if (char === '-') {
      for (let i = 0; i < dashDuration; i++) {
        const pattern = createEmptyPattern(8)
        for (let r = 3; r <= 4; r++) {
          for (let c = 1; c <= 6; c++) {
            pattern[r][c] = true
          }
        }
        frames.push(pattern)
      }
    }
    
    for (let i = 0; i < pauseDuration; i++) {
      frames.push(createEmptyPattern(8))
    }
  }
  
  return frames
}

export const patternPresets: PatternPreset[] = [
  {
    name: 'Loading',
    description: 'Expanding circles animation',
    frames: createExpandingCircles(),
    tempo: 100
  },
  {
    name: 'Processing',
    description: 'Rotating cross pattern',
    frames: createRotatingCross(),
    tempo: 80
  },
  {
    name: 'Scanning',
    description: 'Radar sweep effect',
    frames: createRadarSweep(),
    tempo: 60
  },
  {
    name: 'Building',
    description: 'Bottom-up fill animation',
    frames: createBuildingBlocks(),
    tempo: 120
  },
  {
    name: 'Pulse',
    description: 'Center-out wave effect',
    frames: createPulseWave(),
    tempo: 150
  },
  {
    name: 'SOS',
    description: 'Morse code SOS signal',
    frames: createMorseSignal('...---...'),
    tempo: 100
  },
  {
    name: 'Heart',
    description: 'Static heart shape',
    frames: [createHeartPattern(8)],
    tempo: 1000
  },
  {
    name: 'Wave',
    description: 'Sine wave pattern',
    frames: [createWavePattern(8), createWavePattern(8, 2, 1.5), createWavePattern(8, 2, 2)],
    tempo: 200
  },
  {
    name: 'Spiral',
    description: 'Spiral pattern',
    frames: [createSpiralPattern(8)],
    tempo: 1000
  },
  {
    name: 'Diagonal',
    description: 'Diagonal lines',
    frames: [createDiagonalPattern(8)],
    tempo: 1000
  }
]

export const getPresetByName = (name: string): PatternPreset | undefined => {
  return patternPresets.find(preset => preset.name === name)
}

export const getRandomPreset = (): PatternPreset => {
  return patternPresets[Math.floor(Math.random() * patternPresets.length)]
}