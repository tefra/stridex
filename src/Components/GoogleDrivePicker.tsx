import React from "react";

import {
  DrivePicker,
  DrivePickerDocsView,
} from "@googleworkspace/drive-picker-react";

import { GOOGLE_APP_ID, GOOGLE_CLIENT_ID } from "@/config";
import useAutoSyncStore from "@/stores/useAutoSyncStore";

interface Props {
  onClose: () => void;
}

const GoogleDrivePicker: React.FC<Props> = ({ onClose }) => {
  const { authToken, setAuthToken, fileId, setFileId, createFile } =
    useAutoSyncStore();

  const handleAuthResponse = (e: CustomEvent) => {
    if (e.detail?.access_token) {
      setAuthToken(e.detail.access_token);
      if (fileId) {
        onClose();
      }
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
    onClose();
  };

  return (
    <DrivePicker
      app-id={GOOGLE_APP_ID}
      client-id={GOOGLE_CLIENT_ID}
      oauth-token={authToken ?? undefined}
      onCanceled={onClose}
      onOauthResponse={handleAuthResponse}
      onPicked={handlePicked}
      prompt="select_account"
    >
      <DrivePickerDocsView
        enable-drives="false"
        include-folders="true"
        mime-types="application/vnd.google-apps.folder,application/json"
        owned-by-me="true"
        select-folder-enabled="true"
      />
    </DrivePicker>
  );
};

export default GoogleDrivePicker;
