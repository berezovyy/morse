export const GRID_SIZES = {
  SMALL: 5,
  DEFAULT: 7,
  LARGE: 9,
} as const;

export const ANIMATION_TIMING = {
  FAST: 200,
  NORMAL: 600,
  SLOW: 1000,
  TEMPO_DEFAULT: 200,
} as const;

export const PIXEL_SIZES = {
  '2xs': { size: 'w-1 h-1', gap: 'gap-[1px]' },
  xs: { size: 'w-2 h-2', gap: 'gap-[1px]' },
  sm: { size: 'w-3 h-3', gap: 'gap-[2px]' },
  md: { size: 'w-4 h-4', gap: 'gap-[3px]' },
  lg: { size: 'w-5 h-5', gap: 'gap-[4px]' },
  xl: { size: 'w-6 h-6', gap: 'gap-[5px]' },
} as const;

export const BUTTON_SIZES = {
  sm: { class: 'h-8 px-3 text-sm gap-2' },
  md: { class: 'h-10 px-4 text-base gap-3' },
  lg: { class: 'h-12 px-6 text-lg gap-4' },
} as const;

export const BUTTON_VARIANTS = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
} as const;

export const PATTERN_CACHE_CONFIG = {
  MAX_SIZE: 100,
} as const;

export const DEFAULT_COLOR_SCHEME = {
  active: 'currentColor',
  inactive: 'rgba(128, 128, 128, 0.3)',
  grid: 'rgba(128, 128, 128, 0.3)',
  background: 'transparent',
} as const;

export const ANIMATION_PRESETS = [
  'fade',
  'scale',
  'slide',
  'wave',
  'spiral',
  'random',
  'ripple',
  'cascade',
] as const;

export const BUTTON_STATUSES = [
  'idle',
  'loading',
  'success',
  'error',
  'disabled',
  'importing',
  'searching',
] as const;