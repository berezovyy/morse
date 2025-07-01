'use client';

interface ToolPanelProps {
  onClear: () => void;
  onFill: () => void;
  onInvert: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function ToolPanel({ onClear, onFill, onInvert, onUndo, onRedo, canUndo, canRedo }: ToolPanelProps) {
  const tools = [
    { 
      label: 'Clear', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="3" y="3" width="12" height="12" stroke="currentColor" strokeWidth="1.5" rx="3"/>
        </svg>
      ), 
      action: onClear, 
      description: 'Clear all pixels',
      shortcut: 'C',
      color: 'default'
    },
    { 
      label: 'Fill', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="3" y="3" width="12" height="12" fill="currentColor" rx="3"/>
        </svg>
      ), 
      action: onFill, 
      description: 'Fill all pixels',
      shortcut: 'F',
      color: 'primary'
    },
    { 
      label: 'Invert', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 3h6a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 3v12M9 3h3a3 3 0 013 3v6a3 3 0 01-3 3H9V3z" fill="currentColor"/>
        </svg>
      ), 
      action: onInvert, 
      description: 'Invert all pixels',
      shortcut: 'I',
      color: 'default'
    },
  ];

  return (
    <div className="bg-card/50 backdrop-blur rounded-xl border overflow-hidden">
      <div className="border-b bg-muted/30 px-4 py-2.5">
        <h3 className="font-semibold text-sm">Tools</h3>
      </div>
      
      <div className="p-3 space-y-3">
        {/* Undo/Redo buttons */}
        {(onUndo || onRedo) && (
          <div className="grid grid-cols-2 gap-2">
            {onUndo && (
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-background/50 border-border/50 hover:bg-accent hover:border-accent disabled:hover:bg-background/50 disabled:hover:border-border/50 group"
                title="Undo (Ctrl+Z)"
              >
                <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground transition-all duration-200 group-hover:bg-accent group-hover:text-accent-foreground group-disabled:hover:bg-muted/50 group-disabled:hover:text-muted-foreground">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 8h8a3 3 0 013 3v0a3 3 0 01-3 3H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 8l3-3M3 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">Undo</div>
                  <kbd className="mt-1 px-1.5 py-0.5 text-[10px] bg-muted/50 rounded font-mono text-muted-foreground">
                    Ctrl+Z
                  </kbd>
                </div>
              </button>
            )}
            {onRedo && (
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-background/50 border-border/50 hover:bg-accent hover:border-accent disabled:hover:bg-background/50 disabled:hover:border-border/50 group"
                title="Redo (Ctrl+Shift+Z)"
              >
                <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground transition-all duration-200 group-hover:bg-accent group-hover:text-accent-foreground group-disabled:hover:bg-muted/50 group-disabled:hover:text-muted-foreground">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15 8H7a3 3 0 00-3 3v0a3 3 0 003 3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 8l-3-3M15 8l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">Redo</div>
                  <kbd className="mt-1 px-1.5 py-0.5 text-[10px] bg-muted/50 rounded font-mono text-muted-foreground">
                    Ctrl+Y
                  </kbd>
                </div>
              </button>
            )}
          </div>
        )}
        
        {/* Main tools */}
        <div className="grid grid-cols-3 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.label}
            onClick={tool.action}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 group ${
              tool.color === 'primary'
                ? 'bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30'
                : 'bg-background/50 border-border/50 hover:bg-accent hover:border-accent'
            }`}
            title={tool.description}
          >
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              tool.color === 'primary'
                ? 'bg-primary/10 text-primary group-hover:bg-primary/20'
                : 'bg-muted/50 text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
            }`}>
              {tool.icon}
            </div>
            <div className="text-center">
              <div className="text-xs font-medium">{tool.label}</div>
              <kbd className="mt-1 px-1.5 py-0.5 text-[10px] bg-muted/50 rounded font-mono text-muted-foreground">
                {tool.shortcut}
              </kbd>
            </div>
          </button>
        ))}
        </div>
      </div>
      
      <div className="border-t bg-gradient-to-b from-muted/10 to-transparent px-3 py-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground">
              <rect x="2" y="6" width="12" height="8" stroke="currentColor" strokeWidth="1.5" rx="2"/>
              <path d="M5 4h1.5v2H5zM7.25 4h1.5v2h-1.5zM10 4h1.5v2H10z" fill="currentColor"/>
            </svg>
          </div>
          <h4 className="font-semibold text-sm">Shortcuts</h4>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-background/50 border border-border/30">
            <span className="text-sm flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground">
                <path d="M4 3v8l6-4-6-4z" fill="currentColor" />
              </svg>
              Play/Pause
            </span>
            <kbd className="px-2 py-1 bg-muted/50 rounded text-xs font-mono border border-border/50">Space</kbd>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-background/50 border border-border/30">
            <span className="text-sm flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground">
                <path d="M9 10L5 7l4-3M10 10L6 7l4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Navigate
            </span>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-muted/50 rounded text-xs font-mono border border-border/50">←</kbd>
              <kbd className="px-2 py-1 bg-muted/50 rounded text-xs font-mono border border-border/50">→</kbd>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-background/50 border border-border/30">
            <span className="text-sm flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground">
                <path d="M7 2L10 7L7 12M2 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Shift Pixels
            </span>
            <div className="flex gap-1 items-center">
              <kbd className="px-1.5 py-1 bg-muted/50 rounded text-xs font-mono border border-border/50">Alt</kbd>
              <span className="text-xs text-muted-foreground">+</span>
              <kbd className="px-1.5 py-1 bg-muted/50 rounded text-xs font-mono border border-border/50">↑↓←→</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}