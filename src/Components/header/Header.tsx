import React from "react";

import { Container, Group, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

import BackupButtons from "@/Components/header/BackupButtons";
import GithubLink from "@/Components/header/GithubLink";
import LanguageSwitcher from "@/Components/header/LanguageSwitcher";
import SyncMenu from "@/Components/header/SyncMenu";
import ThemeToggle from "@/Components/header/ThemeToggle";

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container mx="auto" my="xs" size="xl">
      <Group justify="space-between">
        <Title order={2}>{t("app.title")}</Title>
        <Group align="center" gap="sm">
          <SyncMenu />
          <BackupButtons />
          <GithubLink />
          <ThemeToggle />
          <LanguageSwitcher />
        </Group>
      </Group>
    </Container>
  );
};

export default Header;
