export type Pattern = boolean[][]

export const createEmptyPattern = (size: number = 8): Pattern =>
  Array(size).fill(null).map(() => Array(size).fill(false))

export const createFilledPattern = (size: number = 8): Pattern =>
  Array(size).fill(null).map(() => Array(size).fill(true))

export const createCirclePattern = (size: number = 8, radius: number = 3): Pattern => {
  const pattern = createEmptyPattern(size)
  const center = Math.floor(size / 2)
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const distance = Math.sqrt(
        Math.pow(row - center, 2) + Math.pow(col - center, 2)
      )
      pattern[row][col] = distance <= radius
    }
  }
  
  return pattern
}

export const createRingPattern = (
  size: number = 8,
  outerRadius: number = 3,
  innerRadius: number = 2
): Pattern => {
  const pattern = createEmptyPattern(size)
  const center = Math.floor(size / 2)
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const distance = Math.sqrt(
        Math.pow(row - center, 2) + Math.pow(col - center, 2)
      )
      pattern[row][col] = distance <= outerRadius && distance >= innerRadius
    }
  }
  
  return pattern
}

export const createCrossPattern = (size: number = 8): Pattern => {
  const pattern = createEmptyPattern(size)
  const center = Math.floor(size / 2)
  
  for (let i = 0; i < size; i++) {
    pattern[center][i] = true
    pattern[i][center] = true
  }
  
  return pattern
}

export const createDiagonalPattern = (size: number = 8): Pattern => {
  const pattern = createEmptyPattern(size)
  
  for (let i = 0; i < size; i++) {
    pattern[i][i] = true
    pattern[i][size - 1 - i] = true
  }
  
  return pattern
}

export const createCheckerboardPattern = (size: number = 8): Pattern => {
  const pattern = createEmptyPattern(size)
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      pattern[row][col] = (row + col) % 2 === 0
    }
  }
  
  return pattern
}

export const createSpiralPattern = (size: number = 8): Pattern => {
  const pattern = createEmptyPattern(size)
  let top = 0, bottom = size - 1
  let left = 0, right = size - 1
  
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) {
      pattern[top][i] = true
    }
    top++
    
    for (let i = top; i <= bottom; i++) {
      pattern[i][right] = true
    }
    right--
    
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        pattern[bottom][i] = true
      }
      bottom--
    }
    
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        pattern[i][left] = true
      }
      left++
    }
  }
  
  return pattern
}

export const createRandomPattern = (size: number = 8, density: number = 0.5): Pattern => {
  const pattern = createEmptyPattern(size)
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      pattern[row][col] = Math.random() < density
    }
  }
  
  return pattern
}

export const createWavePattern = (
  size: number = 8,
  amplitude: number = 2,
  frequency: number = 1
): Pattern => {
  const pattern = createEmptyPattern(size)
  const centerY = Math.floor(size / 2)
  
  for (let col = 0; col < size; col++) {
    const y = centerY + Math.round(
      amplitude * Math.sin((col / size) * Math.PI * 2 * frequency)
    )
    
    if (y >= 0 && y < size) {
      pattern[y][col] = true
      if (y > 0) pattern[y - 1][col] = true
      if (y < size - 1) pattern[y + 1][col] = true
    }
  }
  
  return pattern
}

export const createHeartPattern = (size: number = 8): Pattern => {
  const pattern = createEmptyPattern(size)
  
  const heart = [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]
  
  for (let row = 0; row < Math.min(size, 8); row++) {
    for (let col = 0; col < Math.min(size, 8); col++) {
      pattern[row][col] = heart[row][col] === 1
    }
  }
  
  return pattern
}

export const morphPatterns = (
  from: Pattern,
  to: Pattern,
  progress: number
): Pattern => {
  const size = from.length
  const pattern = createEmptyPattern(size)
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (from[row][col] && to[row][col]) {
        pattern[row][col] = true
      } else if (from[row][col] && !to[row][col]) {
        pattern[row][col] = progress < 0.5
      } else if (!from[row][col] && to[row][col]) {
        pattern[row][col] = progress > 0.5
      }
    }
  }
  
  return pattern
}

export const rotatePattern = (pattern: Pattern, clockwise: boolean = true): Pattern => {
  const size = pattern.length
  const rotated = createEmptyPattern(size)
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (clockwise) {
        rotated[col][size - 1 - row] = pattern[row][col]
      } else {
        rotated[size - 1 - col][row] = pattern[row][col]
      }
    }
  }
  
  return rotated
}

export const flipPattern = (pattern: Pattern, horizontal: boolean = true): Pattern => {
  const size = pattern.length
  const flipped = createEmptyPattern(size)
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (horizontal) {
        flipped[row][size - 1 - col] = pattern[row][col]
      } else {
        flipped[size - 1 - row][col] = pattern[row][col]
      }
    }
  }
  
  return flipped
}

export const scalePattern = (
  pattern: Pattern,
  scale: number
): Pattern => {
  const size = pattern.length
  const center = Math.floor(size / 2)
  const scaled = createEmptyPattern(size)
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const scaledRow = Math.round(center + (row - center) / scale)
      const scaledCol = Math.round(center + (col - center) / scale)
      
      if (
        scaledRow >= 0 && scaledRow < size &&
        scaledCol >= 0 && scaledCol < size
      ) {
        scaled[row][col] = pattern[scaledRow][scaledCol]
      }
    }
  }
  
  return scaled
}