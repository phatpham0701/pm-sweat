import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  profile: {
    name: 'Minh Ngọc',
    handle: 'minhsweat',
    tier: 3,
    sv: 3284,
    streak: 47,
  },
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates },
  })),
}));

export default useAuthStore;
