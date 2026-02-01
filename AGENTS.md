# SA News Auto-Fill Plugin - Agent Instructions

## Build & Run

- Install: `npm install`
- Build: `npm run build`
- Watch: `npm run watch`
- Typecheck: `npx tsc --noEmit`

## Load in Figma

1. Open Figma Desktop
2. Go to Plugins → Development → Import plugin from manifest
3. Select `manifest.json` from this project
4. Plugin appears in Plugins menu

## Validation (Run After Every Change)

```bash
npx tsc --noEmit          # TypeScript check
npm run build             # Build plugin
```

## Stack

- **Platform:** Figma Plugin API
- **Language:** TypeScript (strict mode)
- **UI:** HTML + vanilla JavaScript
- **External API:** Claude (Anthropic) for content adjustment

## Code Patterns

### File Organization
- `src/code.ts` - Main plugin logic (runs in Figma sandbox)
- `src/ui.html` - Plugin UI (runs in iframe)
- `dist/` - Compiled output (gitignored)

### Key Functions
- `detectLayout()` - Find text nodes by layer name
- `detectOverflow()` - Use HEIGHT trick to measure overflow
- `fillContent()` - Set text in all fields
- `adjustWithClaude()` - Call Claude API for content fitting

### Figma API Patterns
- Always load fonts before modifying text
- Use `textAutoResize = 'HEIGHT'` trick for overflow detection
- Traverse nodes recursively to find by name
- Sort columns by x position for left-to-right order

## Testing

1. Open a SA News article frame in Figma
2. Select the article frame
3. Run plugin from Plugins menu
4. Load a test article JSON/Markdown
5. Verify all fields populate correctly
6. Check overflow detection works
7. Test Claude integration (requires API key)

## Key Constraints

- MUST load fonts before setting text
- MUST restore original textAutoResize after measuring
- MUST handle network errors gracefully
- MUST store API key securely in clientStorage
- NEVER expose API key in logs or UI
