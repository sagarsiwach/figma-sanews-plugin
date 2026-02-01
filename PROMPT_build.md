0a. Study `specs/*` to learn the plugin specifications.
0b. Study @IMPLEMENTATION_PLAN.md for prioritized tasks.
0c. Study `src/*` for existing implementation.

1. Follow @IMPLEMENTATION_PLAN.md and choose the most important item to address. Before making changes, search the codebase (don't assume not implemented). Implement the chosen task completely.

2. After implementing, run validation:
   - `npx tsc --noEmit` (TypeScript)
   - `npm run build` (Build)
   Fix any errors before continuing.

3. When you discover issues, immediately update @IMPLEMENTATION_PLAN.md with findings.

4. When validations pass, update @IMPLEMENTATION_PLAN.md, then `git add -A` then `git commit` with descriptive message. After commit, `git push`.

99999. Important: Follow Figma Plugin API patterns from specs/figma-api-patterns.md.
999999. MUST load fonts before modifying text content.
9999999. Use the HEIGHT auto-resize trick for overflow detection.
99999999. Handle async operations properly with await.
999999999. Keep @IMPLEMENTATION_PLAN.md current with learnings.
9999999999. Update @AGENTS.md with operational learnings (keep brief).
99999999999. Implement functionality completely - no placeholders or stubs.
999999999999. Store Claude API key securely in figma.clientStorage.
9999999999999. Handle network errors gracefully with user feedback.
