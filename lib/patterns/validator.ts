import { Pattern } from '@/lib/types';

export const isValidPattern = (pattern: unknown): pattern is Pattern => {
  if (!Array.isArray(pattern) || pattern.length === 0) {
    return false;
  }

  const size = pattern.length;
  
  return pattern.every((row) => 
    Array.isArray(row) &&
    row.length === size &&
    row.every(cell => typeof cell === 'boolean')
  );
};

export const normalizePattern = (
  pattern: unknown,
  size: number = 8
): Pattern | null => {
  if (!isValidPattern(pattern)) {
    return null;
  }

  if (pattern.length === size) {
    return pattern;
  }

  const normalized: Pattern = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));
  const minSize = Math.min(pattern.length, size);

  for (let row = 0; row < minSize; row++) {
    for (let col = 0; col < minSize; col++) {
      normalized[row][col] = pattern[row][col];
    }
  }

  return normalized;
};

const FILLED_CHAR = '█';
const EMPTY_CHAR = '░';

export const patternToString = (pattern: Pattern): string => {
  return pattern
    .map((row) => row.map((cell) => cell ? FILLED_CHAR : EMPTY_CHAR).join(''))
    .join('\n');
};

const FILLED_CHARS = new Set(['█', '1', '#']);
const EMPTY_CHARS = new Set(['░', '0', '.']);

export const stringToPattern = (
  str: string,
  size: number = 8
): Pattern | null => {
  const lines = str.trim().split('\n');
  if (lines.length !== size) return null;

  const pattern: Pattern = [];

  for (const line of lines) {
    if (line.length !== size) return null;

    const row: boolean[] = [];
    for (const char of line) {
      if (FILLED_CHARS.has(char)) {
        row.push(true);
      } else if (EMPTY_CHARS.has(char)) {
        row.push(false);
      } else {
        return null;
      }
    }

    pattern.push(row);
  }

  return pattern;
};

export const compressPattern = (pattern: Pattern): string => {
  const binary = pattern
    .flat()
    .map((cell) => cell ? '1' : '0')
    .join('');
  
  const bytes: number[] = [];
  for (let i = 0; i < binary.length; i += 8) {
    bytes.push(parseInt(binary.slice(i, i + 8).padEnd(8, '0'), 2));
  }

  return btoa(String.fromCharCode(...bytes));
};

export const decompressPattern = (
  compressed: string,
  size: number = 8
): Pattern | null => {
  try {
    const binary = atob(compressed)
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');

    const pattern: Pattern = [];

    for (let row = 0; row < size; row++) {
      const rowData: boolean[] = [];
      for (let col = 0; col < size; col++) {
        const index = row * size + col;
        rowData.push(index < binary.length && binary[index] === '1');
      }
      pattern.push(rowData);
    }

    return pattern;
  } catch {
    return null;
  }
};
