import { useMemo } from "react";

import { useShallow } from "zustand/react/shallow";

import useWorkoutStore from "@/stores/useWorkoutStore";

import type { Dayjs } from "dayjs";

interface Stats {
  total: number;
  easy: number;
  hard: number;
  easyPercent: number;
  hardPercent: number;
}

const useStats = (days: Dayjs[]): Stats => {
  const workouts = useWorkoutStore(
    useShallow((state) =>
      days.flatMap((day) => state.getWorkouts(day.format("YYYY-MM-DD")) || [])
    )
  );

  return useMemo(() => {
    const easyPaces = new Set(["warmup", "easy", "base", "cooldown"]);
    const hardPaces = new Set(["tempo", "subthreshold", "threshold", "sprint"]);
    let total = 0;
    let easy = 0;
    let hard = 0;

    workouts.forEach((workout) => {
      workout.steps.forEach((step) => {
        let distance = 0;
        if (step.durationUnit === "km") {
          distance = step.durationValue * step.repetitions;
        } else if (step.durationUnit === "m") {
          distance = (step.durationValue * step.repetitions) / 1000;
        }

        total += distance;
        if (easyPaces.has(step.pace)) {
          easy += distance;
        } else if (hardPaces.has(step.pace)) {
          hard += distance;
        }
      });
    });

    const easyPercent = total > 0 ? Math.round((easy / total) * 100) : 0;
    const hardPercent = total > 0 ? 100 - easyPercent : 0;

    return {
      total,
      easy,
      hard,
      easyPercent,
      hardPercent,
    };
  }, [workouts]);
};

export default useStats;
