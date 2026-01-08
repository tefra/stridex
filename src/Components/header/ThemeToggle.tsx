import React from "react";

import { ActionIcon, Tooltip, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const ThemeToggle: React.FC = () => {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Tooltip
      label={
        colorScheme === "dark"
          ? t("theme.switchToLight")
          : t("theme.switchToDark")
      }
    >
      <ActionIcon onClick={toggleColorScheme}>
        {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
      </ActionIcon>
    </Tooltip>
  );
};

export default ThemeToggle;
