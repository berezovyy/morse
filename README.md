# Morse

A modern React component library for animated pixel-based visualizations inspired by morse code patterns. Create engaging loading states, status indicators, and interactive animations with customizable dot patterns.

![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Motion](https://img.shields.io/badge/Motion-12.19.2-FF0066?style=flat-square&logo=framer)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🎯 **Pre-built Patterns** - Play, Loading, Syncing, Importing, Searching, and more
- 🎨 **Customizable Animations** - Multiple presets including fade, scale, wave, spiral, and ripple effects
- ⚡ **Optimized Performance** - Separate optimized component variants for performance-critical applications
- 🎮 **Interactive Mode** - Allow users to create custom patterns through interaction
- 🎭 **Animation Engine** - Frame-based system with configurable tempo and iterations
- 🔧 **Developer Friendly** - Full TypeScript support with comprehensive type definitions
- 🎪 **Component Variants** - Button, Grid, and Matrix Flow components for different use cases
- ✏️ **Pattern Editor** - Built-in visual editor with drawing tools, undo/redo, and frame management
- 📦 **Import/Export** - Share patterns as JSON or generate TypeScript code
- 👻 **Ghost Overlay** - Visualize previous frames while editing animations
- ⌨️ **Keyboard Shortcuts** - Efficient editing with keyboard controls (C, F, I, Ctrl+Z/Y)

## 📦 Installation


> **Note**: Package is currently in development and not yet published.

## 🚀 Quick Start

```tsx
import { MorsePixelGrid, MorseButton, MorseMatrixFlow } from 'morse'

// Basic pixel grid with loading pattern
<MorsePixelGrid
  pattern="loading"
  preset="wave"
  size={5}
  pixelSize={8}
  tempo={80}
/>

// Interactive button with morse animations
<MorseButton
  status="loading"
  variant="primary"
  size="medium"
>
  Click Me
</MorseButton>

// Sequential pattern animations
<MorseMatrixFlow
  sequence={['play', 'loading', 'success']}
  preset="fade"
  duration={1000}
/>
```

## 🎯 Components

### MorsePixelGrid

The core component for rendering animated pixel grids. Now supports 5x5 grids by default with enhanced performance optimizations.

```tsx
<MorsePixelGrid
  pattern="custom"           // Pattern type or custom array
  preset="scale"            // Animation preset
  size={5}                  // Grid size (NxN) - default 5x5
  pixelSize={12}            // Individual pixel size
  gap={2}                   // Gap between pixels
  tempo={100}               // Animation speed (ms)
  iterations={3}            // Number of loops
  interactive={true}        // Enable user interaction
  colors={{                 // Custom color scheme
    active: '#3B82F6',
    inactive: '#E5E7EB',
    highlight: '#60A5FA'
  }}
/>
```

### MorseButton

Button component with integrated morse animations.

```tsx
<MorseButton
  status="loading"          // idle | loading | success | error | disabled
  variant="primary"         // primary | secondary | ghost
  size="medium"             // small | medium | large
  pattern="syncing"         // Custom pattern override
  onClick={handleClick}
>
  Submit
</MorseButton>
```

### MorseMatrixFlow

Sequential pattern animations with smooth transitions.

```tsx
<MorseMatrixFlow
  sequence={[               // Array of patterns to cycle through
    'searching',
    'importing',
    'syncing'
  ]}
  labels={[                 // Optional labels for each pattern
    'Searching...',
    'Importing...',
    'Syncing...'
  ]}
  duration={1200}           // Duration per pattern (ms)
  preset="fade"             // Transition animation
/>
```

## 🎨 Patterns

### Built-in Patterns

- `play` - Play button icon
- `loading` - Loading spinner dots
- `syncing` - Synchronization pattern
- `importing` - Import/download indicator
- `searching` - Search animation
- `success` - Checkmark pattern
- `error` - X mark pattern
- `heart` - Heart shape

### Pattern Generators

```tsx
import { generators } from 'morse/patterns'

// Create a circle pattern
const circlePattern = generators.circle(7, 3)

// Create a wave pattern
const wavePattern = generators.wave(5, 2)

// Create a spiral pattern
const spiralPattern = generators.spiral(7)

// Use in component
<MorsePixelGrid pattern={circlePattern} />
```

### Custom Patterns

```tsx
// Define a custom 5x5 pattern
const customPattern = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0]
]

<MorsePixelGrid pattern={customPattern} />
```

## 🎭 Animation Presets

- `fade` - Smooth opacity transitions
- `scale` - Size scaling effects
- `wave` - Wave-like propagation
- `spiral` - Spiral activation pattern
- `ripple` - Ripple from center
- `random` - Random activation
- `linear` - Sequential left-to-right
- `radial` - Radial expansion

## 🎨 Pattern Editor

The built-in pattern editor provides a comprehensive visual interface for creating and editing morse patterns:

### Features

- **Drawing Tools** - Pencil (toggle), Fill, and Clear tools
- **Frame Management** - Add, duplicate, and delete frames
- **Timeline** - Visual timeline with adjustable frame duration
- **Undo/Redo** - Full history support (Ctrl+Z / Ctrl+Y)
- **Ghost Overlay** - See previous frame while editing
- **Import/Export** - Share patterns as JSON or TypeScript code
- **Pattern Library** - Quick access to preset patterns
- **Canvas Settings** - Adjustable grid size (3x3 to 9x9) and pixel spacing

### Keyboard Shortcuts

- `C` - Clear canvas
- `F` - Fill canvas
- `I` - Invert pattern
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Space` - Play/pause animation

### Using the Editor

```tsx
import { PatternEditor } from 'morse/components'

// Embed the pattern editor in your app
<PatternEditor />

// The editor now features:
// - Enhanced canvas with pixel shifting controls
// - Frame timeline with duration adjustment
// - Export modal with JSON and TypeScript code generation
// - Import functionality for existing patterns
```

### Project Structure

```
morse/
├── app/                    # Next.js app directory
│   ├── components/        # App-specific components
│   ├── page.tsx          # Landing page with pattern editor
│   └── constants.ts      # App configuration
├── components/            # React components
│   ├── MorsePixelGrid/   # Core pixel grid component
│   ├── MorseMatrixFlow/  # Pattern flow component
│   ├── MorseButton/      # Interactive button component
│   ├── PatternEditor.tsx # Main pattern editor component
│   └── editor/           # Editor sub-components
│       ├── EditorCanvas.tsx      # Drawing canvas
│       ├── EnhancedEditorCanvas.tsx # Enhanced canvas with tools
│       ├── FrameTimeline.tsx     # Frame management
│       ├── ToolPanel.tsx         # Tool selection
│       ├── DrawingToolPanel.tsx  # Drawing tools UI
│       ├── ExportModal.tsx       # Export functionality
│       ├── ImportModal.tsx       # Import functionality
│       └── PatternLibrary.tsx    # Preset patterns
├── lib/                   # Utilities and hooks
│   ├── patterns/         # Pattern generators and presets
│   ├── hooks/            # Custom React hooks
│   ├── editor/           # Editor utilities
│   │   └── tools.ts     # Drawing tool implementations
│   ├── utils/            # Helper functions
│   └── types.ts          # TypeScript definitions
└── public/
    └── r/                # Pattern registry JSON files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Note**: This project is currently in active development. APIs may change before the stable release.