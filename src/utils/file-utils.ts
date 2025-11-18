/**
 * Generates a unique output path for an exported file.
 * @param baseName The base name of the original file.
 * @param extension The desired file extension (e.g., 'pdf', 'html').
 * @returns A unique filename string.
 */
export function generateOutputPath(baseName: string, extension: string): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `${baseName}_${timestamp}.${extension}`;
}

/**
 * Returns the CSS content for the bundled arXiv theme.
 * In a real plugin, this would be loaded from the styles/arxiv-theme.css file.
 * For build simplicity, it's embedded here.
 */
export function getArxivCSS(): string {
  return `
/* arXiv Academic Style */
body {
  font-family: 'Times New Roman', Times, serif;
  font-size: 10pt;
  line-height: 1.4;
  max-width: 6.5in;
  margin: 0 auto;
  padding: 1in;
  background: white;
  color: black;
}
h1, h2, h3, h4, h5, h6 {
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 0.5em;
}
h1 { font-size: 14pt; }
h2 { font-size: 12pt; }
h3 { font-size: 11pt; }
.markdown-preview-view { padding: 0; }
p { text-align: justify; margin-bottom: 0.5em; }
`;
}

/**
 * Returns a simplified base CSS for Obsidian.
 * This is a fallback for HTML exports.
 */
export function getBaseObsidianCSS(): string {
  return `
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-normal, #000);
  background-color: var(--background-primary, #fff);
}
.markdown-preview-view {
  padding: 2em;
}
`;
}
