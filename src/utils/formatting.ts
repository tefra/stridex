import { paceIntensityOrder } from "@/schemas";

import type { TFunction } from "i18next";

import type { Step, Workout } from "@/schemas";

export const stepShorthand = (
  step: Step,
  t: TFunction,
  useAbbreviations = false,
  skipRest = false
): string => {
  const getDuration = (value: number, unit: string) => {
    if (unit !== "sec") return `${value}${t(`units.${unit}.abbr`)}`;

    if (value < 60) return `${value} ${t("units.sec.abbr")}`;

    return `${Math.round(value / 60)} ${t("units.min.abbr")}`;
  };

  const dur = getDuration(step.durationValue, step.durationUnit);
  const pace = useAbbreviations
    ? t(`paces.${step.pace}.abbr`)
    : t(`paces.${step.pace}.label`);

  if (step.repetitions === 1) {
    return `${pace} ${dur}`;
  }

  let repStr = `${step.repetitions}×${dur} @ ${pace}`;
  if (!skipRest && step.recoveryValue && step.recoveryValue > 0) {
    const skip = step.skipLastRecovery ? t("formatting.skipLast") : "";
    const durr = getDuration(step.recoveryValue, step.recoveryUnit);
    repStr += ` [${durr}${skip}]`;
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
