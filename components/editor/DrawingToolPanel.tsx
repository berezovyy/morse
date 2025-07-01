'use client';

import type { ToolType } from '@/lib/editor/tools';

interface DrawingToolPanelProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  fillMode: boolean;
  onFillModeChange: (filled: boolean) => void;
}

export function DrawingToolPanel({ 
  selectedTool, 
  onToolSelect, 
  fillMode,
  onFillModeChange 
}: DrawingToolPanelProps) {
  const tools = [
    {
      id: 'pencil' as ToolType,
      name: 'Pencil',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M13.5 2.5l2 2L6 14l-3 1 1-3 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      shortcut: 'P'
    },
    {
      id: 'eraser' as ToolType,
      name: 'Eraser',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M8.5 13.5L13 9l-4-4L4.5 9.5a1.414 1.414 0 000 2l2 2a1.414 1.414 0 002 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 11l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M13 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      shortcut: 'E'
    },
    {
      id: 'line' as ToolType,
      name: 'Line',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 15L15 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="3" cy="15" r="1" fill="currentColor"/>
          <circle cx="15" cy="3" r="1" fill="currentColor"/>
        </svg>
      ),
      shortcut: 'L'
    },
    {
      id: 'rectangle' as ToolType,
      name: 'Rectangle',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="3" y="5" width="12" height="8" stroke="currentColor" strokeWidth="1.5" rx="1"/>
        </svg>
      ),
      shortcut: 'R'
    },
    {
      id: 'circle' as ToolType,
      name: 'Circle',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      shortcut: 'O'
    },
    {
      id: 'fill' as ToolType,
      name: 'Fill',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2l6 6-7 7a1.414 1.414 0 01-2 0l-3-3a1.414 1.414 0 010-2l6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 2l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M13 11l2 2 1 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      shortcut: 'B'
    }
  ];

  const shapeModeTools = ['rectangle', 'circle'];

  return (
    <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
      <div className="border-b bg-muted/30 px-4 py-2.5">
        <h3 className="font-semibold text-sm">Drawing Tools</h3>
      </div>
      
      <div className="p-3 space-y-3">
        {/* Tool Grid */}
        <div className="grid grid-cols-3 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 group ${
                selectedTool === tool.id
                  ? 'bg-primary/10 border-primary/30 shadow-sm'
                  : 'bg-background/50 border-border/50 hover:bg-accent hover:border-accent'
              }`}
              title={`${tool.name} (${tool.shortcut})`}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                selectedTool === tool.id
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted/50 text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
              }`}>
                {tool.icon}
              </div>
              <div className="text-center">
                <div className="text-xs font-medium">{tool.name}</div>
                <kbd className="mt-1 px-1.5 py-0.5 text-[10px] bg-muted/50 rounded font-mono text-muted-foreground">
                  {tool.shortcut}
                </kbd>
              </div>
            </button>
          ))}
        </div>

        {/* Shape Mode Toggle */}
        {shapeModeTools.includes(selectedTool) && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-muted-foreground">Shape Mode</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onFillModeChange(false)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                  !fillMode
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-background/50 border-border/50 hover:bg-accent hover:border-accent'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" rx="1" fill="none"/>
                </svg>
                <span className="text-xs font-medium">Outline</span>
              </button>
              <button
                onClick={() => onFillModeChange(true)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                  fillMode
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-background/50 border-border/50 hover:bg-accent hover:border-accent'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="3" width="10" height="10" fill="currentColor" rx="1"/>
                </svg>
                <span className="text-xs font-medium">Filled</span>
              </button>
            </div>
          </div>
        )}

        {/* Tool Tips */}
        <div className="border-t pt-3">
          <div className="space-y-1.5 text-xs text-muted-foreground">
            {selectedTool === 'pencil' && (
              <p>Click and drag to draw pixels</p>
            )}
            {selectedTool === 'eraser' && (
              <p>Click and drag to erase pixels</p>
            )}
            {selectedTool === 'line' && (
              <p>Click and drag to draw a line</p>
            )}
            {selectedTool === 'rectangle' && (
              <p>Click and drag to draw a rectangle</p>
            )}
            {selectedTool === 'circle' && (
              <p>Click and drag to draw a circle</p>
            )}
            {selectedTool === 'fill' && (
              <p>Click to fill connected pixels</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}