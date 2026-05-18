/**
 * Base interface for all data providers.
 * All providers must implement these methods.
 */
export class ProviderAdapter {
  /** @returns {'demo'|'manual'|'garmin'} */
  get name() { throw new Error('ProviderAdapter.name not implemented'); }

  /**
   * Fetch daily health signals for a date.
   * @param {string} date - YYYY-MM-DD
   * @returns {Promise<import('../types').DailyHealthSignals|null>}
   */
  getDailyHealth(date) { throw new Error('ProviderAdapter.getDailyHealth not implemented'); }

  /**
   * Fetch workout sessions for a date.
   * @param {string} date - YYYY-MM-DD
   * @returns {Promise<import('../types').WorkoutSession[]>}
   */
  getSessions(date) { throw new Error('ProviderAdapter.getSessions not implemented'); }

  /**
   * Save daily health signals (manual providers only).
   * @param {import('../types').DailyHealthSignals} signals
   * @returns {Promise<void>}
   */
  saveDailyHealth(signals) { throw new Error('ProviderAdapter.saveDailyHealth not implemented'); }

  /**
   * Save a workout session (manual providers only).
   * @param {import('../types').WorkoutSession} session
   * @returns {Promise<void>}
   */
  saveSession(session) { throw new Error('ProviderAdapter.saveSession not implemented'); }
}
