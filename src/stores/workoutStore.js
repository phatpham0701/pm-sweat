import { create } from 'zustand';

const WORKOUTS_KEY = 'pmsweat_workouts';
const GARMIN_KEY = 'pmsweat_garmin_auth';

function loadWorkouts(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(WORKOUTS_KEY)) || {};
    const list = all[userId] || [];
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (_) { return []; }
}

function saveWorkouts(userId, workouts) {
  try {
    const all = JSON.parse(localStorage.getItem(WORKOUTS_KEY)) || {};
    all[userId] = workouts;
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(all));
  } catch (_) {}
}

function loadGarminAuth(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(GARMIN_KEY)) || {};
    return all[userId] || null;
  } catch (_) { return null; }
}

function saveGarminAuth(userId, auth) {
  try {
    const all = JSON.parse(localStorage.getItem(GARMIN_KEY)) || {};
    all[userId] = auth;
    localStorage.setItem(GARMIN_KEY, JSON.stringify(all));
  } catch (_) {}
}

export const useWorkoutStore = create((set, get) => ({
  workouts: [],
  garminAuth: null,
  selectedWorkout: null,
  isLoading: false,
  filter: 'all',

  loadUserWorkouts: (userId) => {
    const workouts = loadWorkouts(userId);
    const garminAuth = loadGarminAuth(userId);
    set({ workouts, garminAuth });
  },

  setSelectedWorkout: (workout) => set({ selectedWorkout: workout }),
  setFilter: (filter) => set({ filter }),
  setLoading: (isLoading) => set({ isLoading }),

  addWorkouts: (userId, newWorkouts) => {
    const current = get().workouts;
    const merged = [...newWorkouts, ...current].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    saveWorkouts(userId, merged);
    set({ workouts: merged });
  },

  addWorkout: (userId, workout) => {
    const current = get().workouts;
    const updated = [workout, ...current];
    saveWorkouts(userId, updated);
    set({ workouts: updated });
  },

  removeWorkout: (userId, workoutId) => {
    const updated = get().workouts.filter(w => w.id !== workoutId);
    saveWorkouts(userId, updated);
    set({ workouts: updated });
  },

  setGarminAuth: (userId, auth) => {
    saveGarminAuth(userId, auth);
    set({ garminAuth: auth });
  },

  getFilteredWorkouts: () => {
    const { workouts, filter } = get();
    if (filter === 'all') return workouts;
    return workouts.filter(w => w.activity_type === filter);
  },

  getTotalCredits: () =>
    get().workouts.reduce((sum, w) => sum + (w.sweat_credits_earned || 0), 0),

  getStats: () => {
    const { workouts } = get();
    if (!workouts.length) {
      return { totalWorkouts: 0, totalCredits: 0, avgPerWeek: 0, currentStreak: 0, lastWorkoutDate: null, monthWorkouts: 0 };
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const monthWorkouts = workouts.filter(w => new Date(w.created_at) >= thirtyDaysAgo);
    const totalCredits = workouts.reduce((sum, w) => sum + (w.sweat_credits_earned || 0), 0);
    const avgPerWeek = monthWorkouts.length > 0 ? Math.round(monthWorkouts.length / 4.3) : 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toDateString();
      const hasWorkout = workouts.some(w => new Date(w.created_at).toDateString() === dStr);
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    const sorted = [...workouts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      totalWorkouts: workouts.length,
      totalCredits,
      avgPerWeek,
      currentStreak: streak,
      lastWorkoutDate: sorted[0]?.created_at || null,
      monthWorkouts: monthWorkouts.length,
    };
  },
}));
