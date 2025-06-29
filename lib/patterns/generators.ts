import { Pattern } from '@/lib/types';

// Pattern cache for memoization
const patternCache = new Map<string, Pattern>();
const MAX_CACHE_SIZE = 100;

// Helper to create cache key
const createCacheKey = (type: string, ...params: any[]): string => {
  return `${type}-${params.join("-")}`;
};

// Helper to get or set cached pattern
const getCachedPattern = <T extends any[]>(
  key: string,
  generator: (...args: T) => Pattern,
  ...args: T
): Pattern => {
  if (patternCache.has(key)) {
    return patternCache.get(key)!.map((row) => [...row]); // Return a copy
  }

  const pattern = generator(...args);

  // Limit cache size
  if (patternCache.size >= MAX_CACHE_SIZE) {
    const firstKey = patternCache.keys().next().value;
    if (firstKey !== undefined) {
      patternCache.delete(firstKey);
    }
  }

  patternCache.set(key, pattern);
  return pattern.map((row) => [...row]); // Return a copy
};

// Pre-allocated empty patterns for common sizes
const emptyPatternCache = new Map<number, Pattern>();

export const createEmptyPattern = (size: number = 7): Pattern => {
  if (!emptyPatternCache.has(size)) {
    emptyPatternCache.set(
      size,
      Array(size)
        .fill(null)
        .map(() => Array(size).fill(false))
    );
  }
  // Return a copy to prevent mutation
  return emptyPatternCache.get(size)!.map((row) => [...row]);
};

// Pre-allocated filled patterns for common sizes
const filledPatternCache = new Map<number, Pattern>();

export const createFilledPattern = (size: number = 7): Pattern => {
  if (!filledPatternCache.has(size)) {
    filledPatternCache.set(
      size,
      Array(size)
        .fill(null)
        .map(() => Array(size).fill(true))
    );
  }
  // Return a copy to prevent mutation
  return filledPatternCache.get(size)!.map((row) => [...row]);
};

export const createCirclePattern = (
  size: number = 7,
  radius: number = 3
): Pattern => {
  const key = createCacheKey("circle", size, radius);
  return getCachedPattern(
    key,
    (size: number, radius: number) => {
      const pattern = createEmptyPattern(size);
      const center = Math.floor(size / 2);
      const radiusSquared = radius * radius; // Avoid repeated sqrt calculations

      for (let row = 0; row < size; row++) {
        const yDiff = row - center;
        const ySquared = yDiff * yDiff; // Cache row calculation

        for (let col = 0; col < size; col++) {
          const xDiff = col - center;
          const distanceSquared = xDiff * xDiff + ySquared;
          pattern[row][col] = distanceSquared <= radiusSquared;
        }
      }

      return pattern;
    },
    size,
    radius
  );
};

export const createRingPattern = (
  size: number = 7,
  outerRadius: number = 3,
  innerRadius: number = 2
): Pattern => {
  const key = createCacheKey("ring", size, outerRadius, innerRadius);
  return getCachedPattern(
    key,
    (size: number, outerRadius: number, innerRadius: number) => {
      const pattern = createEmptyPattern(size);
      const center = Math.floor(size / 2);
      const outerRadiusSquared = outerRadius * outerRadius;
      const innerRadiusSquared = innerRadius * innerRadius;

      for (let row = 0; row < size; row++) {
        const yDiff = row - center;
        const ySquared = yDiff * yDiff;

        for (let col = 0; col < size; col++) {
          const xDiff = col - center;
          const distanceSquared = xDiff * xDiff + ySquared;
          pattern[row][col] =
            distanceSquared <= outerRadiusSquared &&
            distanceSquared >= innerRadiusSquared;
        }
      }

      return pattern;
    },
    size,
    outerRadius,
    innerRadius
  );
};

export const createCrossPattern = (size: number = 7): Pattern => {
  const key = createCacheKey("cross", size);
  return getCachedPattern(
    key,
    (size: number) => {
      const pattern = createEmptyPattern(size);
      const center = Math.floor(size / 2);

      // Fill horizontal line
      pattern[center].fill(true);

      // Fill vertical line
      for (let i = 0; i < size; i++) {
        pattern[i][center] = true;
      }

      return pattern;
    },
    size
  );
};

export const createDiagonalPattern = (size: number = 7): Pattern => {
  const key = createCacheKey("diagonal", size);
  return getCachedPattern(
    key,
    (size: number) => {
      const pattern = createEmptyPattern(size);
      const lastIndex = size - 1;

      for (let i = 0; i < size; i++) {
        pattern[i][i] = true;
        pattern[i][lastIndex - i] = true;
      }

      return pattern;
    },
    size
  );
};

export const createCheckerboardPattern = (size: number = 7): Pattern => {
  const key = createCacheKey("checkerboard", size);
  return getCachedPattern(
    key,
    (size: number) => {
      const pattern = createEmptyPattern(size);

      for (let row = 0; row < size; row++) {
        const rowEven = row % 2 === 0;
        for (let col = 0; col < size; col++) {
          pattern[row][col] = rowEven === (col % 2 === 0);
        }
      }

      return pattern;
    },
    size
  );
};

export const createSpiralPattern = (size: number = 7): Pattern => {
  const pattern = createEmptyPattern(size);
  let top = 0,
    bottom = size - 1;
  let left = 0,
    right = size - 1;

  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) {
      pattern[top][i] = true;
    }
    top++;

    for (let i = top; i <= bottom; i++) {
      pattern[i][right] = true;
    }
    right--;

    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        pattern[bottom][i] = true;
      }
      bottom--;
    }

    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        pattern[i][left] = true;
      }
      left++;
    }
  }

  return pattern;
};

export const createRandomPattern = (
  size: number = 7,
  density: number = 0.5
): Pattern => {
  const pattern = createEmptyPattern(size);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      pattern[row][col] = Math.random() < density;
    }
  }

  return pattern;
};

export const createWavePattern = (
  size: number = 7,
  amplitude: number = 2,
  frequency: number = 1
): Pattern => {
  const key = createCacheKey("wave", size, amplitude, frequency);
  return getCachedPattern(
    key,
    (size: number, amplitude: number, frequency: number) => {
      const pattern = createEmptyPattern(size);
      const centerY = Math.floor(size / 2);
      const angleMultiplier = (Math.PI * 2 * frequency) / size;

      for (let col = 0; col < size; col++) {
        const y =
          centerY + Math.round(amplitude * Math.sin(col * angleMultiplier));

        if (y >= 0 && y < size) {
          pattern[y][col] = true;
          if (y > 0) pattern[y - 1][col] = true;
          if (y < size - 1) pattern[y + 1][col] = true;
        }
      }

      return pattern;
    },
    size,
    amplitude,
    frequency
  );
};

export const createHeartPattern = (size: number = 7): Pattern => {
  const pattern = createEmptyPattern(size);

  const heart = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  for (let row = 0; row < Math.min(size, 7); row++) {
    for (let col = 0; col < Math.min(size, 7); col++) {
      pattern[row][col] = heart[row][col] === 1;
    }
  }

  return pattern;
};

export const morphPatterns = (
  from: Pattern,
  to: Pattern,
  progress: number
): Pattern => {
  const size = from.length;
  const pattern = createEmptyPattern(size);
  const midPoint = progress < 0.5;
  const afterMidPoint = progress > 0.5;

  for (let row = 0; row < size; row++) {
    const fromRow = from[row];
    const toRow = to[row];
    const patternRow = pattern[row];

    for (let col = 0; col < size; col++) {
      const fromVal = fromRow[col];
      const toVal = toRow[col];

      if (fromVal && toVal) {
        patternRow[col] = true;
      } else if (fromVal && !toVal) {
        patternRow[col] = midPoint;
      } else if (!fromVal && toVal) {
        patternRow[col] = afterMidPoint;
      }
    }
  }

  return pattern;
};

export const rotatePattern = (
  pattern: Pattern,
  clockwise: boolean = true
): Pattern => {
  const size = pattern.length;
  const rotated = createEmptyPattern(size);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (clockwise) {
        rotated[col][size - 1 - row] = pattern[row][col];
      } else {
        rotated[size - 1 - col][row] = pattern[row][col];
      }
    }
  }

  return rotated;
};

export const flipPattern = (
  pattern: Pattern,
  horizontal: boolean = true
): Pattern => {
  const size = pattern.length;
  const flipped = createEmptyPattern(size);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (horizontal) {
        flipped[row][size - 1 - col] = pattern[row][col];
      } else {
        flipped[size - 1 - row][col] = pattern[row][col];
      }
    }
  }

  return flipped;
};

export const scalePattern = (pattern: Pattern, scale: number): Pattern => {
  const size = pattern.length;
  const center = Math.floor(size / 2);
  const scaled = createEmptyPattern(size);
  const invScale = 1 / scale;

  for (let row = 0; row < size; row++) {
    const rowOffset = (row - center) * invScale;
    const scaledRow = Math.round(center + rowOffset);

    if (scaledRow >= 0 && scaledRow < size) {
      for (let col = 0; col < size; col++) {
        const colOffset = (col - center) * invScale;
        const scaledCol = Math.round(center + colOffset);

        if (scaledCol >= 0 && scaledCol < size) {
          scaled[row][col] = pattern[scaledRow][scaledCol];
        }
      }
    }
  }

  return scaled;
};

// Utility function to clear pattern cache
export const clearPatternCache = (): void => {
  patternCache.clear();
  emptyPatternCache.clear();
  filledPatternCache.clear();
};

// Utility function to get cache size
export const getPatternCacheSize = (): number => {
  return patternCache.size + emptyPatternCache.size + filledPatternCache.size;
};
