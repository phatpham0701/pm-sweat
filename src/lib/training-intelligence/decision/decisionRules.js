import { deriveDailySignals } from './deriveDailySignals';

/**
 * Philosophy Bias Map.
 * Maps (situation × philosophy) → {decision, flagCoachRisk?}
 * Called when objective flags don't produce a hard override.
 *
 * @type {Record<string, Record<string, {decision: import('../types').Decision, flagCoachRisk?: boolean}>>}
 */
export const philosophyBiasMap = {
  cns_first: {
    low_readiness: { decision: 'recover' },
    limited_sleep: { decision: 'recover' },
    mixed_signals: { decision: 'modify' },
  },
  balanced: {
    low_readiness: { decision: 'recover' },
    limited_sleep: { decision: 'modify' },
    mixed_signals: { decision: 'modify' },
  },
  performance_first: {
    low_readiness: { decision: 'modify' },
    limited_sleep: { decision: 'modify' },
    mixed_signals: { decision: 'modify' },
  },
  fat_loss_first: {
    low_readiness: { decision: 'recover' },
    limited_sleep: { decision: 'recover' },
    mixed_signals: { decision: 'modify' },
  },
  strength_first: {
    low_readiness: { decision: 'recover' },
    limited_sleep: { decision: 'modify' },
    mixed_signals: { decision: 'modify' },
  },
  endurance_first: {
    low_readiness: { decision: 'recover' },
    limited_sleep: { decision: 'modify' },
    mixed_signals: { decision: 'modify' },
  },
  coach_directed: {
    low_readiness: { decision: 'modify', flagCoachRisk: true },
    limited_sleep: { decision: 'modify', flagCoachRisk: true },
    mixed_signals: { decision: 'modify', flagCoachRisk: true },
  },
  beginner_safe: {
    low_readiness: { decision: 'recover' },
    limited_sleep: { decision: 'recover' },
    mixed_signals: { decision: 'modify' },
  },
};

/**
 * Apply philosophy bias for a given situation.
 * Falls back to 'balanced' if philosophy not found.
 *
 * @param {'low_readiness'|'limited_sleep'|'mixed_signals'} situation
 * @param {import('../types').UserProfile} profile
 * @returns {import('../types').DecisionResult}
 */
export function applyPhilosophyBias(situation, profile) {
  const philosophy = profile.trainingPhilosophy || 'balanced';
  const map = philosophyBiasMap[philosophy] || philosophyBiasMap.balanced;
  const rule = map[situation] || philosophyBiasMap.balanced[situation];

  return {
    decision: rule.decision,
    reasonCode: situation,
    reasoning: REASONING_TEMPLATES[situation]?.[rule.decision] || '',
    philosophy,
    flagCoachRisk: rule.flagCoachRisk || false,
  };
}

const REASONING_TEMPLATES = {
  low_readiness: {
    recover: 'Your training readiness is low. A recovery session will protect adaptation today.',
    modify: 'Readiness is below optimal. Reduce intensity to protect long-term consistency.',
  },
  limited_sleep: {
    recover: 'Sleep is in the 5–6.5 hour range. Recovery protects CNS from compounding fatigue.',
    modify: 'Sleep was limited but not critical. Moderate intensity is appropriate.',
  },
  mixed_signals: {
    modify: 'Some signals are suboptimal. A modified session balances stimulus with recovery.',
    recover: 'Multiple signals suggest accumulated fatigue. Prioritise recovery today.',
  },
};

/**
 * Core daily decision function.
 * Processes hard overrides first, then applies philosophy bias for border cases.
 *
 * @param {{
 *   dailyHealth: import('../types').DailyHealthSignals,
 *   subjective: import('../types').SubjectiveSignals,
 *   profile: import('../types').UserProfile,
 *   recentSessions?: import('../types').WorkoutSession[]
 * }} input
 * @returns {import('../types').DecisionResult}
 */
export function decideToday({ dailyHealth, subjective, profile, recentSessions = [] }) {
  // Hard red flags — override philosophy unconditionally
  if (subjective.illnessSymptoms || subjective.injuryPain) {
    return rest('Illness or injury symptoms detected. Rest is the only safe option today.');
  }

  if (dailyHealth.sleepDurationMin != null && dailyHealth.sleepDurationMin < 300) {
    return rest('Sleep is below 5 hours. Training on critically low sleep creates high injury and overtraining risk.');
  }

  const { rhrElevated, hrvSuppressed, readiness, sleepMin } = deriveDailySignals(dailyHealth);

  // RHR + HRV double flag → Recover (stronger signal than philosophy)
  if (rhrElevated && hrvSuppressed) {
    return recover('RHR is elevated and HRV is suppressed. Both signals together indicate active fatigue — recovery session recommended.');
  }

  // Low readiness → philosophy bias
  if (readiness != null && readiness <= 35) {
    return applyPhilosophyBias('low_readiness', profile);
  }

  // Limited sleep (5–6.5 hours) → philosophy bias
  if (sleepMin != null && sleepMin >= 300 && sleepMin < 390) {
    return applyPhilosophyBias('limited_sleep', profile);
  }

  // All signals healthy → Train (BUG FIX: philosophyBiasMap never produces "train")
  // Condition: readiness ≥ 70, sleep ≥ 6.5 hrs (or not provided), no double flag
  const readinessHealthy = readiness == null || readiness >= 70;
  const sleepHealthy = sleepMin == null || sleepMin >= 390;
  if (readinessHealthy && sleepHealthy && !rhrElevated && !hrvSuppressed) {
    return {
      decision: 'train',
      reasonCode: 'all_signals_green',
      reasoning: 'All signals look healthy. Train as planned today.',
      philosophy: profile.trainingPhilosophy || 'balanced',
      flagCoachRisk: false,
    };
  }

  // Mixed signals (readiness 36–69, or only one of RHR/HRV flagged)
  return applyPhilosophyBias('mixed_signals', profile);
}

/**
 * @param {string} reasoning
 * @returns {import('../types').DecisionResult}
 */
function rest(reasoning) {
  return { decision: 'rest', reasonCode: 'hard_override', reasoning, flagCoachRisk: false };
}

/**
 * @param {string} reasoning
 * @returns {import('../types').DecisionResult}
 */
function recover(reasoning) {
  return { decision: 'recover', reasonCode: 'hrv_rhr_double_flag', reasoning, flagCoachRisk: false };
}
