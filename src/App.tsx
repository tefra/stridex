import React, { useEffect, useMemo } from "react";

import { Anchor, Container, Divider, Text } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import Header from "@/Components/header/Header";
import Month from "@/Components/Month";
import useAutoSync from "@/hooks/useAutoSync";

const App: React.FC = () => {
  const { i18n, t } = useTranslation();
  const locale = useMemo(
    () => i18n.resolvedLanguage ?? "en",
    [i18n.resolvedLanguage]
  );

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  useAutoSync();

  return (
    <DatesProvider settings={{ locale }}>
      <Header />
      <Divider my="3xs" />
      <Container size="xl">
        <Month />
      </Container>
      <Container m="auto" size="xl">
        <Text c="dimmed" size="xs" ta="center">
          {t("footer.tagline")}{" "}
          <Anchor
            c="dimmed"
            href="https://github.com/tefra/stridex"
            rel="noopener noreferrer"
            size="xs"
            target="_blank"
          >
            tefra/stridex
          </Anchor>
        </Text>
      </Container>
    </DatesProvider>
  );
};

export default App;
