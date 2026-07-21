import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./ui/App";
import "./ui/styles.css";

const racine = document.getElementById("root");

if (racine === null) {
  throw new Error("La racine de l'application est introuvable.");
}

createRoot(racine).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
