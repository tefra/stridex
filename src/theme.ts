import { Container, createTheme, Paper, rem, Select } from "@mantine/core";

import type { MantineThemeOverride } from "@mantine/core";

const CONTAINER_SIZES: Record<string, string> = {
  xxs: rem("200px"),
  xs: rem("300px"),
  sm: rem("400px"),
  md: rem("500px"),
  lg: rem("600px"),
  xl: rem("1400px"),
  xxl: rem("1600px"),
};

const mantineTheme: MantineThemeOverride = createTheme({
  fontSizes: {
    xs: rem("12px"),
    sm: rem("14px"),
    md: rem("16px"),
    lg: rem("18px"),
    xl: rem("20px"),
    "2xl": rem("24px"),
    "3xl": rem("30px"),
    "4xl": rem("36px"),
    "5xl": rem("48px"),
  },
  spacing: {
    "3xs": rem("4px"),
    "2xs": rem("8px"),
    xs: rem("10px"),
    sm: rem("12px"),
    md: rem("16px"),
    lg: rem("20px"),
    xl: rem("24px"),
    "2xl": rem("28px"),
    "3xl": rem("32px"),
  },
  components: {
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          // eslint-disable-next-line no-nested-ternary
          "--container-size": fluid
            ? "100%"
            : size !== undefined && size in CONTAINER_SIZES
              ? CONTAINER_SIZES[size]
              : rem(size),
        },
      }),
    }),
    Paper: Paper.extend({
      defaultProps: {
        p: "2xs",
        shadow: "sm",
        radius: "md",
        withBorder: true,
      },
    }),
    Select: Select.extend({
      defaultProps: {
        checkIconPosition: "right",
      },
    }),
    ActionIcon: {
      defaultProps: {
        size: 28,
        variant: "subtle",
        color: "gray",
      },
    },
    Avatar: {
      defaultProps: {
        size: 26,
      },
    },
    Tooltip: {
      defaultProps: {
        withArrow: true,
      },
    },
    Popover: {
      defaultProps: {
        withArrow: true,
      },
    },
    Menu: {
      defaultProps: {
        withArrow: true,
      },
    },
  },
  other: {
    style: "mantine",
  },
});

export default mantineTheme;
