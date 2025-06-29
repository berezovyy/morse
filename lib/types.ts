import { ANIMATION_PRESETS, BUTTON_STATUSES } from './constants';

export type Pattern = boolean[][];

export type AnimationPreset = (typeof ANIMATION_PRESETS)[number];

export type ButtonStatus = (typeof BUTTON_STATUSES)[number];

export type PixelSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';

export interface ColorScheme {
  active: string;
  inactive: string;
  background?: string;
  grid?: string;
}

export interface PatternFrame {
  pattern: Pattern;
  duration?: number;
}

export interface AnimationConfig {
  tempo: number;
  iterations: number | 'infinite';
  delay?: number;
  easing?: string;
}

export interface PixelPosition {
  row: number;
  col: number;
}

export interface GridDimensions {
  width: number;
  height: number;
  pixelSize: number;
  gap: number;
}