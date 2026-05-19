const KEYS = {
  profile: 'pmsweat_ti_profile',
  morningBriefs: 'pmsweat_ti_morning_briefs',
  sessionReviews: 'pmsweat_ti_session_reviews',
  journal: 'pmsweat_ti_journal',
  dailyScores: 'pmsweat_ti_daily_scores',
};

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const tiStorage = {
  getProfile: () => read(KEYS.profile),
  setProfile: (v) => write(KEYS.profile, v),

  getMorningBriefs: () => read(KEYS.morningBriefs) || [],
  addMorningBrief: (brief) => {
    const list = tiStorage.getMorningBriefs();
    write(KEYS.morningBriefs, [...list, brief]);
  },
  getMorningBriefByDate: (date) =>
    tiStorage.getMorningBriefs().find((b) => b.date === date) || null,

  getSessionReviews: () => read(KEYS.sessionReviews) || [],
  addSessionReview: (review) => {
    const list = tiStorage.getSessionReviews();
    write(KEYS.sessionReviews, [...list, review]);
  },

  getJournal: () => read(KEYS.journal) || [],
  upsertJournalEntry: (entry) => {
    const list = tiStorage.getJournal();
    const idx = list.findIndex((e) => e.date === entry.date);
    if (idx >= 0) {
      const updated = [...list];
      updated[idx] = { ...updated[idx], ...entry, updatedAt: new Date().toISOString() };
      write(KEYS.journal, updated);
    } else {
      write(KEYS.journal, [...list, entry]);
    }
  },
  getJournalEntry: (date) => tiStorage.getJournal().find((e) => e.date === date) || null,

  getDailyScores: () => read(KEYS.dailyScores) || [],
  addDailyScore: (score) => {
    const list = tiStorage.getDailyScores();
    const filtered = list.filter((s) => s.date !== score.date);
    write(KEYS.dailyScores, [...filtered, score]);
  },

  clearAll: () => Object.values(KEYS).forEach((k) => localStorage.removeItem(k)),

  saveSnapshot(profileId) {
    const snapshot = {};
    Object.entries(KEYS).forEach(([k, storageKey]) => {
      const val = localStorage.getItem(storageKey);
      if (val !== null) snapshot[k] = val;
    });
    try { localStorage.setItem(`pmsweat_ti_snap_${profileId}`, JSON.stringify(snapshot)); } catch {}
  },

  restoreSnapshot(profileId) {
    try {
      const raw = localStorage.getItem(`pmsweat_ti_snap_${profileId}`);
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
      if (!raw) return;
      const snapshot = JSON.parse(raw);
      Object.entries(KEYS).forEach(([k, storageKey]) => {
        if (snapshot[k] != null) localStorage.setItem(storageKey, snapshot[k]);
      });
    } catch {}
  },
};
