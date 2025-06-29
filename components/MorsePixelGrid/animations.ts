import { AnimationPreset } from '@/lib/types';

interface AnimationDelayCalculator {
  (row: number, col: number, gridSize: number): number;
}

const animationStrategies: Record<AnimationPreset, AnimationDelayCalculator> = {
  fade: () => 0,
  
  scale: (row, col) => (row + col) * 20,
  
  slide: (_, col) => col * 30,
  
  wave: (row, col) => Math.sin((row + col) / 2) * 100 + 100,
  
  spiral: (row, col, gridSize) => {
    const center = gridSize / 2;
    const angle = Math.atan2(row - center, col - center);
    const distance = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
    return (angle + Math.PI) * 50 + distance * 30;
  },
  
  random: () => Math.random() * 200,
  
  ripple: (row, col, gridSize) => {
    const center = gridSize / 2;
    const distance = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
    const maxDistance = (Math.sqrt(2) * gridSize) / 2;
    return (distance / maxDistance) * 150;
  },
  
  cascade: (row, col) => row * 40 + col * 10,
};

export const calculateAnimationDelay = (
  row: number,
  col: number,
  gridSize: number,
  preset: AnimationPreset
): number => {
  const calculator = animationStrategies[preset];
  return calculator ? calculator(row, col, gridSize) : 0;
};