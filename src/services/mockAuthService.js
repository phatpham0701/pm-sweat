import { mockWorkoutGenerator } from './mockWorkoutGenerator';
import { sweatCalculator } from './sweatCalculator';

const WORKOUTS_KEY = 'pmsweat_workouts';
const GARMIN_KEY = 'pmsweat_garmin_auth';
const USERS_KEY = 'pmsweat_users';

function loadAll(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (_) { return {}; }
}

function saveAll(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {}
}

export const mockAuthService = {
  async connectToGarmin(userId, userEmail) {
    const mockToken = {
      accessToken: `mock_access_${userId}_${Date.now()}`,
      refreshToken: `mock_refresh_${userId}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      scope: 'activity:read',
      mockMode: true,
      connectedAt: new Date().toISOString(),
    };

    const garminAll = loadAll(GARMIN_KEY);
    garminAll[userId] = mockToken;
    saveAll(GARMIN_KEY, garminAll);

    const rawWorkouts = mockWorkoutGenerator.generateMonthOfWorkouts(userId);
    const workouts = rawWorkouts.map(w => ({
      ...w,
      sweat_credits_earned: sweatCalculator.calculateCredits(w),
    }));

    const workoutsAll = loadAll(WORKOUTS_KEY);
    workoutsAll[userId] = workouts;
    saveAll(WORKOUTS_KEY, workoutsAll);

    const totalCredits = workouts.reduce((sum, w) => sum + w.sweat_credits_earned, 0);

    if (userEmail) {
      const users = loadAll(USERS_KEY);
      if (users[userEmail]) {
        users[userEmail] = {
          ...users[userEmail],
          total_sweat_credits: totalCredits,
          last_workout_date: workouts[workouts.length - 1]?.created_at || null,
          garmin_connected: true,
        };
        saveAll(USERS_KEY, users);
      }
    }

    return {
      success: true,
      message: 'Connected to Garmin (mock mode)',
      workoutsGenerated: workouts.length,
      creditsEarned: totalCredits,
      token: mockToken,
    };
  },

  async syncWorkouts(userId, userEmail) {
    const existing = (loadAll(WORKOUTS_KEY)[userId] || []);
    const newWorkouts = mockWorkoutGenerator.generateMonthOfWorkouts(userId)
      .map(w => ({ ...w, sweat_credits_earned: sweatCalculator.calculateCredits(w) }));

    const existingIds = new Set(existing.map(w => w.id));
    const fresh = newWorkouts.filter(w => !existingIds.has(w.id));
    const merged = [...fresh, ...existing];

    const workoutsAll = loadAll(WORKOUTS_KEY);
    workoutsAll[userId] = merged;
    saveAll(WORKOUTS_KEY, workoutsAll);

    const totalCredits = merged.reduce((sum, w) => sum + w.sweat_credits_earned, 0);
    if (userEmail) {
      const users = loadAll(USERS_KEY);
      if (users[userEmail]) {
        users[userEmail] = {
          ...users[userEmail],
          total_sweat_credits: totalCredits,
          last_workout_date: merged[0]?.created_at || null,
        };
        saveAll(USERS_KEY, users);
      }
    }

    return { success: true, synced: fresh.length, total: merged.length };
  },

  getGarminAuth(userId) {
    return loadAll(GARMIN_KEY)[userId] || null;
  },

  isConnected(userId) {
    const auth = this.getGarminAuth(userId);
    if (!auth) return false;
    return new Date(auth.expiresAt) > new Date();
  },
};
