import React, { useCallback, useMemo, useState } from "react";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Popover,
  SimpleGrid,
  Text,
  Tooltip,
} from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import { useTranslation } from "react-i18next";

import ActiveWorkout from "@/Components/ActiveWorkout";
import Week from "@/Components/Week";
import useWorkoutStore from "@/stores/useWorkoutStore";

import type { DragEndEvent } from "@dnd-kit/core";
import type { Dayjs } from "dayjs";

import type { Workout } from "@/schemas";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const Month: React.FC = () => {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const { saveWorkout, reorderWorkouts } = useWorkoutStore();
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs>(dayjs());
  const month = currentDateTime.month();
  const year = currentDateTime.year();
  const formattedMonthYear = currentDateTime.locale(locale).format("MMMM YYYY");
  const [monthPickerOpened, setMonthPickerOpened] = useState(false);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDateTime((prev) => prev.subtract(1, "month"));
    setMonthPickerOpened(false);
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDateTime((prev) => prev.add(1, "month"));
    setMonthPickerOpened(false);
  }, []);

  const handleMonthPickerChange = useCallback((value: string | null) => {
    if (value) {
      setCurrentDateTime(dayjs(value));
      setMonthPickerOpened(false);
    }
  }, []);

  const mondays = useMemo(() => {
    const startOfMonth = dayjs().year(year).month(month).startOf("month");
    const endOfMonth = startOfMonth.endOf("month");
    let currentMonday = startOfMonth.startOf("isoWeek");

    const weekStarts = [];
    while (currentMonday.isBefore(endOfMonth)) {
      weekStarts.push(currentMonday);
      currentMonday = currentMonday.add(7, "day");
    }
    return weekStarts;
  }, [year, month]);

  const headers = useMemo(() => {
    const days = [1, 2, 3, 4, 5, 6, 7].map((i) =>
      dayjs().isoWeekday(i).locale(locale).format("dddd")
    );
    return [...days, t("week.summary")];
  }, [locale, t]);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const sourceWorkout = active.data.current?.workout as Workout | undefined;
      const sourceDate = active.data.current?.date as string | undefined;
      const sourceId = active.id as string;
      const targetId = over.id as string;
      const targetType = over.data.current?.type as string | undefined;

      if (!sourceWorkout || !sourceDate) return;

      if (targetType === "week") {
        saveWorkout(targetId, { ...sourceWorkout, id: "" });
      } else {
        reorderWorkouts(sourceDate, sourceId, targetId);
      }
    },
    [saveWorkout, reorderWorkouts]
  );

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <Box p={0}>
        <Popover
          withArrow
          onChange={setMonthPickerOpened}
          opened={monthPickerOpened}
          shadow="md"
          width="auto"
        >
          <Popover.Target>
            <Group gap={0} mx="auto" my="xl" w="fit-content">
              <Tooltip
                withArrow
                label={t("nav.previousMonth")}
                position="bottom"
              >
                <ActionIcon onClick={goToPreviousMonth}>
                  <IconChevronLeft />
                </ActionIcon>
              </Tooltip>
              <Button
                color="gray"
                onClick={() => setMonthPickerOpened((o) => !o)}
                px={5}
                size="compact-md"
                variant="subtle"
              >
                {formattedMonthYear}
              </Button>
              <Tooltip label={t("nav.nextMonth")} position="bottom">
                <ActionIcon onClick={goToNextMonth}>
                  <IconChevronRight />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Popover.Target>
          <Popover.Dropdown>
            <MonthPicker
              allowDeselect={false}
              defaultDate={currentDateTime.toDate()}
              onChange={handleMonthPickerChange}
              value={currentDateTime.toDate()}
            />
          </Popover.Dropdown>
        </Popover>

        <SimpleGrid cols={8} mb="xs" spacing="xs" visibleFrom="sm">
          {headers.map((name, index) => (
            <Text
              key={name}
              c="dimmed"
              fw={index === 7 ? 700 : 600}
              pr={index === 7 ? "md" : 0}
              ta={index === 7 ? "right" : "center"}
            >
              {name}
            </Text>
          ))}
        </SimpleGrid>
        {mondays.map((monday) => (
          <Week
            key={monday.format("YYYY-MM-DD")}
            month={month}
            startDay={monday}
            year={year}
          />
        ))}
      </Box>
      <DragOverlay>
        <ActiveWorkout />
      </DragOverlay>
    </DndContext>
  );
};

export default Month;
