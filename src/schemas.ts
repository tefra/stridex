import { z } from "zod";

export const PaceSchema = z.enum([
  "easy",
  "tempo",
  "sub-threshold",
  "threshold",
  "sprint",
]);

export const DurationUnitSchema = z.enum(["sec", "mi", "km", "m"]);

export const StepSchema = z
  .object({
    type: PaceSchema,
    durationValue: z.number().min(1, "Duration value must be positive"),
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
