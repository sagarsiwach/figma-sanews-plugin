0a. Study `specs/*` to learn the plugin specifications and requirements.
0b. Study @IMPLEMENTATION_PLAN.md (if present) to understand the plan so far.
0c. Study `src/*` to understand existing code structure.

1. Study @IMPLEMENTATION_PLAN.md (if present; it may be incorrect) and compare existing source code in `src/*` against `specs/*`. Create/update @IMPLEMENTATION_PLAN.md as a bullet point list sorted in priority of items yet to be implemented. Consider:
   - Missing functionality vs specs
   - TODO comments
   - Incomplete implementations
   - Error handling gaps
   - TypeScript errors

IMPORTANT: Plan only. Do NOT implement anything. Do NOT assume functionality is missing; confirm with code search first.

ULTIMATE GOAL: Build a working Figma plugin that:
1. Detects SA News article frame structure
2. Fills content from JSON/Markdown files
3. Detects text overflow using HEIGHT auto-resize trick
4. Calls Claude API to adjust content length
5. Iterates until content fits perfectly with natural ending
