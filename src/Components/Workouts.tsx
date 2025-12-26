import React from "react";

import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";

import Editor from "@/Components/Editor";
import useWorkoutStore from "@/store";

import type { Workout } from "@/schemas";

interface WorkoutsProps {
  date: string;
}

const Workouts: React.FC<WorkoutsProps> = ({ date }) => {
  const { getWorkouts } = useWorkoutStore();
  const workouts = getWorkouts(date);

  const openEditor = (workout: Workout | null) => {
    modals.open({
      title: workout ? "Edit Workout" : "New Workout",
      size: "xl",
      children: (
        <Editor
          date={date}
          editing={workout !== null}
          onComplete={() => modals.closeAll()}
          workout={workout ?? { id: randomId("workout"), steps: [] }}
        />
      ),
    });
  };

  const formatWorkout = (workout: Workout): string => {
    if (workout.steps.length === 0) return "Empty workout";

    return workout.steps
      .map((step) => {
        const pace = step.type.charAt(0).toUpperCase() + step.type.slice(1);

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
  };

  return (
    <Stack gap="xs">
      {workouts.length === 0 ? (
        <Text c="dimmed" size="sm">
          No workouts yet
        </Text>
      ) : (
        workouts.map((workout) => (
          <Text
            key={workout.id}
            onClick={() => openEditor(workout)}
            size="sm"
            style={{ cursor: "pointer" }}
          >
            • {formatWorkout(workout)}
          </Text>
        ))
      )}

      <Group justify="flex-end" mt="xs">
        <ActionIcon onClick={() => openEditor(null)} size="sm" variant="light">
          <IconPlus size={16} />
        </ActionIcon>
      </Group>
    </Stack>
  );
};

export default Workouts;
