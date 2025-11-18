import { App, Notice } from 'obsidian';
import { ExportProfile, ExportResult } from '../types/interfaces';
import { ThemeManager } from './theme-manager';
import { CSSProcessor } from '../utils/css-processor';
import { HTMLGenerator } from '../utils/html-generator';
import { generateOutputPath, getArxivCSS } from '../utils/file-utils';

/**
 * The core engine for handling PDF and HTML exports.
 */
export class ExportEngine {
  private app: App;
  private themeManager: ThemeManager;

  constructor(app: App) {
    this.app = app;
    this.themeManager = new ThemeManager(app);
  }

  async exportToPDF(profile: ExportProfile): Promise<ExportResult> {
    let cleanup: (() => void)[] = [];

    try {
      if (!this.validateProfile(profile)) {
        throw new Error('Invalid export profile configuration');
      }

      new Notice('VersaPrint: Preparing PDF export...');

      // Apply theme styles
      if (profile.useArxivStyle) {
        const styleEl = document.createElement('style');
        styleEl.id = 'versaprint-arxiv-styles';
        styleEl.textContent = getArxivCSS();
        document.head.appendChild(styleEl);
        cleanup.push(() => styleEl.remove());
      } else if (profile.targetTheme) {
        const currentTheme = this.themeManager.getCurrentTheme();
        if (currentTheme.themeId !== profile.targetTheme) {
          cleanup.push(this.themeManager.applyTemporaryTheme(profile.targetTheme));
        }
      }

      // Inject dynamic CSS for padding, scaling, etc.
      const cssProcessor = new CSSProcessor(this.app, profile);
      cleanup.push(await cssProcessor.injectStyles());

      await this.delay(150); // Delay to ensure DOM updates are processed
      window.print();
      new Notice('VersaPrint: PDF export dialog opened');

      return { success: true, format: 'pdf' };

    } catch (error) {
      console.error('VersaPrint: Export failed:', error);
      new Notice(`VersaPrint: Export failed - ${error.message}`);
      return { success: false, error: error.message, format: 'pdf' };
    } finally {
      // Cleanup all temporary changes
      setTimeout(() => {
        cleanup.reverse().forEach(cleanupFn => {
          try {
            cleanupFn();
          } catch (error) {
            console.warn('VersaPrint: Cleanup error:', error);
          }
        });
      }, 250);
    }
  }

  async exportToHTML(profile: ExportProfile): Promise<ExportResult> {
    try {
      new Notice('VersaPrint: Generating HTML export...');
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) {
        throw new Error('No active note to export');
      }

      const content = await this.app.vault.read(activeFile);
      const generator = new HTMLGenerator(this.app, profile, content);
      const htmlContent = await generator.build();

      const outputPath = generateOutputPath(activeFile.basename, 'html');
      await this.app.vault.create(outputPath, htmlContent);

      new Notice(`VersaPrint: HTML exported to ${outputPath}`);
      return { success: true, filePath: outputPath, format: 'html' };

    } catch (error) {
      console.error('VersaPrint: HTML export failed:', error);
      new Notice(`VersaPrint: HTML export failed - ${error.message}`);
      return { success: false, error: error.message, format: 'html' };
    }
  }

  private validateProfile(profile: ExportProfile): boolean {
    if (!profile.name || !profile.outputFormat) return false;
    if (profile.outputFormat === 'pdf' && !profile.targetTheme && !profile.useArxivStyle) return false;
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
