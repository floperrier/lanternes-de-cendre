import type { EtatDeHautPuits } from "./hautPuits";
import type { EtatDeVeilleBasse } from "./veilleBasse";
import type {
  IdentifiantDeLieu,
  IdentifiantDeTroncon,
} from "./routes";
import { passageFinalDeLaCouronneEstPrepare } from "./ouvertureCouronne";

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
  readonly destination:
    | "relais-des-vannes"
    | "haut-puits"
    | "veille-basse";
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
const FAITS_D_ACCORD_DU_RELAIS = [
  "bassins.nacelles.conseil-passage-partage",
  "bassins.nacelles.conseil-maintenance-commune",
] as const;
const FAITS_DE_PASSAGE_REGIONAL = [
  "bassins.deversoir.passage-prepare",
  "bassins.deversoir.passage-transmis",
] as const;
const FAITS_DE_PASSAGE_VERS_LA_COURONNE = [
  "trame.aiguillage-zero.passage-consigne",
  "trame.aiguillage-zero.passage-transmis",
] as const;
const FAITS_D_INTERFACE_DE_SIGNAL_ZERO = [
  "trame.signal-zero.interface-rail-lue",
  "trame.signal-zero.interface-libre-lue",
] as const;
const FAITS_D_ECHO_DE_SIGNAL_ZERO = [
  "trame.signal-zero.echos-conserves",
  "trame.signal-zero.frequences-separees",
] as const;
const FAITS_DE_TRACE_RESOLUE_A_SIGNAL_ZERO = [
  "trame.signal-zero.trace-sous-scelles",
  "trame.signal-zero.trace-transmise",
] as const;
const FAITS_TERMINAUX_DU_GRAND_AIGUILLAGE = [
  "trame.grand-aiguillage.train-outil-annonce",
  "trame.grand-aiguillage.reparation-locale-ouverte",
  "trame.grand-aiguillage.attelage-federe-annonce",
] as const;
const FAITS_TERMINAUX_DE_TRAVERSE_LIBRE = [
  "trame.traverse-libre.galerie-etayee",
  "trame.traverse-libre.contournement-ouvert",
  "trame.traverse-libre.manifeste-public",
] as const;

function signalZeroEstAcheve(faits: readonly string[]): boolean {
  return (
    FAITS_D_INTERFACE_DE_SIGNAL_ZERO.some((fait) =>
      faits.includes(fait),
    ) &&
    FAITS_D_ECHO_DE_SIGNAL_ZERO.some((fait) => faits.includes(fait)) &&
    (!faits.includes("trame.marche.trace-bascule-clandestine") ||
      FAITS_DE_TRACE_RESOLUE_A_SIGNAL_ZERO.some((fait) =>
        faits.includes(fait),
      ))
  );
}

export function routeAvalDesBassinsEstPreparee(
  tronconId: IdentifiantDeTroncon,
  evenementActif: string | null,
  faits: readonly string[],
): boolean {
  if (
    tronconId !== "chemin-des-vanniers" &&
    tronconId !== "chemin-de-l-hospice" &&
    tronconId !== "nacelles-de-veille-basse" &&
    tronconId !== "conduite-du-deversoir" &&
    tronconId !== "passage-de-la-ligne-zero" &&
    tronconId !== "piste-des-levees" &&
    tronconId !== "rocade-des-regulateurs" &&
    tronconId !== "derivation-des-puits" &&
    tronconId !== "faisceau-de-l-aiguillage-zero" &&
    tronconId !== "passage-de-la-couronne-muette" &&
    tronconId !== "voie-de-tete-de-ligne" &&
    tronconId !== "chemin-des-trois-veilles" &&
    tronconId !== "piste-des-serres-de-verre" &&
    tronconId !== "rampe-du-seuil" &&
    tronconId !== "arc-ferroviaire-du-noeud" &&
    tronconId !== "galerie-des-trois-phares" &&
    tronconId !== "porte-logistique-du-seuil" &&
    tronconId !== "passage-de-la-couronne-ouverte" &&
    tronconId !== "breche-de-secours-du-noeud"
  ) {
    return true;
  }
  if (evenementActif !== null) {
    return false;
  }
  if (
    tronconId === "passage-de-la-ligne-zero" &&
    !faits.includes("bassins.deversoir.ligne-zero-relevee") &&
    !faits.includes("bassins.deversoir.ligne-zero-preservee")
  ) {
    return false;
  }
  if (tronconId === "faisceau-de-l-aiguillage-zero") {
    return evenementActif === null && signalZeroEstAcheve(faits);
  }
  if (
    tronconId === "passage-de-la-couronne-muette" &&
    evenementActif !== null
  ) {
    return false;
  }
  if (
    tronconId === "passage-de-la-couronne-ouverte" ||
    tronconId === "breche-de-secours-du-noeud"
  ) {
    return passageFinalDeLaCouronneEstPrepare(tronconId, faits);
  }
  const faitsAttendus =
    tronconId === "nacelles-de-veille-basse"
      ? [
          ...FAITS_TERMINAUX_DE_HAUT_PUITS,
          ...FAITS_TERMINAUX_DE_VEILLE_BASSE,
        ]
      : tronconId === "chemin-de-l-hospice"
        ? FAITS_TERMINAUX_DE_VEILLE_BASSE
      : tronconId === "chemin-des-vanniers"
        ? FAITS_TERMINAUX_DE_HAUT_PUITS
        : tronconId === "conduite-du-deversoir"
          ? FAITS_D_ACCORD_DU_RELAIS
          : tronconId === "passage-de-la-couronne-muette"
            ? FAITS_DE_PASSAGE_VERS_LA_COURONNE
          : tronconId === "rocade-des-regulateurs"
            ? FAITS_TERMINAUX_DU_GRAND_AIGUILLAGE
          : tronconId === "derivation-des-puits"
            ? FAITS_TERMINAUX_DE_TRAVERSE_LIBRE
          : tronconId === "voie-de-tete-de-ligne" ||
              tronconId === "chemin-des-trois-veilles" ||
              tronconId === "piste-des-serres-de-verre"
            ? FAITS_DE_PASSAGE_VERS_LA_COURONNE
          : tronconId === "rampe-du-seuil"
            ? [
                "couronne.serres-de-verre.coalition-ralliee",
                "couronne.serres-de-verre.passage-force",
              ]
          : tronconId === "arc-ferroviaire-du-noeud" ||
              tronconId === "galerie-des-trois-phares"
            ? [
                "couronne.approches.plans-confies-a-ilyana",
                "couronne.approches.plans-repartis-aux-equipes",
              ]
          : tronconId === "porte-logistique-du-seuil"
            ? [
                "couronne.seuil.registre-confie-a-maelys",
                "couronne.seuil.registre-commun",
              ]
          : FAITS_DE_PASSAGE_REGIONAL;
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
      : contexte.position === "haut-puits"
        ? ("haut-puits" as const)
      : contexte.position === "veille-basse"
        ? ("veille-basse" as const)
        : null;
  if (branche === null) {
    return null;
  }

  const tronconId =
    contexte.position === "les-vanniers"
      ? ("chenal-des-vannes" as const)
      : ("nacelles-de-veille-basse" as const);
  let combustible = tronconId === "chenal-des-vannes" ? 5 : 6;
  let eau = tronconId === "chenal-des-vannes" ? 7 : 8;
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
    tronconId,
    branche,
    destination:
      contexte.position === "les-vanniers"
        ? "relais-des-vannes"
        : contexte.position === "haut-puits"
          ? "veille-basse"
          : "haut-puits",
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
