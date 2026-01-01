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

    const unsubscribe = useWorkoutStore.subscribe(
      (state) => state.workouts,
      () => {
        const { loading } = useAutoSyncStore.getState();
        if (!loading) updateFile().catch(console.error);
      },
      { equalityFn: shallow }
    );

    // eslint-disable-next-line consistent-return
    return () => {
      unsubscribe();
    };
  }, [authToken, fileId, updateFile]);
};

export default useAutoSync;
