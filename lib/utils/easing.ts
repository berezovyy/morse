export type EasingFunction = (t: number) => number

export const easing = {
  linear: (t: number): number => t,
  
  easeInOut: (t: number): number => 
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  easeOut: (t: number): number => 
    t * (2 - t),
  
  easeIn: (t: number): number => 
    t * t,
  
  easeInCubic: (t: number): number => 
    t * t * t,
  
  easeOutCubic: (t: number): number => 
    1 + Math.pow(t - 1, 3),
  
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 + Math.pow(-2 * t + 2, 3) / 2,
  
  elasticOut: (t: number): number => {
    const p = 0.3
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1
  },
  
  bounceOut: (t: number): number => {
    const n1 = 7.5625
    const d1 = 2.75
    
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  },
  
  spring: (t: number): number => {
    const c4 = (2 * Math.PI) / 3
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }
}

export const interpolate = (
  from: number,
  to: number,
  progress: number,
  easingFn: EasingFunction = easing.linear
): number => {
  const easedProgress = easingFn(progress)
  return from + (to - from) * easedProgress
}