import React from "react";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const GithubLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tooltip withArrow label={t("github.viewSource")} position="bottom">
      <ActionIcon
        component="a"
        href="https://github.com/tefra/stridex"
        target="_blank"
      >
        <IconBrandGithub />
      </ActionIcon>
    </Tooltip>
  );
};

export default GithubLink;
