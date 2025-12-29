import React, { useMemo } from "react";

import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { Box, SimpleGrid, Text } from "@mantine/core";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";

import ActiveWorkout from "@/Components/ActiveWorkout";
import Week from "@/Components/Week";
import useWorkoutStore from "@/store";

import type { DragEndEvent } from "@dnd-kit/core";

import type { Workout } from "@/schemas";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

interface Props {
  month: number;
  year: number;
}

const Month: React.FC<Props> = ({ month, year }) => {
  const { saveWorkout, reorderWorkouts } = useWorkoutStore();

  const mondays = useMemo(() => {
    const startOfMonth = dayjs().year(year).month(month).startOf("month");
    const endOfMonth = startOfMonth.endOf("month");
    let currentMonday = startOfMonth.startOf("isoWeek");

    const weekStarts = [];
    while (currentMonday.isBefore(endOfMonth)) {
      weekStarts.push(currentMonday);
      currentMonday = currentMonday.add(7, "day");
    }
    return weekStarts;
  }, [year, month]);

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

  const onDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (!over || !active) return;

    const sourceWorkout = active.data.current?.workout as Workout;
    const sourceDate = active.data.current?.date as string;
    const sourceId = active.id as string;
    const targetId = over.id as string;
    const targetType = over.data.current?.type as string;

    if (targetType === "week") {
      saveWorkout(targetId, { ...sourceWorkout, id: "" });
    } else {
      reorderWorkouts(sourceDate, sourceId, targetId);
    }
  };
  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
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
        {mondays.map((monday) => (
          <Week
            key={monday.toISOString()}
            month={month}
            startDay={monday}
            year={year}
          />
        ))}
      </Box>
      <DragOverlay>
        <ActiveWorkout />
      </DragOverlay>
    </DndContext>
  );
};

export default Month;
