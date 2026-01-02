import React from "react";

import {
  ActionIcon,
  Button,
  Fieldset,
  Grid,
  Group,
  Input,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { TimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconPlus, IconWand, IconX } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useTranslation } from "react-i18next";

import { StepSchema, WorkoutSchema } from "@/schemas";
import useWorkoutStore from "@/stores/useWorkoutStore";
import { stepShorthand, workoutMainStep } from "@/utils/formatting";
import { formatDurationDisplay, parseDurationInput } from "@/utils/time";

import type { Workout } from "@/schemas";

interface EditorProps {
  date: string;
  workout: Workout;
  onComplete: () => void;
}

export const Editor: React.FC<EditorProps> = ({
  date,
  workout,
  onComplete,
}) => {
  const { t } = useTranslation();
  const { saveWorkout, deleteWorkout } = useWorkoutStore();

  const form = useForm({
    initialValues: structuredClone(workout),
    validate: zod4Resolver(WorkoutSchema),
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  const addStep = () => {
    form.insertListItem("steps", {
      pace: "easy",
      durationValue: 5,
      durationUnit: "km",
      repetitions: 1,
      recoveryValue: 0,
      recoveryUnit: "sec",
    });
  };

  const handleSave = () => {
    if (!form.isValid()) return;
    saveWorkout(date, form.values);
    onComplete();
  };

  const handleDelete = () => {
    deleteWorkout(date, workout.id);
    onComplete();
  };

  const generateDescription = () => {
    const step = workoutMainStep(form.values);
    const description = stepShorthand(step, t, true, true);
    form.setFieldValue("description", description);
  };

  return (
    <Stack gap="sm">
      {form.values.steps.map((step, index) => (
        <Fieldset
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          legend={t("editor.stepLegend", { number: index + 1 })}
          radius="sm"
        >
          <Grid align="end" gutter="md">
            <Grid.Col span={6}>
              <Input.Wrapper label={t("editor.duration")}>
                <Group grow align="start" gap="xs">
                  <SegmentedControl
                    size="sm"
                    value={step.durationUnit === "sec" ? "time" : "distance"}
                    data={[
                      { label: t("editor.time"), value: "time" },
                      { label: t("editor.distance"), value: "distance" },
                    ]}
                    onChange={(value) => {
                      form.setFieldValue(
                        `steps.${index}.durationUnit`,
                        value === "time" ? "sec" : "km"
                      );
                      form.setFieldValue(
                        `steps.${index}.durationValue`,
                        value === "time" ? 2700 : 10
                      );
                    }}
                  />
                  {step.durationUnit === "sec" ? (
                    <TimePicker
                      clearable
                      withDropdown
                      withSeconds
                      hoursStep={1}
                      minutesStep={5}
                      secondsStep={5}
                      value={formatDurationDisplay(step.durationValue)}
                      onChange={(value) => {
                        const seconds = parseDurationInput(value);
                        form.setFieldValue(
                          `steps.${index}.durationValue`,
                          seconds
                        );
                      }}
                    />
                  ) : (
                    <Group grow align="end" gap="xs">
                      <NumberInput
                        min={0.01}
                        step={1.0}
                        {...form.getInputProps(`steps.${index}.durationValue`)}
                      />
                      <Select
                        data={["mi", "km", "m"]}
                        {...form.getInputProps(`steps.${index}.durationUnit`)}
                      />
                    </Group>
                  )}
                </Group>
              </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                allowDeselect={false}
                label={t("editor.pace")}
                data={StepSchema.shape.pace.options.map((value) => ({
                  value,
                  label: t(`paces.${value}.label`),
                }))}
                {...form.getInputProps(`steps.${index}.pace`)}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberInput
                label={t("editor.reps")}
                min={1}
                {...form.getInputProps(`steps.${index}.repetitions`)}
              />
            </Grid.Col>
          </Grid>
          <Grid align="end" gutter="md">
            <Grid.Col span={6}>
              <Input.Wrapper label={t("editor.recovery")}>
                <Group grow align="start" gap="xs">
                  <SegmentedControl
                    size="sm"
                    value={step.recoveryUnit === "sec" ? "time" : "distance"}
                    data={[
                      { label: t("editor.time"), value: "time" },
                      { label: t("editor.distance"), value: "distance" },
                    ]}
                    onChange={(value) => {
                      form.setFieldValue(
                        `steps.${index}.recoveryUnit`,
                        value === "time" ? "sec" : "km"
                      );
                      form.setFieldValue(
                        `steps.${index}.recoveryValue`,
                        value === "time" ? 60 : 1
                      );
                    }}
                  />
                  {step.recoveryUnit === "sec" ? (
                    <TimePicker
                      clearable
                      withDropdown
                      withSeconds
                      hoursStep={1}
                      minutesStep={1}
                      secondsStep={5}
                      value={formatDurationDisplay(step.recoveryValue)}
                      onChange={(value) => {
                        const seconds = parseDurationInput(value);
                        form.setFieldValue(
                          `steps.${index}.recoveryValue`,
                          seconds
                        );
                      }}
                    />
                  ) : (
                    <Group grow align="end" gap="xs">
                      <NumberInput
                        min={0.01}
                        step={0.1}
                        {...form.getInputProps(`steps.${index}.recoveryValue`)}
                      />
                      <Select
                        data={["mi", "km", "m"]}
                        {...form.getInputProps(`steps.${index}.recoveryUnit`)}
                      />
                    </Group>
                  )}
                </Group>
              </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={4}>
              <Switch
                disabled={step.repetitions === 1}
                label={t("editor.skipLastRecovery")}
                mb={5}
                {...form.getInputProps(`steps.${index}.skipLastRecovery`, {
                  type: "checkbox",
                })}
              />
            </Grid.Col>
            <Grid.Col span={2} ta="right">
              <Tooltip label={t("editor.removeStep")}>
                <ActionIcon
                  color="red"
                  onClick={() => form.removeListItem("steps", index)}
                  size="sm"
                  variant="subtle"
                >
                  <IconX size={20} />
                </ActionIcon>
              </Tooltip>
            </Grid.Col>
          </Grid>
        </Fieldset>
      ))}
      <Button
        fullWidth
        leftSection={<IconPlus size={14} />}
        onClick={addStep}
        variant="light"
      >
        {t("editor.addStep")}
      </Button>
      <TextInput
        required
        label={t("editor.description")}
        {...form.getInputProps(`description`)}
        rightSection={
          <Tooltip label={t("editor.generate")}>
            <ActionIcon onClick={generateDescription} variant="subtle">
              <IconWand size={16} />
            </ActionIcon>
          </Tooltip>
        }
      />
      <Group justify="flex-end" mt="xl">
        <Button onClick={onComplete} variant="default">
          {t("editor.cancel")}
        </Button>
        {workout.id ? (
          <Button color="red" onClick={handleDelete} variant="filled">
            {t("editor.delete")}
          </Button>
        ) : null}
        <Button disabled={!form.isValid()} onClick={handleSave}>
          {t("editor.save")}
        </Button>
      </Group>
    </Stack>
  );
};

export const openEditor = (
  date: string,
  workout: Workout,
  title: string
): void => {
  modals.open({
    title,
    size: "xl",
    children: (
      <Editor
        date={date}
        onComplete={() => modals.closeAll()}
        workout={workout}
      />
    ),
  });
};
