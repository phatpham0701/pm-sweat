export const DEMO_EMAIL = 'demo@pmsweat.app';
export const DEMO_PASS  = 'Demo1234!';
export const DEMO_ID    = 'demo-user-001';

export const PAULUS_EMAIL = 'paulus@pmsweat.app';
export const PAULUS_PASS  = 'Demo1234!';
export const PAULUS_ID    = 'user-paulus-001';

const TYPES = ['running', 'cycling', 'strength', 'swimming'];
const SV    = { running: [42,48,51,38,44], cycling: [61,58,72,65,55], strength: [24,28,22,30,26], swimming: [32,35,28,38,30] };
const DIST  = { running: [8.2,10.4,12.1,6.5,9.8], cycling: [38.4,42.8,55.2,28.6,45.1], strength: [0,0,0,0,0], swimming: [1.8,2.4,1.5,2.0,1.2] };
const HR    = { running: [158,162,155,160,157], cycling: [148,152,145,150,155], strength: [140,142,138,145,141], swimming: [145,148,142,150,146] };

export function ensureAlexAccount() {
  const users = JSON.parse(localStorage.getItem('pmsweat_users') || '{}');
  if (!users[DEMO_EMAIL]) {
    users[DEMO_EMAIL] = {
      id: DEMO_ID, email: DEMO_EMAIL, name: 'Alex Chen', handle: 'alexchen',
      age: 28, city: 'Ho Chi Minh City', password: btoa(DEMO_PASS),
      createdAt: '2026-01-10T08:00:00Z',
    };
    localStorage.setItem('pmsweat_users', JSON.stringify(users));
  }
}

export function ensurePaulusAccount() {
  const users = JSON.parse(localStorage.getItem('pmsweat_users') || '{}');
  if (!users[PAULUS_EMAIL]) {
    users[PAULUS_EMAIL] = {
      id: PAULUS_ID, email: PAULUS_EMAIL, name: 'Paulus', handle: 'paulus',
      age: 28, city: 'Ho Chi Minh City', password: btoa(PAULUS_PASS),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('pmsweat_users', JSON.stringify(users));
  }
}

export function seedAlexDemoData() {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const workouts = [];

  for (let i = 0; i < 60; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const type = TYPES[i % 4]; const ci = i % 5;
    workouts.push({
      id: `demo-w-${i}`, user_id: DEMO_ID, activity_type: type,
      duration_minutes: type === 'strength' ? 55 : type === 'swimming' ? 40 : 52,
      distance_km: DIST[type][ci], avg_heart_rate: HR[type][ci],
      intensity_level: i % 4 === 1 ? 'high' : i % 4 === 3 ? 'vigorous' : 'moderate',
      sweat_credits_earned: SV[type][ci], notes: '', created_at: d.toISOString(),
    });
  }

  for (let i = 0; i < 40; i++) {
    const d = new Date(today); d.setDate(d.getDate() - (61 + i));
    const type = TYPES[i % 4]; const ci = (i + 2) % 5;
    workouts.push({
      id: `demo-w-old-${i}`, user_id: DEMO_ID, activity_type: type,
      duration_minutes: type === 'strength' ? 50 : 48,
      distance_km: DIST[type][ci], avg_heart_rate: HR[type][ci],
      intensity_level: i % 2 === 0 ? 'moderate' : 'high',
      sweat_credits_earned: SV[type][ci], notes: '', created_at: d.toISOString(),
    });
  }

  const ws = JSON.parse(localStorage.getItem('pmsweat_workouts') || '{}');
  ws[DEMO_ID] = workouts;
  localStorage.setItem('pmsweat_workouts', JSON.stringify(ws));

  const gs = JSON.parse(localStorage.getItem('pmsweat_garmin_auth') || '{}');
  gs[DEMO_ID] = {
    userId: DEMO_ID, deviceName: 'Garmin Fenix 7S',
    connectedAt: '2026-01-10T08:00:00Z', expiresAt: '2027-01-10T08:00:00Z',
    status: 'connected', lastSync: today.toISOString(),
  };
  localStorage.setItem('pmsweat_garmin_auth', JSON.stringify(gs));

  const ALL_BADGES = [
    'FIRST_WORKOUT','CENTURY_SWEAT','CREDITS_500','CREDITS_1000',
    'WORKOUT_10','WORKOUT_50','MARATHON_MODE','CALORIE_CRUSHER',
    'ON_FIRE','RED_HOT','UNSTOPPABLE','LEGENDARY',
    'RUNNERS_HIGH','CYCLISTS_PARADISE','IRON_LIFTER','WATER_CHILD','ALLROUNDER',
    'FIRST_FRIEND','SQUAD_GOALS','FRIEND_MAGNET',
    'GOAL_GETTER','GOAL_CRUSHER','GARMIN_CONNECTED','INSIGHT_SEEKER','LEADERBOARD_PIONEER',
  ];
  const bs = JSON.parse(localStorage.getItem('pmsweat_badges') || '{}');
  bs[DEMO_ID] = ALL_BADGES.map((id, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (i * 3 + 5));
    return { id, earnedAt: d.toISOString() };
  });
  localStorage.setItem('pmsweat_badges', JSON.stringify(bs));

  localStorage.setItem('pmsweat_friends', JSON.stringify(
    ['mock-0','mock-1','mock-2','mock-3','mock-4','mock-5','mock-6','mock-7','mock-8','mock-9']
  ));

  const d30 = new Date(today); d30.setDate(d30.getDate() - 30);
  const d60 = new Date(today); d60.setDate(d60.getDate() - 60);
  const d90 = new Date(today); d90.setDate(d90.getDate() - 90);
  const gls = JSON.parse(localStorage.getItem('pmsweat_goals') || '{}');
  gls[DEMO_ID] = [
    { id: 'demo-g-1', user_id: DEMO_ID, title: 'Run 50 km in a month',       description: '', goal_type: 'distance_km',       target_value: 50,   current_value: 52.3, period: 'monthly',  is_completed: true,  completed_at: d60.toISOString(), start_date: d90.toISOString(), created_at: d90.toISOString() },
    { id: 'demo-g-2', user_id: DEMO_ID, title: 'Earn 500 sweat credits',      description: '', goal_type: 'total_credits',      target_value: 500,  current_value: 500,  period: 'monthly',  is_completed: true,  completed_at: d60.toISOString(), start_date: d90.toISOString(), created_at: d90.toISOString() },
    { id: 'demo-g-3', user_id: DEMO_ID, title: 'Train 5× a week',             description: '', goal_type: 'workouts_per_week', target_value: 5,    current_value: 5,    period: 'weekly',   is_completed: true,  completed_at: d30.toISOString(), start_date: d60.toISOString(), created_at: d60.toISOString() },
    { id: 'demo-g-4', user_id: DEMO_ID, title: 'Cycle 200 km',                description: '', goal_type: 'distance_km',       target_value: 200,  current_value: 220,  period: 'monthly',  is_completed: true,  completed_at: d30.toISOString(), start_date: d60.toISOString(), created_at: d60.toISOString() },
    { id: 'demo-g-5', user_id: DEMO_ID, title: 'Earn 300 credits this month', description: '', goal_type: 'total_credits',      target_value: 300,  current_value: 300,  period: 'monthly',  is_completed: true,  completed_at: d30.toISOString(), start_date: d30.toISOString(), created_at: d30.toISOString() },
    { id: 'demo-g-6', user_id: DEMO_ID, title: 'Hit 5,000 sweat credits',     description: '', goal_type: 'total_credits',      target_value: 5000, current_value: 1300, period: 'all-time', is_completed: false, completed_at: null,              start_date: d30.toISOString(), created_at: d30.toISOString() },
    { id: 'demo-g-7', user_id: DEMO_ID, title: 'Train 7× this week',          description: '', goal_type: 'workouts_per_week', target_value: 7,    current_value: 5,    period: 'weekly',   is_completed: false, completed_at: null,              start_date: d30.toISOString(), created_at: d30.toISOString() },
  ];
  localStorage.setItem('pmsweat_goals', JSON.stringify(gls));

  const hr  = 3600000;
  const day = 24 * hr;
  const ns  = JSON.parse(localStorage.getItem('pmsweat_notifications') || '{}');
  ns[DEMO_ID] = [
    { id: 'demo-n-1', user_id: DEMO_ID, type: 'BADGE_EARNED',     title: '👑 Badge Earned!', message: 'You unlocked "Legendary". Check your badge collection!',  priority: 'high',   data: {}, read: false, created_at: new Date(Date.now() - 2*hr).toISOString()  },
    { id: 'demo-n-2', user_id: DEMO_ID, type: 'STREAK_MILESTONE', title: '60-Day Streak!',   message: 'Your multiplier is now 1.5× — keep it going!',            priority: 'medium', data: {}, read: false, created_at: new Date(Date.now() - 1*day).toISOString() },
    { id: 'demo-n-3', user_id: DEMO_ID, type: 'BADGE_EARNED',     title: '🏊 Badge Earned!', message: 'You unlocked "Water Child". Check your badge collection!', priority: 'high',   data: {}, read: false, created_at: new Date(Date.now() - 2*day).toISOString() },
    { id: 'demo-n-4', user_id: DEMO_ID, type: 'GOAL_COMPLETED',   title: 'Goal Achieved!',   message: 'You completed "Earn 300 credits this month"!',             priority: 'high',   data: {}, read: true,  created_at: new Date(Date.now() - 3*day).toISOString() },
    { id: 'demo-n-5', user_id: DEMO_ID, type: 'WORKOUT_LOGGED',   title: 'Workout Logged',   message: 'Great job! You earned 72 sv.',                            priority: 'low',    data: {}, read: true,  created_at: new Date(Date.now() - 4*day).toISOString() },
    { id: 'demo-n-6', user_id: DEMO_ID, type: 'BADGE_EARNED',     title: '🎯 Badge Earned!', message: 'You unlocked "Allrounder". Check your badge collection!', priority: 'high',   data: {}, read: true,  created_at: new Date(Date.now() - 5*day).toISOString() },
    { id: 'demo-n-7', user_id: DEMO_ID, type: 'STREAK_MILESTONE', title: '30-Day Streak!',   message: 'Your multiplier is now 1.3× — keep it going!',            priority: 'medium', data: {}, read: true,  created_at: new Date(Date.now() - 30*day).toISOString() },
    { id: 'demo-n-8', user_id: DEMO_ID, type: 'BADGE_EARNED',     title: '⌚ Badge Earned!', message: 'You unlocked "Verified Athlete". Garmin connected!',      priority: 'high',   data: {}, read: true,  created_at: new Date(Date.now() - 45*day).toISOString() },
    { id: 'demo-n-9', user_id: DEMO_ID, type: 'GOAL_COMPLETED',   title: 'Goal Achieved!',   message: 'You completed "Cycle 200 km"!',                           priority: 'high',   data: {}, read: true,  created_at: new Date(Date.now() - 30*day).toISOString() },
  ];
  localStorage.setItem('pmsweat_notifications', JSON.stringify(ns));
}
