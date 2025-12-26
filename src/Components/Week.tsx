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

import Workouts from "@/Components/Workouts";

const Week: React.FC = () => {
  const monday = DateTime.now().startOf("week");
  const days = [0, 1, 2, 3, 4, 5, 6].map(
    (i): DateTime => monday.plus({ days: i })
  );

  return (
    <Group>
      <Center>
        <Title mb="lg" order={2}>
          Week of {monday.toLocaleString(DateTime.DATE_MED)}
        </Title>
      </Center>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 7 }} spacing="md">
        {days.map((day) => {
          const date = day.toISODate() as string;
          return (
            <Card
              key={date}
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
                <Workouts date={date} />
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Group>
  );
};

export default Week;
