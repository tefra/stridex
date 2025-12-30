import { del as idel, get as iget, set as iset } from "idb-keyval";
import { v7 as uuid7 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { Workout } from "@/schemas";

interface WorkoutState {
  workoutsByDate: Record<string, Workout[]>;
}

interface WorkoutActions {
  getWorkout: (date: string, id: string) => Workout | undefined;
  getWorkouts: (date: string) => Workout[];
  saveWorkout: (date: string, workout: Workout) => void;
  deleteWorkout: (date: string, id: string) => void;
  reorderWorkouts: (date: string, activeId: string, overId: string) => void;
}

type WorkoutStore = WorkoutState & WorkoutActions;

const useWorkoutStore = create<WorkoutStore>()(
  persist(
    immer((set, get) => ({
      workoutsByDate: {},
      getWorkout: (date: string, id: string) =>
        get().workoutsByDate[date]?.find((w) => w.id === id),
      getWorkouts: (date) => get().workoutsByDate[date] || [],
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
            workouts.push({ ...data, id: uuid7() });
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
      reorderWorkouts: (date, activeId, overId) =>
        set((draft) => {
          const dayWorkouts = draft.workoutsByDate[date];
          if (!dayWorkouts) return;
          const oldIndex = dayWorkouts.findIndex((w) => w.id === activeId);
          const newIndex = dayWorkouts.findIndex((w) => w.id === overId);

          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex)
            return;

          const [moved] = dayWorkouts.splice(oldIndex, 1);
          dayWorkouts.splice(newIndex, 0, moved);
        }),
    })),
    {
      name: "stridex-workouts",
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const val = await iget(name);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return val ?? null;
        },
        setItem: async (name, value) => {
          await iset(name, value);
        },
        removeItem: async (name) => {
          await idel(name);
        },
      })),
    }
  )
);

export default useWorkoutStore;
