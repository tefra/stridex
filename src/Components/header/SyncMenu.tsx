import React, { useEffect, useState } from "react";

import { Avatar, Indicator, Menu } from "@mantine/core";
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
  const [pickerOpened, setPickerOpened] = useState(false);
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
        setPickerOpened(true);
      }
    },
  });

  useEffect(() => {
    if (!authToken) return;

    validateToken();
    const interval = setInterval(validateToken, 10 * 60 * 1000);
    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(interval);
    };
  }, [authToken, fileId, validateToken]);

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
      key: "drive.signIn",
      enabled: !hasToken && hasFile,
      leftSection: <IconRefresh />,
      onClick: () => login(),
    },
    {
      key: "drive.pickFileToSync",
      enabled: hasToken && !hasFile,
      leftSection: <IconFolderOpen />,
      onClick: () => setPickerOpened(true),
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
      {pickerOpened ? (
        <GoogleDrivePicker onClose={() => setPickerOpened(false)} />
      ) : null}
    </React.Fragment>
  );
};

export default SyncMenu;
