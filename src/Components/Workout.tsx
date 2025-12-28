import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Group, Text, Tooltip } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";

import { openEditor } from "@/Components/Editor";
import { PaceType } from "@/schemas";
import { workoutMainStep, workoutShorthand } from "@/utils";

import type { Workout } from "@/schemas";

interface Props {
  date: string;
  workout: Workout;
}

const WorkoutItem: React.FC<Props> = ({ date, workout }) => {
  const mainStep = workoutMainStep(workout);
  const mainStepInfo = PaceType[mainStep.pace];
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
      <Tooltip label={workoutShorthand(workout)}>
        <Text
          c={mainStepInfo.color}
          fw={700}
          onClick={() => openEditor(date, workout)}
          size="sm"
          style={{ cursor: "pointer" }}
          truncate="end"
        >
          {workout.description}
        </Text>
      </Tooltip>
    </Group>
  );
};

export default WorkoutItem;
