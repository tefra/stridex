import React from "react";

import { useDroppable } from "@dnd-kit/core";
import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Text,
  Tooltip,
  useMatches,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { openEditor } from "@/Components/Editor";
import Workouts from "@/Components/Workouts";

import type { Dayjs } from "dayjs";

interface Props {
  date: Dayjs;
  current: boolean;
}

const Day: React.FC<Props> = ({ date, current }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";

  const key = date.format("YYYY-MM-DD");
  const dayFormat = useMatches({ base: "ddd D", sm: "D" });
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
      p={7}
      radius="md"
      style={{
        opacity: current ? 1 : 0.5,
        display: "flex",
        flexDirection: "column",
        borderStyle: isOver ? "dashed" : "solid",
        borderColor: isOver ? "var(--mantine-color-blue-6)" : undefined,
        transition: "background-color 0.2s, border 0.2s",
      }}
    >
      <Group gap={0} justify="space-between">
        <Tooltip withArrow label={t("day.addWorkout")}>
          <ActionIcon c="blue" size={16} variant="subtle">
            <IconPlus
              onClick={() =>
                openEditor(
                  key,
                  { id: "", description: "", steps: [] },
                  t("editor.titleNew", { date: key })
                )
              }
            />
          </ActionIcon>
        </Tooltip>
        <Text c={isWeekend ? "red" : "default"} fw={700} size="md">
          {date.locale(locale).format(dayFormat)}
        </Text>
      </Group>
      <Box hidden={!isOver} mt="auto" pt="sm">
        <Text c="blue.2" fw={700} size="md" ta="center">
          {t("day.dropToCopy")}
        </Text>
      </Box>
      <Box hidden={isOver} mt="auto" pt="sm">
        <Workouts date={key} />
      </Box>
    </Paper>
  );
};

export default Day;
