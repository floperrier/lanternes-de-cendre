import type { EtatDeHautPuits } from "./hautPuits";
import type { EtatDeVeilleBasse } from "./veilleBasse";
import type {
  IdentifiantDeLieu,
  IdentifiantDeTroncon,
} from "./routes";

export type BrancheDesNacelles = "haut-puits" | "veille-basse";

export type EtatPublicDUneFaction =
  | "cooperatifs"
  | "neutres"
  | "hostiles";

export type OptionDeTraverseeDesNacelles =
  | "treuil-principal"
  | "contrepoids-de-la-cohorte"
  | "relais-de-l-hospice"
  | "accord-des-factions";

export type FacteurDeTraverseeDesNacelles =
  | "haut-puits-cooperatif"
  | "haut-puits-ferme"
  | "veille-basse-stable"
  | "veille-basse-perdue"
  | "cohorte-aidee"
  | "cohorte-redirigee"
  | "cohorte-refusee"
  | "panache-confine"
  | "panache-derive"
  | "factions-cooperatives"
  | "factions-hostiles";

export interface ContexteDesNacelles {
  readonly position: IdentifiantDeLieu;
  readonly hautPuits: EtatDeHautPuits;
  readonly veilleBasse: EtatDeVeilleBasse;
  readonly faits: readonly string[];
}

export interface OffreDesNacelles {
  readonly tronconId: Extract<
    IdentifiantDeTroncon,
    "chenal-des-vannes" | "nacelles-de-veille-basse"
  >;
  readonly branche: BrancheDesNacelles;
  readonly destination: "relais-des-vannes";
  readonly consommations: {
    readonly combustible: number;
    readonly eau: number;
  };
  readonly factions: {
    readonly puitsLibres: EtatPublicDUneFaction;
    readonly pelerinsDeCendre: EtatPublicDUneFaction;
  };
  readonly renseignementId:
    | "nacelles-accord-des-bassins"
    | "nacelles-passage-conteste"
    | "nacelles-releve-de-branche";
  readonly options: readonly OptionDeTraverseeDesNacelles[];
  readonly facteurs: readonly FacteurDeTraverseeDesNacelles[];
}

const RELATIONS_POSSIBLES_DE_HAUT_PUITS = [
  { combustible: -1, cooperative: true },
  { combustible: 0, cooperative: false },
  { combustible: 1, cooperative: false },
] as const;
const ETATS_POSSIBLES_DE_VEILLE_BASSE = [
  { eau: -1, stable: true },
  { eau: 0, stable: false },
  { eau: 2, stable: false },
] as const;
const MEMOIRES_POSSIBLES_DE_LA_COHORTE = [
  { combustible: -1, eau: 0, ouvreAccord: true },
  { combustible: 0, eau: 0, ouvreAccord: true },
  { combustible: 0, eau: 1, ouvreAccord: false },
  { combustible: 0, eau: 0, ouvreAccord: false },
] as const;
const DELTAS_DE_PANACHE = [-1, 0, 1] as const;

function enumererConsommationsAtteignables(
  combustibleDeBase: number,
  eauDeBase: number,
): ReadonlySet<string> {
  const couples = new Set<string>();
  for (const relation of RELATIONS_POSSIBLES_DE_HAUT_PUITS) {
    for (const veilleBasse of ETATS_POSSIBLES_DE_VEILLE_BASSE) {
      for (const cohorte of MEMOIRES_POSSIBLES_DE_LA_COHORTE) {
        for (const panache of DELTAS_DE_PANACHE) {
          const accordDesFactions =
            relation.cooperative &&
            veilleBasse.stable &&
            cohorte.ouvreAccord
              ? -1
              : 0;
          couples.add(
            [
              Math.max(
                1,
                combustibleDeBase +
                  relation.combustible +
                  cohorte.combustible +
                  accordDesFactions,
              ),
              Math.max(
                1,
                eauDeBase + veilleBasse.eau + cohorte.eau + panache,
              ),
            ].join(":"),
          );
        }
      }
    }
  }
  return couples;
}

const CONSOMMATIONS_ATTEIGNABLES = {
  "chenal-des-vannes": enumererConsommationsAtteignables(5, 7),
  "nacelles-de-veille-basse": enumererConsommationsAtteignables(6, 8),
} as const;

export function consommationsDesNacellesSontAtteignables(
  tronconId: keyof typeof CONSOMMATIONS_ATTEIGNABLES,
  consommations: { readonly combustible: number; readonly eau: number },
): boolean {
  return CONSOMMATIONS_ATTEIGNABLES[tronconId].has(
    `${consommations.combustible}:${consommations.eau}`,
  );
}

const FAITS_TERMINAUX_DE_HAUT_PUITS = [
  "bassins.haut-puits.ilyana-garante",
  "bassins.haut-puits.ilyana-contredite",
] as const;
const FAITS_TERMINAUX_DE_VEILLE_BASSE = [
  "veille-basse.maelys-mission-confiee",
  "veille-basse.maelys-equipes-prioritaires",
  "veille-basse.intervention-refusee",
] as const;

export function routeAvalDesBassinsEstPreparee(
  tronconId: IdentifiantDeTroncon,
  evenementActif: string | null,
  faits: readonly string[],
): boolean {
  if (
    tronconId !== "chemin-des-vanniers" &&
    tronconId !== "nacelles-de-veille-basse"
  ) {
    return true;
  }
  if (evenementActif !== null) {
    return false;
  }
  const faitsAttendus =
    tronconId === "nacelles-de-veille-basse"
      ? FAITS_TERMINAUX_DE_VEILLE_BASSE
      : FAITS_TERMINAUX_DE_HAUT_PUITS;
  return faitsAttendus.some((fait) => faits.includes(fait));
}

function faitEstPresent(
  faits: readonly string[],
  identifiant: string,
): boolean {
  return faits.includes(identifiant);
}

export function calculerOffreDesNacelles(
  contexte: ContexteDesNacelles,
): OffreDesNacelles | null {
  const branche =
    contexte.position === "les-vanniers"
      ? ("haut-puits" as const)
      : contexte.position === "veille-basse"
        ? ("veille-basse" as const)
        : null;
  if (branche === null) {
    return null;
  }

  let combustible = branche === "haut-puits" ? 5 : 6;
  let eau = branche === "haut-puits" ? 7 : 8;
  const facteurs: FacteurDeTraverseeDesNacelles[] = [];
  const options: OptionDeTraverseeDesNacelles[] = ["treuil-principal"];

  const puitsLibres: EtatPublicDUneFaction =
    contexte.hautPuits.relationPublique === "cooperative"
      ? "cooperatifs"
      : contexte.hautPuits.relationPublique === "fermee"
        ? "hostiles"
        : "neutres";
  if (puitsLibres === "cooperatifs") {
    combustible -= 1;
    facteurs.push("haut-puits-cooperatif");
  } else if (puitsLibres === "hostiles") {
    combustible += 1;
    facteurs.push("haut-puits-ferme");
  }

  const veilleBasseEstStable =
    contexte.veilleBasse.colonie.statut === "stable" ||
    contexte.veilleBasse.colonie.statut === "prospere";
  if (veilleBasseEstStable) {
    eau -= 1;
    facteurs.push("veille-basse-stable");
  } else if (contexte.veilleBasse.colonie.statut === "perdue") {
    eau += 2;
    facteurs.push("veille-basse-perdue");
  }

  if (contexte.veilleBasse.cohorte.memoire === "aidee") {
    combustible -= 1;
    options.push("contrepoids-de-la-cohorte");
    facteurs.push("cohorte-aidee");
  } else if (contexte.veilleBasse.cohorte.memoire === "redirigee") {
    options.push("relais-de-l-hospice");
    facteurs.push("cohorte-redirigee");
  } else if (contexte.veilleBasse.cohorte.memoire === "refusee") {
    eau += 1;
    facteurs.push("cohorte-refusee");
  }

  const panacheEstConfine = faitEstPresent(
    contexte.faits,
    "bassins.haut-puits.panache-confine",
  );
  const panacheEstDerive = faitEstPresent(
    contexte.faits,
    "bassins.haut-puits.panache-derive",
  );
  if (panacheEstConfine) {
    eau -= 1;
    facteurs.push("panache-confine");
  } else if (panacheEstDerive) {
    eau += 1;
    facteurs.push("panache-derive");
  }

  const pelerinsDeCendre: EtatPublicDUneFaction =
    contexte.veilleBasse.colonie.statut === "perdue" ||
    contexte.veilleBasse.cohorte.memoire === "refusee"
      ? "hostiles"
      : veilleBasseEstStable &&
          (contexte.veilleBasse.cohorte.memoire === "aidee" ||
            contexte.veilleBasse.cohorte.memoire === "redirigee")
        ? "cooperatifs"
        : "neutres";

  if (puitsLibres === "cooperatifs" && pelerinsDeCendre === "cooperatifs") {
    combustible -= 1;
    options.push("accord-des-factions");
    facteurs.push("factions-cooperatives");
  } else if (
    puitsLibres === "hostiles" &&
    pelerinsDeCendre === "hostiles"
  ) {
    facteurs.push("factions-hostiles");
  }

  return {
    tronconId:
      branche === "haut-puits"
        ? "chenal-des-vannes"
        : "nacelles-de-veille-basse",
    branche,
    destination: "relais-des-vannes",
    consommations: {
      combustible: Math.max(1, combustible),
      eau: Math.max(1, eau),
    },
    factions: { puitsLibres, pelerinsDeCendre },
    renseignementId:
      puitsLibres === "cooperatifs" && pelerinsDeCendre === "cooperatifs"
        ? "nacelles-accord-des-bassins"
        : puitsLibres === "hostiles" && pelerinsDeCendre === "hostiles"
          ? "nacelles-passage-conteste"
          : "nacelles-releve-de-branche",
    options,
    facteurs,
  };
}
