import React from "react";

import { Box, Group, Paper, SimpleGrid, Text } from "@mantine/core";

import Day from "@/Components/Day";
import useStats from "@/hooks/useStats";
import { calculatePercentDelta } from "@/utils/formatting";

import type { Dayjs } from "dayjs";

interface Props {
  startDay: Dayjs;
  month: number;
  year: number;
}

const Week: React.FC<Props> = ({ startDay, year, month }) => {
  const days = Array.from({ length: 7 }, (_, i) => startDay.add(i, "day"));
  const stats = useStats(days);
  const previousStartDay = startDay.subtract(1, "week");
  const previousWeekDays = Array.from({ length: 7 }, (_, i) =>
    previousStartDay.add(i, "day")
  );
  const previousStats = useStats(previousWeekDays);
  const delta = calculatePercentDelta(stats.total, previousStats.total);

  const summaries = [
    {
      label: "Total",
      value: `${stats.total.toFixed(1)}km`,
      color: "indigo",
    },
    {
      label: "Easy",
      value: `${stats.easy.toFixed(1)}km`,
      color: "teal",
    },
    {
      label: "Speed",
      value: `${stats.speed.toFixed(1)}km`,
      color: "orange",
    },
    {
      label: "Ratio",
      value: `${stats.easyPercent.toFixed(0)}/${stats.speedPercent.toFixed(0)}`,
      color: stats.easyPercent < 80 ? "yellow" : "green",
    },
    {
      label: "Delta",
      value: `${delta.toFixed(1)}%`,
      color: delta >= 0 ? "lime" : "red",
      badge: true,
    },
  ];

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
        <Box>
          {summaries.map((item) => (
            <Group key={item.label} justify="space-between" wrap="nowrap">
              <Text
                fw={600}
                size="sm"
                style={{ minWidth: 50, textAlign: "right" }}
              >
                {item.label}:
              </Text>
              <Text c={item.color} fw={700} size="sm" ta="left">
                {item.value}
              </Text>
            </Group>
          ))}
        </Box>
      </Paper>
    </SimpleGrid>
  );
};

export default Week;
