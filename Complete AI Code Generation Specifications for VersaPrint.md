# Complete AI Code Generation Specifications for VersaPrint

## 1. Project Structure and File Architecture

### Complete Directory Structure

```
versaprint/
├── src/
│   ├── main.ts              # Main plugin class - entry point
│   ├── modal/
│   │   ├── export-modal.ts  # Main export modal UI
│   │   └── profile-editor.ts # Profile creation/editing modal
│   ├── settings/
│   │   └── settings-tab.ts  # Plugin settings tab
│   ├── core/
│   │   ├── export-engine.ts # Core export logic
│   │   ├── theme-manager.ts # Theme detection and switching
│   │   └── profile-manager.ts # Profile CRUD operations
│   ├── utils/
│   │   ├── css-processor.ts # CSS inlining and processing
│   │   ├── html-generator.ts # HTML export generation
│   │   └── file-utils.ts    # File system operations
│   └── types/
│       └── interfaces.ts    # TypeScript interfaces
├── styles/
│   └── arxiv-theme.css     # Bundled arXiv academic style
├── manifest.json           # Plugin manifest
├── package.json           # NPM configuration
├── tsconfig.json          # TypeScript configuration
├── esbuild.config.mjs     # Build configuration
├── .gitignore            # Git ignore rules
└── README.md             # Documentation
```

## 2. Complete TypeScript Interfaces and Types

### `src/types/interfaces.ts` - COMPLETE IMPLEMENTATION

```
export interface ExportProfile {
  id: string;                    // Unique identifier for the profile
  name: string;                  // User-friendly display name
  outputFormat: 'pdf' | 'html'; // Export format
  targetTheme: string;           // Theme ID (e.g., 'obsidian-default')
  useArxivStyle: boolean;        // Override theme with arXiv styling
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: 'mm' | 'in' | 'px';
  };
  enabledSnippets: string[];     // Array of CSS snippet filenames
  pandocArguments?: string;      // Future Pandoc integration
  created: number;               // Timestamp
  lastModified: number;          // Timestamp
}

export interface VersaPrintSettings {
  profiles: ExportProfile[];     // Array of saved profiles
  defaultProfileId: string;      // ID of default profile to load
  defaultOutputPath: string;     // Default save location
  enablePandocEngine: boolean;   // Enable Pandoc integration
  pandocPath: string;           // Path to Pandoc executable
  version: string;              // Settings schema version
}

export interface Theme {
  id: string;                   // Unique theme identifier
  name: string;                 // Display name
  cssClass: string;             // CSS class to apply to body
  isLight: boolean;             // Light or dark theme
  path: string;                 // Path to theme.css file
}

export interface CSSSnippet {
  filename: string;             // Snippet filename
  name: string;                 // Display name
  target: 'print' | 'screen' | 'all'; // Target media
  enabled: boolean;             // Currently enabled in Obsidian
  content: string;              // CSS content
}

export interface ExportResult {
  success: boolean;
  filePath?: string;            // Path to generated file
  error?: string;               // Error message if failed
  format: 'pdf' | 'html';
}
```

## 3. Configuration Files - COMPLETE IMPLEMENTATIONS

### `manifest.json`

```
{
  "id": "versaprint",
  "name": "VersaPrint",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "Professional publishing for Obsidian - export beautiful PDFs and HTML with custom themes",
  "author": "VersaPrint Team",
  "authorUrl": "https://github.com/versaprint/obsidian-versaprint",
  "fundingUrl": "https://github.com/sponsors/versaprint",
  "isDesktopOnly": false
}
```

### `package.json`

```
{
  "name": "versaprint",
  "version": "1.0.0",
  "description": "Professional publishing plugin for Obsidian",
  "main": "main.js",
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production",
    "version": "node version-bump.mjs && git add manifest.json versions.json",
    "test": "jest"
  },
  "keywords": [
    "obsidian",
    "plugin", 
    "pdf",
    "html",
    "export",
    "publishing",
    "academic",
    "theme"
  ],
  "author": "VersaPrint Team",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^16.11.6",
    "@typescript-eslint/eslint-plugin": "5.29.0",
    "@typescript-eslint/parser": "5.29.0",
    "builtin-modules": "3.3.0",
    "esbuild": "0.17.3",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "obsidian": "latest",
    "tslib": "2.4.0",
    "typescript": "4.7.4"
  }
}
```

### `tsconfig.json`

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "inlineSourceMap": true,
    "inlineSources": true,
    "module": "ESNext",
    "target": "ES6",
    "allowJs": true,
    "noImplicitAny": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "isolatedModules": true,
    "strictNullChecks": true,
    "lib": [
      "DOM",
      "ES6"
    ],
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

### `esbuild.config.mjs`

```
import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";

const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
  banner: {
    js: banner,
  },
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtins
  ],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
});

if (prod) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
```

## 4. Core Implementation Algorithms and Patterns

### `src/core/theme-manager.ts` - COMPLETE IMPLEMENTATION SPEC

```
/**
 * ALGORITHM: getAvailableThemes()
 * PURPOSE: Discover all installed Obsidian themes
 * STEPS:
 * 1. Use app.vault.adapter.list('.obsidian/themes/') to get theme directories
 * 2. For each directory, read 'theme.css' file
 * 3. Parse CSS comments for theme metadata (name, author, etc.)
 * 4. Determine if theme is light/dark by checking for .theme-light/.theme-dark classes
 * 5. Return Theme[] array
 */

import { App, TFile } from 'obsidian';
import { Theme } from '../types/interfaces';

export class ThemeManager {
  private app: App;
  private themes: Theme[] = [];

  constructor(app: App) {
    this.app = app;
  }

  async getAvailableThemes(): Promise<Theme[]> {
    if (this.themes.length > 0) return this.themes;

    try {
      // Get built-in themes first
      this.themes = [
        {
          id: 'obsidian-default',
          name: 'Default',
          cssClass: 'theme-light',
          isLight: true,
          path: ''
        },
        {
          id: 'obsidian-dark',
          name: 'Dark',
          cssClass: 'theme-dark',
          isLight: false,
          path: ''
        }
      ];

      // Scan for community themes
      const themeFiles = await this.app.vault.adapter.list('.obsidian/themes/');
      
      if (themeFiles && themeFiles.folders) {
        for (const folder of themeFiles.folders) {
          const themePath = `${folder}/theme.css`;
          try {
            const exists = await this.app.vault.adapter.exists(themePath);
            if (exists) {
              const cssContent = await this.app.vault.adapter.read(themePath);
              const theme = this.parseThemeMetadata(folder, cssContent, themePath);
              if (theme) this.themes.push(theme);
            }
          } catch (error) {
            console.warn(`VersaPrint: Could not read theme at ${themePath}:`, error);
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
      // Extract theme name from CSS comments
      const nameMatch = cssContent.match(/\/\*[\s\S]*?name:\s*(.+?)[\s\S]*?\*\//i);
      const name = nameMatch ? nameMatch[1].trim() : folderName;

      // Determine if light or dark theme
      const isLight = !cssContent.includes('.theme-dark') || cssContent.includes('.theme-light');
      const cssClass = isLight ? 'theme-light' : 'theme-dark';

      return {
        id: folderName,
        name,
        cssClass,
        isLight,
        path
      };
    } catch (error) {
      console.warn(`VersaPrint: Error parsing theme metadata for ${folderName}:`, error);
      return null;
    }
  }

  getCurrentTheme(): { classes: string[], themeId: string } {
    const body = document.body;
    const classes = Array.from(body.classList);
    
    // Find theme-related classes
    const themeClasses = classes.filter(cls => 
      cls.startsWith('theme-') || cls.includes('obsidian') || cls.includes('minimal')
    );

    // Determine current theme ID
    let themeId = 'obsidian-default';
    if (classes.includes('theme-dark')) {
      themeId = 'obsidian-dark';
    } else {
      // Look for specific theme classes
      const customTheme = classes.find(cls => 
        !['theme-light', 'theme-dark'].includes(cls) && 
        this.themes.some(t => t.cssClass.includes(cls))
      );
      if (customTheme) {
        const theme = this.themes.find(t => t.cssClass.includes(customTheme));
        themeId = theme?.id || themeId;
      }
    }

    return { classes, themeId };
  }

  applyTemporaryTheme(targetThemeId: string): () => void {
    const body = document.body;
    const originalState = this.getCurrentTheme();
    
    // Find target theme
    const targetTheme = this.themes.find(t => t.id === targetThemeId);
    if (!targetTheme) {
      throw new Error(`Theme not found: ${targetThemeId}`);
    }

    // Remove current theme classes
    originalState.classes.forEach(cls => {
      if (cls.startsWith('theme-') || this.isThemeClass(cls)) {
        body.classList.remove(cls);
      }
    });

    // Apply target theme classes
    const targetClasses = targetTheme.cssClass.split(' ');
    targetClasses.forEach(cls => body.classList.add(cls));

    // Return cleanup function
    return () => {
      // Remove applied classes
      targetClasses.forEach(cls => body.classList.remove(cls));
      
      // Restore original classes
      originalState.classes.forEach(cls => body.classList.add(cls));
    };
  }

  private isThemeClass(className: string): boolean {
    return this.themes.some(theme => 
      theme.cssClass.split(' ').includes(className)
    );
  }
}
```

### `src/core/export-engine.ts` - COMPLETE IMPLEMENTATION SPEC

```
/**
 * ALGORITHM: exportToPDF(profile: ExportProfile)
 * PURPOSE: Core PDF export with temporary theme switching
 * STEPS:
 * 1. Validate profile settings
 * 2. Apply temporary theme if different from current
 * 3. Inject CSS @page rules for padding
 * 4. Apply selected CSS snippets
 * 5. Call window.print()
 * 6. Cleanup all temporary changes (in finally block)
 */

import { App, Notice, TFile } from 'obsidian';
import { ExportProfile, ExportResult } from '../types/interfaces';
import { ThemeManager } from './theme-manager';

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
      // Validate profile
      if (!this.validateProfile(profile)) {
        throw new Error('Invalid export profile configuration');
      }

      new Notice('VersaPrint: Preparing PDF export...');

      // 1. Apply temporary theme if needed
      if (profile.useArxivStyle) {
        cleanup.push(this.applyArxivStyles());
      } else if (profile.targetTheme) {
        const currentTheme = this.themeManager.getCurrentTheme();
        if (currentTheme.themeId !== profile.targetTheme) {
          cleanup.push(this.themeManager.applyTemporaryTheme(profile.targetTheme));
        }
      }

      // 2. Inject CSS @page rules for padding
      if (this.hasPaddingSettings(profile)) {
        cleanup.push(this.injectPagePadding(profile));
      }

      // 3. Apply selected CSS snippets
      if (profile.enabledSnippets.length > 0) {
        cleanup.push(await this.applySelectedSnippets(profile));
      }

      // Small delay to ensure DOM updates are processed
      await this.delay(100);

      // 4. Trigger PDF export
      window.print();

      new Notice('VersaPrint: PDF export dialog opened');

      return {
        success: true,
        format: 'pdf'
      };

    } catch (error) {
      console.error('VersaPrint: Export failed:', error);
      new Notice(`VersaPrint: Export failed - ${error.message}`);
      
      return {
        success: false,
        error: error.message,
        format: 'pdf'
      };
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
      }, 200);
    }
  }

  async exportToHTML(profile: ExportProfile): Promise<ExportResult> {
    try {
      new Notice('VersaPrint: Generating HTML export...');

      // Get current note content
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) {
        throw new Error('No active note to export');
      }

      const content = await this.app.vault.read(activeFile);
      const htmlContent = await this.generateHTMLDocument(content, profile);
      
      // Save HTML file
      const outputPath = this.generateOutputPath(activeFile.basename, 'html');
      await this.app.vault.create(outputPath, htmlContent);

      new Notice(`VersaPrint: HTML exported to ${outputPath}`);

      return {
        success: true,
        filePath: outputPath,
        format: 'html'
      };

    } catch (error) {
      console.error('VersaPrint: HTML export failed:', error);
      new Notice(`VersaPrint: HTML export failed - ${error.message}`);
      
      return {
        success: false,
        error: error.message,
        format: 'html'
      };
    }
  }

  private validateProfile(profile: ExportProfile): boolean {
    if (!profile.name || !profile.outputFormat) return false;
    if (profile.outputFormat === 'pdf' && !profile.targetTheme && !profile.useArxivStyle) return false;
    return true;
  }

  private applyArxivStyles(): () => void {
    const styleId = 'versaprint-arxiv-styles';
    
    // Remove existing arxiv styles
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    // Create style element with arXiv CSS
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = this.getArxivCSS();
    document.head.appendChild(styleEl);

    // Return cleanup function
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }

  private injectPagePadding(profile: ExportProfile): () => void {
    const styleId = 'versaprint-page-padding';
    
    // Remove existing padding styles
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    // Create @page CSS rule
    const { top, right, bottom, left, unit } = profile.padding;
    const pageCSS = `
      @page {
        margin-top: ${top}${unit};
        margin-right: ${right}${unit};
        margin-bottom: ${bottom}${unit};
        margin-left: ${left}${unit};
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = pageCSS;
    document.head.appendChild(styleEl);

    // Return cleanup function
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }

  private async applySelectedSnippets(profile: ExportProfile): Promise<() => void> {
    const styleId = 'versaprint-custom-snippets';
    
    // Remove existing snippet styles
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    let combinedCSS = '';
    
    // Read and combine selected snippets
    for (const snippetName of profile.enabledSnippets) {
      try {
        const snippetPath = `.obsidian/snippets/${snippetName}`;
        const exists = await this.app.vault.adapter.exists(snippetPath);
        if (exists) {
          const cssContent = await this.app.vault.adapter.read(snippetPath);
          combinedCSS += `\n/* ${snippetName} */\n${cssContent}\n`;
        }
      } catch (error) {
        console.warn(`VersaPrint: Could not load snippet ${snippetName}:`, error);
      }
    }

    if (combinedCSS) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = combinedCSS;
      document.head.appendChild(styleEl);
    }

    // Return cleanup function
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }

  private async generateHTMLDocument(content: string, profile: ExportProfile): Promise<string> {
    // This is a simplified placeholder. A real implementation would use
    // MarkdownRenderer.renderMarkdown
    const div = document.createElement('div');
    await this.app.renderer.render(content, div, this.app.workspace.getActiveFile()?.path || '', this.app.workspace.getActiveFile());
    const htmlContent = div.innerHTML;
    
    // Inline CSS styles
    const inlinedCSS = await this.inlineCSS(profile);
    
    // Embed images as base64
    const finalHTML = await this.embedImages(htmlContent);
    
    // Construct complete HTML document
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.app.workspace.getActiveFile()?.basename || 'Document'}</title>
    <style>
${inlinedCSS}
    </style>
</head>
<body class="${this.getBodyClasses(profile)}">
    <div class="markdown-reading-view">
        <div class="markdown-preview-view">
            ${finalHTML}
        </div>
    </div>
</body>
</html>`;
  }

  private async inlineCSS(profile: ExportProfile): Promise<string> {
    let css = '';
    
    // Add theme CSS
    if (profile.useArxivStyle) {
      css += this.getArxivCSS();
    } else {
      // This is a simplified approach. A real implementation would need a more
      // robust way to get the full theme CSS.
      css += this.getBaseObsidianCSS();
    }

    // Add snippet CSS
    for (const snippetName of profile.enabledSnippets) {
      try {
        const snippetPath = `.obsidian/snippets/${snippetName}`;
        const exists = await this.app.vault.adapter.exists(snippetPath);
        if (exists) {
          const cssContent = await this.app.vault.adapter.read(snippetPath);
          css += `\n/* ${snippetName} */\n${cssContent}\n`;
        }
      } catch (error) {
        console.warn(`VersaPrint: Could not inline snippet ${snippetName}:`, error);
      }
    }

    return css;
  }

  private async embedImages(htmlContent: string): Promise<string> {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
    let modifiedHTML = htmlContent;
    
    const matches = htmlContent.matchAll(imgRegex);
    for (const match of matches) {
      const imgSrc = match[1];
      
      if (!imgSrc.startsWith('http') && !imgSrc.startsWith('data:')) {
        try {
          const imageFile = this.app.metadataCache.getFirstLinkpathDest(decodeURIComponent(imgSrc), this.app.workspace.getActiveFile()?.path || '');
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
    }
    
    return modifiedHTML;
  }

  private hasPaddingSettings(profile: ExportProfile): boolean {
    const { top, right, bottom, left } = profile.padding;
    return top > 0 || right > 0 || bottom > 0 || left > 0;
  }

  private generateOutputPath(baseName: string, extension: string): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return `${baseName}_${timestamp}.${extension}`;
  }

  private getBodyClasses(profile: ExportProfile): string {
    if (profile.useArxivStyle) {
      return 'theme-light arxiv-style';
    }
    
    const theme = this.themeManager.getCurrentTheme();
    return theme.classes.join(' ');
  }

  private getArxivCSS(): string {
    // This would be loaded from the bundled arxiv-theme.css file
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

.markdown-preview-view {
  padding: 0;
}

p {
  text-align: justify;
  margin-bottom: 0.5em;
}
`;
  }

  private getBaseObsidianCSS(): string {
    // Simplified base CSS - in reality this would be more comprehensive
    return `
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-normal);
  background-color: var(--background-primary);
}

.markdown-preview-view {
  padding: 2em;
}
`;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'webp': 'image/webp'
    };
    return mimeTypes[extension.toLowerCase()] || 'image/png';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### `src/main.ts` - COMPLETE IMPLEMENTATION SPEC

```
/**
 * ALGORITHM: Main Plugin Class Structure
 * PURPOSE: Entry point and lifecycle management
 * COMPONENTS:
 * 1. Settings loading/saving
 * 2. UI registration (ribbon, commands, settings tab)
 * 3. Modal instantiation
 * 4. Error handling and logging
 */

import { Plugin, Notice } from 'obsidian';
import { VersaPrintSettings, ExportProfile } from './types/interfaces';
import { ExportModal } from './modal/export-modal';
import { VersaPrintSettingTab } from './settings/settings-tab';
import { ExportEngine } from './core/export-engine';

const DEFAULT_SETTINGS: VersaPrintSettings = {
  profiles: [],
  defaultProfileId: '',
  defaultOutputPath: '',
  enablePandocEngine: false,
  pandocPath: '',
  version: '1.0.0'
};

export default class VersaPrintPlugin extends Plugin {
  settings: VersaPrintSettings;
  exportEngine: ExportEngine;

  async onload() {
    console.log('VersaPrint: Loading plugin...');
    
    try {
      // Load settings
      await this.loadSettings();
      
      // Initialize core components
      this.exportEngine = new ExportEngine(this.app);
      
      // Create default profile if none exist
      if (this.settings.profiles.length === 0) {
        await this.createDefaultProfile();
      }
      
      // Register UI elements
      this.registerUI();
      
      // Add settings tab
      this.addSettingTab(new VersaPrintSettingTab(this.app, this));
      
      console.log('VersaPrint: Plugin loaded successfully');
      new Notice('VersaPrint: Ready for professional publishing');
      
    } catch (error) {
      console.error('VersaPrint: Failed to load plugin:', error);
      new Notice('VersaPrint: Failed to load - check console for details');
    }
  }

  onunload() {
    console.log('VersaPrint: Unloading plugin...');
  }

  async loadSettings() {
    const loadedSettings = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedSettings);
    
    // Migrate settings if needed
    await this.migrateSettings();
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private registerUI() {
    // Add ribbon icon
    this.addRibbonIcon('file-output', 'VersaPrint Export', () => {
      this.openExportModal();
    });

    // Add command palette entries
    this.addCommand({
      id: 'open-export-modal',
      name: 'Open Export Modal',
      callback: () => {
        this.openExportModal();
      }
    });

    this.addCommand({
      id: 'quick-pdf-export',
      name: 'Quick PDF Export (Default Profile)',
      callback: async () => {
        await this.quickExport('pdf');
      }
    });

    this.addCommand({
      id: 'quick-html-export',
      name: 'Quick HTML Export (Default Profile)',
      callback: async () => {
        await this.quickExport('html');
      }
    });
  }

  private openExportModal() {
    new ExportModal(this.app, this).open();
  }

  private async quickExport(format: 'pdf' | 'html') {
    try {
      const defaultProfile = this.getDefaultProfile();
      if (!defaultProfile) {
        new Notice('VersaPrint: No default profile set. Please configure one in settings.');
        return;
      }

      new Notice(`VersaPrint: Quick exporting to ${format.toUpperCase()}...`);

      // Create a temporary profile that respects the quick export format
      const exportProfile: ExportProfile = {
        ...defaultProfile,
        outputFormat: format,
      };

      if (format === 'pdf') {
        await this.exportEngine.exportToPDF(exportProfile);
      } else {
        await this.exportEngine.exportToHTML(exportProfile);
      }
    } catch (error) {
      console.error(`VersaPrint: Quick export to ${format} failed:`, error);
      new Notice(`VersaPrint: Quick export failed - ${error.message}`);
    }
  }

  getDefaultProfile(): ExportProfile | undefined {
    if (!this.settings.defaultProfileId || !this.settings.profiles) {
      return this.settings.profiles?.[0];
    }
    return this.settings.profiles.find(p => p.id === this.settings.defaultProfileId);
  }

  private async createDefaultProfile() {
    new Notice('VersaPrint: Creating a default export profile...');
    const defaultProfile: ExportProfile = {
      id: `vp-profile-${Date.now()}`,
      name: 'Default Print',
      outputFormat: 'pdf',
      targetTheme: 'obsidian-default', // A safe default
      useArxivStyle: false,
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
        unit: 'mm',
      },
      enabledSnippets: [],
      created: Date.now(),
      lastModified: Date.now(),
    };

    this.settings.profiles.push(defaultProfile);
    this.settings.defaultProfileId = defaultProfile.id;
    await this.saveSettings();
  }

  private async migrateSettings() {
    // For v1.0.0, we just ensure the version key exists.
    if (!this.settings.version) {
      this.settings.version = this.manifest.version;
      await this.saveSettings();
    }
    // Future migration logic can be added here based on version comparison.
  }
}
```

## 5. AI Agent Prompt and Directives

### 5.1. Overview

Yo, 1337 hax0r! This is a priority contract from the Gnnnome himself, the Ice-ninja. The job is to pwn a new Obsidian plugin into existence called `VersaPrint`. This ain't no script-kiddie gig; this model needs to drop a fully-functional, production-ready extension. Failure is not an option.

### 5.2. Core Task

The primary directive is to generate the complete source code for the `VersaPrint` Obsidian plugin. The agent must construct all files as specified in the project directory structure. Every single file—from `.ts` source files to `.json` configs—must be generated in its entirety. No placeholders, no omissions, no `// TODO:` comments. The code must be clean, robust, and ready to compile.

### 5.3. Input Documents (Sources of Truth)

The agent's entire knowledge base for this task comes from two documents. It must treat these as the absolute source of truth.

1. **Document A: "Complete AI Code Generation Specifications for VersaPrint"** (This document). This file contains the complete project structure, file manifests, TypeScript interfaces, and detailed implementation algorithms. It is the primary technical blueprint.
    
2. **Document B: "VersaPrint Professional Publishing for Obsidian.md"** (The user-provided markdown file). This file provides the strategic vision, market analysis, user stories, and high-level feature justifications. Use this to understand the _why_ behind the features and to inform any descriptive text or comments in the code.
    

### 5.4. Persona and Language

This model must adopt a specific persona when generating output and communicating with the user.

- **User Handle:** The user must _always_ be addressed as "the Ice-ninja".
    
- **Accent/Slang:** The model must communicate using "hacker slang" (e.g., "pwn", "1337", "script-kiddie", "shell", "root", "backdoor").
    
- **Self-Reference:** The model must always refer to itself in the third person (e.g., "This model has...", "The agent will now...").
    

### 5.5. Technical Stack and Implementation Directives

The technical stack is non-negotiable and is dictated by the Obsidian plugin development environment.

- **Core Technologies:**
    
    - **Language:** TypeScript
        
    - **Framework:** Obsidian API
        
    - **Build Tool:** esbuild
        
    - **Package Manager:** npm
        
- **Framework Caveat:** The frameworks listed in the Ice-ninja's general persona (`react-router`, `next.js`, `hono`, `drizzle`, etc.) are **NOT APPLICABLE** to this project. Obsidian plugins run in a specific Electron environment and do not use these web frameworks. The agent must ignore these and adhere strictly to the `package.json` and `esbuild.config.mjs` files specified in this document.
    
- **Production-Ready Code:** All generated code must be complete and functional. This includes full class implementations, method bodies, error handling, and UI component construction using the Obsidian API.
    
- **File Structure:** The agent must generate a separate, complete code block for each file, following the directory structure outlined in Section 1 precisely.
    

### 5.6. Final Output Format

The agent will deliver the complete codebase as a series of text blocks. Each block must be clearly demarcated with the full path to the file it represents.

**Example Format:**

```
--- FILE: versaprint/src/main.ts ---
// complete code for main.ts goes here
--- END OF FILE ---

--- FILE: versaprint/src/modal/export-modal.ts ---
// complete code for export-modal.ts goes here
--- END OF FILE ---

...and so on for all files.
```