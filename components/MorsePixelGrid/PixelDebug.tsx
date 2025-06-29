import React from 'react';

export const PixelDebug: React.FC<{
  active: boolean;
  row: number;
  col: number;
  color?: string;
  size?: string;
}> = ({ active, row, col, color, size = "md" }) => {
  const sizeMap = {
    xs: '4px',
    sm: '6px', 
    md: '8px',
    lg: '12px',
    xl: '16px'
  };
  
  const pixelSize = sizeMap[size as keyof typeof sizeMap] || '8px';
  const bgColor = active ? (color || 'black') : '#e5e5e5';
  
  return (
    <div
      style={{
        width: pixelSize,
        height: pixelSize,
        backgroundColor: bgColor,
        borderRadius: '2px',
        display: 'block'
      }}
      title={`Pixel ${row},${col} - ${active ? 'active' : 'inactive'}`}
    />
  );
};