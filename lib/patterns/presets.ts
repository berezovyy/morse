import { createEmptyPattern } from './generators'
import { Pattern } from '@/lib/types'

export interface PatternPreset {
  name: string
  description: string
  frames: Pattern[]
  tempo: number
}











const createPlayPattern = (): Pattern[] => {
  const frames: Pattern[] = []
  const playFrames = [
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [4, 1],
      [4, 2],
      [4, 3],
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [2, 3],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [3, 4],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [2, 3],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [2, 1],
      [4, 1],
      [4, 2],
      [4, 3],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [3, 0],
      [4, 0],
      [4, 1],
      [4, 2],
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [2, 1],
      [4, 0],
      [4, 1],
      [4, 2],
    ],
  ]

  for (const frame of playFrames) {
    const pattern = createEmptyPattern(5)
    for (const [col, row] of frame) {
      pattern[row][col] = true
    }
    frames.push(pattern)
  }

  return frames
}

const createLoadingPattern = (): Pattern[] => {
  const frames: Pattern[] = []
  const loadingFrames = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [3, 0],
      [3, 1],
      [3, 2],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [2, 0],
      [2, 1],
      [2, 2],
      [3, 0],
      [3, 1],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 4],
      [3, 4],
      [2, 4],
      [1, 4],
      [0, 4],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [2, 0],
      [2, 1],
      [3, 0],
      [4, 0],
      [4, 1],
      [4, 3],
      [3, 3],
      [2, 3],
      [1, 3],
      [0, 3],
      [4, 4],
      [3, 4],
      [2, 4],
      [1, 4],
      [0, 4],
    ],
    [
      [0, 0],
      [2, 0],
      [4, 0],
      [4, 2],
      [3, 2],
      [2, 2],
      [1, 2],
      [0, 2],
      [4, 3],
      [3, 3],
      [2, 3],
      [1, 3],
      [0, 3],
      [4, 4],
      [3, 4],
      [2, 4],
      [1, 4],
      [0, 4],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [4, 1],
      [3, 1],
      [2, 1],
      [1, 1],
      [0, 1],
      [4, 2],
      [3, 2],
      [2, 2],
      [1, 2],
      [0, 2],
      [4, 3],
      [3, 3],
      [2, 3],
      [1, 3],
      [0, 3],
      [4, 4],
      [3, 4],
      [2, 4],
      [1, 4],
      [0, 4],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [4, 1],
      [3, 1],
      [2, 1],
      [1, 1],
      [0, 1],
      [4, 2],
      [3, 2],
      [2, 2],
      [1, 2],
      [0, 2],
      [4, 3],
      [3, 3],
      [2, 3],
      [1, 3],
      [0, 3],
      [4, 4],
      [3, 4],
      [2, 4],
      [1, 4],
      [0, 4],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [4, 1],
      [3, 1],
      [2, 1],
      [1, 1],
      [0, 1],
      [4, 2],
      [3, 2],
      [2, 2],
      [1, 2],
      [0, 2],
      [4, 3],
      [3, 3],
      [2, 3],
      [1, 3],
      [0, 3],
      [4, 4],
      [3, 4],
      [2, 4],
      [1, 4],
      [0, 4],
    ],
  ]

  for (const frame of loadingFrames) {
    const pattern = createEmptyPattern(5)
    for (const [col, row] of frame) {
      pattern[row][col] = true
    }
    frames.push(pattern)
  }

  return frames
}

const createSyncingPattern = (): Pattern[] => {
  const frames: Pattern[] = []
  const arrowDownFrames = [
    [[2, 0]],
    [
      [1, 0],
      [2, 0],
      [3, 0],
      [2, 1],
    ],
    [
      [2, 0],
      [1, 1],
      [2, 1],
      [3, 1],
      [2, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [2, 3],
    ],
    [
      [2, 1],
      [2, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [2, 4],
    ],
    [
      [2, 2],
      [2, 3],
      [1, 4],
      [2, 4],
      [3, 4],
    ],
    [
      [2, 3],
      [2, 4],
    ],
    [[2, 4]],
    [],
  ]

  const arrowUpFrames = [
    [[2, 4]],
    [
      [1, 4],
      [2, 4],
      [3, 4],
      [2, 3],
    ],
    [
      [2, 4],
      [1, 3],
      [2, 3],
      [3, 3],
      [2, 2],
    ],
    [
      [2, 4],
      [2, 3],
      [1, 2],
      [2, 2],
      [3, 2],
      [2, 1],
    ],
    [
      [2, 3],
      [2, 2],
      [1, 1],
      [2, 1],
      [3, 1],
      [2, 0],
    ],
    [
      [2, 2],
      [2, 1],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [2, 1],
      [2, 0],
    ],
    [[2, 0]],
    [],
  ]

  const syncingFrames = [...arrowDownFrames, ...arrowUpFrames]

  for (const frame of syncingFrames) {
    const pattern = createEmptyPattern(5)
    for (const [col, row] of frame) {
      pattern[row][col] = true
    }
    frames.push(pattern)
  }

  return frames
}

const createImportingPattern = (): Pattern[] => {
  const importingFrames = [
    [[2, 2]],
    [
      [1, 2],
      [2, 1],
      [2, 3],
      [3, 2],
    ],
    [
      [2, 2],
      [0, 2],
      [1, 1],
      [1, 3],
      [2, 0],
      [2, 4],
      [3, 1],
      [3, 3],
      [4, 2],
    ],
    [
      [0, 1],
      [0, 3],
      [1, 0],
      [1, 2],
      [1, 4],
      [2, 1],
      [2, 3],
      [3, 0],
      [3, 2],
      [3, 4],
      [4, 1],
      [4, 3],
    ],
    [
      [0, 0],
      [0, 2],
      [0, 4],
      [1, 1],
      [1, 3],
      [2, 0],
      [2, 2],
      [2, 4],
      [3, 1],
      [3, 3],
      [4, 0],
      [4, 2],
      [4, 4],
    ],
    [
      [0, 1],
      [0, 3],
      [1, 0],
      [1, 2],
      [1, 4],
      [2, 1],
      [2, 3],
      [3, 0],
      [3, 2],
      [3, 4],
      [4, 1],
      [4, 3],
    ],
    [
      [0, 0],
      [0, 2],
      [0, 4],
      [1, 1],
      [1, 3],
      [2, 0],
      [2, 4],
      [3, 1],
      [3, 3],
      [4, 0],
      [4, 2],
      [4, 4],
    ],
    [
      [0, 1],
      [1, 0],
      [3, 0],
      [4, 1],
      [0, 3],
      [1, 4],
      [3, 4],
      [4, 3],
    ],
    [
      [0, 0],
      [0, 4],
      [4, 0],
      [4, 4],
    ],
    [],
  ]

  return importingFrames.map((frame) => {
    const pattern: Pattern = Array(7)
      .fill(null)
      .map(() => Array(7).fill(false))
    frame.forEach(([r, c]) => {
      pattern[r][c] = true
    })
    return pattern
  })
}

const createSearchingPattern = (): Pattern[] => {
  const searchingFrames = [
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [1, 1],
      [2, 1],
      [3, 1],
      [2, 2],
    ],
    [
      [3, 0],
      [2, 1],
      [3, 1],
      [4, 1],
      [3, 2],
    ],
    [
      [3, 1],
      [2, 2],
      [3, 2],
      [4, 2],
      [3, 3],
    ],
    [
      [3, 2],
      [2, 3],
      [3, 3],
      [4, 3],
      [3, 4],
    ],
    [
      [1, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [1, 4],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [],
  ]

  return searchingFrames.map((frame) => {
    const pattern: Pattern = Array(7)
      .fill(null)
      .map(() => Array(7).fill(false))
    frame.forEach(([r, c]) => {
      pattern[r][c] = true
    })
    return pattern
  })
}

export const patternPresets: PatternPreset[] = [
  {
    name: 'Play',
    description: 'Play button animation',
    frames: createPlayPattern(),
    tempo: 150,
  },
  {
    name: 'Loading',
    description: 'Loading spinner animation',
    frames: createLoadingPattern(),
    tempo: 100,
  },
  {
    name: 'Syncing',
    description: 'Up and down arrow sync animation',
    frames: createSyncingPattern(),
    tempo: 80,
  },
  {
    name: 'Importing',
    description: 'Expanding circles',
    frames: createImportingPattern(),
    tempo: 100,
  },
  {
    name: 'Searching',
    description: 'Expanding circles',
    frames: createSearchingPattern(),
    tempo: 100,
  },
]

export const getPresetByName = (name: string): PatternPreset | undefined => {
  return patternPresets.find((preset) => preset.name === name)
}

export const getRandomPreset = (): PatternPreset => {
  return patternPresets[Math.floor(Math.random() * patternPresets.length)]
}
