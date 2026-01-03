import { useMemo } from "react";

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
  const { getWorkouts } = useWorkoutStore();

  return useMemo(() => {
    const easyPaces = new Set(["warmup", "easy", "base", "cooldown"]);
    const hardPaces = new Set(["tempo", "subthreshold", "threshold", "sprint"]);
    let total = 0;
    let easy = 0;
    let hard = 0;

    days.forEach((day) => {
      const dateStr = day.format("YYYY-MM-DD");
      const workouts = getWorkouts(dateStr);
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
  }, [days, getWorkouts]);
};

export default useStats;
