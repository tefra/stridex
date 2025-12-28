import React from "react";

import { useDndContext } from "@dnd-kit/core";
import { Group, Text } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";

import { PaceType } from "@/schemas";
import { workoutMainStep } from "@/utils";

import type { Workout } from "@/schemas";

const ActiveWorkout: React.FC = () => {
  const { active } = useDndContext();

  if (!active?.data.current?.workout) return null;

  const workout = active.data.current.workout as Workout;
  const mainStep = workoutMainStep(workout);
  const mainStepInfo = PaceType[mainStep.pace];

  return (
    <Group justify="flex-start">
      <IconGripVertical
        size="14"
        style={{
          cursor: "move",
          outline: "none",
          marginRight: "1",
          opacity: "0.7",
        }}
      />
      <Text c={mainStepInfo.color} fw={700} size="sm">
        {workout.description}
      </Text>
    </Group>
  );
};

export default ActiveWorkout;
