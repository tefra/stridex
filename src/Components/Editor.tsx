import React, { useCallback } from "react";

import {
  ActionIcon,
  Button,
  Collapse,
  Fieldset,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { TimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
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

const Editor: React.FC<EditorProps> = ({ date, workout, onComplete }) => {
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

  const handleSave = useCallback(() => {
    if (!form.isValid()) return;
    saveWorkout(date, form.values);
    onComplete();
  }, [date, saveWorkout, onComplete, form]);

  const handleDelete = useCallback(() => {
    deleteWorkout(date, workout.id);
    onComplete();
  }, [date, workout.id, deleteWorkout, onComplete]);

  const generateDescription = useCallback(() => {
    const step = workoutMainStep(form.values);
    const description = stepShorthand(step, t, true, true);
    form.setFieldValue("description", description);
  }, [form, t]);

  return (
    <Stack gap="sm">
      {form.values.steps.map((step, index) => (
        <Fieldset
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          radius="sm"
          legend={
            <Group
              gap="xs"
              justify="space-between"
              style={{ width: "100%" }}
              wrap="nowrap"
            >
              <Text fw={500} size="sm">
                {t("editor.stepLegend", { number: index + 1 })}
              </Text>
              <Tooltip label={t("editor.removeStep")}>
                <ActionIcon
                  color="red"
                  onClick={() => form.removeListItem("steps", index)}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          }
        >
          <Stack gap="xs">
            <Title order={6}>{t("editor.duration")}</Title>
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
                minutesStep={1}
                secondsStep={5}
                value={formatDurationDisplay(step.durationValue)}
                onChange={(value) => {
                  const seconds = parseDurationInput(value);
                  form.setFieldValue(`steps.${index}.durationValue`, seconds);
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
                  allowDeselect={false}
                  data={[
                    { value: "km", label: t("units.km.label") },
                    { value: "m", label: t("units.m.label") },
                  ]}
                  {...form.getInputProps(`steps.${index}.durationUnit`)}
                />
              </Group>
            )}
            <Group grow align="end" gap="xs">
              <Select
                allowDeselect={false}
                label={t("editor.pace")}
                data={StepSchema.shape.pace.options.map((value) => ({
                  value,
                  label: t(`paces.${value}.label`),
                }))}
                {...form.getInputProps(`steps.${index}.pace`)}
              />
              <NumberInput
                label={t("editor.reps")}
                min={1}
                {...form.getInputProps(`steps.${index}.repetitions`)}
                onChange={(value) => {
                  form
                    .getInputProps(`steps.${index}.repetitions`)
                    .onChange(value);

                  if (value === 1) {
                    form.setFieldValue(`steps.${index}.recoveryValue`, 0);
                    form.setFieldValue(`steps.${index}.recoveryUnit`, "sec");
                    form.setFieldValue(
                      `steps.${index}.skipLastRecovery`,
                      false
                    );
                  }
                }}
              />
            </Group>
          </Stack>
          <Collapse in={step.repetitions > 1}>
            <Stack gap="xs" mt="xl">
              <Title order={6}>{t("editor.recovery")}</Title>
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
                  form.setFieldValue(`steps.${index}.recoveryValue`, 0);
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
                    form.setFieldValue(`steps.${index}.recoveryValue`, seconds);
                  }}
                />
              ) : (
                <Group grow align="end" gap="xs">
                  <NumberInput
                    min={0.01}
                    step={1.0}
                    {...form.getInputProps(`steps.${index}.recoveryValue`)}
                    onChange={(value) => {
                      form
                        .getInputProps(`steps.${index}.recoveryValue`)
                        .onChange(value);
                      if (value === 0) {
                        form.setFieldValue(
                          `steps.${index}.skipLastRecovery`,
                          false
                        );
                      }
                    }}
                  />
                  <Select
                    allowDeselect={false}
                    data={[
                      { value: "km", label: t("units.km.label") },
                      { value: "m", label: t("units.m.label") },
                    ]}
                    {...form.getInputProps(`steps.${index}.recoveryUnit`)}
                  />
                </Group>
              )}
              <Switch
                disabled={step.recoveryValue === 0}
                label={t("editor.skipLastRecovery")}
                mb={5}
                {...form.getInputProps(`steps.${index}.skipLastRecovery`, {
                  type: "checkbox",
                })}
              />
            </Stack>
          </Collapse>
        </Fieldset>
      ))}
      <Button
        fullWidth
        leftSection={<IconPlus size="16" />}
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
            <ActionIcon onClick={generateDescription}>
              <IconWand size="16" />
            </ActionIcon>
          </Tooltip>
        }
      />
      <Group justify="flex-end" mt="xl">
        <Button onClick={onComplete} variant="default">
          {t("editor.cancel")}
        </Button>
        {workout.id ? (
          <Button color="red" onClick={handleDelete}>
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

export default Editor;
