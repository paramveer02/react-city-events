import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Router";
import AppProviders from "./providers/AppProviders";

createRoot(document.getElementById("root")).render(
  <AppProviders>
    <Router />
  </AppProviders>
);
