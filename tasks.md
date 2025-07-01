Frame Reordering
**Problem**: Can't reorganize frames after creation
**Solution**:
- Implement drag-and-drop in timeline
- Add visual indicators during drag
- Support keyboard shortcuts (Ctrl+Left/Right)
- Maintain frame selection after reorder
**Impact**: Critical for animation workflow


#### 6. Drawing Tools
**Problem**: Only pixel-by-pixel drawing available
**Solution**:
- **Line Tool**: Click and drag to draw straight lines
- **Rectangle Tool**: Draw filled/outline rectangles
- **Circle Tool**: Draw filled/outline circles
- **Flood Fill**: Fill connected areas with one click
**Implementation**: Add tool selector in ToolPanel with visual icons
**Impact**: Faster pattern creation, especially for geometric shapes

#### 7. Copy/Paste Between Frames
**Problem**: No way to reuse patterns between frames
**Solution**:
- Add copy/paste buttons to frame actions
- Support Ctrl+C/V when frame is selected
- Visual indicator for copied frame
- Paste as new frame or replace current
**Impact**: Speeds up animation creation significantly

#### 8. Ability to configure the canvas:
**Problem**: The canvas is fixed at 5x5
**Solution**:
- Add options to configure the canvas size
- Add options to configure the canvas space between dots
- Add options to configure the canvas size in px
- Add options to configure the canvas size in dots
