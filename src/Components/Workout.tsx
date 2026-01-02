import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Group, Text, Tooltip } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { openEditor } from "@/Components/Editor";
import { paceColors } from "@/schemas";
import { workoutMainStep, workoutShorthand } from "@/utils/formatting";

import type { Workout } from "@/schemas";

interface Props {
  date: string;
  workout: Workout;
  index: number;
}

const WorkoutItem: React.FC<Props> = ({ date, workout, index }) => {
  const { t } = useTranslation();
  const mainStep = workoutMainStep(workout);
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id: workout.id,
    data: { type: "workout", date, workout },
  });

  return (
    <Group
      ref={setNodeRef}
      gap={0}
      justify="flex-start"
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        flexWrap: "nowrap",
      }}
    >
      <IconGripVertical
        size="14"
        style={{
          cursor: "move",
          outline: "none",
          marginRight: "1",
          opacity: "0.7",
          flexShrink: 0,
        }}
        {...listeners}
        {...attributes}
      />
      <Tooltip label={workoutShorthand(workout, t)}>
        <Text
          c={paceColors[mainStep.pace]}
          fw={700}
          size="sm"
          style={{ cursor: "pointer" }}
          truncate="end"
          onClick={() =>
            openEditor(
              date,
              workout,
              t("editor.titleEdit", { date, index: index + 1 })
            )
          }
        >
          {workout.description}
        </Text>
      </Tooltip>
    </Group>
  );
};

export default WorkoutItem;
