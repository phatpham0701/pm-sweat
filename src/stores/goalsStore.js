import { create } from 'zustand';

const GOALS_KEY = 'pmsweat_goals';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function loadAll(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(GOALS_KEY)) || {};
    return all[userId] || [];
  } catch { return []; }
}

function saveAll(userId, goals) {
  try {
    const all = JSON.parse(localStorage.getItem(GOALS_KEY)) || {};
    all[userId] = goals;
    localStorage.setItem(GOALS_KEY, JSON.stringify(all));
  } catch {}
}

export const useGoalsStore = create((set, get) => ({
  goals: [],

  loadGoals: (userId) => {
    set({ goals: loadAll(userId) });
  },

  addGoal: (userId, goalData) => {
    const goal = {
      id: genId(),
      user_id: userId,
      title: goalData.title,
      description: goalData.description || '',
      goal_type: goalData.goal_type,
      target_value: Number(goalData.target_value),
      current_value: 0,
      period: goalData.period,
      start_date: new Date().toISOString(),
      is_completed: false,
      completed_at: null,
      created_at: new Date().toISOString(),
    };
    const updated = [...get().goals, goal];
    saveAll(userId, updated);
    set({ goals: updated });
    return goal;
  },

  deleteGoal: (userId, goalId) => {
    const updated = get().goals.filter(g => g.id !== goalId);
    saveAll(userId, updated);
    set({ goals: updated });
  },

  updateProgress: (userId, workouts) => {
    const goals = get().goals;
    if (!goals.length) return [];
    const newlyCompleted = [];
    const weekStart = getWeekStart();

    const updated = goals.map(goal => {
      if (goal.is_completed) return goal;
      const startDate = new Date(goal.start_date);
      const relevant = workouts.filter(w => new Date(w.created_at) >= startDate);

      let currentValue = 0;
      switch (goal.goal_type) {
        case 'workouts_per_week':
          currentValue = workouts.filter(w => new Date(w.created_at) >= weekStart).length;
          break;
        case 'total_credits':
          currentValue = relevant.reduce((s, w) => s + (w.sweat_credits_earned || 0), 0);
          break;
        case 'distance_km':
          currentValue = Math.round(relevant.reduce((s, w) => s + (w.distance_km || 0), 0) * 10) / 10;
          break;
        default:
          break;
      }

      const isCompleted = currentValue >= goal.target_value;
      if (isCompleted && !goal.is_completed) {
        newlyCompleted.push({ ...goal, current_value: currentValue });
      }

      return {
        ...goal,
        current_value: currentValue,
        is_completed: isCompleted,
        completed_at: isCompleted && !goal.completed_at ? new Date().toISOString() : goal.completed_at,
      };
    });

    saveAll(userId, updated);
    set({ goals: updated });
    return newlyCompleted;
  },
}));
