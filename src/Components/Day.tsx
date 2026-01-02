import React from "react";

import { useDroppable } from "@dnd-kit/core";
import { Box, Paper, Text, Tooltip } from "@mantine/core";

import { openEditor } from "@/Components/Editor";
import Workouts from "@/Components/Workouts";

import type { Dayjs } from "dayjs";

interface Props {
  date: Dayjs;
  current: boolean;
}

const Day: React.FC<Props> = ({ date, current }) => {
  const key = date.format("YYYY-MM-DD");
  const isWeekend = date.day() === 0 || date.day() === 6;
  const { setNodeRef, isOver } = useDroppable({
    id: key,
    data: { type: "week" },
  });

  return (
    <Paper
      key={key}
      ref={setNodeRef}
      withBorder
      p="sm"
      radius="md"
      style={{
        opacity: current ? 1 : 0.5,
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
        borderStyle: isOver ? "dashed" : "solid",
        borderColor: isOver ? "var(--mantine-color-blue-6)" : undefined,
        transition: "background-color 0.2s, border 0.2s",
      }}
    >
      <Tooltip withArrow label="Click to add a workout">
        <Text
          c={isWeekend ? "red" : "default"}
          fw={700}
          onClick={() => openEditor(key)}
          size="md"
          style={{ cursor: "pointer" }}
          ta="right"
        >
          {date.date()}
        </Text>
      </Tooltip>
      <Box mt="auto" pt="sm">
        {isOver ? (
          <Text c="blue.2" fw={700} size="md" ta="center">
            Drop to copy
          </Text>
        ) : (
          <Workouts date={key} />
        )}
      </Box>
    </Paper>
  );
};

export default Day;
