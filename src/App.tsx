import React, { useState } from "react";

import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Menu,
  Popover,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { DatesProvider, MonthPicker } from "@mantine/dates";
import {
  IconBrandGithub,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconLanguage,
  IconMoon,
  IconSun,
  IconUpload,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import GoogleDriveButton from "@/Components/GoogleDriveButton";
import Month from "@/Components/Month";
import useAutoSync from "@/hooks/useAutoSync";
import { supportedLanguages } from "@/i18n";
import { fromJson, toJson } from "@/utils/localDataSync";

import type { Dayjs } from "dayjs";

const App: React.FC = () => {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  dayjs.locale(locale);
  useAutoSync();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs>(dayjs());
  const [monthPickerOpened, setMonthPickerOpened] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const goToPreviousMonth = () => {
    setMonthPickerOpened(false);
    setCurrentDateTime((prev) => prev.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setMonthPickerOpened(false);
    setCurrentDateTime((prev) => prev.add(1, "month"));
  };

  return (
    <DatesProvider settings={{ locale }}>
      <Container fluid m={0} p={0}>
        <Group justify="space-between" m="sm" wrap="wrap">
          <Title>{t("app.title")}</Title>
          <Group align="center" gap="sm">
            <GoogleDriveButton />
            <Tooltip label={t("backup.import")}>
              <ActionIcon
                color="gray"
                onClick={fromJson}
                size="sm"
                variant="subtle"
              >
                <IconUpload />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("backup.export")}>
              <ActionIcon
                color="gray"
                onClick={toJson}
                size="sm"
                variant="subtle"
              >
                <IconDownload />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow label={t("github.viewSource")} position="bottom">
              <ActionIcon
                color="gray"
                component="a"
                href="https://github.com/tefra/stridex"
                radius="md"
                rel="noopener noreferrer"
                size="sm"
                target="_blank"
                variant="subtle"
              >
                <IconBrandGithub />
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
                size="sm"
                variant="subtle"
              >
                {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
              </ActionIcon>
            </Tooltip>
            <Menu shadow="md">
              <Menu.Target>
                <ActionIcon c="gray" size="sm" variant="subtle">
                  <IconLanguage />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {supportedLanguages.map((lng) => {
                  const isCurrent = locale.startsWith(lng);

                  return (
                    <Menu.Item
                      key={lng}
                      c={isCurrent ? "blue" : undefined}
                      onClick={() => changeLanguage(lng)}
                      style={{ fontWeight: isCurrent ? 600 : 400 }}
                    >
                      {lng.toUpperCase()}
                    </Menu.Item>
                  );
                })}
              </Menu.Dropdown>
            </Menu>
            <Popover
              withArrow
              onChange={setMonthPickerOpened}
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
                      <IconChevronLeft />
                    </ActionIcon>
                  </Tooltip>
                  <Button
                    c="gray"
                    onClick={() => setMonthPickerOpened((o) => !o)}
                    px={5}
                    size="sm"
                    variant="transparent"
                  >
                    {currentDateTime.locale(locale).format("MMM YYYY")}
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
                      <IconChevronRight />
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
                      setMonthPickerOpened(false);
                    }
                  }}
                />
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Group>
      </Container>
      <Divider my="md" />
      <Container fluid mt="md" p="sm">
        <Month month={currentDateTime.month()} year={currentDateTime.year()} />
      </Container>
      <Container fluid m={0} p="sm">
        <Text c="dimmed" size="xs" ta="center">
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
      </Container>
    </DatesProvider>
  );
};

export default App;
