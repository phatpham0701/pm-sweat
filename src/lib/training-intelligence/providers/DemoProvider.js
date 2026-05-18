import { ProviderAdapter } from './ProviderAdapter';
import { DEMO_SCENARIOS, DEMO_SESSIONS } from '../demoData';

/**
 * Demo provider — hardcoded test data for QA and feature preview.
 * Always labeled "Demo Mode" in UI. Data cleared on logout.
 * No real user data. No persistence beyond current session.
 */
export class DemoProvider extends ProviderAdapter {
  constructor(scenarioId = 'green_day') {
    super();
    this._scenarioId = scenarioId;
  }

  get name() { return 'demo'; }

  setScenario(id) { this._scenarioId = id; }

  _getScenario() {
    return DEMO_SCENARIOS.find((s) => s.id === this._scenarioId) || DEMO_SCENARIOS[0];
  }

  async getDailyHealth(date) {
    const scenario = this._getScenario();
    return { ...scenario.dailyHealth, date };
  }

  async getSubjective() {
    return this._getScenario().subjective;
  }

  async getSessions(date) {
    return DEMO_SESSIONS.filter((s) => s.date === date);
  }

  async saveDailyHealth() {
    throw new Error('DemoProvider is read-only — use ManualProvider to save data.');
  }

  async saveSession() {
    throw new Error('DemoProvider is read-only — use ManualProvider to save data.');
  }
}
