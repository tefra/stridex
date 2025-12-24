import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Workout } from "@/models/workouts";

interface WorkoutStore {
  workouts: Record<string, Workout>;
  setWorkout: (date: string, workout: Workout) => void;
  getWorkout: (date: string) => Workout | undefined;
}

const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workouts: {},
      setWorkout: (date, workout) => {
        set((state) => ({
          workouts: { ...state.workouts, [date]: workout },
        }));
      },
      getWorkout: (date) => get().workouts[date],
    }),
    {
      name: "stridex-workouts",
    }
  )
);
export default useWorkoutStore;
