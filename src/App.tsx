import React, { useState } from "react";

import {
  ActionIcon,
  Anchor,
  AppShell,
  Button,
  Group,
  Popover,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
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
import { useTranslation } from "react-i18next";

import GoogleDriveButton from "@/Components/GoogleDriveButton";
import Month from "@/Components/Month";
import useAutoSync from "@/hooks/useAutoSync";
import { fromJson, toJson } from "@/utils/localDataSync";

import type { Dayjs } from "dayjs";

const App: React.FC = () => {
  const { t } = useTranslation();
  useAutoSync();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs>(dayjs());
  const [monthPickerOpened, setMonthPickerOpened] = useState(false);

  const goToPreviousMonth = () => {
    setMonthPickerOpened(false);
    setCurrentDateTime((prev) => prev.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setMonthPickerOpened(false);
    setCurrentDateTime((prev) => prev.add(1, "month"));
  };

  return (
    <AppShell footer={{ height: 30 }} header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group justify="space-between" px={10} style={{ flex: 1 }}>
          <Title>{t("app.title")}</Title>
          <Group align="center" gap="xs" ml="xl" visibleFrom="sm">
            <GoogleDriveButton />
            <Tooltip label={t("backup.import")}>
              <ActionIcon color="gray" onClick={fromJson} variant="subtle">
                <IconUpload size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("backup.export")}>
              <ActionIcon color="gray" onClick={toJson} variant="subtle">
                <IconDownload size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow label={t("github.viewSource")} position="bottom">
              <ActionIcon
                aria-label={t("github.ariaLabel")}
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
                  ? t("theme.switchToLight")
                  : t("theme.switchToDark")
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
            <Popover
              withArrow
              opened={monthPickerOpened}
              shadow="md"
              width="auto"
            >
              <Popover.Target>
                <Group gap={0}>
                  <Tooltip
                    withArrow
                    label={t("nav.previousMonth")}
                    position="bottom"
                  >
                    <ActionIcon
                      c="gray"
                      onClick={goToPreviousMonth}
                      size="sm"
                      variant="transparent"
                    >
                      <IconChevronLeft size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Button
                    c="gray"
                    onClick={() => setMonthPickerOpened((o) => !o)}
                    size="sm"
                    variant="transparent"
                  >
                    {currentDateTime.format("MMM YYYY")}
                  </Button>
                  <Tooltip
                    withArrow
                    label={t("nav.nextMonth")}
                    position="bottom"
                  >
                    <ActionIcon
                      c="gray"
                      onClick={goToNextMonth}
                      size="sm"
                      variant="transparent"
                    >
                      <IconChevronRight size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Popover.Target>
              <Popover.Dropdown>
                <MonthPicker
                  allowDeselect={false}
                  defaultDate={currentDateTime.toDate()}
                  value={currentDateTime.toDate()}
                  onChange={(value) => {
                    if (value) {
                      setCurrentDateTime(dayjs(value));
                    }
                  }}
                />
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Month month={currentDateTime.month()} year={currentDateTime.year()} />
      </AppShell.Main>
      <AppShell.Footer ta="center">
        <Group align="center" h="100%" justify="center" px="md">
          <Text c="dimmed" size="xs">
            {t("footer.tagline")}{" "}
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
