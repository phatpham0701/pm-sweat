import { create } from 'zustand';

const MOCK_NAMES = [
  'Alex Chen', 'Maria Santos', 'Kai Nakamura', 'Priya Sharma', 'Lucas Oliveira',
  'Emma Johansson', 'Dong-hyun Kim', 'Fatima Al-Hassan', 'Luca Rossi', 'Sophie Martin',
  'Arjun Mehta', 'Isabella Costa', 'Tanaka Hiroshi', 'Amara Diallo', 'Ethan Park',
  'Yuna Lee', 'Carlos Mendez', 'Aisha Okafor', 'Sebastian Koch', 'Mei Xiao',
  'Rahul Gupta', 'Zara Ahmed', 'Finn Larsen', 'Chloe Dubois', 'Marcus Osei',
  'Nadia Petrov', 'Diego Hernandez', 'Sakura Yamamoto', 'Oluwaseun Bello', 'Ingrid Svensson',
];

const MOCK_CITIES = [
  'Ho Chi Minh City', 'Singapore', 'Bangkok', 'Jakarta', 'Kuala Lumpur',
  'Manila', 'Tokyo', 'Seoul', 'Taipei', 'Hong Kong',
  'Mumbai', 'Dubai', 'Sydney', 'London', 'New York',
];

function dv(seed, range) {
  return Math.abs(((seed * 1664525 + 1013904223) | 0)) % range;
}

const USER_RANK = 12;

function buildLeaderboard(currentUser) {
  const entries = [];
  let mockIdx = 0;

  for (let rank = 1; rank <= 100; rank++) {
    if (rank === USER_RANK && currentUser) {
      const prevScore = entries[rank - 2]?.globalScore ?? 4200;
      const userScore = prevScore - 55;
      entries.push({
        id: currentUser.id,
        rank,
        name: currentUser.name,
        handle: currentUser.handle || 'athlete',
        city: currentUser.city || '—',
        globalScore: userScore,
        weeklyScore: 185,
        trendChange: 2,
        categoryScores: { running: 820, cycling: 610, strength: 390, other: 195 },
        isCurrentUser: true,
      });
    } else {
      const i = mockIdx++;
      const nameIdx = dv(i * 7 + 3, MOCK_NAMES.length);
      const cityIdx = dv(i * 11 + 5, MOCK_CITIES.length);
      const baseName = MOCK_NAMES[nameIdx];
      const score = Math.max(120, 4800 - (rank * 46) + dv(i * 3, 40));
      const weeklyScore = Math.max(10, Math.floor(score * 0.11) + dv(i * 2, 25));
      const trend = dv(i * 5 + 1, 9) - 4;
      const catRun = Math.floor(score * (0.3 + dv(i, 20) / 100));
      const catCyc = Math.floor(score * (0.2 + dv(i + 1, 15) / 100));
      const catStr = Math.floor(score * (0.15 + dv(i + 2, 10) / 100));
      const catOth = Math.max(0, score - catRun - catCyc - catStr);
      entries.push({
        id: `mock-${i}`,
        rank,
        name: baseName,
        handle: `${baseName.split(' ')[0].toLowerCase()}${dv(i * 3 + 7, 99) + 1}`,
        city: MOCK_CITIES[cityIdx],
        globalScore: score,
        weeklyScore,
        trendChange: trend,
        categoryScores: { running: catRun, cycling: catCyc, strength: catStr, other: catOth },
        isCurrentUser: false,
      });
    }
  }

  return entries;
}

export const useLeaderboardStore = create((set, get) => ({
  athletes: [],
  loading: false,
  error: null,

  load: (currentUser) => {
    set({ loading: true, error: null });
    setTimeout(() => {
      set({ athletes: buildLeaderboard(currentUser), loading: false });
    }, 350);
  },

  getEntries: (tab, friendIds = new Set()) => {
    const { athletes } = get();
    if (!athletes.length) return [];

    if (tab === 'friends') {
      return athletes
        .filter(a => a.isCurrentUser || friendIds.has(a.id))
        .map((a, idx) => ({ ...a, rank: idx + 1 }));
    }
    if (tab === 'weekly') {
      return [...athletes]
        .sort((a, b) => b.weeklyScore - a.weeklyScore)
        .map((a, idx) => ({ ...a, rank: idx + 1 }));
    }
    if (['running', 'cycling', 'strength', 'other'].includes(tab)) {
      return [...athletes]
        .sort((a, b) => (b.categoryScores[tab] || 0) - (a.categoryScores[tab] || 0))
        .map((a, idx) => ({ ...a, rank: idx + 1 }));
    }
    return athletes;
  },
}));
