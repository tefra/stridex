import { create } from "zustand";
import { persist } from "zustand/middleware";

import useWorkoutStore from "@/stores/useWorkoutStore";

interface DriveSyncState {
  authToken: string | null;
  fileId: string | null;
  setAuthToken: (token: string | null) => void;
  setFileId: (id: string | null) => void;
  createFile: (parent: string) => Promise<void>;
  loadFile: () => Promise<void>;
  updateFile: () => Promise<void>;
}

const useAutoSyncStore = create<DriveSyncState>()(
  persist(
    (set, get) => ({
      authToken: null,
      fileId: null,

      setAuthToken: (token) => set({ authToken: token }),
      setFileId: (id) => set({ fileId: id }),

      createFile: async (parent) => {
        console.log(`Creating new file under ${parent}`);
        const { authToken, setFileId } = get();
        const res = await fetch("https://www.googleapis.com/drive/v3/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "stridex-workouts.json",
            mimeType: "application/json",
            parents: [parent],
          }),
        });

        if (res.ok) {
          const file: { id: string } = await res.json();
          setFileId(file.id);
          console.log(`File created: ${file.id}`);
        } else if (res.status === 401 || res.status === 403) {
          get().setAuthToken(null);
          console.error("Invalid token");
        } else {
          throw Error(await res.text());
        }
      },
      loadFile: async () => {
        const { authToken, fileId } = get();
        if (!authToken || !fileId) return;

        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (res.ok) {
          try {
            const remoteData = await res.json();
            useWorkoutStore.setState({
              workouts: remoteData?.workouts,
            });
            console.log("Loaded remote data");
          } catch {
            await get().updateFile();
          }
        } else if (res.status === 404) {
          get().setFileId(null);
          console.error("Remote file not found");
        } else if (res.status === 401 || res.status === 403) {
          get().setAuthToken(null);
          console.error("Invalid token");
        } else {
          throw Error(await res.text());
        }
      },
      updateFile: async () => {
        console.log("Updating remote file");
        const { authToken, fileId } = get();
        if (!authToken || !fileId) return;

        const data = useWorkoutStore.getState();
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
        if (res.status === 404) {
          get().setFileId(null);
          console.log("Remote file not found");
        } else if (res.status === 401 || res.status === 403) {
          get().setAuthToken(null);
          console.error("Invalid token");
        } else if (!res.ok) {
          throw Error(await res.text());
        }
      },
    }),
    {
      name: "stridex-google-drive",
    }
  )
);

export default useAutoSyncStore;
