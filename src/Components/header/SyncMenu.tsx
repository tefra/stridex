import React, { useEffect } from "react";

import { Avatar, Indicator, Menu } from "@mantine/core";
import { useDisclosure, useInterval } from "@mantine/hooks";
import { useGoogleLogin } from "@react-oauth/google";
import {
  IconFolderOpen,
  IconLogin,
  IconLogout,
  IconRefresh,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import GoogleDrivePicker from "@/Components/GoogleDrivePicker";
import useAutoSyncStore from "@/stores/useAutoSyncStore";

const SyncMenu: React.FC = () => {
  const { t } = useTranslation();
  const [pickerOpened, { open: openPicker, close: closePicker }] =
    useDisclosure(false);
  const {
    user,
    setAuthToken,
    authToken,
    loadUser,
    fileId,
    disconnect,
    validateToken,
  } = useAutoSyncStore(
    useShallow((state) => ({
      user: state.user,
      setAuthToken: state.setAuthToken,
      authToken: state.authToken,
      loadUser: state.loadUser,
      fileId: state.fileId,
      disconnect: state.disconnect,
      validateToken: state.validateToken,
    }))
  );
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.file",
    include_granted_scopes: false,
    prompt: "",
    onSuccess: async (response) => {
      setAuthToken(response.access_token);
      await loadUser();
      if (!fileId) {
        openPicker();
      }
    },
  });

  const { start: startInterval, stop: stopInterval } = useInterval(
    validateToken,
    10 * 60 * 1000
  );
  useEffect(() => {
    if (!authToken) return undefined;
    validateToken();
    startInterval();
    return stopInterval;
  }, [authToken, validateToken, startInterval, stopInterval]);

  const hasToken = !!authToken;
  const hasFile = !!fileId;
  let indicatorColor = "yellow";
  if (hasToken && hasFile) indicatorColor = "green";
  else if (!hasToken && !hasFile) indicatorColor = "gray";

  const menuItems = [
    {
      key: "drive.signIn",
      leftSection: <IconLogin />,
      onClick: () => login(),
      enabled: !hasToken && !hasFile,
    },
    {
      key: "drive.refresh",
      enabled: !hasToken && hasFile,
      leftSection: <IconRefresh />,
      onClick: () => login(),
    },
    {
      key: "drive.pickFileToSync",
      enabled: hasToken && !hasFile,
      leftSection: <IconFolderOpen />,
      onClick: openPicker,
    },
    {
      key: "drive.signOut",
      enabled: hasToken,
      leftSection: <IconLogout />,
      color: "red",
      onClick: disconnect,
    },
  ];

  return (
    <React.Fragment>
      <Menu>
        <Menu.Target>
          <Indicator color={indicatorColor} offset={2}>
            <Avatar
              imageProps={{ referrerPolicy: "no-referrer" }}
              src={user ? user.picture : null}
              style={{ cursor: "pointer" }}
            />
          </Indicator>
        </Menu.Target>
        <Menu.Dropdown>
          {menuItems
            .filter((item) => item.enabled)
            .map((item) => (
              <Menu.Item
                key={item.key}
                leftSection={item.leftSection}
                onClick={item.onClick}
              >
                {t(item.key)}
              </Menu.Item>
            ))}
        </Menu.Dropdown>
      </Menu>
      {pickerOpened ? <GoogleDrivePicker onClose={closePicker} /> : null}
    </React.Fragment>
  );
};

export default SyncMenu;
