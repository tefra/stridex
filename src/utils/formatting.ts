import { paceIntensityOrder, PaceType } from "@/schemas";

import type { Step, Workout } from "@/schemas";

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
export const calculatePercentDelta = (
  current: number,
  previous: number
): number | null => {
  if (previous === 0) {
    return current > 0 ? null : 0;
  }

  return ((current - previous) / previous) * 100;
};
