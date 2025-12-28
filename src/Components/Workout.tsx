import React from "react";

import { Group, Text, Tooltip } from "@mantine/core";

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

  return (
    <Group key={workout.id} justify="space-between">
      <Tooltip label={workoutShorthand(workout)}>
        <Text
          c={mainStepInfo.color}
          fw={700}
          onClick={() => openEditor(date, workout)}
          size="sm"
        >
          {workout.description}
        </Text>
      </Tooltip>
    </Group>
  );
};

export default WorkoutItem;
