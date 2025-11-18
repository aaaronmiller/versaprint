# VersaPrint: Professional Publishing for Obsidian

VersaPrint is a professional publishing plugin for Obsidian that allows you to export your notes to beautiful PDF and self-contained HTML files. Take full control over your output with custom themes, academic styles, and precise layout adjustments, all without leaving your Obsidian workspace.

## Features

- **Theme Switching:** Export your notes using any installed Obsidian theme, not just your active one. Go from a dark writing theme to a clean, light print theme in one click.
- **Auto Dark-to-Light Conversion:** Automatically converts dark mode themes to light/white backgrounds for professional PDF printing.
- **Export Profiles:** Create, save, and manage reusable export profiles for different publication targets (e.g., "Work Report", "Academic Paper", "Web Draft").
- **Bundled arXiv Style:** Includes a professionally crafted CSS theme that emulates the classic look and feel of academic preprints on arXiv.org.
- **Precise Layout Control:** Set custom page padding/margins for your PDFs using precise units like millimeters (`mm`) or inches (`in`).
- **Independent Scaling:** Scale tables and charts (Mermaid) independently from 50% to 100% to fit them perfectly on the page.
- **Table Optimization:** Automatically ensures tables fit properly within PDF pages with no staggered/broken layouts.
- **Image Resizing:** Intelligently resizes images to fit within page boundaries.
- **Live Preview:** Preview your document before exporting to see exactly how it will look.
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

3.  **Preview (Optional):**
    * Click the "Preview" button to see how your document will look before exporting.

4.  **Export:**
    * Click the "Export" button. For PDFs, this will open your system's print dialog. For HTML, the file will be saved in your vault.

## Creating Export Profiles

1.  Go to `Settings` -> `Plugin Options` -> `VersaPrint`.
2.  Click "Add New Profile".
3.  Configure the profile name, theme, padding, scaling, and other settings.
4.  Click "Save".
5.  You can now select this profile directly from the Export Modal for quick, consistent exports.

## License

MIT
