import { Text } from "@mantine/core";

import useWorkoutStore from "@/stores/workoutStore";

import type React from "react";

const Workout: React.FC<{ day: string }> = ({ day }) => {
  const { getWorkout } = useWorkoutStore();
  const workout = getWorkout(day);

  if (!workout) {
    return (
      <Text c="dimmed" size="sm">
        Rest
      </Text>
    );
  }
  return <Text>foo</Text>;
};

export default Workout;
