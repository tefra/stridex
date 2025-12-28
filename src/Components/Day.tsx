import React from "react";

import { Box, Paper, Text } from "@mantine/core";

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

  return (
    <Paper
      key={key}
      withBorder
      p="sm"
      radius="md"
      style={{
        opacity: current ? 1 : 0.5,
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text
        c={isWeekend ? "red" : "gray"}
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
};

export default Day;
