import { z } from "zod";

export const PACES = {
  warmup: { label: "Warm-Up", abbr: "WU" },
  easy: { label: "Easy", abbr: "E" },
  base: { label: "Base", abbr: "B" },
  tempo: { label: "Tempo", abbr: "T" },
  subthreshold: { label: "Sub-Threshold", abbr: "ST" },
  threshold: { label: "Threshold", abbr: "TH" },
  sprint: { label: "Sprint", abbr: "S" },
  cooldown: { label: "Cool-Down", abbr: "CD" },
} as const;

export const DURATIONS = {
  sec: { type: "time", label: "Seconds" },
  mi: { type: "distance", label: "Miles" },
  km: { type: "distance", label: "Kilometers" },
  m: { type: "distance", label: "Meters" },
};

export const DISTANCE_OPTIONS = Object.entries(DURATIONS)
  .filter(([, { type }]) => type === "distance")
  .map(([value, { label }]) => ({
    value,
    label,
  }));

export const PACE_OPTIONS = Object.entries(PACES).map(([value, info]) => ({
  value,
  label: info.label,
}));

export const PaceSchema = z.enum(Object.keys(PACES));

export const DurationUnitSchema = z.enum(Object.keys(DURATIONS));

export const StepSchema = z
  .object({
    pace: PaceSchema,
    durationValue: z.number().positive("Duration value must be positive"),
    durationUnit: DurationUnitSchema,
    repetitions: z.number().int().min(1, "At least 1 repetition"),
    recoveryValue: z.number().min(0, "Recovery value must be a positive"),
    recoveryUnit: DurationUnitSchema.clone().nullish(),
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
  steps: z.array(StepSchema).min(1, "Workout must have at least one step"),
});

export type Step = z.infer<typeof StepSchema>;
export type Workout = z.infer<typeof WorkoutSchema>;
