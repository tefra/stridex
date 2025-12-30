import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const parseDurationInput = (input: string): number => {
  const parts = input.trim().split(":").map(Number);
  const [hours, minutes, seconds] = parts;
  return hours * 3600 + minutes * 60 + seconds;
};
export const formatDurationDisplay = (seconds: number): string => {
  if (seconds <= 0) return "00:00:00";

  const dur = dayjs.duration(seconds, "seconds");
  const hours = Math.floor(dur.asHours());
  const minutes = dur.minutes();
  const secs = dur.seconds();

  return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
