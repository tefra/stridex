import { Duration } from "luxon";

// Parse user input (hh:mm:ss, mm:ss, or seconds) to seconds
export const parseDurationInput = (input: string): number => {
  if (!input.trim()) return 0;

  // Luxon can parse "1:30:00", "30:00", "45", etc. directly!
  const duration = Duration.fromISOTime(input.trim(), { locale: "en" });

  if (!duration.isValid) return 0;

  return Math.round(duration.as("seconds"));
};

export const formatDurationDisplay = (seconds: number): string => {
  if (seconds <= 0) return "0:00:00";
  const duration = Duration.fromObject({ seconds });
  return duration.toFormat("h:mm:ss");
};
