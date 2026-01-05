import { paceIntensityOrder } from "@/schemas";

import type { TFunction } from "i18next";

import type { Step, Workout } from "@/schemas";

export const stepShorthand = (
  step: Step,
  t: TFunction,
  useAbbreviations = false,
  skipRest = false
): string => {
  const pace = useAbbreviations
    ? t(`paces.${step.pace}.abbr`)
    : t(`paces.${step.pace}.label`);

  const getUnit = (unitKey: string) => t(`units.${unitKey}.abbr`);

  if (step.repetitions === 1) {
    return `${pace} ${step.durationValue}${getUnit(step.durationUnit)}`;
  }

  let repStr = `${step.repetitions}×${step.durationValue}${getUnit(step.durationUnit)} @ ${pace}`;
  if (!skipRest && step.recoveryValue && step.recoveryValue > 0) {
    const skip = step.skipLastRecovery ? t("formatting.skipLast") : "";
    repStr += ` [${step.recoveryValue}${getUnit(step.recoveryUnit)}${skip}]`;
  }
  return repStr;
};

export const workoutShorthand = (workout: Workout, t: TFunction): string =>
  workout.steps.map((s) => stepShorthand(s, t)).join(" + ");

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
