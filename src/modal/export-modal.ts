import { App, Modal, Setting, Notice } from 'obsidian';
import VersaPrintPlugin from '../main';
import { ExportProfile, Theme } from '../types/interfaces';
import { ThemeManager } from '../core/theme-manager';
import { PreviewModal } from './preview-modal';

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
    this.createActionButtons(contentEl);
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
      .addButton(btn => {
        btn.setButtonText('PDF').onClick(() => {
          this.currentProfile.outputFormat = 'pdf';
          this.onOpen();
        });
        if (this.currentProfile.outputFormat === 'pdf') btn.setCta();
      })
      .addButton(btn => {
        btn.setButtonText('HTML').onClick(() => {
          this.currentProfile.outputFormat = 'html';
          this.onOpen();
        });
        if (this.currentProfile.outputFormat === 'html') btn.setCta();
      });
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

  private createActionButtons(container: HTMLElement) {
    const buttonContainer = new Setting(container);

    // Preview button
    buttonContainer.addButton(btn => btn
      .setButtonText('Preview')
      .setIcon('eye')
      .onClick(async () => {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
          new Notice('No active file to preview');
          return;
        }

        const content = await this.app.vault.read(activeFile);
        const finalProfile = {
          ...this.plugin.getDefaultProfile(),
          ...this.currentProfile,
          id: this.currentProfile.id || 'custom',
          name: this.currentProfile.name || 'Custom Export'
        } as ExportProfile;

        new PreviewModal(this.app, finalProfile, content).open();
      }));

    // Export button
    buttonContainer.addButton(btn => btn
      .setButtonText('Export')
      .setCta()
      .onClick(async () => {
        if (!this.currentProfile.targetTheme && !this.currentProfile.useArxivStyle) {
          new Notice('Please select a theme or enable arXiv style.');
          return;
        }
        this.close();
        const finalProfile = {
          ...this.plugin.getDefaultProfile(),
          ...this.currentProfile,
          id: this.currentProfile.id || 'custom',
          name: this.currentProfile.name || 'Custom Export'
        } as ExportProfile;
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
