import React from "react";

import { useDndContext } from "@dnd-kit/core";
import { Group, Text } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";

import { PaceType } from "@/schemas";
import { workoutMainStep } from "@/utils/formatting";

import type { Workout } from "@/schemas";

const ActiveWorkout: React.FC = () => {
  const { active } = useDndContext();

  if (!active?.data.current?.workout) return null;

  const workout = active.data.current.workout as Workout;
  const mainStep = workoutMainStep(workout);
  const mainStepInfo = PaceType[mainStep.pace];

  return (
    <Group
      gap={0}
      justify="flex-start"
      style={{
        flexWrap: "nowrap",
        width: "100%",
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
      />
      <Text c={mainStepInfo.color} fw={700} size="sm" truncate="end">
        {workout.description}
      </Text>
    </Group>
  );
};

export default ActiveWorkout;
