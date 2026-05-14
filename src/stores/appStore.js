import { create } from 'zustand';

const useAppStore = create((set) => ({
  accent: 'indigo',
  density: 'regular',
  font: 'geist',
  setAccent: (accent) => set({ accent }),
  setDensity: (density) => set({ density }),
  setFont: (font) => set({ font }),
}));

export default useAppStore;
