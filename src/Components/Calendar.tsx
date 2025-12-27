import React, { useMemo } from "react";

import { Box, Group, Paper, SimpleGrid, Text } from "@mantine/core";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";

import { openEditor } from "@/Components/Editor";
import Workouts from "@/Components/Workouts";
import useWorkoutStore from "@/store";

import type { Dayjs } from "dayjs";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

interface Props {
  month: number;
  year: number;
}

const Calendar: React.FC<Props> = ({ month, year }) => {
  const { getWorkouts } = useWorkoutStore();

  console.log(`${year}-${month}`);
  const calendarDays = useMemo(() => {
    const startOfMonth = dayjs().year(year).month(month).date(1);
    const endOfMonth = startOfMonth.endOf("month");

    const startOfGrid = startOfMonth.isoWeekday(1);
    const endOfGrid = endOfMonth.isoWeekday(7);
    const days: Dayjs[] = [];
    let current = startOfGrid;
    while (current.isBefore(endOfGrid) || current.isSame(endOfGrid, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }
    return days;
  }, [year, month]);

  const weeks = useMemo(() => {
    const result: Dayjs[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  const getWeekTotals = (weekDays: Dayjs[]) => {
    let totalKm = 0;
    let easyKm = 0;
    let speedKm = 0;

    const easyPaces = new Set(["easy", "warmup", "cooldown", "base"]);
    const speedPaces = new Set([
      "tempo",
      "subthreshold",
      "threshold",
      "sprint",
    ]);

    weekDays.forEach((day) => {
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
    const speedPercent =
      totalKm > 0 ? Math.round((speedKm / totalKm) * 100) : 0;

    return {
      total: totalKm.toFixed(1),
      easy: easyKm.toFixed(1),
      speed: speedKm.toFixed(1),
      easyPercent,
      speedPercent,
    };
  };

  const weekdayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Total",
  ];

  const isWeekend = (date: Dayjs) => date.day() === 0 || date.day() === 6;
  const isCurrentMonth = (date: Dayjs) =>
    date.year() === year && date.month() === month;

  return (
    <Box p="md">
      <SimpleGrid cols={8} mb="xs" spacing="xs">
        {weekdayNames.map((name, index) => (
          <Text
            key={name}
            c="dimmed"
            fw={index === 7 ? 700 : 600}
            pr={index === 7 ? "md" : 0}
            size="sm"
            ta={index === 7 ? "right" : "center"}
          >
            {name}
          </Text>
        ))}
      </SimpleGrid>

      {weeks.map((week) => {
        const { total, easy, speed, easyPercent, speedPercent } =
          getWeekTotals(week);
        return (
          <SimpleGrid key={week[0].isoWeek()} cols={8} mb="lg" spacing="xs">
            {week.map((date) => {
              const key = date.format("YYYY-MM-DD");
              return (
                <Paper
                  key={key}
                  withBorder
                  p="sm"
                  radius="md"
                  style={{
                    opacity: isCurrentMonth(date) ? 1 : 0.5,
                    minHeight: 120,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text
                    c={isWeekend(date) ? "red" : "gray"}
                    fw={700}
                    onClick={() => openEditor(key, null)}
                    size="md"
                    style={{ cursor: "pointer" }}
                    ta="right"
                  >
                    {date.date()}
                  </Text>
                  <Box mt="auto" pt="sm">
                    <Workouts date={key} />
                  </Box>
                </Paper>
              );
            })}
            <Paper
              withBorder
              p="sm"
              radius="md"
              style={{
                minHeight: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                backgroundColor: "var(--mantine-color-gray-0)",
              }}
            >
              <Box pr="md">
                <Group align="center" justify="space-between">
                  <Text c="gray.7" fw={600} size="sm">
                    Total:
                  </Text>
                  <Text c="blue" fw={700} size="sm">
                    {total} km
                  </Text>
                </Group>
                <Group align="center" justify="space-between">
                  <Text c="gray.7" fw={600} size="sm">
                    Easy:
                  </Text>
                  <Text c="cyan" fw={700} size="sm">
                    {easy} km
                  </Text>
                </Group>
                <Group align="center" justify="space-between">
                  <Text c="gray.7" fw={600} size="sm">
                    Speed:
                  </Text>
                  <Text c="orange" fw={700} size="sm">
                    {speed} km
                  </Text>
                </Group>
                <Group align="center" justify="space-between">
                  <Text c="gray.7" fw={600} size="sm">
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
      })}
    </Box>
  );
};

export default Calendar;
