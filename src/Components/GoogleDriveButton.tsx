import React, { useState } from "react";

import {
  DrivePicker,
  DrivePickerDocsView,
} from "@googleworkspace/drive-picker-react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBrandGoogleDrive } from "@tabler/icons-react";

import { GOOGLE_APP_ID, GOOGLE_CLIENT_ID } from "@/config";
import useAutoSyncStore from "@/stores/useAutoSyncStore";

const GoogleDriveButton: React.FC = () => {
  const [openPicker, setOpenPicker] = useState(false);
  const {
    authToken,
    fileId,
    setAuthToken,
    setFileId,
    createFile,
    validateToken,
  } = useAutoSyncStore();

  let color = "gray";
  let label = "Link to Google Drive";

  if (fileId && !authToken) {
    color = "orange";
    label = "Access token expired – click to re-authorize";
  } else if (!fileId && authToken) {
    color = "red";
    label = "Linked file no longer exists – click to pick a new one";
  } else if (fileId && authToken) {
    color = "green";
    label = "Synced with Google Drive";
  }

  const handleOnClick = () => {
    validateToken();
    setOpenPicker(true);
  };

  const handleAuthResponse = (e: CustomEvent) => {
    if (e.detail?.access_token) {
      setAuthToken(e.detail.access_token);
    }
  };

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
        <ActionIcon color={color} onClick={handleOnClick} variant="subtle">
          <IconBrandGoogleDrive size={20} />
        </ActionIcon>
      </Tooltip>

      {openPicker ? (
        <DrivePicker
          app-id={GOOGLE_APP_ID}
          client-id={GOOGLE_CLIENT_ID}
          oauth-token={authToken ?? undefined}
          onCanceled={() => setOpenPicker(false)}
          onOauthResponse={handleAuthResponse}
          onPicked={handlePicked}
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
