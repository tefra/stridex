export const parseDurationInput = (input: string): number => {
  const [hours, minutes, seconds] = input.trim().split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const formatDurationDisplay = (seconds: number): string => {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};
