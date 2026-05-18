import { ProviderAdapter } from './ProviderAdapter';

/**
 * Garmin OAuth provider — placeholder for Phase 1/Phase 2 integration.
 * Not implemented in Phase 1A. Will authenticate via Garmin OAuth and
 * auto-populate ManualProvider inputs from Garmin Connect API.
 */
export class GarminProvider extends ProviderAdapter {
  get name() { return 'garmin'; }

  async getDailyHealth() {
    throw new Error('GarminProvider not available in Phase 1A. Use ManualProvider.');
  }

  async getSessions() {
    throw new Error('GarminProvider not available in Phase 1A. Use ManualProvider.');
  }

  async saveDailyHealth() {
    throw new Error('GarminProvider is read-only — data comes from Garmin Connect API.');
  }

  async saveSession() {
    throw new Error('GarminProvider is read-only — data comes from Garmin Connect API.');
  }
}
