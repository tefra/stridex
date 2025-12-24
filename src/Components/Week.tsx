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

const Week: React.FC = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToMonday);

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });

  const formatWeekday = (date: Date) =>
    date.toLocaleDateString(undefined, { weekday: "long" });

  const formatFullDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };
  return (
    <div>
      <Center>
        <Title mb="lg" order={2}>
          Week of {formatFullDate(monday)}
        </Title>
      </Center>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 7 }} spacing="md">
        {days.map((day) => (
          <Card
            key={day.toISOString().slice(0, 10)}
            withBorder
            padding="sm"
            radius="md"
            shadow="sm"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Stack gap="xs" style={{ flexGrow: 1 }}>
              <Group justify="space-between">
                <Text fw={700} size="sm">
                  {formatWeekday(day)}
                </Text>
                <Text c={isWeekend(day) ? "red" : "dimmed"} fw={700} size="xl">
                  {day.getDate()}
                </Text>
              </Group>
              <Text c="gray.6" mt="auto" size="sm">
                Rest
                {day.getDay() === 1 &&
                  " — extra long note for Mondays to test height matching. This makes Monday much taller than the others!"}
              </Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default Week;
