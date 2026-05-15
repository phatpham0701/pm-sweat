function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getIntensityLevel(avgHR, maxHR) {
  const percent = (avgHR / maxHR) * 100;
  if (percent < 60) return 'easy';
  if (percent < 75) return 'moderate';
  return 'hard';
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const TEMPLATES = {
  running: () => ({
    duration_minutes: randomBetween(20, 60),
    distance_km: parseFloat((randomBetween(30, 150) / 10).toFixed(1)),
    avg_heart_rate: randomBetween(130, 170),
    max_heart_rate: randomBetween(160, 190),
    calories_burned: randomBetween(250, 800),
  }),
  cycling: () => ({
    duration_minutes: randomBetween(30, 90),
    distance_km: parseFloat((randomBetween(100, 400) / 10).toFixed(1)),
    avg_heart_rate: randomBetween(120, 160),
    max_heart_rate: randomBetween(150, 180),
    calories_burned: randomBetween(400, 1000),
  }),
  strength: () => ({
    duration_minutes: randomBetween(30, 60),
    distance_km: 0,
    avg_heart_rate: randomBetween(100, 140),
    max_heart_rate: randomBetween(130, 160),
    calories_burned: randomBetween(200, 500),
  }),
  swimming: () => ({
    duration_minutes: randomBetween(20, 45),
    distance_km: parseFloat((randomBetween(5, 30) / 10).toFixed(1)),
    avg_heart_rate: randomBetween(120, 160),
    max_heart_rate: randomBetween(150, 180),
    calories_burned: randomBetween(300, 600),
  }),
};

const ACTIVITY_TYPES = ['running', 'cycling', 'strength', 'swimming'];

export const mockWorkoutGenerator = {
  generateMonthOfWorkouts(userId) {
    const workouts = [];
    const today = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const isWeekday = date.getDay() > 0 && date.getDay() < 6;
      if (Math.random() < (isWeekday ? 0.7 : 0.4)) {
        workouts.push(this.generateSingleWorkout(userId, date));
      }
    }

    return workouts;
  },

  generateSingleWorkout(userId, date = new Date()) {
    const type = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)];
    const stats = TEMPLATES[type]();
    const intensity = getIntensityLevel(stats.avg_heart_rate, stats.max_heart_rate);

    return {
      id: genId(),
      user_id: userId,
      source: 'mock',
      external_id: null,
      activity_type: type,
      duration_minutes: stats.duration_minutes,
      distance_km: stats.distance_km,
      calories_burned: stats.calories_burned,
      avg_heart_rate: stats.avg_heart_rate,
      max_heart_rate: stats.max_heart_rate,
      intensity_level: intensity,
      verified: false,
      metadata: {
        source: 'MOCK_GENERATOR',
        generatedAt: new Date().toISOString(),
        note: 'Simulated data for MVP demo',
      },
      sweat_credits_earned: 0,
      created_at: date.toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
};
