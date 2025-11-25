import { App, Modal, Setting, Notice } from 'obsidian';
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
