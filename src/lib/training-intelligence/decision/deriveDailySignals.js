/**
 * Parse raw daily health input into a normalised signals object
 * used by decisionRules.js and buildMorningBrief.js.
 */

/**
 * @param {import('../types').DailyHealthSignals} raw
 * @returns {{ rhrElevated: boolean, hrvSuppressed: boolean, readiness: number|null, sleepMin: number|null, signalCount: number }}
 */
export function deriveDailySignals(raw) {
  const sleepMin = raw.sleepDurationMin ?? null;
  const readiness = raw.trainingReadiness ?? null;

  const rhrElevated =
    raw.restingHrBaseline != null &&
    raw.restingHrBpm != null &&
    raw.restingHrBpm >= raw.restingHrBaseline + 5;

  const hrvSuppressed =
    raw.hrvBaselineLow != null &&
    raw.hrvMs != null &&
    raw.hrvMs < raw.hrvBaselineLow;

  // Count how many objective signals are present (for Morning Brief context)
  let signalCount = 0;
  const checkFields = ['sleepDurationMin', 'trainingReadiness', 'hrvMs', 'restingHrBpm', 'bodyBatteryStart'];
  for (const field of checkFields) {
    if (raw[field] != null) signalCount++;
  }

  return { rhrElevated, hrvSuppressed, readiness, sleepMin, signalCount };
}
