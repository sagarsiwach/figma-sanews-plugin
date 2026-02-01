# SA News Auto-Fill Plugin

Figma plugin for automatically filling SA News newspaper article layouts with content, with Claude API integration for dynamic content adjustment.

## Features

- **Layout Detection** - Automatically detects article structure (headline, title, subtitle, columns)
- **Content Filling** - Fills all text fields from JSON/form input
- **Overflow Detection** - Uses Figma's HEIGHT auto-resize trick to detect text overflow
- **Claude Integration** - Adjusts content length using Claude API until it fits perfectly

## Installation

```bash
npm install
npm run build
```

## Load in Figma

1. Open Figma Desktop
2. Go to Plugins → Development → Import plugin from manifest
3. Select `manifest.json` from this project

## Usage

1. Select an article frame in Figma
2. Click "Detect Layout" to identify text fields
3. Enter article content (or paste JSON)
4. Click "Fill Content" to populate fields
5. If content overflows, click "Auto-Fit with Claude" to adjust

## Layer Naming Convention

The plugin looks for these layer names:
- `Headline` - Overline/category text
- `#Title` - Main article title
- `#Subtitle` - Article subtitle/summary
- `Source` - Publication source
- `URL` - Article URL
- `Title` (multiple) - Body text columns (sorted left-to-right by x position)

## Development

```bash
npm run watch    # Watch mode
npm run build    # Production build
npx tsc --noEmit # Type check
```

## Ralph Loop

This project uses Ralph Loop for autonomous AI development:

```bash
./loop.sh plan   # Planning mode
./loop.sh        # Build mode
./loop.sh 5      # Build mode with max 5 iterations
```

## Architecture

- `src/code.ts` - Main plugin logic (Figma sandbox)
- `src/ui.html` - Plugin UI (iframe)
- `specs/` - Specifications and documentation
- `AGENTS.md` - AI agent instructions
- `PROMPT_*.md` - Ralph loop prompts
