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
  version: '1.2.0'
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
    if (!this.settings.version || this.settings.version < "1.2.0") {
        this.settings.profiles.forEach(p => {
            if (p.tableScale === undefined) p.tableScale = 100;
            if (p.chartScale === undefined) p.chartScale = 100;
        });
        this.settings.version = '1.2.0';
        await this.saveSettings();
    }
  }
}
