export type ToolType = 'pencil' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'fill';

export interface Tool {
  id: ToolType;
  name: string;
  icon: React.ReactNode;
  cursor?: string;
  shortcut?: string;
}

export interface Point {
  x: number;
  y: number;
}

// Bresenham's line algorithm
export function getLinePoints(start: Point, end: Point): Point[] {
  const points: Point[] = [];
  
  let x0 = start.x;
  let y0 = start.y;
  const x1 = end.x;
  const y1 = end.y;
  
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  
  while (true) {
    points.push({ x: x0, y: y0 });
    
    if (x0 === x1 && y0 === y1) break;
    
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  
  return points;
}

// Get rectangle points (outline)
export function getRectanglePoints(start: Point, end: Point, filled: boolean): Point[] {
  const points: Point[] = [];
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);
  
  if (filled) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        points.push({ x, y });
      }
    }
  } else {
    // Top and bottom edges
    for (let x = minX; x <= maxX; x++) {
      points.push({ x, y: minY });
      if (minY !== maxY) {
        points.push({ x, y: maxY });
      }
    }
    // Left and right edges (excluding corners to avoid duplicates)
    for (let y = minY + 1; y < maxY; y++) {
      points.push({ x: minX, y });
      if (minX !== maxX) {
        points.push({ x: maxX, y });
      }
    }
  }
  
  return points;
}

// Get circle points using midpoint circle algorithm
export function getCirclePoints(center: Point, end: Point, filled: boolean): Point[] {
  const points: Point[] = [];
  const radius = Math.round(Math.sqrt(Math.pow(end.x - center.x, 2) + Math.pow(end.y - center.y, 2)));
  
  if (filled) {
    // Fill the circle
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y <= radius * radius) {
          points.push({ x: center.x + x, y: center.y + y });
        }
      }
    }
  } else {
    // Draw circle outline using midpoint circle algorithm
    let x = radius;
    let y = 0;
    let err = 0;
    
    while (x >= y) {
      points.push({ x: center.x + x, y: center.y + y });
      points.push({ x: center.x + y, y: center.y + x });
      points.push({ x: center.x - y, y: center.y + x });
      points.push({ x: center.x - x, y: center.y + y });
      points.push({ x: center.x - x, y: center.y - y });
      points.push({ x: center.x - y, y: center.y - x });
      points.push({ x: center.x + y, y: center.y - x });
      points.push({ x: center.x + x, y: center.y - y });
      
      if (err <= 0) {
        y += 1;
        err += 2 * y + 1;
      }
      if (err > 0) {
        x -= 1;
        err -= 2 * x + 1;
      }
    }
  }
  
  // Remove duplicates and filter out-of-bounds points
  const uniquePoints = Array.from(new Set(points.map(p => `${p.x},${p.y}`))).map(p => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
  });
  
  return uniquePoints;
}

// Flood fill algorithm
export function getFloodFillPoints(pattern: boolean[][], start: Point, gridSize: number): Point[] {
  const points: Point[] = [];
  const targetValue = pattern[start.y][start.x];
  const visited = new Set<string>();
  const stack: Point[] = [start];
  
  while (stack.length > 0) {
    const point = stack.pop()!;
    const key = `${point.x},${point.y}`;
    
    if (visited.has(key)) continue;
    if (point.x < 0 || point.x >= gridSize || point.y < 0 || point.y >= gridSize) continue;
    if (pattern[point.y][point.x] !== targetValue) continue;
    
    visited.add(key);
    points.push(point);
    
    // Add neighboring points
    stack.push({ x: point.x + 1, y: point.y });
    stack.push({ x: point.x - 1, y: point.y });
    stack.push({ x: point.x, y: point.y + 1 });
    stack.push({ x: point.x, y: point.y - 1 });
  }
  
  return points;
}