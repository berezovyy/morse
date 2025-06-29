export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

export const rgbToHex = (rgb: RGB): string => {
  const toHex = (n: number) => {
    const hex = n.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

export const hslToRgb = (hsl: HSL): RGB => {
  const { h, s, l } = hsl
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  
  let r = 0, g = 0, b = 0
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

export const interpolateColor = (
  from: RGB,
  to: RGB,
  progress: number
): RGB => ({
  r: Math.round(from.r + (to.r - from.r) * progress),
  g: Math.round(from.g + (to.g - from.g) * progress),
  b: Math.round(from.b + (to.b - from.b) * progress),
})

export const generateGradient = (
  colors: string[],
  steps: number
): string[] => {
  const gradient: string[] = []
  const segmentSize = steps / (colors.length - 1)
  
  for (let i = 0; i < colors.length - 1; i++) {
    const from = hexToRgb(colors[i])
    const to = hexToRgb(colors[i + 1])
    
    for (let j = 0; j < segmentSize; j++) {
      const progress = j / segmentSize
      const color = interpolateColor(from, to, progress)
      gradient.push(rgbToHex(color))
    }
  }
  
  return gradient
}