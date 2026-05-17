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
  } = useAutoSyncStore();
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.file",
    include_granted_scopes: false,
    prompt: "",
    onSuccess: async (response) => {
      setAuthToken(response.access_token);
      loadUser();
      if (!fileId) {
        openPicker();
      }
    },
  });

  const interval = useInterval(validateToken, 10 * 60 * 1000);
  useEffect(() => {
    if (!authToken) return undefined;
    validateToken();
    interval.start();
    return interval.stop;
  }, [authToken, fileId, validateToken, interval]);

  const hasToken = !!authToken;
  const hasFile = !!fileId;
  const indicatorColor =
    // eslint-disable-next-line no-nested-ternary
    !hasToken && !hasFile ? "gray" : hasToken && hasFile ? "green" : "yellow";

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
