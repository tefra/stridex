export type DurationType = "time" | "distance";
export type StepType = "warmup" | "interval" | "recovery" | "cooldown";

export interface Step {
  type: StepType;
  durationType: DurationType;
  durationValue: number;
  durationUnit: string;
  description: string;
}

export interface Repeat {
  times: number;
  skipLastRecovery: boolean;
  steps: Step[];
}

export interface Workout {
  steps: Step[];
  description: string;
}
