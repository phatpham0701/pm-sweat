import { create } from 'zustand';

const BADGES_KEY = 'pmsweat_badges';

function loadBadges(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(BADGES_KEY)) || {};
    return all[userId] || [];
  } catch { return []; }
}

function saveBadges(userId, badges) {
  try {
    const all = JSON.parse(localStorage.getItem(BADGES_KEY)) || {};
    all[userId] = badges;
    localStorage.setItem(BADGES_KEY, JSON.stringify(all));
  } catch {}
}

export const useBadgeStore = create((set, get) => ({
  badges: [],

  loadBadges: (userId) => {
    set({ badges: loadBadges(userId) });
  },

  // Returns true if a new badge was awarded, false if already had it
  awardBadge: (userId, badgeId) => {
    const current = get().badges;
    if (current.some(b => b.id === badgeId)) return false;
    const updated = [...current, { id: badgeId, earnedAt: new Date().toISOString() }];
    saveBadges(userId, updated);
    set({ badges: updated });
    return true;
  },

  hasBadge: (badgeId) => get().badges.some(b => b.id === badgeId),
}));
