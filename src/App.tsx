import React, { useState } from "react";

import { AppShell, Group, Text, Title } from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";

import Month from "@/Components/Month";

import type { Dayjs } from "dayjs";

const App = (): React.ReactElement => {
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs>(dayjs());
  const openMonthPicker = () => {
    modals.open({
      withCloseButton: false,
      size: "auto",
      children: (
        <MonthPicker
          allowDeselect={false}
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

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Title>StrideX</Title>
            <Group gap={0} ml="xl" visibleFrom="sm">
              <Text fw={700} onClick={openMonthPicker} size="md">
                {currentDateTime.format("MMMM YYYY")}
              </Text>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Month month={currentDateTime.month()} year={currentDateTime.year()} />
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
