import { createHash } from "node:crypto";

export {
  CONTENU_PREMIUM_V1,
  NOMS_D_ASSETS_PREMIUM,
} from "./cataloguePremiumComplet";
import { CONTENU_PREMIUM_V1 } from "./cataloguePremiumComplet";

export const CONTENU_PREMIUM_V1_JSON = JSON.stringify(CONTENU_PREMIUM_V1);

export const EMPREINTE_CONTENU_PREMIUM_V1 = createHash("sha256")
  .update(CONTENU_PREMIUM_V1_JSON)
  .digest("base64url");
