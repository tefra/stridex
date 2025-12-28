import React, { useMemo } from "react";

import { DndContext } from "@dnd-kit/core";
import { Box, SimpleGrid, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";

import Week from "@/Components/Week";
import useWorkoutStore from "@/store";

import type { DragEndEvent } from "@dnd-kit/core";
import type { Dayjs } from "dayjs";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

interface Props {
  month: number;
  year: number;
}

const Month: React.FC<Props> = ({ month, year }) => {
  const { saveWorkout } = useWorkoutStore();
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

  const copyWorkout = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (!over || !active.data.current) return;

    if (over.id === active.data.current.date) return;

    saveWorkout(over.id as string, {
      id: randomId("workout"),
      ...active.data.current.workout,
    });
  };

  return (
    <DndContext onDragEnd={copyWorkout}>
      <Box p={0}>
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
        {weeks.map((week) => (
          <Week key={week[0].isoWeek()} days={week} month={month} year={year} />
        ))}
      </Box>
    </DndContext>
  );
};

export default Month;
