import React from "react";

import { ActionIcon, Menu } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { supportedLanguages } from "@/i18n";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Menu shadow="md">
      <Menu.Target>
        <ActionIcon>
          <IconLanguage />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {supportedLanguages.map((lng) => {
          const isCurrent = locale.startsWith(lng);

          return (
            <Menu.Item
              key={lng}
              c={isCurrent ? "blue" : undefined}
              onClick={() => changeLanguage(lng)}
              style={{ fontWeight: isCurrent ? 600 : 400 }}
            >
              {lng.toUpperCase()}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitcher;
