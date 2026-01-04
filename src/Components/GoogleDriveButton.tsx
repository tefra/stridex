import React, { useEffect, useState } from "react";

import {
  DrivePicker,
  DrivePickerDocsView,
} from "@googleworkspace/drive-picker-react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useGoogleLogin } from "@react-oauth/google";
import { IconBrandGoogleDrive } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { GOOGLE_APP_ID, GOOGLE_CLIENT_ID } from "@/config";
import useAutoSyncStore from "@/stores/useAutoSyncStore";

const GoogleDriveButton: React.FC = () => {
  const { t } = useTranslation();
  const [openPicker, setOpenPicker] = useState(false);
  const {
    authToken,
    fileId,
    setAuthToken,
    setFileId,
    createFile,
    validateToken,
  } = useAutoSyncStore();

  useEffect(() => {
    if (!authToken) return;

    validateToken();
    const interval = setInterval(validateToken, 10 * 60 * 1000);
    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(interval);
    };
  }, [authToken, fileId, validateToken]);

  let color: string;
  let label: string;
  let action: () => void;

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.file",
    include_granted_scopes: false,
    prompt: "",
    onSuccess: (response) => {
      setAuthToken(response.access_token);
      if (!fileId) {
        setOpenPicker(true);
      }
    },
  });

  if (!authToken && !fileId) {
    color = "gray";
    label = t("drive.connect");
    action = () => login();
  } else if (!authToken) {
    color = "orange";
    label = t("drive.reauthenticate");
    action = () => login();
  } else if (!fileId) {
    color = "orange";
    label = t("drive.selectFileOrFolder");
    action = () => setOpenPicker(true);
  } else {
    color = "green";
    label = t("drive.synced");
    action = () => {
      setAuthToken(null);
      setFileId(null);
    };
  }

  const handlePicked = async (e: CustomEvent) => {
    const { docs } = e.detail;
    if (!docs || docs.length === 0) return;

    const selected = docs[0];

    if (selected.mimeType === "application/vnd.google-apps.folder") {
      await createFile(selected.id);
    } else {
      setFileId(selected.id);
    }

    setOpenPicker(false);
  };

  return (
    <React.Fragment>
      <Tooltip label={label}>
        <ActionIcon color={color} onClick={action} size="sm" variant="subtle">
          <IconBrandGoogleDrive />
        </ActionIcon>
      </Tooltip>

      {openPicker && authToken ? (
        <DrivePicker
          app-id={GOOGLE_APP_ID}
          client-id={GOOGLE_CLIENT_ID}
          oauth-token={authToken}
          onCanceled={() => setOpenPicker(false)}
          onPicked={handlePicked}
          onOauthError={() => {
            setAuthToken(null);
            setOpenPicker(false);
          }}
        >
          <DrivePickerDocsView
            enable-drives="false"
            include-folders="true"
            mime-types="application/vnd.google-apps.folder,application/json"
            owned-by-me="true"
            select-folder-enabled="true"
          />
        </DrivePicker>
      ) : null}
    </React.Fragment>
  );
};

export default GoogleDriveButton;
