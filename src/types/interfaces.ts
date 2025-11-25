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
