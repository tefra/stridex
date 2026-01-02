import React from "react";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";

import { GOOGLE_CLIENT_ID } from "@/config";

import App from "./App";
import "./i18n";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root not found");
}

createRoot(root).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <ModalsProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
