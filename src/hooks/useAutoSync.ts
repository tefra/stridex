import { useEffect } from "react";

import { shallow } from "zustand/shallow";

import useAutoSyncStore from "@/stores/useAutoSyncStore";
import useWorkoutStore from "@/stores/useWorkoutStore";

const useAutoSync = (): void => {
  const { authToken, fileId, initializeSync, uploadToDrive } =
    useAutoSyncStore();

  useEffect(() => {
    if (authToken && fileId) initializeSync();
  }, [authToken, fileId, initializeSync]);

  useEffect(() => {
    if (!authToken || !fileId) return;

    const unsubscribe = useWorkoutStore.subscribe(
      (state) => state.workoutsByDate,
      () => {
        console.log("Syncing to Drive...");
        uploadToDrive().catch((err) => {
          console.error("Failed to sync:", err);
        });
      },
      { equalityFn: shallow }
    );

    // eslint-disable-next-line consistent-return
    return () => {
      unsubscribe();
    };
  }, [authToken, fileId, uploadToDrive]);
};

export default useAutoSync;
