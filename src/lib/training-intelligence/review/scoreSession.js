import { clamp } from '../utils';
import { scoreDecisionAlignment, scoreRecoveryDiscipline } from './reviewSession';

/**
 * CNS Cost scoring — informational only in Phase 1.
 * Phase 2+ will incorporate into adaptive recommendations.
 *
 * @param {import('../types').WorkoutSession} session
 * @param {import('../types').DailyHealthSignals} dailyState
 * @returns {number} 0–100
 */
export function scoreCnsCost(session, dailyState) {
  let score = 20;
  if (session.trainingLoad > 100) score += 20;
  if (session.trainingLoad > 180) score += 20;
  if (session.anaerobicTe != null && session.anaerobicTe >= 2.5) score += 15;
  if (session.maxHrBpm != null && session.avgHrBpm != null &&
      session.maxHrBpm - session.avgHrBpm > 45) score += 10;
  if (session.durationSec != null && session.durationSec > 5400) score += 10;
  if (dailyState?.sleepDurationMin != null && dailyState.sleepDurationMin < 390) score += 15;
  return clamp(score, 0, 100);
}

/**
 * Run all session scoring functions and return a full session review score object.
 *
 * @param {{
 *   morningBrief: import('../types').MorningBrief,
 *   session: import('../types').WorkoutSession|null,
 *   dailyState: import('../types').DailyHealthSignals
 * }} input
 * @returns {{
 *   decisionAligned: boolean|null,
 *   recoveryDisciplined: boolean,
 *   cnsCost: number|null,
 * }}
 */
export function scoreSession({ morningBrief, session, dailyState }) {
  const decisionAligned = scoreDecisionAlignment(morningBrief, session);
  const recoveryDisciplined = scoreRecoveryDiscipline(morningBrief, session, dailyState);
  const cnsCost = session ? scoreCnsCost(session, dailyState) : null;

  return { decisionAligned, recoveryDisciplined, cnsCost };
}
