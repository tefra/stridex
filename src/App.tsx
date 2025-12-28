import React, { useState } from "react";

import {
  ActionIcon,
  Anchor,
  AppShell,
  Group,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import { modals } from "@mantine/modals";
import {
  IconBrandGithub,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconMoon,
  IconSun,
  IconUpload,
} from "@tabler/icons-react";
import dayjs from "dayjs";

import Month from "@/Components/Month";
import useWorkoutStore from "@/store";

import type { Dayjs } from "dayjs";

const App: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
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

  const exportData = () => {
    const storageKey = "stridex-workouts";
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      alert("No data found to export.");
      return;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseError) {
      alert("Error reading saved data – it may be corrupted.");
      console.error("Parse error:", parseError);
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stride-backup-${dayjs().format("YYYY-MM-DD")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          localStorage.setItem("stridex-workouts", JSON.stringify(data));
          useWorkoutStore.persist.rehydrate();
        } catch (err) {
          alert("Invalid backup file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <AppShell footer={{ height: 30 }} header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Title>StrideX</Title>

            <Group align="center" gap="xs" ml="xl" visibleFrom="sm">
              <Tooltip label="Import backup">
                <ActionIcon color="gray" onClick={importData} variant="subtle">
                  <IconUpload size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Export backup">
                <ActionIcon color="gray" onClick={exportData} variant="subtle">
                  <IconDownload size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                withArrow
                label="View source on GitHub"
                position="bottom"
              >
                <ActionIcon
                  aria-label="GitHub repository"
                  color="gray"
                  component="a"
                  href="https://github.com/tefra/stridex"
                  radius="md"
                  rel="noopener noreferrer"
                  size="lg"
                  target="_blank"
                  variant="subtle"
                >
                  <IconBrandGithub size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                withArrow
                position="bottom"
                label={
                  colorScheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                <ActionIcon
                  c="gray"
                  onClick={() => toggleColorScheme()}
                  size="lg"
                  variant="subtle"
                >
                  {colorScheme === "dark" ? (
                    <IconSun size={20} />
                  ) : (
                    <IconMoon size={20} />
                  )}
                </ActionIcon>
              </Tooltip>
              <Tooltip withArrow label="Previous month" position="bottom">
                <ActionIcon
                  color="gray"
                  onClick={goToPreviousMonth}
                  size="md"
                  variant="subtle"
                >
                  <IconChevronLeft size={18} />
                </ActionIcon>
              </Tooltip>
              <Text
                fw={700}
                onClick={openMonthPicker}
                size="md"
                style={{ cursor: "pointer" }}
              >
                {currentDateTime.format("MMM YYYY")}
              </Text>
              <Tooltip withArrow label="Next month" position="bottom">
                <ActionIcon
                  color="gray"
                  onClick={goToNextMonth}
                  size="md"
                  variant="subtle"
                >
                  <IconChevronRight size={18} />
                </ActionIcon>
              </Tooltip>
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
