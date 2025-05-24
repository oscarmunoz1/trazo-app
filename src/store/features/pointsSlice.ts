import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PointsState {
  points: number;
  level: number;
  addPoints: (amount: number) => void;
  getLevelInfo: () => { name: string; nextLevel: number; pointsToNext: number };
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      points: 0,
      level: 1,
      addPoints: (amount: number) => {
        set((state) => {
          const newPoints = state.points + amount;
          const newLevel = Math.floor(newPoints / 100) + 1;

          return {
            points: newPoints,
            level: newLevel
          };
        });
      },
      getLevelInfo: () => {
        const { points, level } = get();
        const nextLevel = level + 1;
        const pointsNeededForNextLevel = nextLevel * 100;
        const pointsToNext = pointsNeededForNextLevel - points;

        let name = 'Green Beginner';
        if (level >= 5) name = 'Carbon Master';
        else if (level >= 4) name = 'Eco Champion';
        else if (level >= 3) name = 'Sustainability Pro';
        else if (level >= 2) name = 'Green Enthusiast';

        return {
          name,
          nextLevel,
          pointsToNext
        };
      }
    }),
    {
      name: 'trazo-user-points'
    }
  )
);
