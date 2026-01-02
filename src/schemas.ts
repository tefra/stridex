import { z } from "zod";

const paces = [
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

export const durations = ["sec", "km", "m"];

export const paceColors = {
  warmup: "blue.6",
  easy: "cyan.6",
  base: "teal.6",
  tempo: "orange.6",
  subthreshold: "yellow.6",
  threshold: "pink.7",
  sprint: "red.7",
  cooldown: "indigo.6",
} as const;

export const StepSchema = z
  .object({
    pace: z.enum(paces),
    durationValue: z.number().positive(),
    durationUnit: z.enum(durations),
    repetitions: z.number().int().min(1),
    recoveryValue: z.number().min(0),
    recoveryUnit: z.enum(durations),
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
      path: ["recoveryUnit"],
    }
  );

export const WorkoutSchema = z.object({
  id: z.string(),
  description: z.string().nonempty(),
  steps: z.array(StepSchema).min(1),
});

export type Step = z.infer<typeof StepSchema>;
export type Workout = z.infer<typeof WorkoutSchema>;
