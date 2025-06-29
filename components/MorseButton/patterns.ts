import { Pattern } from '@/lib/types';
import { GRID_SIZES } from '@/lib/constants';

const createEmptyGrid = (size: number = GRID_SIZES.DEFAULT): Pattern => 
  Array(size).fill(null).map(() => Array(size).fill(false));

const setPixels = (pattern: Pattern, pixels: [number, number][]): void => {
  pixels.forEach(([row, col]) => {
    if (pattern[row] && pattern[row][col] !== undefined) {
      pattern[row][col] = true;
    }
  });
};

export const createLoadingPattern = (): Pattern[] => {
  const positions = [
    [2, 3], [2, 4], [3, 4], [4, 4],
    [4, 3], [4, 2], [3, 2], [2, 2],
  ];

  return positions.map((_, index) => {
    const pattern = createEmptyGrid();
    for (let j = 0; j < 3; j++) {
      const idx = (index + j) % positions.length;
      const [row, col] = positions[idx];
      pattern[row][col] = true;
    }
    return pattern;
  });
};

export const createSuccessPattern = (): Pattern[] => {
  const pattern = createEmptyGrid();
  setPixels(pattern, [
    [4, 1], [5, 2], [4, 3], [3, 4], [2, 5], [1, 4]
  ]);
  return [pattern];
};

export const createErrorPattern = (): Pattern[] => {
  const pattern = createEmptyGrid();
  for (let i = 0; i < 5; i++) {
    pattern[i + 1][i + 1] = true;
    pattern[i + 1][5 - i] = true;
  }
  return [pattern];
};

export const createDisabledPattern = (): Pattern[] => {
  const pattern = createEmptyGrid();
  for (let row = 2; row <= 4; row += 2) {
    for (let col = 2; col <= 4; col++) {
      pattern[row][col] = true;
    }
  }
  return [pattern];
};

export const createEmptyPattern = (): Pattern[] => [createEmptyGrid()];

export const createImportingPattern = (): Pattern[] => {
  const frames = [
    [[2, 2]],
    [[1, 2], [2, 1], [2, 3], [3, 2]],
    [[2, 2], [0, 2], [1, 1], [1, 3], [2, 0], [2, 4], [3, 1], [3, 3], [4, 2]],
    [[0, 1], [0, 3], [1, 0], [1, 2], [1, 4], [2, 1], [2, 3], [3, 0], [3, 2], [3, 4], [4, 1], [4, 3]],
    [[0, 0], [0, 2], [0, 4], [1, 1], [1, 3], [2, 0], [2, 2], [2, 4], [3, 1], [3, 3], [4, 0], [4, 2], [4, 4]],
    [[0, 1], [0, 3], [1, 0], [1, 2], [1, 4], [2, 1], [2, 3], [3, 0], [3, 2], [3, 4], [4, 1], [4, 3]],
    [[0, 0], [0, 2], [0, 4], [1, 1], [1, 3], [2, 0], [2, 4], [3, 1], [3, 3], [4, 0], [4, 2], [4, 4]],
    [[0, 1], [1, 0], [3, 0], [4, 1], [0, 3], [1, 4], [3, 4], [4, 3]],
    [[0, 0], [0, 4], [4, 0], [4, 4]],
    [],
  ];

  return frames.map(pixelCoords => {
    const pattern = createEmptyGrid();
    setPixels(pattern, pixelCoords as [number, number][]);
    return pattern;
  });
};

export const createSearchingPattern = (): Pattern[] => {
  const frames = [
    [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
    [[2, 0], [1, 1], [2, 1], [3, 1], [2, 2]],
    [[3, 0], [2, 1], [3, 1], [4, 1], [3, 2]],
    [[3, 1], [2, 2], [3, 2], [4, 2], [3, 3]],
    [[3, 2], [2, 3], [3, 3], [4, 3], [3, 4]],
    [[1, 2], [0, 3], [1, 3], [2, 3], [1, 4]],
    [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]],
    [],
  ];

  return frames.map(pixelCoords => {
    const pattern = createEmptyGrid();
    setPixels(pattern, pixelCoords as [number, number][]);
    return pattern;
  });
};