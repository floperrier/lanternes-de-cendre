import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  creerControleurAccesPremium,
} from "./commercial/controleur";
import {
  creerPortDuServiceCommercialNavigateur,
  stockageNavigateurAccesPremium,
} from "./commercial/serviceNavigateur";
import { creerPolitiqueDAccesPremium } from "./application/application";
import { creerControleurDeSessionNavigateur } from "./sauvegarde/controleur";
import { App } from "./ui/App";
import "./ui/styles.css";

const racine = document.getElementById("root");

if (racine === null) {
  throw new Error("La racine de l'application est introuvable.");
}

const controleurAccesPremium = creerControleurAccesPremium({
  service: creerPortDuServiceCommercialNavigateur(),
  stockage: stockageNavigateurAccesPremium,
});
const controleur = creerControleurDeSessionNavigateur(
  "CENDRE-01",
  creerPolitiqueDAccesPremium(
    controleurAccesPremium.possedeAccesPremium,
  ),
);

createRoot(racine).render(
  <StrictMode>
    <App
      controleur={controleur}
      controleurAccesPremium={controleurAccesPremium}
    />
  </StrictMode>,
);
