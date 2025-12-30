import React from "react";

import { SortableContext } from "@dnd-kit/sortable";
import { Stack } from "@mantine/core";
import { IconZzz } from "@tabler/icons-react";

import WorkoutItem from "@/Components/Workout";
import useWorkoutStore from "@/stores/workouts";

interface WorkoutsProps {
  date: string;
}

const Workouts: React.FC<WorkoutsProps> = ({ date }) => {
  const workouts = useWorkoutStore().getWorkouts(date);

  return (
    <SortableContext items={workouts.map((workout) => workout.id)}>
      <Stack gap={0}>
        {workouts.length === 0 ? (
          <IconZzz size={16} />
        ) : (
          workouts.map((workout) => (
            <WorkoutItem key={workout.id} date={date} workout={workout} />
          ))
        )}
      </Stack>
    </SortableContext>
  );
};

export default Workouts;
