import { App } from 'obsidian';
import { ExportProfile } from '../types/interfaces';

/**
 * Handles the dynamic creation and injection of CSS styles for an export operation.
 * Includes automatic dark-to-light theme conversion for professional printing.
 */
export class CSSProcessor {
  private app: App;
  private profile: ExportProfile;
  private injectedStyleIds: string[] = [];

  constructor(app: App, profile: ExportProfile) {
    this.app = app;
    this.profile = profile;
  }

  /**
   * Injects all necessary styles for the export and returns a cleanup function.
   * @returns A function that removes all injected styles.
   */
  async injectStyles(): Promise<() => void> {
    this.injectDarkToLightConversion();
    this.injectPagePadding();
    this.injectScalingStyles();
    this.injectTableOptimization();
    this.injectImageOptimization();
    await this.applySelectedSnippets();

    return () => this.cleanup();
  }

  /**
   * Removes all styles injected by this processor.
   */
  private cleanup(): void {
    this.injectedStyleIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    this.injectedStyleIds = [];
  }

  /**
   * Injects a style element with a given ID and content.
   * @param id The ID for the new style element.
   * @param cssContent The CSS rules to inject.
   */
  private injectStyleElement(id: string, cssContent: string): void {
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    if (!cssContent.trim()) return;

    const styleEl = document.createElement('style');
    styleEl.id = id;
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);
    this.injectedStyleIds.push(id);
  }

  /**
   * Converts dark mode themes to light/white backgrounds for professional printing.
   * This ensures PDFs always print with a clean white background and dark text.
   */
  private injectDarkToLightConversion(): void {
    const conversionCSS = `
      @media print {
        /* Force light background and dark text for all elements */
        body, .markdown-preview-view, .markdown-reading-view {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #000000 !important;
        }

        /* Convert dark backgrounds to white */
        * {
          background-color: transparent !important;
        }

        /* Ensure text is always dark/readable */
        p, li, span, div, h1, h2, h3, h4, h5, h6 {
          color: #000000 !important;
        }

        /* Handle code blocks - light gray background */
        pre, code {
          background-color: #f5f5f5 !important;
          color: #000000 !important;
          border: 1px solid #ddd !important;
        }

        /* Handle blockquotes */
        blockquote {
          background-color: #f9f9f9 !important;
          border-left-color: #ccc !important;
          color: #000000 !important;
        }

        /* Handle tables */
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

        /* Handle links - make them visible but not bright */
        a {
          color: #0066cc !important;
        }

        /* Remove any dark overlays or shadows */
        *::before, *::after {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      }
    `;
    this.injectStyleElement('versaprint-dark-to-light', conversionCSS);
  }

  private injectPagePadding(): void {
    const { top, right, bottom, left, unit } = this.profile.padding;
    if (top <= 0 && right <= 0 && bottom <= 0 && left <= 0) {
      return;
    }

    const pageCSS = `
      @page {
        margin-top: ${top}${unit};
        margin-right: ${right}${unit};
        margin-bottom: ${bottom}${unit};
        margin-left: ${left}${unit};
      }
    `;
    this.injectStyleElement('versaprint-page-padding', pageCSS);
  }

  private injectScalingStyles(): void {
    const tableScale = (this.profile.tableScale || 100) / 100;
    const chartScale = (this.profile.chartScale || 100) / 100;

    if (tableScale === 1 && chartScale === 1) {
      return;
    }

    const scalingCSS = `
      @media print {
        ${tableScale !== 1 ? `
        table {
          transform: scale(${tableScale});
          transform-origin: top left;
          width: ${100 / tableScale}%;
        }
        ` : ''}

        ${chartScale !== 1 ? `
        .mermaid svg {
          transform: scale(${chartScale});
          transform-origin: top left;
          width: ${100 / chartScale}%;
          height: ${100 / chartScale}%;
        }
        ` : ''}
      }
    `;
    this.injectStyleElement('versaprint-scaling-styles', scalingCSS);
  }

  /**
   * Injects CSS to ensure tables fit properly within page boundaries.
   * Prevents staggered/broken table layouts in PDFs.
   */
  private injectTableOptimization(): void {
    const tableCSS = `
      @media print {
        /* Ensure tables fit within page width */
        table {
          max-width: 100% !important;
          width: auto !important;
          table-layout: auto !important;
          border-collapse: collapse !important;
          page-break-inside: avoid !important;
        }

        /* Prevent table cells from breaking across pages */
        tr {
          page-break-inside: avoid !important;
        }

        /* Ensure table headers repeat on each page */
        thead {
          display: table-header-group !important;
        }

        /* Optimize table cell sizing */
        th, td {
          padding: 6px 8px !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          hyphens: auto !important;
          max-width: 200px !important;
        }

        /* Handle wide tables by allowing horizontal overflow with smaller font */
        table.wide-table {
          font-size: 0.85em !important;
        }
      }
    `;
    this.injectStyleElement('versaprint-table-optimization', tableCSS);
  }

  /**
   * Injects CSS to ensure images fit properly within page boundaries.
   * Prevents images from being cut off or extending beyond page margins.
   */
  private injectImageOptimization(): void {
    const imageCSS = `
      @media print {
        /* Ensure images fit within page width */
        img {
          max-width: 100% !important;
          height: auto !important;
          page-break-inside: avoid !important;
          display: block !important;
        }

        /* Handle image containers */
        .image-embed, .internal-embed {
          max-width: 100% !important;
          page-break-inside: avoid !important;
        }

        /* Prevent images from breaking across pages */
        figure {
          page-break-inside: avoid !important;
          margin: 0.5em 0 !important;
        }
      }
    `;
    this.injectStyleElement('versaprint-image-optimization', imageCSS);
  }

  private async applySelectedSnippets(): Promise<void> {
    if (!this.profile.enabledSnippets || this.profile.enabledSnippets.length === 0) {
      return;
    }

    let combinedCSS = '';
    for (const snippetName of this.profile.enabledSnippets) {
      try {
        const snippetPath = `.obsidian/snippets/${snippetName}`;
        if (await this.app.vault.adapter.exists(snippetPath)) {
          const cssContent = await this.app.vault.adapter.read(snippetPath);
          combinedCSS += `\n/* --- ${snippetName} --- */\n${cssContent}\n`;
        }
      } catch (error) {
        console.warn(`VersaPrint: Could not load snippet ${snippetName}:`, error);
      }
    }
    this.injectStyleElement('versaprint-custom-snippets', combinedCSS);
  }
}
