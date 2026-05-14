import { create } from 'zustand';

function getInitialState() {
  try {
    const session = JSON.parse(localStorage.getItem('pmsweat_session'));
    if (session) {
      const users = JSON.parse(localStorage.getItem('pmsweat_users')) || {};
      const user = Object.values(users).find(u => u.id === session.userId);
      if (user) {
        return {
          user: { id: user.id, email: user.email, name: user.name, handle: user.handle },
          isLoggedIn: true,
        };
      }
    }
  } catch (_) {}
  return { user: null, isLoggedIn: false };
}

export const useAuthStore = create((set, get) => ({
  ...getInitialState(),
  isLoading: false,
  error: null,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const existingUsers = JSON.parse(localStorage.getItem('pmsweat_users')) || {};
      if (existingUsers[userData.email]) throw new Error('Email already registered');
      const hashedPassword = btoa(userData.password);
      const user = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        handle: userData.handle,
        age: userData.age,
        city: userData.city,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };
      existingUsers[userData.email] = user;
      localStorage.setItem('pmsweat_users', JSON.stringify(existingUsers));
      localStorage.setItem('pmsweat_session', JSON.stringify({
        userId: user.id,
        email: user.email,
        token: btoa(user.id + ':' + Date.now()),
      }));
      set({
        user: { id: user.id, email: user.email, name: user.name, handle: user.handle },
        isLoggedIn: true,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const existingUsers = JSON.parse(localStorage.getItem('pmsweat_users')) || {};
      const user = existingUsers[email];
      if (!user) throw new Error('No account found with this email');
      if (user.password !== btoa(password)) throw new Error('Incorrect password');
      localStorage.setItem('pmsweat_session', JSON.stringify({
        userId: user.id,
        email: user.email,
        token: btoa(user.id + ':' + Date.now()),
      }));
      set({
        user: { id: user.id, email: user.email, name: user.name, handle: user.handle },
        isLoggedIn: true,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('pmsweat_session');
    set({ user: null, isLoggedIn: false });
  },

  restoreSession: () => set(getInitialState()),

  updateProfile: (data) => {
    const { user } = get();
    if (!user) return;
    const users = JSON.parse(localStorage.getItem('pmsweat_users')) || {};
    users[user.email] = { ...users[user.email], ...data };
    localStorage.setItem('pmsweat_users', JSON.stringify(users));
    set({ user: { ...user, ...data } });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
