# Content Format Specification

## Article JSON Schema

```json
{
  "id": "edition-40-home-01",
  "section": "Homepage",
  "overline": "ECONOMY | UNION BUDGET",
  "title": "Nirmala Sitharaman Presents Historic Ninth Consecutive Union Budget",
  "subtitle": "Finance Minister sets record for most consecutive budgets...",
  "source": "SA News - Delhi",
  "url": "www.sanews.in",
  "dateline": "NEW DELHI, February 1 —",
  "body": "Full article text here...",
  "wordCount": 950
}
```

## Markdown Article Format

The plugin should also support reading from markdown files matching SA News format:

```markdown
# Home - 01 - Union Budget 2026

**Section:** Homepage
**Word Count:** 950

---

**OVERLINE**
ECONOMY | UNION BUDGET

**TITLE**
Nirmala Sitharaman Presents Historic Ninth Consecutive Union Budget

**SUBTITLE**
Finance Minister sets record for most consecutive budgets...

**DATELINE**
NEW DELHI, February 1 —

Full article body text here...

[Word Count: 950 words]
```

## Layer Name Mapping

| Content Field | Figma Layer Name | Notes |
|---------------|------------------|-------|
| overline | `Headline` | Category tags (e.g., "WEATHER \| CLIMATE") |
| title | `#Title` | Main headline |
| subtitle | `#Subtitle` | Extended summary |
| source | `Source` | Publication name |
| url | `URL` | Website URL |
| dateline | First text in body | City, Date format |
| body | `Title` (multiple) | Column text - need to identify which |

## Column Distribution

For 3-column articles:
- **Column 1**: First ~33% of body text
- **Column 2**: Middle ~33% of body text
- **Column 3**: Final ~33% of body text

Split should occur at paragraph boundaries when possible.

## Content Adjustment Requirements

When Claude adjusts content:

**For Condensing:**
- Preserve headline, title, subtitle, dateline (fixed elements)
- Only modify body text
- Maintain journalistic quality
- End with complete sentence
- Keep factual accuracy

**For Expanding:**
- Add relevant context or detail
- Maintain tone and style
- No fabricated facts
- Natural integration with existing text

## Special Characters

- Handle Hindi text (Devanagari script)
- Preserve quotation marks (both English and Hindi)
- Handle em-dashes, en-dashes correctly
- Preserve paragraph breaks
