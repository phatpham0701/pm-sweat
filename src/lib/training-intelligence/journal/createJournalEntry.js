import { crypto } from '../utils';

/**
 * Create a new journal entry after a Morning Brief is generated.
 * Never creates an empty entry — requires at minimum a morning brief.
 *
 * @param {{
 *   userId: string,
 *   date: string,
 *   dayNumber: number,
 *   morningBrief: import('../types').MorningBrief,
 * }} input
 * @returns {import('../types').JournalEntry}
 */
export function createJournalEntry({ userId, date, dayNumber, morningBrief }) {
  const now = new Date().toISOString();
  return {
    id: crypto.uuid(),
    userId,
    date,
    dayNumber,
    morningBriefId: morningBrief.id,
    sessionReviewIds: [],
    smartSweatScoreId: null,
    decision: morningBrief.decision,
    plannedSessionSummary: morningBrief.plannedSessionSummary || '',
    actualTrainingSummary: null,
    dailySummary: null,
    nutritionNote: null,
    recoveryNote: null,
    userReflection: null,
    tags: [],
    smartSweatScore: null,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update a journal entry after a Session Review is completed.
 *
 * @param {import('../types').JournalEntry} entry
 * @param {{
 *   sessionReviewId: string,
 *   actualTrainingSummary: string,
 *   smartSweatScoreId?: string,
 *   smartSweatScore?: number,
 * }} update
 * @returns {import('../types').JournalEntry}
 */
export function updateJournalEntryAfterReview(entry, update) {
  return {
    ...entry,
    sessionReviewIds: [...(entry.sessionReviewIds || []), update.sessionReviewId],
    actualTrainingSummary: update.actualTrainingSummary || entry.actualTrainingSummary,
    smartSweatScoreId: update.smartSweatScoreId || entry.smartSweatScoreId,
    smartSweatScore: update.smartSweatScore ?? entry.smartSweatScore,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Add a user reflection to a journal entry.
 *
 * @param {import('../types').JournalEntry} entry
 * @param {string} reflection
 * @returns {import('../types').JournalEntry}
 */
export function addUserReflection(entry, reflection) {
  return {
    ...entry,
    userReflection: reflection,
    updatedAt: new Date().toISOString(),
  };
}
