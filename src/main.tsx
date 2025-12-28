import React from "react";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { createRoot } from "react-dom/client";

import App from "./App";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root not found");
}

createRoot(root).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <ModalsProvider>
        <App />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
