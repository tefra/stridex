import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { Workout } from "@/schemas";

interface WorkoutStore {
  workoutsByDate: Record<string, Workout[]>;
  saveWorkout: (date: string, workout: Workout) => void;
  deleteWorkout: (date: string, id: string) => void;
  getWorkouts: (date: string) => Workout[];
  getWorkout: (date: string, id: string) => Workout | undefined;
}

const useWorkoutStore = create<WorkoutStore>()(
  persist(
    immer((set, get) => ({
      workoutsByDate: {},

      getWorkouts: (date) => get().workoutsByDate[date] || [],

      getWorkout: (date: string, id: string) =>
        get().workoutsByDate[date]?.find((w) => w.id === id),

      saveWorkout: (date: string, data: Workout) => {
        set((draft) => {
          if (!draft.workoutsByDate[date]) {
            draft.workoutsByDate[date] = [];
          }

          const workouts = draft.workoutsByDate[date];
          const existingIndex = workouts.findIndex((w) => w.id === data.id);

          if (existingIndex !== -1) {
            workouts[existingIndex] = data;
          } else {
            workouts.push(data);
          }
        });
      },

      deleteWorkout: (date: string, workoutId: string) => {
        set((draft) => {
          if (draft.workoutsByDate[date]) {
            draft.workoutsByDate[date] = draft.workoutsByDate[date].filter(
              (w) => w.id !== workoutId
            );
            if (draft.workoutsByDate[date].length === 0) {
              delete draft.workoutsByDate[date];
            }
          }
        });
      },
    })),
    {
      name: "stridex-workouts",
    }
  )
);

export default useWorkoutStore;
