# Plugin Overview Specification

## Purpose

A Figma plugin that automatically fills SA News newspaper article frames with content from markdown/JSON files, using Claude AI to dynamically adjust content length to fit column constraints perfectly.

## Core Problem

SA News newspaper is designed in Figma with:
- 3 unlinked text columns per article
- Unknown word capacity per column (depends on typography)
- Articles written at ~1000 words may not fit exactly
- Content gets abruptly cut if it doesn't fit

## Solution

Plugin that:
1. Reads article content from structured format (JSON/Markdown)
2. Maps content to Figma layer names
3. Fills text frames automatically
4. Detects overflow using HEIGHT auto-resize trick
5. Calls Claude API to intelligently condense/expand content
6. Iterates until perfect fit with natural ending

## User Flow

1. User selects an article frame in Figma (e.g., "Frame 240")
2. User opens plugin from Plugins menu
3. Plugin UI shows:
   - Detected layer structure
   - File picker for content source
   - "Fill Content" button
4. User selects markdown/JSON file
5. Plugin fills all fields automatically
6. If overflow detected, plugin calls Claude to adjust
7. User sees progress and final result

## Success Criteria

- [ ] Plugin loads in Figma without errors
- [ ] Correctly identifies text layers by name
- [ ] Fills headline, title, subtitle, source fields
- [ ] Fills body columns with article text
- [ ] Detects overflow accurately
- [ ] Successfully calls Claude API for adjustment
- [ ] Produces naturally-ending articles that fit exactly
- [ ] Handles Hindi text correctly
- [ ] Works with SA News template structure
