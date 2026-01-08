import React from "react";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconDownload, IconUpload } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { fromJson, toJson } from "@/utils/localDataSync";

const BackupButtons: React.FC = () => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Tooltip label={t("backup.import")}>
        <ActionIcon onClick={fromJson}>
          <IconUpload />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t("backup.export")}>
        <ActionIcon onClick={toJson}>
          <IconDownload />
        </ActionIcon>
      </Tooltip>
    </React.Fragment>
  );
};

export default BackupButtons;
