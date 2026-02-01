# Claude Integration Specification

## Purpose

Use Claude API to dynamically adjust article content length to fit column constraints while maintaining natural endings and journalistic quality.

## API Configuration

```typescript
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
```

## Request Format

```typescript
interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
```

## Condensing Prompt Template

```
You are editing a newspaper article that is slightly too long to fit its layout.

ORIGINAL ARTICLE:
[Full article text]

CURRENT WORD COUNT: [X] words
TARGET WORD COUNT: [Y] words (reduce by [Z] words)

REQUIREMENTS:
1. Preserve the opening paragraph and dateline exactly
2. Maintain all key facts and quotes
3. End with a complete, natural-sounding sentence
4. Preserve journalistic tone and quality
5. The final paragraph must feel like a proper conclusion

Return ONLY the adjusted article text, no explanations.
```

## Expanding Prompt Template

```
You are editing a newspaper article that needs slightly more content to fill its layout.

ORIGINAL ARTICLE:
[Full article text]

CURRENT WORD COUNT: [X] words
TARGET WORD COUNT: [Y] words (add [Z] words)

REQUIREMENTS:
1. Preserve the opening paragraph and dateline exactly
2. Add relevant context or elaboration
3. Do not fabricate facts or quotes
4. Maintain journalistic tone and quality
5. New content should integrate naturally

Return ONLY the adjusted article text, no explanations.
```

## Iteration Loop

```typescript
async function adjustContent(
  originalContent: string,
  targetWordCount: number,
  maxIterations: number = 3
): Promise<string> {
  let content = originalContent;
  let iteration = 0;

  while (iteration < maxIterations) {
    const currentCount = countWords(content);
    const difference = currentCount - targetWordCount;

    // Within tolerance (±5 words)
    if (Math.abs(difference) <= 5) {
      return content;
    }

    if (difference > 0) {
      content = await condenseContent(content, targetWordCount);
    } else {
      content = await expandContent(content, targetWordCount);
    }

    iteration++;
  }

  return content; // Best effort after max iterations
}
```

## Error Handling

| Error | Action |
|-------|--------|
| API rate limit | Wait and retry (exponential backoff) |
| Network failure | Show error, allow manual retry |
| Invalid response | Use original content, warn user |
| Max iterations reached | Use best result, notify user |

## API Key Management

- Store API key in plugin settings (Figma clientStorage)
- Prompt user to enter key on first use
- Never log or expose API key
- Validate key format before requests

```typescript
// Store API key
await figma.clientStorage.setAsync('claude_api_key', apiKey);

// Retrieve API key
const apiKey = await figma.clientStorage.getAsync('claude_api_key');
```

## Word Count Estimation

```typescript
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Estimate words that fit in column based on overflow
function estimateWordCapacity(
  textNode: TextNode,
  overflow: number
): number {
  const currentWords = countWords(textNode.characters);
  const heightRatio = textNode.height / (textNode.height + overflow);
  return Math.floor(currentWords * heightRatio);
}
```
