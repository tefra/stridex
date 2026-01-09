import React, { useMemo } from "react";

import { Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => startDay.add(i, "day")),
    [startDay]
  );
  const stats = useStats(days);
  const previousWeekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        startDay.subtract(1, "week").add(i, "day")
      ),
    [startDay]
  );
  const previousStats = useStats(previousWeekDays);
  const delta = useMemo(
    () => calculatePercentDelta(stats.total, previousStats.total),
    [stats.total, previousStats.total]
  );

  const summaries = useMemo(
    () => [
      {
        label: t("week.total"),
        value: `${stats.total.toFixed(1)}km`,
        color: "indigo",
      },
      {
        label: t("week.easy"),
        value: `${stats.easy.toFixed(1)}km`,
        color: "teal",
      },
      {
        label: t("week.hard"),
        value: `${stats.hard.toFixed(1)}km`,
        color: "orange",
      },
      {
        label: t("week.ratio"),
        value: `${stats.easyPercent.toFixed(0)}/${stats.hardPercent.toFixed(0)}`,
        color: stats.easyPercent < 80 ? "yellow" : "green",
      },
      {
        label: t("week.delta"),
        value: delta === null ? t("week.na") : `${delta.toFixed(1)}%`,
        color: delta === null || delta > 0 ? "lime" : "red",
        badge: true,
      },
    ],
    [t, stats, delta]
  );

  return (
    <SimpleGrid cols={{ base: 1, sm: 8 }} mb="lg" spacing="xs">
      {days.map((day) => (
        <Day
          key={day.format("YYYY-MM-DD")}
          current={day.year() === year && day.month() === month}
          date={day}
        />
      ))}
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack gap={0}>
          <Text c="dimmed" fw={700} hiddenFrom="sm" mb="xs" size="sm">
            {t("week.summary")}
          </Text>
          {summaries.map((item) => (
            <Group key={item.label} gap={4} justify="space-between">
              <Text fw={600} size="sm" ta="right">
                {item.label}:
              </Text>
              <Text c={item.color} fw={700} size="sm" ta="left">
                {item.value}
              </Text>
            </Group>
          ))}
        </Stack>
      </Paper>
    </SimpleGrid>
  );
};

export default Week;
