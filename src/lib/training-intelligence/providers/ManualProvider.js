import { ProviderAdapter } from './ProviderAdapter';

const STORAGE_KEY_HEALTH = 'pmsweat_ti_manual_health';
const STORAGE_KEY_SESSIONS = 'pmsweat_ti_manual_sessions';

const DAILY_VALIDATION = {
  sleepDurationMin: { min: 0, max: 1440 },
  sleepScore: { min: 0, max: 100 },
  hrvMs: { min: 10, max: 250 },
  restingHrBpm: { min: 30, max: 130 },
  bodyBatteryStart: { min: 0, max: 100 },
  bodyBatteryEnd: { min: 0, max: 100 },
  trainingReadiness: { min: 0, max: 100 },
  stressAvg: { min: 0, max: 100 },
  recoveryTimeHours: { min: 0, max: 120 },
  acuteLoad: { min: 0, max: 3000 },
  subjectiveEnergy: { min: 1, max: 10 },
  subjectiveSoreness: { min: 1, max: 10 },
  subjectiveStress: { min: 1, max: 10 },
};

const WORKOUT_VALIDATION = {
  sportType: { required: true },
  durationSec: { min: 0, max: 43200 },
  distanceM: { min: 0, max: 300000 },
  avgHrBpm: { min: 30, max: 220 },
  maxHrBpm: { min: 30, max: 230 },
  trainingLoad: { min: 0, max: 1000 },
  aerobicTe: { min: 0, max: 5 },
  anaerobicTe: { min: 0, max: 5 },
  z2RangeMin: { min: 100, max: 150 },
  z2RangeMax: { min: 100, max: 150 },
  timeInZ2Sec: { min: 0, max: 43200 },
};

function validateFields(data, rules) {
  const errors = [];
  for (const [field, rule] of Object.entries(rules)) {
    const val = data[field];
    if (rule.required && (val === undefined || val === null || val === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    if (val !== undefined && val !== null && val !== '') {
      const num = Number(val);
      if (isNaN(num)) { errors.push(`${field} must be a number`); continue; }
      if (rule.min !== undefined && num < rule.min) errors.push(`${field} must be >= ${rule.min}`);
      if (rule.max !== undefined && num > rule.max) errors.push(`${field} must be <= ${rule.max}`);
    }
  }
  return errors;
}

function readStore(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

function writeStore(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); }
  catch {}
}

/**
 * Manual provider — primary data source for Phase 1A.
 * User enters daily health signals and session data via form.
 * Persists to localStorage. Replaces ChatGPT screenshot workflow.
 */
export class ManualProvider extends ProviderAdapter {
  constructor(userId) {
    super();
    this._userId = userId;
  }

  get name() { return 'manual'; }

  async getDailyHealth(date) {
    const all = readStore(STORAGE_KEY_HEALTH);
    return all.find((r) => r.userId === this._userId && r.date === date) || null;
  }

  async getSessions(date) {
    const all = readStore(STORAGE_KEY_SESSIONS);
    return all.filter((s) => s.userId === this._userId && s.date === date);
  }

  async saveDailyHealth(signals) {
    const errors = validateFields(signals, DAILY_VALIDATION);
    if (errors.length) throw new Error(`Validation: ${errors.join(', ')}`);

    const all = readStore(STORAGE_KEY_HEALTH);
    const idx = all.findIndex((r) => r.userId === this._userId && r.date === signals.date);
    const record = { ...signals, userId: this._userId, savedAt: new Date().toISOString() };

    if (idx >= 0) { all[idx] = record; } else { all.push(record); }
    writeStore(STORAGE_KEY_HEALTH, all);
  }

  async saveSession(session) {
    const errors = validateFields(session, WORKOUT_VALIDATION);
    if (errors.length) throw new Error(`Validation: ${errors.join(', ')}`);

    const all = readStore(STORAGE_KEY_SESSIONS);
    const existing = all.findIndex((s) => s.id === session.id);
    const record = { ...session, userId: this._userId, savedAt: new Date().toISOString() };

    if (existing >= 0) { all[existing] = record; } else { all.push(record); }
    writeStore(STORAGE_KEY_SESSIONS, all);
  }

  clearUserData() {
    const health = readStore(STORAGE_KEY_HEALTH).filter((r) => r.userId !== this._userId);
    const sessions = readStore(STORAGE_KEY_SESSIONS).filter((s) => s.userId !== this._userId);
    writeStore(STORAGE_KEY_HEALTH, health);
    writeStore(STORAGE_KEY_SESSIONS, sessions);
  }
}
