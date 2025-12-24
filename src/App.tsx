import React from "react";

import {
  AppShell,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Week from "@/Components/Week";

const App = (): React.ReactElement => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="sm">
          <Burger hiddenFrom="sm" onClick={toggle} opened={opened} size="sm" />
          <Title>StrideX</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AppShell.Section grow component={ScrollArea} my="md" px="md">
          <NavLink href="#" label="Navbar link" />
        </AppShell.Section>
        <AppShell.Section p="md">
          <Group>
            <Text c="dimmed" mt="xl" size="sm" ta="center">
              Plan your strides
            </Text>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Week />
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
