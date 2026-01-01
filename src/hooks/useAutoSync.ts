import { useEffect } from "react";

import { shallow } from "zustand/shallow";

import useAutoSyncStore from "@/stores/useAutoSyncStore";
import useWorkoutStore from "@/stores/useWorkoutStore";

const useAutoSync = (): void => {
  const { authToken, fileId, loadFile, updateFile } = useAutoSyncStore();

  useEffect(() => {
    if (authToken && fileId) {
      loadFile();
    }
  }, [authToken, fileId, loadFile]);

  useEffect(() => {
    if (!authToken || !fileId) return;

    let timeout: undefined | number;
    const unsubscribe = useWorkoutStore.subscribe(
      (state) => state.workouts,
      () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          updateFile().catch(console.error);
        }, 1000);
      },
      { equalityFn: shallow }
    );

    // eslint-disable-next-line consistent-return
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [authToken, fileId, updateFile]);
};

export default useAutoSync;
