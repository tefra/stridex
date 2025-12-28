import React from "react";

import { Stack } from "@mantine/core";
import { IconZzz } from "@tabler/icons-react";

import WorkoutItem from "@/Components/Workout";
import useWorkoutStore from "@/store";

interface WorkoutsProps {
  date: string;
}

const Workouts: React.FC<WorkoutsProps> = ({ date }) => {
  const workouts = useWorkoutStore().getWorkouts(date);

  return (
    <Stack gap={0}>
      {workouts.length === 0 ? (
        <IconZzz size={16} />
      ) : (
        workouts.map((workout) => (
          <WorkoutItem key={workout.id} date={date} workout={workout} />
        ))
      )}
    </Stack>
  );
};

export default Workouts;
