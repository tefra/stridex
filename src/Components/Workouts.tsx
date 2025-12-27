import React from "react";

import { ActionIcon, Group, Menu, Stack, Text, Tooltip } from "@mantine/core";
import { IconDots, IconEdit, IconTrash, IconZzz } from "@tabler/icons-react";

import { openEditor } from "@/Components/Editor";
import { PaceType } from "@/schemas";
import useWorkoutStore from "@/store";

import type { Workout } from "@/schemas";

interface WorkoutsProps {
  date: string;
}

const Workouts: React.FC<WorkoutsProps> = ({ date }) => {
  const { getWorkouts, deleteWorkout } = useWorkoutStore();
  const workouts = getWorkouts(date);
  const getMainStep = (workout: Workout) => {
    const paceIntensityOrder = [
      "sprint",
      "threshold",
      "subthreshold",
      "tempo",
      "base",
      "easy",
      "cooldown",
      "warmup",
    ] as const;

    return workout.steps.reduce((primary, step) => {
      const currentIntensity = paceIntensityOrder.indexOf(step.pace);
      const primaryIntensity = paceIntensityOrder.indexOf(primary.pace);
      return currentIntensity < primaryIntensity ? step : primary;
    });
  };

  const formatWorkout = (workout: Workout): string =>
    workout.steps
      .map((step) => {
        const pace = PaceType[step.pace].label;

        if (step.repetitions === 1) {
          return `${pace} ${step.durationValue}${step.durationUnit}`;
        }

        // Repeat block
        let repStr = `${step.repetitions} × ${step.durationValue}${step.durationUnit} @ ${pace}`;

        if (step.recoveryValue && step.recoveryValue > 0) {
          const skip = step.skipLastRecovery ? " (skip last)" : "";
          repStr += ` [${step.recoveryValue}${step.recoveryUnit}${skip}]`;
        }

        return repStr;
      })
      .join(" + ");

  return (
    <Stack gap={0} style={{ width: "100%" }}>
      {workouts.map((workout) => {
        const mainStep = getMainStep(workout);
        const paceInfo = PaceType[mainStep.pace];

        return (
          <Group key={workout.id} justify="space-between">
            <Tooltip withArrow label={formatWorkout(workout)}>
              <Text c={paceInfo.color} fw={700} size="sm">
                {workout.description}
              </Text>
            </Tooltip>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon
                  color="gray"
                  onClick={(e) => e.stopPropagation()}
                  size="sm"
                  variant="subtle"
                >
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={16} />}
                  onClick={() => openEditor(date, workout)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconEdit size={16} />}
                  onClick={() => openEditor(date, workout)}
                >
                  Copy to
                </Menu.Item>
                <Menu.Divider />

                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => deleteWorkout(date, workout.id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        );
      })}
      {workouts.length === 0 && <IconZzz size={16} />}
    </Stack>
  );
};

export default Workouts;
