import { create } from 'zustand';

interface PointsState {
  points: number;
  addPoints: (amount: number) => void;
  resetPoints: () => void;
}

export const usePointsStore = create<PointsState>((set) => ({
  points: 0,
  addPoints: (amount: number) => set((state) => ({ points: state.points + amount })),
  resetPoints: () => set({ points: 0 })
}));
