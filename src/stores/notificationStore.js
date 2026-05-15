import { create } from 'zustand';

const NOTIF_KEY = 'pmsweat_notifications';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadAll(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY)) || {};
    return all[userId] || [];
  } catch { return []; }
}

function saveAll(userId, notifs) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY)) || {};
    all[userId] = notifs;
    localStorage.setItem(NOTIF_KEY, JSON.stringify(all));
  } catch {}
}

const TEMPLATES = {
  WORKOUT_LOGGED:    (d) => ({ title: 'Workout Logged',      message: `Great job! You earned ${d.credits} sv.`,                          priority: 'low' }),
  GOAL_COMPLETED:    (d) => ({ title: 'Goal Achieved!',       message: `You completed "${d.goalTitle}"!`,                                 priority: 'high' }),
  STREAK_MILESTONE:  (d) => ({ title: `${d.days}-Day Streak!`, message: `Your multiplier is now ${d.multiplier}x — keep it up!`,          priority: 'medium' }),
  STREAK_WARNING:    ()  => ({ title: 'Streak at Risk',       message: 'Work out today to keep your streak alive!',                       priority: 'medium' }),
  BADGE_EARNED:      (d) => ({ title: `${d.icon} Badge Earned!`, message: `You unlocked "${d.name}". Check your badge collection!`,       priority: 'high' }),
};

export const useNotificationStore = create((set, get) => ({
  notifications: [],

  loadNotifications: (userId) => {
    set({ notifications: loadAll(userId) });
  },

  addNotification: (userId, type, data = {}) => {
    const tmpl = TEMPLATES[type] ? TEMPLATES[type](data) : { title: 'Update', message: '', priority: 'low' };
    const notif = {
      id: genId(),
      user_id: userId,
      type,
      title: tmpl.title,
      message: tmpl.message,
      priority: tmpl.priority,
      data,
      read: false,
      created_at: new Date().toISOString(),
    };
    const updated = [notif, ...get().notifications].slice(0, 50);
    saveAll(userId, updated);
    set({ notifications: updated });
  },

  markRead: (userId, notifId) => {
    const updated = get().notifications.map(n =>
      n.id === notifId ? { ...n, read: true, read_at: new Date().toISOString() } : n
    );
    saveAll(userId, updated);
    set({ notifications: updated });
  },

  markAllRead: (userId) => {
    const updated = get().notifications.map(n => ({ ...n, read: true }));
    saveAll(userId, updated);
    set({ notifications: updated });
  },

  clearAll: (userId) => {
    saveAll(userId, []);
    set({ notifications: [] });
  },
}));
