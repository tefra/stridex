import React, { useMemo, useState } from "react";

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

  const [monthPickerOpened, setMonthPickerOpened] = useState(false);
  const goToPreviousMonth = () => {
    setMonthPickerOpened(false);
    setCurrentDateTime((prev) => prev.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setMonthPickerOpened(false);
    setCurrentDateTime((prev) => prev.add(1, "month"));
  };

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

  const headers = [
    dayjs().isoWeekday(1).format("dddd"),
    dayjs().isoWeekday(2).format("dddd"),
    dayjs().isoWeekday(3).format("dddd"),
    dayjs().isoWeekday(4).format("dddd"),
    dayjs().isoWeekday(5).format("dddd"),
    dayjs().isoWeekday(6).format("dddd"),
    dayjs().isoWeekday(7).format("dddd"),
    t("week.summary"),
  ];

  const onDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (!over || !active) return;

    const sourceWorkout = active.data.current?.workout as Workout;
    const sourceDate = active.data.current?.date as string;
    const sourceId = active.id as string;
    const targetId = over.id as string;
    const targetType = over.data.current?.type as string;

    if (targetType === "week") {
      saveWorkout(targetId, { ...sourceWorkout, id: "" });
    } else {
      reorderWorkouts(sourceDate, sourceId, targetId);
    }
  };

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
                {currentDateTime.locale(locale).format("MMMM YYYY")}
              </Button>
              <Tooltip withArrow label={t("nav.nextMonth")} position="bottom">
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
            key={monday.toISOString()}
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
