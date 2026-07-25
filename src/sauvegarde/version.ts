import {
  VERSION_ALEATOIRE_COURANTE,
  VERSION_EMPREINTE_DETERMINISTE,
  VERSION_SIMULATION_COURANTE,
} from "../simulation/versions";
import { VERSION_CONTENU_COURANTE } from "../content/types";

export const FORMAT_SAUVEGARDE = "lanternes-de-cendre.sauvegarde" as const;
export const VERSION_SAUVEGARDE_INITIALE = 1 as const;
export const VERSION_SAUVEGARDE_AVANT_ROUTES = 2 as const;
export const VERSION_SAUVEGARDE_AVANT_CRISES = 3 as const;
export const VERSION_SAUVEGARDE_AVANT_EXPEDITIONS = 3 as const;
export const VERSION_SAUVEGARDE_AVANT_VEILLE_BASSE = 4 as const;
export const VERSION_SAUVEGARDE_AVANT_HAUT_PUITS = 5 as const;
export const VERSION_SAUVEGARDE_AVANT_NACELLES = 6 as const;
export const VERSION_SAUVEGARDE_AVANT_DEVERSOIR = 7 as const;
export const VERSION_SAUVEGARDE_AVANT_TRAME_DE_FER = 8 as const;
export const VERSION_SAUVEGARDE_AVANT_TRAVERSE_LIBRE = 9 as const;
export const VERSION_SAUVEGARDE_AVANT_DENOUEMENT = 10 as const;
export const VERSION_SAUVEGARDE_COURANTE = 11 as const;
export { VERSION_CONTENU_COURANTE } from "../content/types";

export const VERSIONS_DU_SNAPSHOT_COURANT = Object.freeze({
  simulation: VERSION_SIMULATION_COURANTE,
  contenu: VERSION_CONTENU_COURANTE,
  aleatoire: VERSION_ALEATOIRE_COURANTE,
  empreinte: VERSION_EMPREINTE_DETERMINISTE,
});

export type NomDeSousVersion = keyof typeof VERSIONS_DU_SNAPSHOT_COURANT;
export const NOMS_DES_SOUS_VERSIONS = Object.freeze(
  Object.keys(VERSIONS_DU_SNAPSHOT_COURANT) as NomDeSousVersion[],
);
