import { App, PluginSettingTab, Setting, Notice, Modal } from 'obsidian';
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
        .addButton(btn => btn.setButtonText('Yes').setCta().onClick(() => {
          modal.close();
          resolve(true);
        }))
        .addButton(btn => btn.setButtonText('No').onClick(() => {
          modal.close();
          resolve(false);
        }));
      modal.open();
    });
  }
}
