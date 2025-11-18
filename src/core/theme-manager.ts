import { App } from 'obsidian';
import { Theme } from '../types/interfaces';

/**
 * Discovers and manages installed Obsidian themes.
 */
export class ThemeManager {
  private app: App;
  private themes: Theme[] = [];

  constructor(app: App) {
    this.app = app;
  }

  async getAvailableThemes(): Promise<Theme[]> {
    if (this.themes.length > 0) return this.themes;

    try {
      this.themes = [
        { id: 'obsidian-default', name: 'Default', cssClass: 'theme-light', isLight: true, path: '' },
        { id: 'obsidian-dark', name: 'Dark', cssClass: 'theme-dark', isLight: false, path: '' }
      ];

      const themeDir = '.obsidian/themes/';
      const themeFiles = await this.app.vault.adapter.list(themeDir);

      if (themeFiles && themeFiles.folders) {
        for (const themeFolder of themeFiles.folders) {
          try {
            const themePath = `${themeFolder}/theme.css`;
            if (await this.app.vault.adapter.exists(themePath)) {
              const cssContent = await this.app.vault.adapter.read(themePath);
              const folderName = themeFolder.replace(themeDir, '');
              const theme = this.parseThemeMetadata(folderName, cssContent, themePath);
              if (theme) this.themes.push(theme);
            }
          } catch (error) {
            console.warn(`VersaPrint: Could not read theme at ${themeFolder}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('VersaPrint: Error scanning themes:', error);
    }

    return this.themes;
  }

  private parseThemeMetadata(folderName: string, cssContent: string, path: string): Theme | null {
    try {
      const nameMatch = cssContent.match(/\/\*[\s\S]*?name:\s*(.+?)[\s\S]*?\*\//i);
      const name = nameMatch ? nameMatch[1].trim() : folderName;
      const isLight = !cssContent.includes('.theme-dark') || cssContent.includes('.theme-light');
      const cssClass = isLight ? 'theme-light' : 'theme-dark';

      return { id: folderName, name, cssClass, isLight, path };
    } catch (error) {
      console.warn(`VersaPrint: Error parsing theme metadata for ${folderName}:`, error);
      return null;
    }
  }

  getCurrentTheme(): { classes: string[], themeId: string } {
    const body = document.body;
    const classes = Array.from(body.classList);
    const themeId = body.getAttribute('data-obsidian-theme') || (classes.includes('theme-dark') ? 'obsidian-dark' : 'obsidian-default');
    return { classes, themeId };
  }

  applyTemporaryTheme(targetThemeId: string): () => void {
    const body = document.body;
    const originalClasses = Array.from(body.classList);
    const originalDataTheme = body.getAttribute('data-obsidian-theme');

    // Remove all theme-related classes
    originalClasses.forEach(cls => {
      if (cls.startsWith('theme-')) {
        body.classList.remove(cls);
      }
    });

    const targetTheme = this.themes.find(t => t.id === targetThemeId);
    if (!targetTheme) {
      throw new Error(`Theme not found: ${targetThemeId}`);
    }

    // Apply new theme
    body.classList.add(targetTheme.isLight ? 'theme-light' : 'theme-dark');
    body.setAttribute('data-obsidian-theme', targetTheme.id);
    // This is a bit of a hack to force Obsidian to re-evaluate styles
    this.app.workspace.trigger('css-change');

    return () => {
      // Restore original state
      body.removeAttribute('data-obsidian-theme');
      body.classList.remove('theme-light', 'theme-dark');
      if(originalDataTheme) body.setAttribute('data-obsidian-theme', originalDataTheme);
      originalClasses.forEach(cls => body.classList.add(cls));
      this.app.workspace.trigger('css-change');
    };
  }
}
