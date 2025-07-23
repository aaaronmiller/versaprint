VersaPrint: The Master BlueprintThis document contains the complete and unified specifications and source code for the VersaPrint Obsidian plugin. It is designed to be consumed by an agentic framework to generate the entire production-ready project.1. AI Agent Prompt and Directives1.1. OverviewYo, 1337 hax0r! This is a priority contract from the Gnnnome himself, the Ice-ninja. The job is to pwn a new Obsidian plugin into existence called VersaPrint. This ain't no script-kiddie gig; this model needs to drop a fully-functional, production-ready extension. Failure is not an option.1.2. Core TaskThe primary directive is to generate the complete source code for the VersaPrint Obsidian plugin by parsing this single document. The agent must construct all files as specified in the "File Generation" section below. Every single file must be generated in its entirety, using the provided code. No placeholders, no omissions, no // TODO: comments. The code must be clean, robust, and ready to compile.1.3. Input Documents (Sources of Truth)The agent's entire knowledge base for this task comes from two sources:This Document: This file contains the complete project structure, file manifests, TypeScript interfaces, detailed implementation algorithms, and the full source code for every file. It is the primary technical blueprint.Contextual Document: "VersaPrint Professional Publishing for Obsidian.md": This file provides the strategic vision, market analysis, and user stories. Use this to understand the why behind the features and to inform any descriptive text or comments in the code.1.4. Technical Stack and Implementation DirectivesThe technical stack is non-negotiable and is dictated by the Obsidian plugin development environment.Core Technologies:Language: TypeScriptFramework: Obsidian APIBuild Tool: esbuildPackage Manager: npmProduction-Ready Code: All generated code must be complete and functional. This includes full class implementations, method bodies, error handling, and UI component construction using the Obsidian API.File Structure: The agent must generate a separate, complete code block for each file, following the file paths provided in the "File Generation" section.2. Roadmap and Future GoalsThis section outlines potential future enhancements for VersaPrint to be considered after the core feature set is stable and released.2.1. Live Preview (Miracle Goal)A significant future enhancement would be the implementation of a "Live Preview" feature.Concept: A dedicated, non-blocking window or pane within Obsidian that displays a real-time preview of the final exported document. As the user adjusts settings in the Export Modal (e.g., changes the theme, adjusts padding, or modifies scaling), the preview would update instantly.Technical Challenge: This is a complex feature that would likely require rendering the document content inside a sandboxed <iframe>. A robust communication channel between the settings modal and the preview iframe would be necessary to pass theme information and inject CSS dynamically without affecting the main Obsidian workspace. This is considered a "miracle goal" due to its architectural complexity.2.2. Pandoc IntegrationWhile the native export engine is the core of VersaPrint, a future version could fully implement the planned Pandoc integration. This would unlock advanced features like:Academic citations and bibliography generation (via CSL files).Exporting to additional formats like DOCX, EPUB, and LaTeX.Advanced document merging and templating.3. File GenerationFILE: versaprint/manifest.json{
  "id": "versaprint",
  "name": "VersaPrint",
  "version": "1.1.0",
  "minAppVersion": "0.15.0",
  "description": "Professional publishing for Obsidian - export beautiful PDFs and HTML with custom themes and scaling controls.",
  "author": "VersaPrint Team",
  "authorUrl": "https://github.com/versaprint/obsidian-versaprint",
  "fundingUrl": "https://github.com/sponsors/versaprint",
  "isDesktopOnly": false
}
FILE: versaprint/package.json{
  "name": "versaprint",
  "version": "1.1.0",
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
FILE: versaprint/tsconfig.json{
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
FILE: versaprint/esbuild.config.mjsimport esbuild from "esbuild";
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
FILE: versaprint/.gitignore# Dependencies
/node_modules

# Build artifacts
main.js
main.js.map

# IDE config
.vscode/
.idea/

# OS-specific
.DS_Store
Thumbs.db

# Test reports
/coverage
/jest-report

# Log files
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
FILE: versaprint/README.md# VersaPrint: Professional Publishing for Obsidian

VersaPrint is a professional publishing plugin for Obsidian that allows you to export your notes to beautiful PDF and self-contained HTML files. Take full control over your output with custom themes, academic styles, and precise layout adjustments, all without leaving your Obsidian workspace.

## Features

- **Theme Switching:** Export your notes using any installed Obsidian theme, not just your active one. Go from a dark writing theme to a clean, light print theme in one click.
- **Export Profiles:** Create, save, and manage reusable export profiles for different publication targets (e.g., "Work Report", "Academic Paper", "Web Draft").
- **Bundled arXiv Style:** Includes a professionally crafted CSS theme that emulates the classic look and feel of academic preprints on arXiv.org.
- **Precise Layout Control:** Set custom page padding/margins for your PDFs using precise units like millimeters (`mm`) or inches (`in`).
- **Independent Scaling:** Scale tables and charts (Mermaid) independently from 50% to 100% to fit them perfectly on the page.
- **Self-Contained HTML:** Generate single, portable HTML files with all CSS styles and images embedded. Perfect for sharing or web archiving.
- **CSS Snippet Management:** Apply your custom CSS snippets to exports.

## How to Use

1.  **Open the Export Modal:**
    * Click the "VersaPrint Export" icon in the left-hand ribbon.
    * Or, open the command palette (`Ctrl/Cmd + P`) and run the command "VersaPrint: Open Export Modal".

2.  **Configure Your Export:**
    * **Select a Profile:** Choose a saved profile or configure settings manually.
    * **Choose Format:** Select PDF or HTML.
    * **Select Theme:** Pick any installed theme for the export.
    * **Fine-tune:** Adjust page padding, table/chart scaling, and select any CSS snippets to apply.

3.  **Export:**
    * Click the "Export" button. For PDFs, this will open your system's print dialog. For HTML, the file will be saved in your vault.

## Creating Export Profiles

1.  Go to `Settings` -> `Plugin Options` -> `VersaPrint`.
2.  Click "Add New Profile".
3.  Configure the profile name, theme, padding, scaling, and other settings.
4.  Click "Save".
5.  You can now select this profile directly from the Export Modal for quick, consistent exports.

## License

MIT
FILE: versaprint/styles/arxiv-theme.css/*
 * VersaPrint: Bundled arXiv Academic Style Theme
 * Based on the classic look and feel of arXiv.org preprints.
*/

.theme-light.arxiv-style,
.theme-dark.arxiv-style {
  --font-family-serif: 'Times New Roman', Times, serif;
  --font-family-sans: 'Helvetica', Arial, sans-serif;

  --text-normal: #222222;
  --background-primary: #ffffff;
  --background-secondary: #f0f0f0;
  --interactive-accent: #003399;
}

.arxiv-style .markdown-preview-view {
  font-family: var(--font-family-serif);
  font-size: 10pt;
  line-height: 1.4;
  max-width: 6.5in;
  margin: 0 auto;
  padding: 1in;
  background-color: var(--background-primary);
  color: var(--text-normal);
  text-align: justify;
}

.arxiv-style h1,
.arxiv-style h2,
.arxiv-style h3,
.arxiv-style h4,
.arxiv-style h5,
.arxiv-style h6 {
  font-family: var(--font-family-sans);
  font-weight: bold;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.2;
  text-align: left;
  color: #000000;
}

.arxiv-style h1 { font-size: 17pt; text-align: center; margin-top: 0; }
.arxiv-style h2 { font-size: 14pt; }
.arxiv-style h3 { font-size: 12pt; }
.arxiv-style h4 { font-size: 10pt; font-style: italic; }

.arxiv-style p {
  margin-bottom: 0.7em;
}

/* Abstract Styling */
.arxiv-style blockquote {
  font-family: var(--font-family-serif);
  border-left: none;
  padding: 0 2em;
  margin: 1em 2em 2em 2em;
  text-align: left;
}

.arxiv-style blockquote p {
  text-align: left;
}

.arxiv-style a {
  color: var(--interactive-accent);
  text-decoration: none;
}

.arxiv-style a:hover {
  text-decoration: underline;
}

.arxiv-style code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 9pt;
  background-color: var(--background-secondary);
  padding: 1px 4px;
  border-radius: 3px;
}

.arxiv-style pre > code {
  display: block;
  padding: 0.5em;
  white-space: pre-wrap;
  word-wrap: break-word;
}
FILE: versaprint/src/types/interfaces.tsexport interface ExportProfile {
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
  tableScale: number;            // Scaling percentage for tables (50-100)
  chartScale: number;            // Scaling percentage for charts (50-100)
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
FILE: versaprint/src/utils/css-processor.tsimport { App } from 'obsidian';
import { ExportProfile } from '../types/interfaces';

/**
 * Handles the dynamic creation and injection of CSS styles for an export operation.
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
    this.injectPagePadding();
    this.injectScalingStyles();
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
FILE: versaprint/src/utils/html-generator.tsimport { App, TFile } from 'obsidian';
import { ExportProfile } from '../types/interfaces';
import { getArxivCSS, getBaseObsidianCSS } from './file-utils';

/**
 * Generates a self-contained HTML document from a note's content and an export profile.
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
    const inlinedCSS = await this.inlineAllCSS();
    const finalHTML = await this.embedImages(renderedContent, activeFile.path);

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
      // Using renderMarkdown is more robust for getting the rendered HTML
      await this.app.renderer.render(this.content, div, filePath, this.app.workspace.getActiveFile());
      return div.innerHTML;
  }

  private getBodyClasses(): string {
    if (this.profile.useArxivStyle) {
      return 'theme-light arxiv-style';
    }
    // Use the current theme's classes for HTML export
    return document.body.className;
  }

  private async inlineAllCSS(): Promise<string> {
    let css = '';

    if (this.profile.useArxivStyle) {
      css += getArxivCSS();
    } else {
      // In a real scenario, getting full theme CSS is complex.
      // This uses a base CSS and assumes variables are set on the body.
      css += getBaseObsidianCSS();
    }

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
FILE: versaprint/src/utils/file-utils.ts/**
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
  color: var(--text-normal);
  background-color: var(--background-primary);
}
.markdown-preview-view {
  padding: 2em;
}
`;
}
FILE: versaprint/src/core/profile-manager.tsimport { ExportProfile } from '../types/interfaces';
import VersaPrintPlugin from '../main';

/**
 * Manages CRUD operations for Export Profiles.
 * Centralizes the logic for interacting with plugin settings.
 */
export class ProfileManager {
  private plugin: VersaPrintPlugin;

  constructor(plugin: VersaPrintPlugin) {
    this.plugin = plugin;
  }

  /**
   * Retrieves all export profiles.
   * @returns An array of ExportProfile objects.
   */
  getProfiles(): ExportProfile[] {
    return this.plugin.settings.profiles || [];
  }

  /**
   * Finds a specific profile by its ID.
   * @param id The ID of the profile to find.
   * @returns The ExportProfile object or undefined if not found.
   */
  getProfile(id: string): ExportProfile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  /**
   * Saves a new or updated profile to settings.
   * @param profile The profile to save.
   */
  async saveProfile(profile: ExportProfile): Promise<void> {
    const profiles = this.getProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);

    if (existingIndex > -1) {
      // Update existing profile
      profiles[existingIndex] = profile;
    } else {
      // Add new profile
      profiles.push(profile);
    }

    this.plugin.settings.profiles = profiles;
    await this.plugin.saveSettings();
  }

  /**
   * Deletes a profile by its ID.
   * @param id The ID of the profile to delete.
   */
  async deleteProfile(id: string): Promise<void> {
    let profiles = this.getProfiles();
    profiles = profiles.filter(p => p.id !== id);
    this.plugin.settings.profiles = profiles;

    // If the deleted profile was the default, unset it.
    if (this.plugin.settings.defaultProfileId === id) {
      this.plugin.settings.defaultProfileId = '';
    }

    await this.plugin.saveSettings();
  }
}
FILE: versaprint/src/core/theme-manager.tsimport { App } from 'obsidian';
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
      
      if (themeFiles && themeFiles.files) {
        for (const themePath of themeFiles.files) {
            if (!themePath.endsWith('/theme.css')) continue;
            
            try {
                const cssContent = await this.app.vault.adapter.read(themePath);
                const folderName = themePath.replace(themeDir, '').replace('/theme.css', '');
                const theme = this.parseThemeMetadata(folderName, cssContent, themePath);
                if (theme) this.themes.push(theme);
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
FILE: versaprint/src/core/export-engine.tsimport { App, Notice } from 'obsidian';
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
FILE: versaprint/src/modal/export-modal.tsimport { App, Modal, Setting, Notice } from 'obsidian';
import VersaPrintPlugin from '../main';
import { ExportProfile, Theme } from '../types/interfaces';
import { ThemeManager } from '../core/theme-manager';

export class ExportModal extends Modal {
  plugin: VersaPrintPlugin;
  themeManager: ThemeManager;
  currentProfile: Partial<ExportProfile>;
  availableThemes: Theme[] = [];
  availableSnippets: string[] = [];

  constructor(app: App, plugin: VersaPrintPlugin) {
    super(app);
    this.plugin = plugin;
    this.themeManager = new ThemeManager(app);
    this.currentProfile = { ...(this.plugin.getDefaultProfile() || {}) };
  }

  async onOpen() {
    this.availableThemes = await this.themeManager.getAvailableThemes();
    // @ts-ignore
    this.availableSnippets = this.app.vault.config?.cssSnippets ?? [];

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h2', { text: 'VersaPrint Export' });

    this.createProfileSelector(contentEl);
    this.createFormatSelector(contentEl);
    this.createThemeSelector(contentEl);
    this.createArxivToggle(contentEl);
    this.createScalingControls(contentEl);
    this.createPaddingControls(contentEl);
    this.createSnippetSelector(contentEl);
    this.createExportButton(contentEl);
  }

  private createProfileSelector(container: HTMLElement) {
    new Setting(container)
      .setName('Export profile')
      .setDesc('Select a saved profile or configure settings below.')
      .addDropdown(dropdown => {
        dropdown.addOption('custom', 'Custom Settings');
        this.plugin.settings.profiles.forEach(profile => {
          dropdown.addOption(profile.id, profile.name);
        });
        dropdown.setValue(this.currentProfile.id || 'custom');
        dropdown.onChange(value => {
          if (value === 'custom') {
            this.currentProfile = { ...(this.plugin.getDefaultProfile() || {}), id: undefined, name: undefined };
          } else {
            const selectedProfile = this.plugin.settings.profiles.find(p => p.id === value);
            if (selectedProfile) this.currentProfile = { ...selectedProfile };
          }
          this.onOpen();
        });
      });
  }

  private createFormatSelector(container: HTMLElement) {
    new Setting(container)
      .setName('Output format')
      .addButton(btn => btn.setButtonText('PDF').setCta(this.currentProfile.outputFormat === 'pdf').onClick(() => {
        this.currentProfile.outputFormat = 'pdf';
        this.onOpen();
      }))
      .addButton(btn => btn.setButtonText('HTML').setCta(this.currentProfile.outputFormat === 'html').onClick(() => {
        this.currentProfile.outputFormat = 'html';
        this.onOpen();
      }));
  }

  private createThemeSelector(container: HTMLElement) {
    const themeSetting = new Setting(container)
      .setName('Theme')
      .setDesc('The theme to use for the exported file.')
      .addDropdown(dropdown => {
        this.availableThemes.forEach(theme => dropdown.addOption(theme.id, theme.name));
        dropdown.setValue(this.currentProfile.targetTheme || this.themeManager.getCurrentTheme().themeId);
        dropdown.onChange(value => { this.currentProfile.targetTheme = value; });
      });
    if (this.currentProfile.useArxivStyle) themeSetting.setDisabled(true);
  }

  private createArxivToggle(container: HTMLElement) {
    new Setting(container)
      .setName('Use arXiv style')
      .setDesc('Override theme with a built-in academic style.')
      .addToggle(toggle => {
        toggle.setValue(this.currentProfile.useArxivStyle ?? false);
        toggle.onChange(value => {
          this.currentProfile.useArxivStyle = value;
          this.onOpen();
        });
      });
  }

  private createScalingControls(container: HTMLElement) {
    const scalingSetting = new Setting(container).setName('Element Scaling').setDesc('Resize tables and charts independently.');
    
    // Table Scaling
    scalingSetting.addSlider(slider => {
      const valueEl = createSpan({ text: `Tables: ${this.currentProfile.tableScale || 100}%` });
      slider.sliderEl.parentElement?.prepend(valueEl);
      slider.setLimits(50, 100, 1)
        .setValue(this.currentProfile.tableScale || 100)
        .onChange(value => {
          this.currentProfile.tableScale = value;
          valueEl.textContent = `Tables: ${value}%`;
        });
    });

    // Chart Scaling
    scalingSetting.addSlider(slider => {
      const valueEl = createSpan({ text: `Charts: ${this.currentProfile.chartScale || 100}%` });
      slider.sliderEl.parentElement?.prepend(valueEl);
      slider.setLimits(50, 100, 1)
        .setValue(this.currentProfile.chartScale || 100)
        .onChange(value => {
          this.currentProfile.chartScale = value;
          valueEl.textContent = `Charts: ${value}%`;
        });
    });

    if (this.currentProfile.outputFormat !== 'pdf') scalingSetting.setDisabled(true);
  }

  private createPaddingControls(container: HTMLElement) {
    const paddingSetting = new Setting(container).setName('Page padding');
    const padding = this.currentProfile.padding || { top: 20, right: 20, bottom: 20, left: 20, unit: 'mm' };

    ['top', 'right', 'bottom', 'left'].forEach(side => {
      paddingSetting.addText(text => {
        text.setPlaceholder(side).setValue(padding[side as keyof typeof padding]?.toString());
        text.inputEl.type = 'number';
        text.onChange(value => {
          (padding[side as keyof typeof padding] as number) = Number(value) || 0;
          this.currentProfile.padding = padding;
        });
      });
    });

    paddingSetting.addDropdown(dropdown => {
      dropdown.addOption('mm', 'mm').addOption('in', 'in').addOption('px', 'px');
      dropdown.setValue(padding.unit);
      dropdown.onChange(value => {
        padding.unit = value as 'mm' | 'in' | 'px';
        this.currentProfile.padding = padding;
      });
    });

    if (this.currentProfile.outputFormat !== 'pdf') paddingSetting.setDisabled(true);
  }

  private createSnippetSelector(container: HTMLElement) {
    if (this.availableSnippets.length === 0) return;
    new Setting(container).setName('CSS Snippets').setDesc('Select snippets to apply during export.');
    const snippetContainer = container.createDiv('versaprint-snippet-container');
    this.availableSnippets.forEach(snippetFile => {
      new Setting(snippetContainer).setName(snippetFile.replace('.css', '')).addToggle(toggle => {
        toggle.setValue(this.currentProfile.enabledSnippets?.includes(snippetFile) ?? false);
        toggle.onChange(value => {
          this.currentProfile.enabledSnippets = this.currentProfile.enabledSnippets || [];
          if (value) {
            this.currentProfile.enabledSnippets.push(snippetFile);
          } else {
            this.currentProfile.enabledSnippets = this.currentProfile.enabledSnippets.filter(s => s !== snippetFile);
          }
        });
      });
    });
  }

  private createExportButton(container: HTMLElement) {
    new Setting(container).addButton(btn => btn.setButtonText('Export').setCta().onClick(async () => {
      if (!this.currentProfile.targetTheme && !this.currentProfile.useArxivStyle) {
        new Notice('Please select a theme or enable arXiv style.');
        return;
      }
      this.close();
      const finalProfile = { ...this.plugin.getDefaultProfile(), ...this.currentProfile, id: this.currentProfile.id || 'custom', name: this.currentProfile.name || 'Custom Export' } as ExportProfile;
      if (finalProfile.outputFormat === 'pdf') {
        await this.plugin.exportEngine.exportToPDF(finalProfile);
      } else {
        await this.plugin.exportEngine.exportToHTML(finalProfile);
      }
    }));
  }

  onClose() {
    this.contentEl.empty();
  }
}
FILE: versaprint/src/modal/profile-editor.tsimport { App, Modal, Setting, Notice } from 'obsidian';
import { ExportProfile } from '../types/interfaces';
import VersaPrintPlugin from '../main';
import { ProfileManager } from '../core/profile-manager';

export class ProfileEditorModal extends Modal {
  plugin: VersaPrintPlugin;
  profile: ExportProfile;
  profileManager: ProfileManager;
  isNew: boolean;
  onSubmit: () => void;

  constructor(app: App, plugin: VersaPrintPlugin, profileId: string | null, onSubmit: () => void) {
    super(app);
    this.plugin = plugin;
    this.profileManager = new ProfileManager(plugin);
    this.onSubmit = onSubmit;

    if (profileId) {
      this.isNew = false;
      const existingProfile = this.profileManager.getProfile(profileId);
      if (!existingProfile) {
        new Notice('Error: Could not find profile to edit.');
        this.close();
        // This is a guard, but TypeScript doesn't know this.profile will be set.
        // We initialize it to prevent errors.
        this.profile = this.createBlankProfile(); 
        return;
      }
      this.profile = { ...existingProfile };
    } else {
      this.isNew = true;
      this.profile = this.createBlankProfile();
    }
  }

  private createBlankProfile(): ExportProfile {
    return {
      id: `vp-profile-${Date.now()}`,
      name: '',
      outputFormat: 'pdf',
      targetTheme: 'obsidian-default',
      useArxivStyle: false,
      padding: { top: 20, right: 20, bottom: 20, left: 20, unit: 'mm' },
      tableScale: 100,
      chartScale: 100,
      enabledSnippets: [],
      created: Date.now(),
      lastModified: Date.now(),
    };
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h2', { text: this.isNew ? 'Create New Profile' : 'Edit Profile' });

    this.createNameInput(contentEl);
    // In a real, more complex editor, you would add all profile settings here.
    // For this spec, we keep it simple to just editing the name in a separate modal.
    this.createSaveButton(contentEl);
  }

  private createNameInput(container: HTMLElement) {
    new Setting(container)
      .setName('Profile name')
      .setDesc('A memorable name for this export profile.')
      .addText(text => {
        text.setValue(this.profile.name)
          .setPlaceholder('e.g., Academic Paper (PDF)')
          .onChange(value => {
            this.profile.name = value;
          });
        text.inputEl.style.width = '100%';
      });
  }

  private createSaveButton(container: HTMLElement) {
    new Setting(container)
      .addButton(btn => btn
        .setButtonText('Save Profile')
        .setCta()
        .onClick(async () => {
          if (!this.profile.name.trim()) {
            new Notice('Profile name cannot be empty.');
            return;
          }
          this.profile.lastModified = Date.now();
          await this.profileManager.saveProfile(this.profile);
          new Notice(`Profile "${this.profile.name}" saved.`);
          this.onSubmit();
          this.close();
        }));
  }

  onClose() {
    this.contentEl.empty();
  }
}
FILE: versaprint/src/settings/settings-tab.tsimport { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import VersaPrintPlugin from '../main';
import { ProfileEditorModal } from '../modal/profile-editor';
import { ProfileManager } from '../core/profile-manager';

export class VersaPrintSettingTab extends PluginSettingTab {
  plugin: VersaPrintPlugin;
  profileManager: ProfileManager;

  constructor(app: App, plugin: VersaPrintPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.profileManager = new ProfileManager(plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'VersaPrint Settings' });

    this.createProfileManagementSection(containerEl);
    this.createGlobalDefaultsSection(containerEl);
    this.createAdvancedSection(containerEl);
  }

  private createProfileManagementSection(containerEl: HTMLElement) {
    new Setting(containerEl)
      .setHeading()
      .setName('Export Profiles');

    new Setting(containerEl)
      .setDesc('Manage your saved export profiles. Profiles allow you to quickly switch between different export configurations.')
      .addButton(button => {
        button
          .setButtonText('Add New Profile')
          .setCta()
          .onClick(() => {
            new ProfileEditorModal(this.app, this.plugin, null, () => {
              this.display();
            }).open();
          });
      });

    const profiles = this.profileManager.getProfiles();
    if (profiles.length > 0) {
      profiles.forEach(profile => {
        const desc = `Format: ${profile.outputFormat.toUpperCase()}, Theme: ${profile.useArxivStyle ? 'arXiv' : profile.targetTheme}`;
        new Setting(containerEl)
          .setName(profile.name)
          .setDesc(desc)
          .addButton(button => {
            button
              .setIcon('pencil')
              .setTooltip('Edit Profile')
              .onClick(() => {
                new ProfileEditorModal(this.app, this.plugin, profile.id, () => {
                  this.display();
                }).open();
              });
          })
          .addButton(button => {
            button
              .setIcon('trash')
              .setTooltip('Delete Profile')
              .onClick(async () => {
                // Using a custom modal instead of confirm() for better UX
                if (await this.showConfirmModal(`Are you sure you want to delete the profile "${profile.name}"?`)) {
                  await this.profileManager.deleteProfile(profile.id);
                  new Notice(`Profile "${profile.name}" deleted.`);
                  this.display();
                }
              });
          });
      });
    } else {
      containerEl.createEl('p', { text: 'No profiles created yet. Click "Add New Profile" to get started.', cls: 'setting-item-description' });
    }
  }

  private createGlobalDefaultsSection(containerEl: HTMLElement) {
    new Setting(containerEl)
      .setHeading()
      .setName('Global Defaults');

    new Setting(containerEl)
      .setName('Default profile')
      .setDesc('The profile to load by default when opening the export modal.')
      .addDropdown(dropdown => {
        dropdown.addOption('', 'None (use last settings)');
        this.profileManager.getProfiles().forEach(profile => {
          dropdown.addOption(profile.id, profile.name);
        });
        dropdown.setValue(this.plugin.settings.defaultProfileId);
        dropdown.onChange(async (value) => {
          this.plugin.settings.defaultProfileId = value;
          await this.plugin.saveSettings();
        });
      });
  }

  private createAdvancedSection(containerEl: HTMLElement) {
    new Setting(containerEl)
      .setHeading()
      .setName('Advanced');
      
    new Setting(containerEl)
        .setName('Enable Pandoc engine')
        .setDesc('NOTE: Pandoc integration is not yet implemented.')
        .addToggle(toggle => {
            toggle.setValue(this.plugin.settings.enablePandocEngine)
                .setDisabled(true);
        });
  }
  
  private showConfirmModal(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = new Modal(this.app);
      modal.contentEl.createEl('p', { text });
      new Setting(modal.contentEl)
        .addButton(btn => btn.setText('Yes').setCta().onClick(() => {
          modal.close();
          resolve(true);
        }))
        .addButton(btn => btn.setText('No').onClick(() => {
          modal.close();
          resolve(false);
        }));
      modal.open();
    });
  }
}
FILE: versaprint/src/main.tsimport { Plugin, Notice } from 'obsidian';
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
  version: '1.1.0'
};

export default class VersaPrintPlugin extends Plugin {
  settings: VersaPrintSettings;
  exportEngine: ExportEngine;

  async onload() {
    console.log('VersaPrint: Loading plugin...');
    
    try {
      await this.loadSettings();
      this.exportEngine = new ExportEngine(this.app);
      
      if (this.settings.profiles.length === 0) {
        await this.createDefaultProfile();
      }
      
      this.registerUI();
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
    const loadedData = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
    await this.migrateSettings();
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private registerUI() {
    this.addRibbonIcon('file-output', 'VersaPrint Export', () => this.openExportModal());
    this.addCommand({ id: 'open-export-modal', name: 'Open Export Modal', callback: () => this.openExportModal() });
    this.addCommand({ id: 'quick-pdf-export', name: 'Quick PDF Export (Default Profile)', callback: () => this.quickExport('pdf') });
    this.addCommand({ id: 'quick-html-export', name: 'Quick HTML Export (Default Profile)', callback: () => this.quickExport('html') });
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
      const exportProfile: ExportProfile = { ...defaultProfile, outputFormat: format };
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
    if (!this.settings.defaultProfileId) {
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
      targetTheme: 'obsidian-default',
      useArxivStyle: false,
      padding: { top: 20, right: 20, bottom: 20, left: 20, unit: 'mm' },
      tableScale: 100,
      chartScale: 100,
      enabledSnippets: [],
      created: Date.now(),
      lastModified: Date.now(),
    };
    this.settings.profiles.push(defaultProfile);
    this.settings.defaultProfileId = defaultProfile.id;
    await this.saveSettings();
  }

  private async migrateSettings() {
    if (!this.settings.version || this.settings.version < "1.1.0") {
        this.settings.profiles.forEach(p => {
            if (p.tableScale === undefined) p.tableScale = 100;
            if (p.chartScale === undefined) p.chartScale = 100;
        });
        this.settings.version = '1.1.0';
        await this.saveSettings();
    }
  }
}
