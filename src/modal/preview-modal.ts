import { App, Modal, MarkdownRenderer } from 'obsidian';
import { ExportProfile } from '../types/interfaces';
import { getArxivCSS, getBaseObsidianCSS } from '../utils/file-utils';

/**
 * Preview modal that shows how the document will look when exported.
 * Provides a live preview with the selected theme and settings applied.
 */
export class PreviewModal extends Modal {
  private profile: ExportProfile;
  private content: string;
  private previewContainer: HTMLElement;

  constructor(app: App, profile: ExportProfile, content: string) {
    super(app);
    this.profile = profile;
    this.content = content;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('versaprint-preview-modal');

    // Create header
    const header = contentEl.createDiv('versaprint-preview-header');
    header.createEl('h2', { text: 'Export Preview' });

    const closeBtn = header.createEl('button', { text: 'Close' });
    closeBtn.addEventListener('click', () => this.close());

    // Create preview container
    this.previewContainer = contentEl.createDiv('versaprint-preview-container');
    this.previewContainer.addClass('markdown-reading-view');

    // Apply styles
    await this.applyPreviewStyles();

    // Render content
    await this.renderPreview();
  }

  private async applyPreviewStyles() {
    // Inject preview-specific CSS
    const styleId = 'versaprint-preview-styles';
    let existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();

    const styleEl = document.createElement('style');
    styleEl.id = styleId;

    let css = `
      .versaprint-preview-modal .modal {
        width: 90vw !important;
        max-width: 1200px !important;
        height: 90vh !important;
      }

      .versaprint-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1em;
        border-bottom: 1px solid var(--background-modifier-border);
        margin-bottom: 1em;
      }

      .versaprint-preview-container {
        height: calc(90vh - 100px);
        overflow-y: auto;
        padding: 2em;
        background: white;
        color: black;
        border: 1px solid #ddd;
      }

      /* Dark to light conversion for preview */
      .versaprint-preview-container * {
        background-color: transparent !important;
      }

      .versaprint-preview-container {
        background: #ffffff !important;
      }

      .versaprint-preview-container p,
      .versaprint-preview-container li,
      .versaprint-preview-container span,
      .versaprint-preview-container div,
      .versaprint-preview-container h1,
      .versaprint-preview-container h2,
      .versaprint-preview-container h3,
      .versaprint-preview-container h4,
      .versaprint-preview-container h5,
      .versaprint-preview-container h6 {
        color: #000000 !important;
      }

      .versaprint-preview-container pre,
      .versaprint-preview-container code {
        background-color: #f5f5f5 !important;
        color: #000000 !important;
        border: 1px solid #ddd !important;
      }

      .versaprint-preview-container table {
        background-color: #ffffff !important;
        border-color: #ddd !important;
        max-width: 100%;
        border-collapse: collapse;
      }

      .versaprint-preview-container th {
        background-color: #f0f0f0 !important;
        color: #000000 !important;
        border: 1px solid #ddd !important;
        padding: 8px;
      }

      .versaprint-preview-container td {
        background-color: #ffffff !important;
        color: #000000 !important;
        border: 1px solid #ddd !important;
        padding: 8px;
      }

      .versaprint-preview-container img {
        max-width: 100% !important;
        height: auto !important;
      }
    `;

    // Add theme-specific CSS
    if (this.profile.useArxivStyle) {
      css += getArxivCSS();
    } else {
      css += getBaseObsidianCSS();
    }

    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  private async renderPreview() {
    const previewDiv = this.previewContainer.createDiv('markdown-preview-view');

    // Render markdown content
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      const view = this.app.workspace.getActiveViewOfType(require('obsidian').MarkdownView);
      if (view) {
        await MarkdownRenderer.renderMarkdown(
          this.content,
          previewDiv,
          activeFile.path,
          view
        );
      } else {
        // Fallback if no view available
        previewDiv.innerHTML = this.content;
      }
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();

    // Remove preview styles
    const styleEl = document.getElementById('versaprint-preview-styles');
    if (styleEl) styleEl.remove();
  }
}
