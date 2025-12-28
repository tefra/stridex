import React, { useState } from "react";

import {
  ActionIcon,
  Anchor,
  AppShell,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import dayjs from "dayjs";

import Month from "@/Components/Month";

import type { Dayjs } from "dayjs";

const App = (): React.ReactElement => {
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs>(dayjs());
  const openMonthPicker = () => {
    modals.open({
      withCloseButton: false,
      size: "auto",
      key: currentDateTime.format("YYYY-MM"),
      children: (
        <MonthPicker
          allowDeselect={false}
          date={currentDateTime.toDate()}
          value={currentDateTime.toDate()}
          onChange={(value) => {
            if (value) {
              setCurrentDateTime(dayjs(value));
              modals.closeAll();
            }
          }}
        />
      ),
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDateTime((prev) => prev.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDateTime((prev) => prev.add(1, "month"));
  };

  return (
    <AppShell footer={{ height: 30 }} header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Title>StrideX</Title>
            <Group gap={0} ml="xl" visibleFrom="sm">
              <ActionIcon
                color="gray"
                onClick={goToPreviousMonth}
                size="md"
                variant="subtle"
              >
                <IconChevronLeft size={18} />
              </ActionIcon>
              <Text fw={700} onClick={openMonthPicker} size="md">
                {currentDateTime.format("MMM YYYY")}
              </Text>
              <ActionIcon
                color="gray"
                onClick={goToNextMonth}
                size="md"
                variant="subtle"
              >
                <IconChevronRight size={18} />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Month month={currentDateTime.month()} year={currentDateTime.year()} />
      </AppShell.Main>
      <AppShell.Footer ta="center">
        <Group align="center" h="100%" justify="center" px="md">
          <Text c="dimmed" size="xs">
            Plan your strides ×{" "}
            <Anchor
              c="dimmed"
              href="https://github.com/tefra/stridex"
              rel="noopener noreferrer"
              size="xs"
              target="_blank"
            >
              tefra/stridex
            </Anchor>
          </Text>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
};

export default App;
