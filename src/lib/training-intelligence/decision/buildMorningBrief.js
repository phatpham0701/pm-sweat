import { crypto } from '../utils';
import { decideToday } from './decisionRules';
import { buildUserProfileSummary } from './buildUserProfileSummary';

/**
 * Build a complete Morning Brief object.
 * Stores an inputSnapshot so future profile changes don't alter historical entries.
 *
 * @param {{
 *   userId: string,
 *   date: string,
 *   dailyHealth: import('../types').DailyHealthSignals,
 *   subjective: import('../types').SubjectiveSignals,
 *   profile: import('../types').UserProfile,
 *   recentSessions?: import('../types').WorkoutSession[]
 * }} input
 * @returns {import('../types').MorningBrief}
 */
export function buildMorningBrief({ userId, date, dailyHealth, subjective, profile, recentSessions = [] }) {
  const result = decideToday({ dailyHealth, subjective, profile, recentSessions });

  const plannedSessionSummary = buildPlannedSummary(result.decision, profile);

  return {
    id: crypto.uuid(),
    date,
    userId,
    decision: result.decision,
    reasoning: result.reasoning,
    reasonCode: result.reasonCode,
    philosophy: result.philosophy,
    flagCoachRisk: result.flagCoachRisk || false,
    plannedSessionSummary,
    inputSnapshot: {
      profile: { ...profile, profileSummary: buildUserProfileSummary(profile) },
      dailyHealth: { ...dailyHealth },
      subjective: { ...subjective },
    },
    createdAt: new Date().toISOString(),
  };
}

function buildPlannedSummary(decision, profile) {
  const philosophy = profile.trainingPhilosophy || 'balanced';
  switch (decision) {
    case 'rest':
      return 'No training today. Rest, sleep, light stretching only.';
    case 'recover':
      return 'Recovery session: low intensity (Z1/Z2), short duration. No strength, no anaerobic work.';
    case 'modify':
      return philosophy === 'strength_first'
        ? 'Modified training: reduce volume by 20-30%. Keep compound lifts, drop accessories.'
        : 'Modified training: reduce intensity and duration. Keep movement, avoid pushing limits.';
    case 'train':
      return 'Train as planned. All systems are go — execute your scheduled session.';
    default:
      return '';
  }
}
