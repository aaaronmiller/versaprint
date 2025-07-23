Of course. Here is an appendix file containing detailed instructions for incorporating the recommended features into the `VersaPrint` project. This document is designed to be combined with the existing project specifications.

-----

# Appendix A: Post-Launch Feature Enhancements

This document outlines the technical specifications for a set of high-value features to be implemented into `VersaPrint` after the initial version is stable. These enhancements are derived from ideas presented in the "A Professional Markdown Publishing Engine.md" document and are adapted to the `VersaPrint` architecture.

## 1\. Feature: Interactive Image Lightbox for HTML Exports

### 1.1. Objective and Justification

The goal is to enhance the user experience of HTML exports by implementing an interactive "lightbox" for images. When a user clicks an image in the final HTML document, it will open in a full-screen, focused overlay, which is crucial for viewing detailed diagrams and screenshots. This feature directly addresses the needs of technical and academic users.

### 1.2. Technical Implementation Plan

The implementation will involve adding a lightweight, dependency-free JavaScript library to the HTML output and modifying the HTML generation pipeline to automatically prepare images for the library.

**Proposed Library:** `GLightbox`. It is modern, dependency-free, and supports touch gestures, making it ideal for this use case.

#### Step 1: Update `ExportProfile` Interface

The `ExportProfile` interface must be updated to include a toggle for this feature.

**File to Modify:** `versaprint/src/types/interfaces.ts`

```typescript
export interface ExportProfile {
  // ... existing properties
  enableLightbox: boolean;         // New: Toggle for image lightbox in HTML
  created: number;
  lastModified: number;
}
```

#### Step 2: Update `HTMLGenerator` to Embed Library and Post-Process HTML

The `HTMLGenerator` class is responsible for building the final HTML file. It must be modified to conditionally embed the GLightbox library and its activation script, and to process the HTML content.

**File to Modify:** `versaprint/src/utils/html-generator.ts`

**Modifications:**

1.  **Post-Process HTML Content:** A new private method, `postProcessForLightbox`, will be created. This method will use a regular expression to find all `<img>` tags and wrap them in an `<a>` tag with the `.glightbox` class, which is required for the library to detect them. This method will be called within the `build()` function before the final HTML is assembled.

    ```typescript
    private postProcessForLightbox(html: string): string {
      // Wraps <img> tags in <a> tags for GLightbox compatibility.
      return html.replace(/<img src="([^"]+)"([^>]*)>/g, '<a href="$1" class="glightbox"><img src="$1"$2></a>');
    }
    ```

2.  **Embed Assets in `build()` method:** The `build()` method will be updated to conditionally include the GLightbox CSS and JavaScript, along with its initialization script, if `profile.enableLightbox` is true.

    ```typescript
    // Inside the HTMLGenerator.build() method

    // ... after rendering markdown and inlining CSS
    let finalHTML = await this.embedImages(renderedContent, activeFile.path);
    let lightboxAssets = '';

    if (this.profile.enableLightbox) {
        finalHTML = this.postProcessForLightbox(finalHTML);
        
        // In a real implementation, this minified code would be stored in a separate constants file.
        const lightboxCSS = `/* GLightbox CSS content here */`;
        const lightboxJS = `/* GLightbox JS content here */`;
        const lightboxInit = `const lightbox = GLightbox({ selector: '.glightbox' });`;
        
        inlinedCSS += lightboxCSS; // Add CSS to existing styles
        lightboxAssets = `<script>${lightboxJS}\n${lightboxInit}</script>`;
    }

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${activeFile.basename}</title>
        <style>${inlinedCSS}</style>
    </head>
    <body class="${this.getBodyClasses()}">
        <div class="markdown-reading-view">
            <div class="markdown-preview-view">${finalHTML}</div>
        </div>
        ${lightboxAssets}
    </body>
    </html>`;
    ```

#### Step 3: Update `ExportModal` UI

A new toggle control must be added to the `ExportModal` to allow users to enable or disable this feature for their exports.

**File to Modify:** `versaprint/src/modal/export-modal.ts`

**Modification:** Add a new `Setting` that is only visible when the selected output format is HTML.

```typescript
// Inside ExportModal, after createArxivToggle

private createLightboxToggle(container: HTMLElement) {
    const lightboxSetting = new Setting(container)
        .setName('Enable image lightbox')
        .setDesc('Make images clickable to view in a full-screen overlay.')
        .addToggle(toggle => {
            toggle.setValue(this.currentProfile.enableLightbox ?? false)
                .onChange(value => {
                    this.currentProfile.enableLightbox = value;
                });
        });

    if (this.currentProfile.outputFormat !== 'html') {
        lightboxSetting.setDisabled(true);
    }
}
```

## 2\. Feature: Dynamic Syntax Highlighting for HTML Exports

### 2.1. Objective and Justification

To make `VersaPrint`'s HTML exports truly professional and future-proof, syntax highlighting should support any programming language a user might reference without requiring a plugin update. This will be achieved by integrating a client-side library with an "autoloader" capability.

### 2.2. Technical Implementation Plan

**Proposed Library:** `Prism.js` with the `prism-autoloader.js` plugin.

#### Step 1: Update `HTMLGenerator`

The `HTMLGenerator` will be modified to embed the `Prism.js` core library, the autoloader plugin, a `Prism.js` theme CSS, and the required activation script into the generated HTML file.

**File to Modify:** `versaprint/src/utils/html-generator.ts`

**Modifications:**

1.  **No Profile Change Needed:** This feature can be implemented as a default enhancement for all HTML exports, requiring no new setting in the `ExportProfile` interface.

2.  **Update `build()` Method:** The `build()` method will be updated to always include the `Prism.js` assets in the final HTML string.

    ```typescript
    // Inside the HTMLGenerator.build() method, before the final return statement.

    const prismThemeCSS = `/* PrismJS Theme CSS (e.g., Material Oceanic) content here */`;
    const prismCoreJS = `/* PrismJS Core JS content here */`;
    const prismAutoloaderJS = `/* PrismJS Autoloader Plugin JS content here */`;
    const prismInitScript = `
        Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
        Prism.highlightAll();
    `;

    // Add Prism theme to the main CSS block
    inlinedCSS += `\n${prismThemeCSS}\n`;

    // Prepare the script block
    const finalScripts = `
        <script>${prismCoreJS}</script>
        <script>${prismAutoloaderJS}</script>
        <script>${prismInitScript}</script>
        ${lightboxAssets} // From previous feature
    `;

    return `<!DOCTYPE html>
    ...
    <body ...>
        ...
        ${finalScripts}
    </body>
    </html>`;

    ```

## 3\. Feature: Document Metadata via YAML Front Matter

### 3.1. Objective and Justification

To enhance the professionalism of exported documents, `VersaPrint` will read metadata (title, author, date) from the note's YAML front matter and embed it into the exported files. This automates the inclusion of critical document information.

### 3.2. Technical Implementation Plan

This involves reading the front matter using the Obsidian API and injecting it into the PDF and HTML outputs.

#### Step 1: Update `ExportProfile` Interface

A new boolean property will be added to the `ExportProfile` interface to control this behavior.

**File to Modify:** `versaprint/src/types/interfaces.ts`

```typescript
export interface ExportProfile {
  // ... existing properties
  enableLightbox: boolean;
  useFrontMatter: boolean;        // New: Toggle for using YAML front matter
  created: number;
  lastModified: number;
}
```

#### Step 2: Modify `ExportEngine` for PDF Exports

The `ExportEngine` needs to be updated to read front matter and temporarily inject it into the DOM before printing.

**File to Modify:** `versaprint/src/core/export-engine.ts`

**Modification:** In `exportToPDF`, before calling `window.print()`, get the front matter and inject it.

```typescript
// Inside ExportEngine.exportToPDF()

if (profile.useFrontMatter) {
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
        const fileCache = this.app.metadataCache.getFileCache(activeFile);
        const frontmatter = fileCache?.frontmatter;
        if (frontmatter) {
            const { title, author, date } = frontmatter;
            if (title || author || date) {
                const headerEl = document.createElement('div');
                headerEl.id = 'versaprint-frontmatter-header';
                headerEl.style.textAlign = 'center';
                headerEl.style.marginBottom = '2em';
                if (title) headerEl.innerHTML += `<h1>${title}</h1>`;
                if (author) headerEl.innerHTML += `<p><strong>${author}</strong></p>`;
                if (date) headerEl.innerHTML += `<p><em>${new Date(date).toLocaleDateString()}</em></p>`;

                // Prepend to the print-target element
                const printTarget = document.querySelector('.markdown-preview-view'); // or other relevant selector
                printTarget?.prepend(headerEl);

                cleanup.push(() => headerEl.remove());
            }
        }
    }
}
// ... call delay, then window.print()
```

#### Step 3: Modify `HTMLGenerator` for HTML Exports

The `HTMLGenerator` will read the front matter to set the HTML document's `<title>` tag.

**File to Modify:** `versaprint/src/utils/html-generator.ts`

**Modification:** Update the `build()` method to read the front matter.

```typescript
// Inside HTMLGenerator.build()
let docTitle = activeFile.basename;
if (this.profile.useFrontMatter) {
    const fileCache = this.app.metadataCache.getFileCache(activeFile);
    const frontmatter = fileCache?.frontmatter;
    if (frontmatter?.title) {
        docTitle = frontmatter.title;
    }
}
// ...
return `<!DOCTYPE html>
<html lang="en">
<head>
    ...
    <title>${docTitle}</title>
    ...
</head>
...
</html>`;
```

#### Step 4: Update `ExportModal` UI

Add a toggle to the modal to control the `useFrontMatter` setting.

**File to Modify:** `versaprint/src/modal/export-modal.ts`

**Modification:** Add a new `Setting` in a relevant location.

```typescript
// Inside ExportModal, e.g., after the theme selector

private createFrontMatterToggle(container: HTMLElement) {
    new Setting(container)
        .setName('Use YAML front matter')
        .setDesc('Use "title", "author", and "date" from front matter in the export.')
        .addToggle(toggle => {
            toggle.setValue(this.currentProfile.useFrontMatter ?? false)
                .onChange(value => {
                    this.currentProfile.useFrontMatter = value;
                });
        });
}
```