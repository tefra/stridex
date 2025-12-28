import React from "react";

import { Box, Group, Paper, SimpleGrid, Text } from "@mantine/core";

import Day from "@/Components/Day";
import useWorkoutStore from "@/store";

import type { Dayjs } from "dayjs";

interface Props {
  days: Dayjs[];
  month: number;
  year: number;
}

const Week: React.FC<Props> = ({ days, month, year }) => {
  const { getWorkouts } = useWorkoutStore();

  let totalKm = 0;
  let easyKm = 0;
  let speedKm = 0;
  const easyPaces = new Set(["easy", "warmup", "cooldown", "base"]);
  const speedPaces = new Set(["tempo", "subthreshold", "threshold", "sprint"]);

  days.forEach((day) => {
    const dateStr = day.format("YYYY-MM-DD");
    const workouts = getWorkouts(dateStr);

    workouts.forEach((workout) => {
      workout.steps.forEach((step) => {
        let distanceKm = 0;
        if (step.durationUnit === "km") {
          distanceKm = step.durationValue * step.repetitions;
        } else if (step.durationUnit === "m") {
          distanceKm = (step.durationValue * step.repetitions) / 1000;
        }

        totalKm += distanceKm;
        if (easyPaces.has(step.pace)) easyKm += distanceKm;
        else if (speedPaces.has(step.pace)) speedKm += distanceKm;
      });
    });
  });

  const easyPercent = totalKm > 0 ? Math.round((easyKm / totalKm) * 100) : 0;
  const speedPercent = totalKm > 0 ? Math.round((speedKm / totalKm) * 100) : 0;

  const total = totalKm.toFixed(1);
  const easy = easyKm.toFixed(1);
  const speed = speedKm.toFixed(1);

  return (
    <SimpleGrid cols={8} mb="lg" spacing="xs">
      {days.map((day) => (
        <Day
          key={day.format("YYYY-MM-DD")}
          current={day.year() === year && day.month() === month}
          date={day}
        />
      ))}
      <Paper
        withBorder
        p="sm"
        radius="md"
        style={{
          minHeight: 120,
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box pr="md">
          <Group align="center" justify="space-between">
            <Text fw={600} size="sm">
              Total:
            </Text>
            <Text c="blue" fw={700} size="sm">
              {total} km
            </Text>
          </Group>
          <Group align="center" justify="space-between">
            <Text fw={600} size="sm">
              Easy:
            </Text>
            <Text c="cyan" fw={700} size="sm">
              {easy} km
            </Text>
          </Group>
          <Group align="center" justify="space-between">
            <Text fw={600} size="sm">
              Speed:
            </Text>
            <Text c="orange" fw={700} size="sm">
              {speed} km
            </Text>
          </Group>
          <Group align="center" justify="space-between">
            <Text fw={600} size="sm">
              Ratio:
            </Text>
            <Text
              c={easyPercent >= 80 ? "green.6" : "red.7"}
              fw={700}
              size="sm"
            >
              {easyPercent}/{speedPercent}
            </Text>
          </Group>
        </Box>
      </Paper>
    </SimpleGrid>
  );
};

export default Week;
