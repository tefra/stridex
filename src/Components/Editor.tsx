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
} from "@mantine/core";
import { TimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconPlus, IconX } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";

import { PaceSchema, WorkoutSchema } from "@/schemas";
import useWorkoutStore from "@/store";
import { formatDurationDisplay, parseDurationInput } from "@/utils";

import type { Workout } from "@/schemas";

interface EditorProps {
  date: string;
  editing: boolean;
  workout: Workout;
  onComplete: () => void;
}

const paceOptions = PaceSchema.options;

const Editor: React.FC<EditorProps> = ({
  date,
  editing,
  workout,
  onComplete,
}) => {
  const { saveWorkout, deleteWorkout } = useWorkoutStore();

  const form = useForm({
    initialValues: structuredClone(workout),
    validate: zod4Resolver(WorkoutSchema),
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  const addStep = () => {
    form.insertListItem("steps", {
      type: "easy",
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

  return (
    <Stack gap="lg">
      <Stack gap="md">
        {form.values.steps.map((step, index) => (
          <Fieldset key={randomId()} legend={`Step ${index + 1}`} radius="sm">
            <Grid align="end" gutter="md">
              <Grid.Col span={6}>
                <Input.Wrapper label="Duration">
                  <Group grow align="start" gap="xs">
                    <SegmentedControl
                      size="sm"
                      value={step.durationUnit === "sec" ? "time" : "distance"}
                      data={[
                        { label: "Time", value: "time" },
                        { label: "Distance", value: "distance" },
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
                          step={0.1}
                          {...form.getInputProps(
                            `steps.${index}.durationValue`
                          )}
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
                  data={paceOptions}
                  label="Type"
                  {...form.getInputProps(`steps.${index}.type`)}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  label="Reps"
                  min={1}
                  {...form.getInputProps(`steps.${index}.repetitions`)}
                />
              </Grid.Col>
            </Grid>
            <Grid align="end" gutter="md">
              <Grid.Col span={6}>
                <Input.Wrapper label="Recovery">
                  <Group grow align="start" gap="xs">
                    <SegmentedControl
                      size="sm"
                      value={step.recoveryUnit === "sec" ? "time" : "distance"}
                      data={[
                        { label: "Time", value: "time" },
                        { label: "Distance", value: "distance" },
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
                          {...form.getInputProps(
                            `steps.${index}.recoveryValue`
                          )}
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
                  label="Skip last recovery"
                  mb={5}
                  {...form.getInputProps(`steps.${index}.skipLastRecovery`, {
                    type: "checkbox",
                  })}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Group align="end" h="100%" justify="flex-end">
                  <ActionIcon
                    color="red"
                    onClick={() => form.removeListItem("steps", index)}
                    size="sm"
                    variant="subtle"
                  >
                    <IconX size={20} />
                  </ActionIcon>
                </Group>
              </Grid.Col>
            </Grid>
          </Fieldset>
        ))}
      </Stack>
      <Button
        fullWidth
        leftSection={<IconPlus size={14} />}
        onClick={addStep}
        variant="light"
      >
        Add Step
      </Button>
      <Group justify="flex-end" mt="xl">
        <Button onClick={onComplete} variant="default">
          Cancel
        </Button>
        {editing ? (
          <Button color="red" onClick={handleDelete} variant="filled">
            Delete
          </Button>
        ) : null}
        <Button disabled={!form.isValid()} onClick={handleSave}>
          Save
        </Button>
      </Group>
    </Stack>
  );
};

export default Editor;
