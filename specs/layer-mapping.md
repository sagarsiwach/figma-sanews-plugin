# Layer Mapping Specification

## SA News Article Frame Structure

Based on screenshot analysis:

```
Frame 240 (Article Container)
├── Frame 19
│   └── Headline              → OVERLINE ("WEATHER | CLIMATE")
├── Frame 171
│   ├── #Title                → Main Title
│   └── #Subtitle             → Subtitle
├── Frame 226
│   └── Frame 228
│       └── Container
│           └── Frame 15
│               ├── Source    → "SA News - Delhi"
│               └── URL       → "www.sanews.in"
│           └── URL           → (duplicate?)
│       └── Frame 234
│           └── Title         → Dateline?
│   ├── Title                 → Column 1 body text
│   ├── Title                 → Column 2 body text
│   └── Title                 → Column 3 body text
```

## Layer Detection Strategy

Since multiple layers share the same name ("Title"), use position-based detection:

```typescript
interface ArticleLayout {
  headline: TextNode;       // Name: "Headline"
  title: TextNode;          // Name: "#Title"
  subtitle: TextNode;       // Name: "#Subtitle"
  source: TextNode;         // Name: "Source"
  url: TextNode;            // Name: "URL" (first occurrence)
  columns: TextNode[];      // Name: "Title" (sorted by x position)
}

function detectLayout(frame: FrameNode): ArticleLayout {
  const allTextNodes: TextNode[] = [];

  // Collect all text nodes
  function traverse(node: BaseNode) {
    if (node.type === 'TEXT') {
      allTextNodes.push(node);
    }
    if ('children' in node) {
      node.children.forEach(traverse);
    }
  }
  traverse(frame);

  // Find by name
  const headline = allTextNodes.find(n => n.name === 'Headline');
  const title = allTextNodes.find(n => n.name === '#Title');
  const subtitle = allTextNodes.find(n => n.name === '#Subtitle');
  const source = allTextNodes.find(n => n.name === 'Source');
  const url = allTextNodes.find(n => n.name === 'URL');

  // Find columns (multiple nodes named "Title", sorted by x position)
  const columns = allTextNodes
    .filter(n => n.name === 'Title' && n !== title)
    .sort((a, b) => a.absoluteBoundingBox!.x - b.absoluteBoundingBox!.x);

  return { headline, title, subtitle, source, url, columns };
}
```

## Column Identification

Columns are identified by:
1. Layer name is "Title" (excluding the main #Title)
2. Sorted left-to-right by x position
3. Similar y position (same row)
4. Similar height (same column template)

```typescript
function identifyColumns(textNodes: TextNode[]): TextNode[] {
  const titleNodes = textNodes.filter(n => n.name === 'Title');

  // Group by approximate y position (within 10px)
  const rows = new Map<number, TextNode[]>();

  titleNodes.forEach(node => {
    const y = Math.round(node.absoluteBoundingBox!.y / 10) * 10;
    if (!rows.has(y)) rows.set(y, []);
    rows.get(y)!.push(node);
  });

  // Find the row with most columns (likely the body text row)
  let bodyRow: TextNode[] = [];
  rows.forEach(nodes => {
    if (nodes.length > bodyRow.length) {
      bodyRow = nodes;
    }
  });

  // Sort by x position (left to right)
  return bodyRow.sort((a, b) =>
    a.absoluteBoundingBox!.x - b.absoluteBoundingBox!.x
  );
}
```

## Validation

Before filling, validate that:

```typescript
function validateLayout(layout: ArticleLayout): string[] {
  const errors: string[] = [];

  if (!layout.headline) errors.push('Missing "Headline" layer');
  if (!layout.title) errors.push('Missing "#Title" layer');
  if (!layout.subtitle) errors.push('Missing "#Subtitle" layer');
  if (!layout.source) errors.push('Missing "Source" layer');
  if (layout.columns.length < 1) errors.push('No body columns detected');
  if (layout.columns.length > 5) errors.push('Too many columns detected (max 5)');

  return errors;
}
```

## Future Enhancement: Custom Layer Names

Allow users to configure layer name mappings:

```typescript
interface LayerMapping {
  headline: string;    // default: "Headline"
  title: string;       // default: "#Title"
  subtitle: string;    // default: "#Subtitle"
  source: string;      // default: "Source"
  url: string;         // default: "URL"
  columnPattern: string; // default: "Title"
}
```

Store in plugin settings for persistence across sessions.
