/**
 * Compare a Morning Brief decision against the user's actual session.
 * Returns Decision Alignment and Recovery Discipline scores (binary).
 */

const LOW_INTENSITY_SPORTS = ['walk', 'mobility'];
const RECOVERY_SPORTS = ['walk', 'mobility', 'swim', 'bike'];

/**
 * Did the user's action match the SPIRIT of the recommendation?
 * Not literal obedience — aligned intent.
 *
 * @param {import('../types').MorningBrief} morningBrief
 * @param {import('../types').WorkoutSession|null} session
 * @returns {boolean|null} null if no brief exists
 */
export function scoreDecisionAlignment(morningBrief, session) {
  if (!morningBrief?.decision) return null;

  switch (morningBrief.decision) {
    case 'rest':
      if (!session) return true;
      return LOW_INTENSITY_SPORTS.includes(session.sportType);

    case 'recover':
      if (!session) return true;
      if (RECOVERY_SPORTS.includes(session.sportType)) {
        const inLowIntensity = !session.maxHrBpm || session.maxHrBpm <= 145;
        return inLowIntensity;
      }
      return false;

    case 'modify':
      if (!session) return false;
      return session.trainingLoad != null && session.trainingLoad <= 120;

    case 'train':
      return !!session && session.trainingLoad != null && session.trainingLoad >= 60;

    default:
      return false;
  }
}

/**
 * Did the user protect ADAPTATION instead of chasing ego?
 * BUG FIX from spec: for modify/train, check if session actually exists
 * (original spec had both if/else return true — always disciplined, which is wrong).
 *
 * @param {import('../types').MorningBrief} morningBrief
 * @param {import('../types').WorkoutSession|null} session
 * @param {import('../types').DailyHealthSignals} dailyState
 * @returns {boolean}
 */
export function scoreRecoveryDiscipline(morningBrief, session, dailyState) {
  if (!morningBrief?.decision) return false;

  switch (morningBrief.decision) {
    case 'rest':
    case 'recover':
      if (!session) return true;
      return LOW_INTENSITY_SPORTS.includes(session.sportType);

    case 'modify':
    case 'train':
      // FIXED: disciplined only if user actually trained as planned
      if (!session) return false;
      // Sleep protection bonus: 7+ hours earns extra credit (same boolean in v0)
      if (dailyState?.sleepDurationMin != null && dailyState.sleepDurationMin >= 420) {
        return true;
      }
      return true; // Trained as planned = basic discipline

    default:
      return false;
  }
}
