import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { paceIntensityOrder, PaceType } from "@/schemas";

import type { Step, Workout } from "@/schemas";

dayjs.extend(duration);

export const parseDurationInput = (input: string): number => {
  const parts = input.trim().split(":").map(Number);
  const [hours, minutes, seconds] = parts;
  return hours * 3600 + minutes * 60 + seconds;
};

export const formatDurationDisplay = (seconds: number): string => {
  if (seconds <= 0) return "00:00:00";

  const dur = dayjs.duration(seconds, "seconds");
  const hours = Math.floor(dur.asHours());
  const minutes = dur.minutes();
  const secs = dur.seconds();

  return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const stepShorthand = (
  step: Step,
  useAbbrevations = false,
  skipRest = false
): string => {
  const paceType = PaceType[step.pace];
  const pace = useAbbrevations ? paceType.abbr : paceType.label;

  if (step.repetitions === 1) {
    return `${pace} ${step.durationValue}${step.durationUnit}`;
  }

  let repStr = `${step.repetitions}×${step.durationValue}${step.durationUnit} @ ${pace}`;
  if (!skipRest && step.recoveryValue && step.recoveryValue > 0) {
    const skip = step.skipLastRecovery ? " (skip last)" : "";
    repStr += ` [${step.recoveryValue}${step.recoveryUnit}${skip}]`;
  }
  return repStr;
};

export const workoutShorthand = (workout: Workout): string =>
  workout.steps.map((s) => stepShorthand(s)).join(" + ");

export const workoutMainStep = (workout: Workout): Step =>
  workout.steps.reduce((primary, step) => {
    const currentIntensity = paceIntensityOrder.indexOf(step.pace);
    const primaryIntensity = paceIntensityOrder.indexOf(primary.pace);
    return currentIntensity < primaryIntensity ? step : primary;
  });
