import { create } from "zustand";
import { persist } from "zustand/middleware";

import useWorkoutStore from "@/stores/useWorkoutStore";

interface DriveSyncState {
  authToken: string | undefined;
  fileId: string | undefined;
  setAuthToken: (token: string) => void;
  setFileId: (id: string) => void;
  clearToken: () => void;
  clearFile: () => void;
  loadFromDrive: () => Promise<void>;
  uploadToDrive: () => Promise<void>;
  initializeSync: () => Promise<void>;
}

const useAutoSyncStore = create<DriveSyncState>()(
  persist(
    (set, get) => ({
      authToken: undefined,
      fileId: undefined,

      setAuthToken: (token) => set({ authToken: token }),
      setFileId: (id) => set({ fileId: id }),
      clearToken: () => set({ authToken: undefined }),
      clearFile: () => set({ fileId: undefined }),

      loadFromDrive: async () => {
        const { authToken, fileId, clearToken, clearFile } = get();
        if (!authToken || !fileId) return;

        try {
          const res = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );

          if (res.ok) {
            const text = await res.text();
            if (text.trim() === "") {
              await get().uploadToDrive();
              return;
            }
            const remoteData = JSON.parse(text);
            useWorkoutStore.setState({ workoutsByDate: remoteData });
            console.log("Loaded workouts from Drive");
            return;
          }

          if (res.status === 404) {
            console.warn("Drive file deleted externally");
            clearFile();
            return;
          }
          if (res.status === 401 || res.status === 403) {
            console.warn("Authorization failed");
            clearToken();
            return;
          }

          throw new Error(await res.text());
        } catch (err) {
          console.error("Failed to load from Drive:", err);
        }
      },

      uploadToDrive: async () => {
        const { authToken, fileId } = get();
        if (!authToken || !fileId) return;

        const data = useWorkoutStore.getState().workoutsByDate;

        try {
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });

          const res = await fetch(
            `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
              body: blob,
            }
          );

          if (!res.ok) {
            throw new Error(await res.text());
          }

          console.log("Synced to Drive successfully");
        } catch (err) {
          console.error("Upload failed:", err);
        }
      },

      initializeSync: async () => {
        await get().loadFromDrive();
      },
    }),
    {
      name: "stridex-google-drive",
    }
  )
);

export default useAutoSyncStore;
