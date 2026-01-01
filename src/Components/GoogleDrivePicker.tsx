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

interface FileResponse {
  id: string;
}

const GoogleDrivePicker: React.FC<Props> = ({ onClose }) => {
  const { authToken, setAuthToken, fileId, setFileId } = useAutoSyncStore();
  const createFile = async (folder: string) => {
    const res = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "stridex-workouts.json",
        mimeType: "application/json",
        parents: [folder],
      }),
    });

    if (!res.ok) {
      throw Error(await res.text());
    }
    const file = (await res.json()) as FileResponse;
    return file.id;
  };

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
    setFileId(
      selected.mimeType === "application/vnd.google-apps.folder"
        ? await createFile(selected.id)
        : selected.id
    );
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
