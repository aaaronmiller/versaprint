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

## Building and Deployment

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Building from Source

1. **Clone the repository:**
   ```bash
   git clone https://github.com/versaprint/obsidian-versaprint.git
   cd obsidian-versaprint
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the plugin:**
   ```bash
   npm run build
   ```

   This will:
   - Run TypeScript type checking
   - Bundle the plugin with esbuild
   - Generate `main.js` in the project root

### Development Workflow

For development with hot-reload:

1. **Start the development build:**
   ```bash
   npm run dev
   ```

   This watches for file changes and automatically rebuilds the plugin.

2. **Link to your Obsidian vault:**
   ```bash
   # Create a symbolic link to your vault's plugins folder
   # Replace VAULT_PATH with your actual vault path

   # On Linux/Mac:
   ln -s "$(pwd)" "/path/to/your/vault/.obsidian/plugins/versaprint"

   # On Windows (run as Administrator):
   mklink /D "C:\path\to\vault\.obsidian\plugins\versaprint" "%CD%"
   ```

3. **Enable the plugin:**
   - Open Obsidian
   - Go to Settings → Community Plugins
   - Enable "VersaPrint"

4. **Reload the plugin after changes:**
   - Open Command Palette (`Ctrl/Cmd + P`)
   - Run "Reload app without saving" to see your changes

### Manual Installation

If you want to manually install the built plugin:

1. **Build the plugin** (see above)

2. **Copy files to your vault:**
   ```bash
   # Create the plugin directory
   mkdir -p /path/to/vault/.obsidian/plugins/versaprint

   # Copy the necessary files
   cp main.js manifest.json styles/ /path/to/vault/.obsidian/plugins/versaprint/
   ```

3. **Required files for deployment:**
   - `main.js` - The compiled plugin code
   - `manifest.json` - Plugin metadata
   - `styles/` - CSS theme files (optional but recommended)

4. **Restart Obsidian** and enable the plugin in Settings

### Distribution / Release Build

For creating a release:

1. **Update version numbers:**
   - Update `version` in `manifest.json`
   - Update `version` in `package.json`
   - Add entry to `versions.json` if needed

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Create a release package:**
   ```bash
   # Create a zip with required files
   zip -r versaprint-release.zip main.js manifest.json styles/
   ```

4. **Release on GitHub:**
   - Create a new release tag (e.g., `v1.2.0`)
   - Upload `main.js` and `manifest.json`
   - Users can install via Obsidian's Community Plugins browser

### Troubleshooting

**Build fails with TypeScript errors:**
- Run `npm install` to ensure all dependencies are installed
- Check that you're using Node.js v16 or higher

**Plugin doesn't appear in Obsidian:**
- Ensure all three files (`main.js`, `manifest.json`, `styles/`) are in the correct directory
- Check that the plugin folder name matches the `id` in `manifest.json` (should be `versaprint`)
- Restart Obsidian completely

**Changes not reflecting:**
- Make sure you ran `npm run dev` or `npm run build` after making changes
- Reload Obsidian with Command Palette → "Reload app without saving"
- Check the browser console (Ctrl+Shift+I) for errors

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
