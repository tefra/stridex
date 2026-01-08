import { create } from "zustand";
import { persist } from "zustand/middleware";

import useWorkoutStore from "@/stores/useWorkoutStore";

interface User {
  picture: string;
  name: string;
  email: string;
}

interface DriveSyncState {
  authToken: string | null;
  fileId: string | null;
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  setAuthToken: (token: string | null) => void;
  setFileId: (id: string | null) => void;
  setLoading: (value: boolean) => void;
  disconnect: () => void;
  createFile: (parent: string) => Promise<void>;
  loadUser: () => void;
  loadFile: () => Promise<void>;
  updateFile: () => Promise<void>;
  validateToken: () => Promise<boolean>;
}

const useAutoSyncStore = create<DriveSyncState>()(
  persist(
    (set, get) => ({
      user: null,
      authToken: null,
      fileId: null,
      loading: false,
      setLoading: (value: boolean) => set({ loading: value }),
      disconnect: () => set({ user: null, authToken: null, fileId: null }),
      setUser: (user: User) => set({ user }),
      setAuthToken: (token) => set({ authToken: token }),
      setFileId: (id) => set({ fileId: id }),
      createFile: async (parent) => {
        console.log(`Creating new file under ${parent}`);
        const { authToken, setFileId } = get();

        try {
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
            console.error("Create file failed:", await res.text());
          }
        } catch (error) {
          console.error("Create file failed:", error);
        }
      },
      loadUser: async () => {
        const { authToken, setUser } = get();
        if (!authToken) return;
        try {
          const userRes = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
          const user: User = await userRes.json();
          setUser(user);
        } catch (error) {
          console.error("Load user failed:", error);
        }
      },
      loadFile: async () => {
        const { authToken, fileId, setLoading } = get();
        if (!authToken || !fileId) return;

        try {
          setLoading(true);
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
            console.error("Load file failed:", await res.text());
          }
        } catch (error) {
          console.error("Load file failed:", error);
        } finally {
          setLoading(false);
        }
      },
      updateFile: async () => {
        const { authToken, fileId } = get();
        if (!authToken || !fileId) return;

        console.log("Updating remote file");
        const data = useWorkoutStore.getState();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });

        try {
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
            console.log("Update file failed:", await res.text());
          }
        } catch (error) {
          console.error("Fetch failed:", error);
        }
      },
      validateToken: async () => {
        const { authToken } = get();
        if (!authToken) return false;

        try {
          const res = await fetch(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${authToken}`
          );

          if (res.ok) {
            return true;
          }

          console.warn("Access token is invalid or expired", await res.text());
          get().setAuthToken(null);
          return false;
        } catch (err) {
          get().setAuthToken(null);
          console.log("Validate token failed", err);
          return false;
        }
      },
    }),
    {
      name: "stridex-google-drive",
    }
  )
);

export default useAutoSyncStore;
