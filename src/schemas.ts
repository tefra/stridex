import { z } from "zod";

export const PACES = [
  "warmup",
  "easy",
  "base",
  "tempo",
  "subthreshold",
  "threshold",
  "sprint",
  "cooldown",
] as const;

export const paceIntensityOrder = [
  "sprint",
  "threshold",
  "subthreshold",
  "tempo",
  "base",
  "easy",
  "cooldown",
  "warmup",
] as const;

export const Durations = ["sec", "km", "m"];

export const PaceType = {
  warmup: {
    label: "Warm-Up",
    color: "blue.6",
  },
  easy: {
    label: "Easy",
    color: "cyan.6",
  },
  base: {
    label: "Base",
    color: "teal.6",
  },
  tempo: {
    label: "Tempo",
    color: "orange.6",
  },
  subthreshold: {
    label: "Sub-Threshold",
    color: "yellow.6",
  },
  threshold: {
    label: "Threshold",
    color: "pink.7",
  },
  sprint: {
    label: "Sprint",
    color: "red.7",
  },
  cooldown: {
    label: "Cool-Down",
    color: "indigo.6",
  },
} as const;

export const DurationType = {
  sec: { type: "time", label: "Seconds" },
  mi: { type: "distance", label: "Miles" },
  km: { type: "distance", label: "Kilometers" },
  m: { type: "distance", label: "Meters" },
};

export const PACE_OPTIONS = Object.entries(PaceType).map(([value, info]) => ({
  value,
  label: info.label,
}));

export const StepSchema = z
  .object({
    pace: z.enum(PACES),
    durationValue: z.number().positive("Duration value must be positive"),
    durationUnit: z.enum(Durations),
    repetitions: z.number().int().min(1, "At least 1 repetition"),
    recoveryValue: z.number().min(0, "Recovery value must be a positive"),
    recoveryUnit: z.enum(Durations),
    skipLastRecovery: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.recoveryValue != null && data.recoveryValue > 0) {
        return data.recoveryUnit != null;
      }
      return true;
    },
    {
      message:
        "Recovery unit is required when recovery value is greater than 0",
      path: ["recoveryUnit"],
    }
  );

export const WorkoutSchema = z.object({
  id: z.string(),
  description: z.string().nonoptional(),
  steps: z.array(StepSchema).min(1, "Workout must have at least one step"),
});

export type Step = z.infer<typeof StepSchema>;
export type Workout = z.infer<typeof WorkoutSchema>;
