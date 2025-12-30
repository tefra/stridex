import dayjs from "dayjs";

import useWorkoutStore from "@/stores/workouts";

export const toJson = (): void => {
  const state = useWorkoutStore.getState();
  const data = state.workoutsByDate;
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `stride-backup-${dayjs().format("YYYY-MM-DD")}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const fromJson = (): void => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (typeof data !== "object" || data === null) {
          throw new Error("Invalid data");
        }
        useWorkoutStore.setState({ workoutsByDate: data });
      } catch (err) {
        alert("Invalid backup file");
      }
    };
    reader.readAsText(file);
  };
  input.click();
};
