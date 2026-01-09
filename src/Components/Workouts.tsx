import React from "react";

import { SortableContext } from "@dnd-kit/sortable";
import { Stack } from "@mantine/core";
import { IconZzz } from "@tabler/icons-react";
import { useShallow } from "zustand/react/shallow";

import WorkoutItem from "@/Components/Workout";
import useWorkoutStore from "@/stores/useWorkoutStore";

interface WorkoutsProps {
  date: string;
}

const Workouts: React.FC<WorkoutsProps> = ({ date }) => {
  const workouts = useWorkoutStore(
    useShallow((state) => state.getWorkouts(date))
  );

  return (
    <SortableContext items={workouts.map((workout) => workout.id)}>
      <Stack gap={0}>
        {workouts.length === 0 ? (
          <IconZzz size={16} />
        ) : (
          workouts.map((workout, index) => (
            <WorkoutItem
              key={workout.id}
              date={date}
              index={index}
              workout={workout}
            />
          ))
        )}
      </Stack>
    </SortableContext>
  );
};

export default Workouts;
