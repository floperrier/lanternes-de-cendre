import catalogueNarratif from "./cataloguePremium.generated";
import {
  LIEUX_PREMIUM,
  NOMS_D_ASSETS_PREMIUM as NOMS_D_ASSETS_PREMIUM_LISTE,
  TRONCONS_PREMIUM,
} from "./donneesPremium";
import { PRESENTATIONS_PREMIUM } from "./presentationsPremium";

export const NOMS_D_ASSETS_PREMIUM: ReadonlySet<string> = new Set(
  NOMS_D_ASSETS_PREMIUM_LISTE,
);

export const CONTENU_PREMIUM_V1 = {
  version: 1,
  catalogue: {
    lieux: LIEUX_PREMIUM,
    troncons: TRONCONS_PREMIUM,
    evenements: catalogueNarratif.evenements,
    libellesTransversaux: catalogueNarratif.libellesTransversaux,
    presentations: PRESENTATIONS_PREMIUM,
  },
} as const;
