// SA News Auto-Fill Plugin - Main Code
// This file runs in Figma's plugin sandbox

// Show the plugin UI
figma.showUI(__html__, { width: 450, height: 600 });

// Types
interface ArticleContent {
  overline: string;
  title: string;
  subtitle: string;
  source: string;
  url: string;
  dateline: string;
  body: string;
}

interface ArticleLayout {
  headline: TextNode | null;
  title: TextNode | null;
  subtitle: TextNode | null;
  source: TextNode | null;
  url: TextNode | null;
  columns: TextNode[];
}

// Find all text nodes in a frame
function collectTextNodes(node: BaseNode): TextNode[] {
  const textNodes: TextNode[] = [];

  function traverse(n: BaseNode) {
    if (n.type === 'TEXT') {
      textNodes.push(n);
    }
    if ('children' in n) {
      for (const child of n.children) {
        traverse(child);
      }
    }
  }

  traverse(node);
  return textNodes;
}

// Detect article layout from selected frame
function detectLayout(frame: FrameNode): ArticleLayout {
  const textNodes = collectTextNodes(frame);

  const layout: ArticleLayout = {
    headline: textNodes.find(n => n.name === 'Headline') || null,
    title: textNodes.find(n => n.name === '#Title') || null,
    subtitle: textNodes.find(n => n.name === '#Subtitle') || null,
    source: textNodes.find(n => n.name === 'Source') || null,
    url: textNodes.find(n => n.name === 'URL') || null,
    columns: []
  };

  // Find body columns (nodes named "Title" that aren't the main title)
  const columnCandidates = textNodes
    .filter(n => n.name === 'Title' && n !== layout.title)
    .filter(n => n.absoluteBoundingBox !== null);

  // Sort by x position (left to right)
  layout.columns = columnCandidates.sort((a, b) => {
    const aX = a.absoluteBoundingBox?.x ?? 0;
    const bX = b.absoluteBoundingBox?.x ?? 0;
    return aX - bX;
  });

  return layout;
}

// Detect text overflow using HEIGHT auto-resize trick
async function detectOverflow(textNode: TextNode): Promise<number> {
  // Load fonts first
  await Promise.all(
    textNode.getRangeAllFontNames(0, textNode.characters.length)
      .map(figma.loadFontAsync)
  );

  const originalHeight = textNode.height;
  const originalMode = textNode.textAutoResize;

  // Temporarily auto-resize to measure true height
  textNode.textAutoResize = 'HEIGHT';
  const trueHeight = textNode.height;

  // Restore original settings
  textNode.textAutoResize = originalMode;
  textNode.resize(textNode.width, originalHeight);

  // Return overflow (positive = overflow, negative = underflow)
  return trueHeight - originalHeight;
}

// Load fonts for a text node
async function loadFontsForNode(textNode: TextNode): Promise<void> {
  const fonts = textNode.getRangeAllFontNames(0, textNode.characters.length);
  await Promise.all(fonts.map(figma.loadFontAsync));
}

// Set text content safely (with font loading)
async function setTextContent(textNode: TextNode, content: string): Promise<void> {
  await loadFontsForNode(textNode);
  textNode.characters = content;
}

// Handle messages from UI
figma.ui.onmessage = async (msg: { type: string; data?: any }) => {
  try {
    if (msg.type === 'detect-layout') {
      const selection = figma.currentPage.selection;

      if (selection.length !== 1) {
        figma.ui.postMessage({
          type: 'error',
          message: 'Please select exactly one article frame'
        });
        return;
      }

      const frame = selection[0];
      if (frame.type !== 'FRAME') {
        figma.ui.postMessage({
          type: 'error',
          message: 'Selected element must be a frame'
        });
        return;
      }

      const layout = detectLayout(frame);

      figma.ui.postMessage({
        type: 'layout-detected',
        data: {
          hasHeadline: !!layout.headline,
          hasTitle: !!layout.title,
          hasSubtitle: !!layout.subtitle,
          hasSource: !!layout.source,
          hasUrl: !!layout.url,
          columnCount: layout.columns.length
        }
      });
    }

    if (msg.type === 'fill-content') {
      const content: ArticleContent = msg.data;
      const selection = figma.currentPage.selection;

      if (selection.length !== 1 || selection[0].type !== 'FRAME') {
        figma.ui.postMessage({
          type: 'error',
          message: 'Please select an article frame first'
        });
        return;
      }

      const layout = detectLayout(selection[0] as FrameNode);

      // Fill each field
      if (layout.headline && content.overline) {
        await setTextContent(layout.headline, content.overline);
      }
      if (layout.title && content.title) {
        await setTextContent(layout.title, content.title);
      }
      if (layout.subtitle && content.subtitle) {
        await setTextContent(layout.subtitle, content.subtitle);
      }
      if (layout.source && content.source) {
        await setTextContent(layout.source, content.source);
      }
      if (layout.url && content.url) {
        await setTextContent(layout.url, content.url);
      }

      // Split body content across columns
      if (layout.columns.length > 0 && content.body) {
        const bodyWithDateline = content.dateline + '\n\n' + content.body;
        const paragraphs = bodyWithDateline.split('\n\n');
        const columnsCount = layout.columns.length;
        const paragraphsPerColumn = Math.ceil(paragraphs.length / columnsCount);

        for (let i = 0; i < layout.columns.length; i++) {
          const start = i * paragraphsPerColumn;
          const end = Math.min(start + paragraphsPerColumn, paragraphs.length);
          const columnText = paragraphs.slice(start, end).join('\n\n');
          await setTextContent(layout.columns[i], columnText);
        }

        // Check for overflow in last column
        const lastColumn = layout.columns[layout.columns.length - 1];
        const overflow = await detectOverflow(lastColumn);

        figma.ui.postMessage({
          type: 'fill-complete',
          data: {
            overflow: overflow,
            needsAdjustment: overflow > 5
          }
        });
      } else {
        figma.ui.postMessage({
          type: 'fill-complete',
          data: { overflow: 0, needsAdjustment: false }
        });
      }
    }

    if (msg.type === 'close') {
      figma.closePlugin();
    }

  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
