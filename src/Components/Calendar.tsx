import React, { useMemo } from "react";

import { Box, Paper, SimpleGrid, Text } from "@mantine/core";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";

import { openEditor } from "@/Components/Editor";
import Workouts from "@/Components/Workouts";

import type { Dayjs } from "dayjs";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

interface Props {
  month: number;
  year: number;
}

const Calendar: React.FC<Props> = ({ month, year }) => {
  const calendarDays = useMemo(() => {
    const startOfMonth = dayjs()
      .year(year)
      .month(month - 1)
      .date(1);
    const endOfMonth = startOfMonth.endOf("month");

    const startOfGrid = startOfMonth.isoWeekday(1);
    const endOfGrid = endOfMonth.isoWeekday(7); // Sunday

    const days: Dayjs[] = [];
    let current = startOfGrid;

    while (current.isBefore(endOfGrid) || current.isSame(endOfGrid, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }

    return days;
  }, [year, month]);

  const weekdayNames = Array.from({ length: 7 }, (_, i) =>
    dayjs()
      .isoWeekday(i + 1)
      .format("dddd")
  );

  const isWeekend = (date: Dayjs) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  const isCurrentMonth = (date: Dayjs) =>
    date.year() === year && date.month() + 1 === month;

  return (
    <Box p="md">
      <SimpleGrid cols={7} mb="xs" spacing="xs">
        {weekdayNames.map((day) => (
          <Text key={day} c="dimmed" fw={600} size="sm" ta="center">
            {day}
          </Text>
        ))}
      </SimpleGrid>
      <SimpleGrid cols={7} spacing="xs">
        {calendarDays.map((date) => {
          const key = date.format("YYYY-MM-DD");
          return (
            <Paper
              key={key}
              withBorder
              p="sm"
              radius="md"
              style={{
                opacity: isCurrentMonth(date) ? 1 : 0.5,
                minHeight: 100,
              }}
            >
              <Text
                c={isWeekend(date) ? "red" : "gray"}
                fw={700}
                size="md"
                style={{ cursor: "pointer" }}
                ta="right"
                onClick={() => {
                  openEditor(key, null);
                }}
              >
                {date.date()}
              </Text>
              <Box mt="lg">
                <Workouts date={key} />
              </Box>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Calendar;
