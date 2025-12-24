import React from "react";

import {
  Card,
  Center,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DateTime } from "luxon";

import WorkoutView from "@/Components/Workout";

const Week: React.FC = () => {
  const monday = DateTime.now().startOf("week");
  const days = [0, 1, 2, 3, 4, 5, 6].map(
    (i): DateTime => monday.plus({ days: i })
  );

  return (
    <div>
      <Center>
        <Title mb="lg" order={2}>
          Week of {monday.toLocaleString(DateTime.DATE_MED)}
        </Title>
      </Center>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 7 }} spacing="md">
        {days.map((day) => {
          const key = day.toISODate() as string;
          return (
            <Card
              key={key}
              withBorder
              padding="sm"
              radius="md"
              shadow="sm"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Stack gap="xs" style={{ flexGrow: 1 }}>
                <Group justify="space-between">
                  <Text fw={700} size="sm">
                    {day.toLocaleString({ weekday: "long" })}
                  </Text>
                  <Text c={day.isWeekend ? "red" : "dimmed"} fw={700} size="xl">
                    {day.toLocaleString({ day: "2-digit" })}
                  </Text>
                </Group>
                <WorkoutView day={key} />
              </Stack>
            </Card>
          );
        })}
        ;
      </SimpleGrid>
    </div>
  );
};

export default Week;
