import { App, TFile, MarkdownRenderer } from 'obsidian';
import { ExportProfile } from '../types/interfaces';
import { getArxivCSS, getBaseObsidianCSS } from './file-utils';

/**
 * Generates a self-contained HTML document from a note's content and an export profile.
 * Includes table/image optimization for proper rendering.
 */
export class HTMLGenerator {
  constructor(private app: App, private profile: ExportProfile, private content: string) {}

  /**
   * Builds the complete HTML document as a string.
   */
  async build(): Promise<string> {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) throw new Error("No active file to generate HTML from.");

    const renderedContent = await this.renderMarkdown(activeFile.path);
    const optimizedContent = this.optimizeTablesAndImages(renderedContent);
    const inlinedCSS = await this.inlineAllCSS();
    const finalHTML = await this.embedImages(optimizedContent, activeFile.path);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${activeFile.basename}</title>
    <style>
${inlinedCSS}
    </style>
</head>
<body class="${this.getBodyClasses()}">
    <div class="markdown-reading-view">
        <div class="markdown-preview-view">
            ${finalHTML}
        </div>
    </div>
</body>
</html>`;
  }

  private async renderMarkdown(filePath: string): Promise<string> {
      const div = document.createElement('div');
      const file = this.app.workspace.getActiveFile();
      if (!file) throw new Error("No active file");

      // Use MarkdownRenderer for proper rendering
      const view = this.app.workspace.getActiveViewOfType(require('obsidian').MarkdownView);
      if (view) {
        await MarkdownRenderer.renderMarkdown(this.content, div, filePath, view);
      } else {
        // Fallback if no view available
        div.innerHTML = this.content;
      }
      return div.innerHTML;
  }

  private getBodyClasses(): string {
    if (this.profile.useArxivStyle) {
      return 'theme-light arxiv-style';
    }
    // Use the current theme's classes for HTML export
    return document.body.className;
  }

  /**
   * Optimizes tables and images for proper display in exported HTML/PDF.
   * Ensures tables fit within page boundaries and images are properly sized.
   */
  private optimizeTablesAndImages(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Optimize tables
    const tables = tempDiv.querySelectorAll('table');
    tables.forEach(table => {
      // Add class for styling
      table.classList.add('versaprint-table');

      // Check if table has many columns (wide table)
      const firstRow = table.querySelector('tr');
      if (firstRow && firstRow.children.length > 6) {
        table.classList.add('wide-table');
      }

      // Ensure table has proper structure
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');

      if (!thead && tbody) {
        // If first row looks like headers, wrap in thead
        const firstBodyRow = tbody.querySelector('tr');
        if (firstBodyRow && this.looksLikeHeader(firstBodyRow)) {
          const newThead = document.createElement('thead');
          newThead.appendChild(firstBodyRow);
          table.insertBefore(newThead, tbody);
        }
      }
    });

    // Optimize images
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      img.classList.add('versaprint-image');

      // Remove any inline width/height that might cause issues
      if (img.hasAttribute('width')) {
        const width = img.getAttribute('width');
        if (width && !width.endsWith('%')) {
          img.removeAttribute('width');
        }
      }

      // Wrap standalone images in figure for better control
      if (img.parentElement?.tagName !== 'FIGURE' && img.parentElement?.tagName !== 'A') {
        const figure = document.createElement('figure');
        img.parentNode?.insertBefore(figure, img);
        figure.appendChild(img);
      }
    });

    return tempDiv.innerHTML;
  }

  /**
   * Determines if a table row looks like a header row.
   */
  private looksLikeHeader(row: Element): boolean {
    const cells = row.querySelectorAll('th, td');
    // If all cells are th, it's definitely a header
    if (row.querySelectorAll('th').length === cells.length) {
      return true;
    }
    // Check if cells have bold content or typical header formatting
    let boldCount = 0;
    cells.forEach(cell => {
      const text = cell.textContent || '';
      if (cell.querySelector('strong, b') || text === text.toUpperCase()) {
        boldCount++;
      }
    });
    return boldCount / cells.length > 0.5;
  }

  private async inlineAllCSS(): Promise<string> {
    let css = '';

    // Base dark-to-light conversion for HTML exports
    css += this.getDarkToLightCSS();

    if (this.profile.useArxivStyle) {
      css += getArxivCSS();
    } else {
      // In a real scenario, getting full theme CSS is complex.
      // This uses a base CSS and assumes variables are set on the body.
      css += getBaseObsidianCSS();
    }

    // Add table and image optimization CSS
    css += this.getTableOptimizationCSS();
    css += this.getImageOptimizationCSS();

    for (const snippetName of this.profile.enabledSnippets) {
      try {
        const snippetPath = `.obsidian/snippets/${snippetName}`;
        if (await this.app.vault.adapter.exists(snippetPath)) {
          css += `\n/* --- ${snippetName} --- */\n${await this.app.vault.adapter.read(snippetPath)}\n`;
        }
      } catch (error) {
        console.warn(`VersaPrint: Could not inline snippet ${snippetName}:`, error);
      }
    }
    return css;
  }

  private getDarkToLightCSS(): string {
    return `
/* Dark to Light Conversion */
body, .markdown-preview-view, .markdown-reading-view {
  background: #ffffff !important;
  background-color: #ffffff !important;
  color: #000000 !important;
}

* {
  background-color: transparent !important;
}

p, li, span, div, h1, h2, h3, h4, h5, h6 {
  color: #000000 !important;
}

pre, code {
  background-color: #f5f5f5 !important;
  color: #000000 !important;
  border: 1px solid #ddd !important;
}

blockquote {
  background-color: #f9f9f9 !important;
  border-left-color: #ccc !important;
  color: #000000 !important;
}

table {
  background-color: #ffffff !important;
  border-color: #ddd !important;
}

th {
  background-color: #f0f0f0 !important;
  color: #000000 !important;
  border-color: #ddd !important;
}

td {
  background-color: #ffffff !important;
  color: #000000 !important;
  border-color: #ddd !important;
}

a {
  color: #0066cc !important;
}
`;
  }

  private getTableOptimizationCSS(): string {
    return `
/* Table Optimization */
table.versaprint-table {
  max-width: 100% !important;
  width: auto !important;
  table-layout: auto !important;
  border-collapse: collapse !important;
  margin: 1em 0 !important;
}

table.versaprint-table th,
table.versaprint-table td {
  padding: 8px 12px !important;
  border: 1px solid #ddd !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  hyphens: auto !important;
}

table.versaprint-table.wide-table {
  font-size: 0.85em !important;
}

table.versaprint-table thead {
  display: table-header-group !important;
}

table.versaprint-table th {
  font-weight: bold !important;
  background-color: #f0f0f0 !important;
}
`;
  }

  private getImageOptimizationCSS(): string {
    return `
/* Image Optimization */
img.versaprint-image {
  max-width: 100% !important;
  height: auto !important;
  display: block !important;
  margin: 0.5em 0 !important;
}

figure {
  margin: 1em 0 !important;
  max-width: 100% !important;
}

figure img {
  max-width: 100% !important;
  height: auto !important;
}
`;
  }

  private async embedImages(htmlContent: string, sourcePath: string): Promise<string> {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
    let modifiedHTML = htmlContent;
    const matches = Array.from(htmlContent.matchAll(imgRegex));

    for (const match of matches) {
      const imgSrc = match[1];
      if (imgSrc.startsWith('http') || imgSrc.startsWith('data:')) {
        continue;
      }

      try {
        const imageFile = this.app.metadataCache.getFirstLinkpathDest(decodeURIComponent(imgSrc), sourcePath);
        if (imageFile instanceof TFile) {
          const arrayBuffer = await this.app.vault.readBinary(imageFile);
          const base64 = this.arrayBufferToBase64(arrayBuffer);
          const mimeType = this.getMimeType(imageFile.extension);
          const dataURI = `data:${mimeType};base64,${base64}`;
          modifiedHTML = modifiedHTML.replace(imgSrc, dataURI);
        }
      } catch (error) {
        console.warn(`VersaPrint: Could not embed image ${imgSrc}:`, error);
      }
    }
    return modifiedHTML;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
      'gif': 'image/gif', 'svg': 'image/svg+xml', 'webp': 'image/webp'
    };
    return mimeTypes[extension.toLowerCase()] || 'image/png';
  }
}
