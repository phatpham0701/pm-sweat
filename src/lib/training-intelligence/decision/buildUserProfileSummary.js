const PHILOSOPHY_LABELS = {
  cns_first: 'CNS First',
  balanced: 'Balanced',
  performance_first: 'Performance First',
  fat_loss_first: 'Fat Loss First',
  strength_first: 'Strength First',
  endurance_first: 'Endurance First',
  coach_directed: 'Coach Directed',
  beginner_safe: 'Beginner Safe',
};

const RISK_LABELS = {
  low: 'cautious (rest when in doubt)',
  medium: 'balanced (push vs protect)',
  high: 'aggressive (push through unless critical)',
};

/**
 * Generate a human-readable profile summary from user profile data.
 * Stored as inputSnapshot with every Morning Brief and Session Review.
 *
 * @param {import('../types').UserProfile} profile
 * @returns {string}
 */
export function buildUserProfileSummary(profile) {
  const parts = [];

  if (profile.primaryGoal) {
    parts.push(`Goal: ${profile.primaryGoal}`);
  }

  const philosophyLabel = PHILOSOPHY_LABELS[profile.trainingPhilosophy] || profile.trainingPhilosophy || 'Balanced';
  const riskLabel = RISK_LABELS[profile.riskTolerance] || profile.riskTolerance || 'balanced';
  parts.push(`Philosophy: ${philosophyLabel} — Risk tolerance: ${riskLabel}`);

  if (profile.trainingBackground) {
    parts.push(`Background: ${profile.trainingBackground}`);
  }

  if (profile.currentChallenges) {
    parts.push(`Current challenges: ${profile.currentChallenges}`);
  }

  return parts.join('\n');
}
