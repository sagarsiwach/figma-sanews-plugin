# Figma API Patterns Specification

## Text Content Manipulation

### Setting Text Content
```typescript
// Requires font to be loaded first
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
textNode.characters = "New text content";
```

### Insert at Specific Position
```typescript
textNode.insertCharacters(start, "characters", useStyle?: 'BEFORE' | 'AFTER');
```

### Delete Characters
```typescript
textNode.deleteCharacters(start, end);
```

## Font Loading (REQUIRED)

Must load fonts before any text modification:

```typescript
// Load specific font
await figma.loadFontAsync({ family: "Inter", style: "Regular" });

// Load all fonts used in a text node
await Promise.all(
  node.getRangeAllFontNames(0, node.characters.length)
    .map(figma.loadFontAsync)
);
```

## Text Auto-Resize Modes

| Mode | Behavior |
|------|----------|
| `NONE` | Fixed dimensions, text may overflow |
| `HEIGHT` | Fixed width, height auto-adjusts to fit content |
| `WIDTH_AND_HEIGHT` | Both dimensions auto-adjust, no wrapping |
| `TRUNCATE` | Fixed size, truncates with ellipsis (deprecated) |

## Overflow Detection Strategy

Figma doesn't have direct "is text overflowing?" property.

**Solution: HEIGHT Auto-Resize Trick**

```typescript
async function detectOverflow(textNode: TextNode): Promise<number> {
  const originalHeight = textNode.height;
  const originalMode = textNode.textAutoResize;

  // Temporarily auto-resize to measure true height
  textNode.textAutoResize = 'HEIGHT';
  const trueHeight = textNode.height;

  // Restore original
  textNode.textAutoResize = originalMode;
  textNode.resize(textNode.width, originalHeight);

  // Return overflow amount (positive = overflow, negative = underflow)
  return trueHeight - originalHeight;
}
```

## Bounds Measurement

```typescript
// Get node dimensions
const bounds = node.absoluteBoundingBox;  // { x, y, width, height }
const renderBounds = node.absoluteRenderBounds;  // Includes shadows, strokes

// Resize node
node.resize(width, height);
node.resizeWithoutConstraints(width, height);
```

## Layer Traversal

```typescript
// Find text nodes by name
function findTextNodeByName(parent: BaseNode, name: string): TextNode | null {
  if (parent.type === 'TEXT' && parent.name === name) {
    return parent;
  }
  if ('children' in parent) {
    for (const child of parent.children) {
      const found = findTextNodeByName(child, name);
      if (found) return found;
    }
  }
  return null;
}
```

## Plugin UI Communication

```typescript
// In code.ts (main)
figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'fill-content') {
    // Handle fill request
  }
};

// Send message to UI
figma.ui.postMessage({ type: 'status', message: 'Processing...' });
```

```javascript
// In ui.html
parent.postMessage({ pluginMessage: { type: 'fill-content', data: {...} } }, '*');

onmessage = (event) => {
  const msg = event.data.pluginMessage;
  // Handle response
};
```

## Key Constraints

1. **Font Loading Required** - Must load fonts before modifying text
2. **Async Operations** - Most operations are async, use await
3. **Selection Scope** - Plugin operates on current selection or page
4. **Network Access** - Must declare domains in manifest.json
