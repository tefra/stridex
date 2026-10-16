import { useEffect } from "react";

import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";

import useAutoSyncStore from "@/stores/useAutoSyncStore";
import useWorkoutStore from "@/stores/useWorkoutStore";

const useAutoSync = (): void => {
  const { authToken, fileId, loadFile, updateFile } = useAutoSyncStore(
    useShallow((state) => ({
      authToken: state.authToken,
      fileId: state.fileId,
      loadFile: state.loadFile,
      updateFile: state.updateFile,
    }))
  );

  useEffect(() => {
    if (authToken && fileId) {
      loadFile();
    }
  }, [authToken, fileId, loadFile]);

  useEffect(() => {
    if (!authToken || !fileId) return undefined;

    return useWorkoutStore.subscribe(
      (state) => state.workouts,
      () => {
        const { loading } = useAutoSyncStore.getState();
        if (!loading) updateFile().catch(console.error);
      },
      { equalityFn: shallow }
    );
  }, [authToken, fileId, updateFile]);
};

export default useAutoSync;
