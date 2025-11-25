import { ExportProfile } from '../types/interfaces';
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
