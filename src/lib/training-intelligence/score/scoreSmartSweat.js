import { clamp } from '../utils';

/**
 * Consistency scoring — did user engage with the app consistently?
 * BUG FIX from spec: removed unused `sessionReviews` param from signature.
 * engagementRate = (briefViews + journalEntries) / (days * 2)
 *
 * @param {{
 *   daysSinceStart: number,
 *   morningBriefViews: number,
 *   journalEntries: number,
 * }} input
 * @returns {{ consistent: boolean, label: string, rate: string }|null}
 */
export function scoreConsistency({ daysSinceStart, morningBriefViews, journalEntries }) {
  const denominator = Math.min(daysSinceStart, 7);
  if (denominator <= 0) return null;

  const engagementRate = (morningBriefViews + journalEntries) / (denominator * 2);
  const consistent = engagementRate >= 0.7;

  return {
    consistent,
    label: denominator < 7 ? `Based on first ${denominator} day(s)` : '7-day consistency',
    rate: Math.round(engagementRate * 100) + '%',
  };
}

/**
 * Smart Sweat Score v0 — 3-signal yes/no binary formula.
 * Phase 1 beta. Explicit "beta" label required in UI.
 *
 * Scores: 0/33/66/100
 * BUG FIX from spec: (2/3)*100 = 66.666, spec says 66 → Math.round()
 *
 * @param {{
 *   decisionAligned: boolean,
 *   recoveredWell: boolean,
 *   consistent: boolean,
 * }} input
 * @returns {{ score: number, label: string, breakdown: object, beta: string }}
 */
export function scoreSmartSweat({ decisionAligned, recoveredWell, consistent }) {
  const signalsYes = [decisionAligned, recoveredWell, consistent].filter(Boolean).length;
  const score = Math.round(clamp((signalsYes / 3) * 100, 0, 100));

  return {
    score,
    label: `${signalsYes}/3 signals met`,
    breakdown: { decisionAligned, recoveredWell, consistent },
    beta: 'This is a beta behavior score. Reflects coaching alignment, not medical readiness.',
  };
}
