import { create } from 'zustand';
import { tiStorage } from '../lib/tiStorage';

const useTrainingStore = create((set, get) => ({
  profile: null,
  morningBriefs: [],
  sessionReviews: [],
  journal: [],
  dailyScores: [],

  loadAll: () => {
    set({
      profile: tiStorage.getProfile(),
      morningBriefs: tiStorage.getMorningBriefs(),
      sessionReviews: tiStorage.getSessionReviews(),
      journal: tiStorage.getJournal(),
      dailyScores: tiStorage.getDailyScores(),
    });
  },

  saveProfile: (profile) => {
    const now = new Date().toISOString();
    const updated = { ...profile, updatedAt: now };
    tiStorage.setProfile(updated);
    set({ profile: updated });
  },

  hasProfile: () => !!get().profile,

  addMorningBrief: (brief) => {
    tiStorage.addMorningBrief(brief);
    set({ morningBriefs: tiStorage.getMorningBriefs() });
  },

  getTodaysBrief: () => {
    const today = new Date().toISOString().slice(0, 10);
    return get().morningBriefs.find((b) => b.date === today) || null;
  },

  addSessionReview: (review) => {
    tiStorage.addSessionReview(review);
    set({ sessionReviews: tiStorage.getSessionReviews() });
  },

  upsertJournalEntry: (entry) => {
    tiStorage.upsertJournalEntry(entry);
    set({ journal: tiStorage.getJournal() });
  },

  getTodaysJournalEntry: () => {
    const today = new Date().toISOString().slice(0, 10);
    return get().journal.find((e) => e.date === today) || null;
  },

  addDailyScore: (score) => {
    tiStorage.addDailyScore(score);
    set({ dailyScores: tiStorage.getDailyScores() });
  },

  getDaysSinceStart: () => {
    const journal = get().journal;
    if (!journal.length) return 0;
    const first = journal.reduce((min, e) => (e.date < min ? e.date : min), journal[0].date);
    const diffMs = Date.now() - new Date(first).getTime();
    return Math.floor(diffMs / 86400000) + 1;
  },
}));

export { useTrainingStore };
