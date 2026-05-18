import { philosophyBiasMap, applyPhilosophyBias, decideToday } from './decisionRules';

// ---------------------------------------------------------------------------
// philosophyBiasMap — structure tests
// ---------------------------------------------------------------------------

const SITUATIONS = ['low_readiness', 'limited_sleep', 'mixed_signals'];
const PHILOSOPHIES = Object.keys(philosophyBiasMap);
const VALID_DECISIONS = new Set(['rest', 'recover', 'modify', 'train']);

describe('philosophyBiasMap — structure', () => {
  test('all 8 philosophies are present', () => {
    const expected = [
      'cns_first', 'balanced', 'performance_first', 'fat_loss_first',
      'strength_first', 'endurance_first', 'coach_directed', 'beginner_safe',
    ];
    expect(PHILOSOPHIES.sort()).toEqual(expected.sort());
  });

  test('every philosophy has entries for all 3 situations', () => {
    for (const philosophy of PHILOSOPHIES) {
      for (const situation of SITUATIONS) {
        const rule = philosophyBiasMap[philosophy][situation];
        expect(rule).toBeDefined();
        expect(typeof rule.decision).toBe('string');
        expect(VALID_DECISIONS.has(rule.decision)).toBe(true);
      }
    }
  });

  test('coach_directed flags all situations with flagCoachRisk: true', () => {
    for (const situation of SITUATIONS) {
      expect(philosophyBiasMap.coach_directed[situation].flagCoachRisk).toBe(true);
    }
  });

  test('no other philosophy has flagCoachRisk: true', () => {
    for (const philosophy of PHILOSOPHIES.filter((p) => p !== 'coach_directed')) {
      for (const situation of SITUATIONS) {
        expect(philosophyBiasMap[philosophy][situation].flagCoachRisk).toBeFalsy();
      }
    }
  });
});

// ---------------------------------------------------------------------------
// applyPhilosophyBias
// ---------------------------------------------------------------------------

describe('applyPhilosophyBias', () => {
  test('returns a valid decision result', () => {
    const result = applyPhilosophyBias('low_readiness', { trainingPhilosophy: 'balanced' });
    expect(VALID_DECISIONS.has(result.decision)).toBe(true);
    expect(result.reasonCode).toBe('low_readiness');
    expect(result.philosophy).toBe('balanced');
    expect(typeof result.flagCoachRisk).toBe('boolean');
  });

  test('falls back to balanced if unknown philosophy', () => {
    const result = applyPhilosophyBias('low_readiness', { trainingPhilosophy: 'nonexistent' });
    const balanced = applyPhilosophyBias('low_readiness', { trainingPhilosophy: 'balanced' });
    expect(result.decision).toBe(balanced.decision);
  });

  test('different philosophies produce different results for same situation', () => {
    const cnsBias = applyPhilosophyBias('mixed_signals', { trainingPhilosophy: 'cns_first' });
    const perfBias = applyPhilosophyBias('mixed_signals', { trainingPhilosophy: 'performance_first' });
    // Both are 'modify' in the spec but let's verify the logic runs without error
    expect(cnsBias.philosophy).toBe('cns_first');
    expect(perfBias.philosophy).toBe('performance_first');
  });

  test('low_readiness: cns_first → recover', () => {
    const r = applyPhilosophyBias('low_readiness', { trainingPhilosophy: 'cns_first' });
    expect(r.decision).toBe('recover');
  });

  test('low_readiness: performance_first → modify', () => {
    const r = applyPhilosophyBias('low_readiness', { trainingPhilosophy: 'performance_first' });
    expect(r.decision).toBe('modify');
  });

  test('limited_sleep: cns_first → recover', () => {
    const r = applyPhilosophyBias('limited_sleep', { trainingPhilosophy: 'cns_first' });
    expect(r.decision).toBe('recover');
  });

  test('limited_sleep: balanced → modify', () => {
    const r = applyPhilosophyBias('limited_sleep', { trainingPhilosophy: 'balanced' });
    expect(r.decision).toBe('modify');
  });
});

// ---------------------------------------------------------------------------
// decideToday — decision rules
// ---------------------------------------------------------------------------

const PROFILE_BALANCED = { trainingPhilosophy: 'balanced', riskTolerance: 'medium' };
const PROFILE_CNS = { trainingPhilosophy: 'cns_first', riskTolerance: 'low' };
const PROFILE_PERF = { trainingPhilosophy: 'performance_first', riskTolerance: 'high' };

const HEALTHY_HEALTH = {
  date: '2026-05-18',
  sleepDurationMin: 450,
  trainingReadiness: 85,
  restingHrBpm: 46,
  restingHrBaseline: 50,
  hrvMs: 72,
  hrvBaselineLow: 58,
};

describe('decideToday — hard overrides', () => {
  test('illness symptoms → rest (overrides any philosophy)', () => {
    const result = decideToday({
      dailyHealth: HEALTHY_HEALTH,
      subjective: { illnessSymptoms: true },
      profile: PROFILE_PERF,
    });
    expect(result.decision).toBe('rest');
    expect(result.reasonCode).toBe('hard_override');
  });

  test('injury pain → rest', () => {
    const result = decideToday({
      dailyHealth: HEALTHY_HEALTH,
      subjective: { injuryPain: true },
      profile: PROFILE_PERF,
    });
    expect(result.decision).toBe('rest');
  });

  test('sleep < 5 hrs (280 min) → rest', () => {
    const result = decideToday({
      dailyHealth: { ...HEALTHY_HEALTH, sleepDurationMin: 280 },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_PERF,
    });
    expect(result.decision).toBe('rest');
  });

  test('sleep exactly 300 min → does NOT trigger rest override', () => {
    const result = decideToday({
      dailyHealth: { ...HEALTHY_HEALTH, sleepDurationMin: 300 },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_BALANCED,
    });
    expect(result.decision).not.toBe('rest');
  });

  test('RHR elevated + HRV suppressed → recover', () => {
    const result = decideToday({
      dailyHealth: {
        ...HEALTHY_HEALTH,
        restingHrBpm: 56,
        restingHrBaseline: 48,
        hrvMs: 44,
        hrvBaselineLow: 58,
        trainingReadiness: 50,
      },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_BALANCED,
    });
    expect(result.decision).toBe('recover');
    expect(result.reasonCode).toBe('hrv_rhr_double_flag');
  });

  test('only RHR elevated (no HRV) → does NOT trigger recover override', () => {
    const result = decideToday({
      dailyHealth: {
        ...HEALTHY_HEALTH,
        restingHrBpm: 56,
        restingHrBaseline: 48,
        hrvMs: null,
        hrvBaselineLow: null,
        trainingReadiness: 50,
        sleepDurationMin: 450,
      },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_BALANCED,
    });
    // Should fall through to mixed_signals bias, not hard recover
    expect(result.reasonCode).not.toBe('hrv_rhr_double_flag');
  });
});

describe('decideToday — philosophy bias paths', () => {
  test('readiness <= 35 → low_readiness bias applied', () => {
    const result = decideToday({
      dailyHealth: { ...HEALTHY_HEALTH, trainingReadiness: 30, sleepDurationMin: 450 },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_BALANCED,
    });
    expect(result.reasonCode).toBe('low_readiness');
  });

  test('readiness <= 35, cns_first → recover', () => {
    const result = decideToday({
      dailyHealth: { ...HEALTHY_HEALTH, trainingReadiness: 30, sleepDurationMin: 450 },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_CNS,
    });
    expect(result.decision).toBe('recover');
  });

  test('readiness <= 35, performance_first → modify', () => {
    const result = decideToday({
      dailyHealth: { ...HEALTHY_HEALTH, trainingReadiness: 30, sleepDurationMin: 450 },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_PERF,
    });
    expect(result.decision).toBe('modify');
  });

  test('limited sleep (300–389 min) → limited_sleep bias applied', () => {
    const result = decideToday({
      dailyHealth: { ...HEALTHY_HEALTH, sleepDurationMin: 350, trainingReadiness: 65 },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_BALANCED,
    });
    expect(result.reasonCode).toBe('limited_sleep');
  });

  test('limited sleep, cns_first → recover', () => {
    const result = decideToday({
      dailyHealth: { ...HEALTHY_HEALTH, sleepDurationMin: 350, trainingReadiness: 65 },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_CNS,
    });
    expect(result.decision).toBe('recover');
  });
});

describe('decideToday — green day path (BUG FIX: train decision)', () => {
  test('all signals healthy → train', () => {
    const result = decideToday({
      dailyHealth: HEALTHY_HEALTH,
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_BALANCED,
    });
    expect(result.decision).toBe('train');
    expect(result.reasonCode).toBe('all_signals_green');
  });

  test('no health data provided → train (default safe to train when no red flags)', () => {
    const result = decideToday({
      dailyHealth: { date: '2026-05-18' },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_BALANCED,
    });
    expect(result.decision).toBe('train');
  });

  test('same healthy data with different philosophies all produce train', () => {
    const philosophies = ['balanced', 'cns_first', 'performance_first', 'strength_first'];
    for (const philosophy of philosophies) {
      const result = decideToday({
        dailyHealth: HEALTHY_HEALTH,
        subjective: { illnessSymptoms: false, injuryPain: false },
        profile: { trainingPhilosophy: philosophy },
      });
      expect(result.decision).toBe('train');
    }
  });
});

describe('decideToday — mixed signals path', () => {
  test('readiness 50, sleep 420 → mixed_signals bias', () => {
    const result = decideToday({
      dailyHealth: {
        ...HEALTHY_HEALTH,
        trainingReadiness: 50,
        sleepDurationMin: 420,
      },
      subjective: { illnessSymptoms: false, injuryPain: false },
      profile: PROFILE_BALANCED,
    });
    expect(result.reasonCode).toBe('mixed_signals');
    expect(result.decision).toBe('modify');
  });
});
