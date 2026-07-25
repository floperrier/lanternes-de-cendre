import {
  empreinteEtat,
  IDENTIFIANTS_PLATEFORMES_MOBILES,
  VITESSES_DU_CONVOI,
  type CommandeCampagne,
  type EtatCampagne,
  type GraineDeCampagne,
  type IdentifiantPlateformeMobile,
  type VitesseDuConvoi,
} from "../simulation/campagne";
import {
  VERSION_ALEATOIRE_COURANTE,
  VERSION_SIMULATION_AVANT_CRISES,
  VERSION_SIMULATION_AVANT_CRISE_DE_TRAME,
  VERSION_SIMULATION_AVANT_CRISES_SEQUENTIELLES,
  VERSION_SIMULATION_AVANT_DENOUEMENT,
  VERSION_SIMULATION_AVANT_DEVERSOIR,
  VERSION_SIMULATION_AVANT_HAUT_PUITS,
  VERSION_SIMULATION_AVANT_NACELLES,
  VERSION_SIMULATION_AVANT_RECUPERATIONS,
  VERSION_SIMULATION_AVANT_ROUTES,
  VERSION_SIMULATION_AVANT_TRAME_DE_FER,
  VERSION_SIMULATION_AVANT_TRAVERSE_LIBRE,
  VERSION_SIMULATION_AVANT_VEILLE_BASSE,
  VERSION_SIMULATION_COURANTE,
  VERSION_SIMULATION_INITIALE,
} from "../simulation/versions";
import {
  CAMPAGNE_EN_COURS,
  reconstruireDenouementReussi,
} from "../simulation/denouement";
import {
  appliquerVariationAUnStock,
  creerPilotageInitial,
  IDENTIFIANTS_DE_CAPACITE,
  IDENTIFIANTS_DE_POLITIQUE,
  IDENTIFIANTS_DE_STOCK,
  INCIDENT_INITIAL,
  POSITIONS_DE_DOCTRINE,
  projeterQuantiteDUnStock,
  type EtatPilotage,
  type StockDuConvoi,
} from "../simulation/pilotage";
import { catalogueDEvenements, trouverEvenement } from "../content/catalogue";
import type {
  ConditionDEvenement,
  EvenementDuCatalogue,
} from "../content/types";
import {
  IDENTIFIANTS_DE_FAITS_D_INCIDENT,
  type FaitDeCampagne,
} from "../simulation/faits";
import {
  calculerModificateursEconomiques,
  ajouterPlateformeRegionaleOrdinaire,
  CATALOGUE_D_INSTALLATIONS,
  creerInfrastructureInitiale,
  demandeDeChargePourCategorie,
  IDENTIFIANTS_DE_PLATEFORME_INITIALE,
  IDENTIFIANT_DE_PLATEFORME_REGIONALE,
  IDENTIFIANTS_D_INSTALLATION,
  installationEstVitale,
  listerPlateformesMobilesDetachables,
  trouverRefusDeConstruction,
  type EtatInfrastructure,
  type OrdreDeChantier,
} from "../simulation/infrastructure";
import {
  TRONCONS_DE_ROUTE,
  appliquerConsommationDeRouteAUnStock,
  creerEtatDesRoutesInitial,
  trouverEngagementDeRouteActif,
  trouverTronconDeRoute,
  type EtatDesRoutes,
} from "../simulation/routes";
import {
  creerEtatDesExpeditionsInitial,
  type EtatDesExpeditions,
} from "../simulation/expeditions";
import {
  creerEtatInitialDeVeilleBasse,
  estEtatDeVeilleBasse,
  type EtatDeVeilleBasse,
} from "../simulation/veilleBasse";
import { rejouerReproduction } from "./replay";
import {
  engagementsDuDeversoirSontCausaux,
  estEtatDesRoutes,
} from "./validationRoutes";
import {
  estEtatDesExpeditions,
  estJournalDExpeditionCoherent,
} from "./validationExpeditions";
import type {
  CommandeDeReproduction,
  ReproductionDeCampagne,
  SauvegardeCampagne,
} from "./types";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";
import {
  IDENTIFIANTS_DE_FAITS_DU_CONSEIL,
  estCausaliteDuConseilValide,
  estCommandeDuConseil,
  estFaitDuConseil,
  estIdentifiantDeFaitDuConseil,
} from "./validation-conseil";
import {
  DEFINITIONS_DES_REPONSES_A_LA_CRISE,
  FAIT_ANNONCANT_LA_CRISE,
  FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
  FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE,
  IDENTIFIANTS_DE_FAITS_DE_CRISE,
  IDENTIFIANTS_DE_FAITS_DE_RECUPERATION,
  IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE,
  IDENTIFIANT_DE_LA_CRISE_DE_TRAME,
  IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE,
  annoncerCriseApresFaits,
  creerEtatDesCrisesInitial,
  declencherCrise,
  reconstruireHistoriqueDesCrises,
  type CicatriceDeCampagne,
  type CriseHistorique,
  type DefinitionDeReponseALaCrise,
  type EtatDesCrises,
  type RecuperationDeCrise,
} from "../simulation/crise";
import {
  creerEtatDeHautPuitsInitial,
  type EtatDeHautPuits,
} from "../simulation/hautPuits";
import {
  calculerDevenirsDesSitesDesBassins,
  calculerDevenirsDesSitesDeLaTrame,
} from "../simulation/sites";
import {
  activitesDeHautPuitsSontCausales,
  estEtatDeHautPuits,
} from "./validationHautPuits";
import { calculerOffreDesNacelles } from "../simulation/nacelles";
import {
  creerEtatInitialDeLaTrameDeFer,
  reconstruireEtatDeLaTrameDeFer,
  type EtatDeLaTrameDeFer,
} from "../simulation/trameFer";
import {
  creerEtatInitialDeTraverseLibre,
  reconstruireEtatDeTraverseLibre,
  type EtatDeTraverseLibre,
} from "../simulation/traverseLibre";
import {
  ancrageEstPrepare,
  citadelleDeCendreEstCredible,
  cielRenduEstCredible,
  constellationEstCredible,
  COUTS_DES_SOLUTIONS_FINALES,
  precipitationEstPreparee,
  reaccordEstPrepare,
  reseauDeFerEstCredible,
  refugeCommunEstCredible,
  terreDesSacrifiesEstCredible,
} from "../simulation/finale";

const EMPREINTE = /^[0-9a-f]{8}$/;
const IDENTIFIANTS_PLATEFORMES_LEGACY_V1 = [
  "phare",
  "foyers",
  "atelier",
  "serres",
  "reservoirs",
  "vigie",
  "forge",
] as const;
const VITESSES = new Set<number>(VITESSES_DU_CONVOI);
const PILOTAGE_INITIAL = creerPilotageInitial();
const ORDRES_D_INCIDENT = new Set(["securiser-pompe", "maintenir-debit"]);
const PRIORITES_DE_CHANTIER = new Set(["basse", "normale", "haute"]);
function definitionsDeFaitsDuCatalogue() {
  return new Map(
    catalogueDEvenements.evenements.flatMap((evenement) =>
      evenement.choix.flatMap((choix) =>
        choix.faitsProduits.map(
          (fait) =>
            [
              fait.id,
              {
                cause: evenement.id,
                acteurs: evenement.acteurs,
                cible: fait.cible,
                effets: choix.effets,
              },
            ] as const,
        ),
      ),
    ),
  );
}

function identifiantsDeFaitsConnus(): ReadonlySet<string> {
  return new Set([
    ...definitionsDeFaitsDuCatalogue().keys(),
    ...IDENTIFIANTS_DE_FAITS_D_INCIDENT,
    ...IDENTIFIANTS_DE_FAITS_DU_CONSEIL,
    ...IDENTIFIANTS_DE_FAITS_DE_CRISE,
    ...IDENTIFIANTS_DE_FAITS_DE_RECUPERATION,
  ]);
}

export type ObjetInconnu = Record<string, unknown>;

export interface EtatCampagneV1 {
  readonly version: typeof VERSION_SIMULATION_INITIALE;
  readonly graine: GraineDeCampagne;
  readonly tempsDuConvoi: EtatCampagne["tempsDuConvoi"];
  readonly citeCaravane: EtatCampagne["citeCaravane"];
  readonly narration: EtatCampagne["narration"];
}

export interface EtatCampagneV2
  extends Omit<
    EtatCampagne,
    | "version"
    | "denouement"
    | "routes"
    | "infrastructure"
    | "crises"
    | "expeditions"
    | "veilleBasse"
    | "hautPuits"
    | "citeCaravane"
    | "devenirsDesSites"
    | "trameDeFer"
    | "traverseLibre"
  > {
  readonly version: typeof VERSION_SIMULATION_AVANT_ROUTES;
  readonly citeCaravane: Omit<EtatCampagne["citeCaravane"], "formation"> & {
    readonly formation: {
      readonly type: "grappe";
      readonly plateformes: readonly string[];
    };
  };
}

export interface EtatCampagneAvantRoutes
  extends Omit<
    EtatCampagne,
    | "version"
    | "denouement"
    | "routes"
    | "crises"
    | "expeditions"
    | "veilleBasse"
    | "hautPuits"
    | "devenirsDesSites"
    | "trameDeFer"
    | "traverseLibre"
  > {
  readonly version: typeof VERSION_SIMULATION_AVANT_CRISES;
}

export interface EtatCampagneAvantCrises
  extends Omit<
    EtatCampagne,
    | "version"
    | "denouement"
    | "crises"
    | "expeditions"
    | "veilleBasse"
    | "hautPuits"
    | "devenirsDesSites"
    | "trameDeFer"
    | "traverseLibre"
  > {
  readonly version: typeof VERSION_SIMULATION_AVANT_CRISES;
}

export type EtatCampagneV3 = EtatCampagneAvantCrises;

export interface EtatCampagneV4
  extends Omit<
    EtatCampagne,
    | "version"
    | "denouement"
    | "veilleBasse"
    | "hautPuits"
    | "devenirsDesSites"
    | "trameDeFer"
    | "traverseLibre"
  > {
  readonly version: typeof VERSION_SIMULATION_AVANT_VEILLE_BASSE;
}

export interface EtatCampagneV5
  extends Omit<
    EtatCampagne,
    | "version"
    | "denouement"
    | "hautPuits"
    | "devenirsDesSites"
    | "trameDeFer"
    | "traverseLibre"
  > {
  readonly version: typeof VERSION_SIMULATION_AVANT_HAUT_PUITS;
}

export interface EtatCampagneV6
  extends Omit<
    EtatCampagne,
    | "version"
    | "denouement"
    | "devenirsDesSites"
    | "trameDeFer"
    | "traverseLibre"
  > {
  readonly version: typeof VERSION_SIMULATION_AVANT_NACELLES;
}

export interface EtatCampagneV7
  extends Omit<
    EtatCampagne,
    | "version"
    | "denouement"
    | "devenirsDesSites"
    | "trameDeFer"
    | "traverseLibre"
  > {
  readonly version: typeof VERSION_SIMULATION_AVANT_DEVERSOIR;
}

export interface EtatCampagneV8
  extends Omit<
    EtatCampagne,
    "version" | "denouement" | "trameDeFer" | "traverseLibre"
  > {
  readonly version: typeof VERSION_SIMULATION_AVANT_TRAME_DE_FER;
}

export interface EtatCampagneV9
  extends Omit<EtatCampagne, "version" | "denouement" | "traverseLibre"> {
  readonly version: typeof VERSION_SIMULATION_AVANT_TRAVERSE_LIBRE;
}

export interface EtatDesCrisesV11
  extends Omit<
    EtatDesCrises,
    | "historique"
    | "crisesSequentiellesHistoriquesIgnorees"
    | "crisesDeTrameHistoriquesIgnorees"
    | "recuperations"
  > {
  readonly recuperations: readonly {
    readonly id: string;
    readonly cause:
      | "cicatrice.rationnement-deau"
      | "cicatrice.reserve-de-remedes-entamee"
      | "cicatrice.evacuation-des-foyers";
    readonly garantie:
      | "socle-de-survie"
      | "mobilite-minimale"
      | "aide-exterieure-identifiee";
    readonly destination: "halte-du-puits-sec" | "haut-puits";
    readonly horizonTroncons: 1 | 2;
    readonly statut: "amorcee";
  }[];
}

export interface EtatCampagneV10
  extends Omit<EtatCampagne, "version" | "denouement" | "crises"> {
  readonly version: typeof VERSION_SIMULATION_AVANT_DENOUEMENT;
  readonly crises: EtatDesCrisesV11;
}

export interface EtatCampagneV11
  extends Omit<EtatCampagne, "version" | "crises"> {
  readonly version: typeof VERSION_SIMULATION_AVANT_RECUPERATIONS;
  readonly crises: EtatDesCrisesV11;
}

export type EtatDesCrisesV12 = Omit<
  EtatDesCrises,
  | "historique"
  | "crisesSequentiellesHistoriquesIgnorees"
  | "crisesDeTrameHistoriquesIgnorees"
>;

export interface EtatCampagneV12
  extends Omit<EtatCampagne, "version" | "crises"> {
  readonly version: typeof VERSION_SIMULATION_AVANT_CRISES_SEQUENTIELLES;
  readonly crises: EtatDesCrisesV12;
}

export type EtatDesCrisesV13 = Omit<
  EtatDesCrises,
  "crisesDeTrameHistoriquesIgnorees"
>;

export interface EtatCampagneV13
  extends Omit<EtatCampagne, "version" | "crises"> {
  readonly version: typeof VERSION_SIMULATION_AVANT_CRISE_DE_TRAME;
  readonly crises: EtatDesCrisesV13;
}

export function estObjet(valeur: unknown): valeur is ObjetInconnu {
  return (
    valeur !== null && typeof valeur === "object" && !Array.isArray(valeur)
  );
}

function estNombreFini(valeur: unknown): valeur is number {
  return typeof valeur === "number" && Number.isFinite(valeur);
}

function estEntierNonSigne(valeur: unknown): valeur is number {
  return (
    typeof valeur === "number" &&
    Number.isInteger(valeur) &&
    valeur >= 0 &&
    valeur <= 0xffffffff
  );
}

function estTableauDeChaines(valeur: unknown): valeur is string[] {
  return (
    Array.isArray(valeur) && valeur.every((item) => typeof item === "string")
  );
}

export function estCommandeV1(valeur: unknown): valeur is CommandeCampagne {
  if (!estObjet(valeur) || typeof valeur.type !== "string") {
    return false;
  }

  if (valeur.type === "temps-du-convoi.regler-vitesse") {
    return VITESSES.has(valeur.vitesse as number);
  }
  if (valeur.type === "temps-du-convoi.ecouler") {
    return (
      typeof valeur.secondesReelles === "number" &&
      Number.isInteger(valeur.secondesReelles) &&
      valeur.secondesReelles >= 0
    );
  }
  if (valeur.type === "evenement-narratif.choisir") {
    return (
      typeof valeur.evenementId === "string" &&
      typeof valeur.choixId === "string"
    );
  }

  return false;
}

export function estCommandeV2(valeur: unknown): valeur is CommandeCampagne {
  if (estCommandeV1(valeur)) {
    return true;
  }
  if (estCommandeDuConseil(valeur)) {
    return true;
  }
  if (!estObjet(valeur) || typeof valeur.type !== "string") {
    return false;
  }
  if (valeur.type === "doctrine.regler") {
    if (
      typeof valeur.politique !== "string" ||
      !IDENTIFIANTS_DE_POLITIQUE.includes(
        valeur.politique as (typeof IDENTIFIANTS_DE_POLITIQUE)[number],
      )
    ) {
      return false;
    }
    return (
      typeof valeur.position === "string" &&
      POSITIONS_DE_DOCTRINE[
        valeur.politique as (typeof IDENTIFIANTS_DE_POLITIQUE)[number]
      ].includes(valeur.position as never)
    );
  }
  if (valeur.type === "incident.ordonner") {
    return (
      valeur.incidentId === INCIDENT_INITIAL.id &&
      typeof valeur.ordre === "string" &&
      ORDRES_D_INCIDENT.has(valeur.ordre)
    );
  }
  return false;
}

export function estCommandeAvantCrises(
  valeur: unknown,
): valeur is CommandeCampagne {
  if (estCommandeAvantRoutes(valeur)) {
    return true;
  }
  return (
    estObjet(valeur) &&
    valeur.type === "engagement-de-route.confirmer" &&
    TRONCONS_DE_ROUTE.some((troncon) => troncon.id === valeur.tronconId)
  );
}

export function estCommandeV3(valeur: unknown): valeur is CommandeCampagne {
  return estCommandeAvantCrises(valeur);
}

export function estCommande(valeur: unknown): valeur is CommandeCampagne {
  if (estCommandeV3(valeur)) {
    return true;
  }
  if (!estObjet(valeur) || typeof valeur.type !== "string") {
    return false;
  }
  if (valeur.type === "expedition.lancer") {
    return valeur.expeditionId === "vannes-grises";
  }
  if (valeur.type === "crise.declencher") {
    return (
      valeur.criseId === IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE ||
      valeur.criseId === IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE
    );
  }
  if (valeur.type === "crise.resoudre") {
    return (
      DEFINITIONS_DES_REPONSES_A_LA_CRISE.some(
        (reponse) =>
          reponse.criseId === valeur.criseId &&
          reponse.id === valeur.reponseId,
      )
    );
  }
  if (valeur.type === "haut-puits.marche.echanger") {
    return (
      valeur.offreId === "eau-contre-materiaux" ||
      valeur.offreId === "eau-contre-remedes"
    );
  }
  return (
    valeur.type === "expedition.ordonner" &&
    valeur.expeditionId === "vannes-grises" &&
    ["couper-contourner", "forcer-galerie", "ordonner-repli"].includes(
      String(valeur.intention),
    )
  );
}

export function estCommandeV5(valeur: unknown): valeur is CommandeCampagne {
  if (!estCommande(valeur) || !estObjet(valeur)) {
    return false;
  }
  if (valeur.type === "haut-puits.marche.echanger") {
    return false;
  }
  if (
    valeur.type === "engagement-de-route.confirmer" &&
    (valeur.tronconId === "chemin-des-vanniers" ||
      valeur.tronconId === "chenal-des-vannes")
  ) {
    return false;
  }
  return !(
    valeur.type === "evenement-narratif.choisir" &&
    typeof valeur.evenementId === "string" &&
    valeur.evenementId.startsWith("bassins.haut-puits.")
  );
}

export function estCommandeV6(valeur: unknown): valeur is CommandeCampagne {
  if (!estCommande(valeur) || !estObjet(valeur)) {
    return false;
  }
  if (
    valeur.type === "engagement-de-route.confirmer" &&
    [
      "nacelles-de-veille-basse",
      "voie-de-tete-de-ligne",
      "chemin-des-trois-veilles",
      "piste-des-serres-de-verre",
      "rampe-du-seuil",
      "arc-ferroviaire-du-noeud",
      "galerie-des-trois-phares",
      "porte-logistique-du-seuil",
      "passage-de-la-couronne-ouverte",
      "breche-de-secours-du-noeud",
    ].includes(String(valeur.tronconId))
  ) {
    return false;
  }
  return !(
    valeur.type === "evenement-narratif.choisir" &&
    typeof valeur.evenementId === "string" &&
    (valeur.evenementId.startsWith("bassins.nacelles.") ||
      valeur.evenementId.startsWith("couronne."))
  );
}

export function estCommandeV7(valeur: unknown): valeur is CommandeCampagne {
  if (!estObjet(valeur)) {
    return false;
  }
  if (
    valeur.type === "conseil.decider" &&
    valeur.conseilId === "conseil.des-vannes"
  ) {
    return false;
  }
  if (!estCommande(valeur)) {
    return false;
  }
  if (
    valeur.type === "engagement-de-route.confirmer" &&
    [
      "chemin-de-l-hospice",
      "chenal-de-l-hospice",
      "conduite-du-deversoir",
      "passage-de-la-ligne-zero",
      "piste-des-levees",
      "voie-de-tete-de-ligne",
      "chemin-des-trois-veilles",
      "piste-des-serres-de-verre",
      "rampe-du-seuil",
      "arc-ferroviaire-du-noeud",
      "galerie-des-trois-phares",
      "porte-logistique-du-seuil",
      "passage-de-la-couronne-ouverte",
      "breche-de-secours-du-noeud",
    ].includes(String(valeur.tronconId))
  ) {
    return false;
  }
  if (
    valeur.type === "evenement-narratif.choisir" &&
    typeof valeur.evenementId === "string" &&
    (valeur.evenementId.startsWith("bassins.deversoir.") ||
      valeur.evenementId.startsWith("couronne."))
  ) {
    return false;
  }
  return true;
}

export function estCommandeV8(valeur: unknown): valeur is CommandeCampagne {
  if (!estCommande(valeur)) {
    return false;
  }
  if (
    valeur.type === "engagement-de-route.confirmer" &&
    [
      "rampe-de-barriere-neuve",
      "voie-des-ponts-lourds",
      "voie-de-tete-de-ligne",
      "chemin-des-trois-veilles",
      "piste-des-serres-de-verre",
      "rampe-du-seuil",
      "arc-ferroviaire-du-noeud",
      "galerie-des-trois-phares",
      "porte-logistique-du-seuil",
      "passage-de-la-couronne-ouverte",
      "breche-de-secours-du-noeud",
    ].includes(
      String(valeur.tronconId),
    )
  ) {
    return false;
  }
  return !(
    valeur.type === "evenement-narratif.choisir" &&
    (valeur.evenementId.startsWith("trame.") ||
      valeur.evenementId.startsWith("couronne."))
  );
}

export function estCommandeV9(valeur: unknown): valeur is CommandeCampagne {
  if (!estCommande(valeur)) {
    return false;
  }
  if (
    valeur.type === "engagement-de-route.confirmer" &&
    [
      "embranchement-de-pompe-neuve",
      "galerie-des-reservoirs",
      "rocade-du-marche",
      "voie-des-citernes",
      "ligne-du-signal-zero",
      "voie-des-contremaitres",
      "traverse-des-porteurs",
      "rocade-des-regulateurs",
      "derivation-des-puits",
      "faisceau-de-l-aiguillage-zero",
      "passage-de-la-couronne-muette",
      "voie-de-tete-de-ligne",
      "chemin-des-trois-veilles",
      "piste-des-serres-de-verre",
      "rampe-du-seuil",
      "arc-ferroviaire-du-noeud",
      "galerie-des-trois-phares",
      "porte-logistique-du-seuil",
      "passage-de-la-couronne-ouverte",
      "breche-de-secours-du-noeud",
    ].includes(String(valeur.tronconId))
  ) {
    return false;
  }
  return !(
    valeur.type === "evenement-narratif.choisir" &&
    (valeur.evenementId.startsWith("couronne.") ||
      valeur.evenementId.startsWith("trame.pompe-neuve.") ||
      valeur.evenementId.startsWith("trame.traverse-libre.") ||
      valeur.evenementId.startsWith("trame.marche.") ||
      valeur.evenementId.startsWith("trame.signal-zero.") ||
      valeur.evenementId.startsWith("trame.aiguillage-zero."))
  );
}

function estOrdreDeChantier(valeur: unknown): valeur is OrdreDeChantier {
  if (!estObjet(valeur) || typeof valeur.type !== "string") {
    return false;
  }
  if (valeur.type === "construction") {
    return (
      typeof valeur.definitionId === "string" &&
      IDENTIFIANTS_D_INSTALLATION.includes(valeur.definitionId as never) &&
      typeof valeur.emplacementId === "string"
    );
  }
  if (valeur.type === "demontage") {
    return typeof valeur.emplacementId === "string";
  }
  return (
    valeur.type === "deplacement" &&
    typeof valeur.origineId === "string" &&
    typeof valeur.destinationId === "string" &&
    valeur.origineId !== valeur.destinationId
  );
}

export function estCommandeAvantRoutes(
  valeur: unknown,
): valeur is CommandeCampagne {
  if (estCommandeV2(valeur)) {
    return true;
  }
  if (!estObjet(valeur) || typeof valeur.type !== "string") {
    return false;
  }
  if (valeur.type === "halte.deployer" || valeur.type === "halte.replier") {
    return true;
  }
  return (
    valeur.type === "chantier.engager" &&
    PRIORITES_DE_CHANTIER.has(String(valeur.priorite)) &&
    estOrdreDeChantier(valeur.ordre)
  );
}

function estFaitDeCampagne(valeur: unknown): boolean {
  return (
    estObjet(valeur) &&
    typeof valeur.id === "string" &&
    typeof valeur.cause === "string" &&
    estTableauDeChaines(valeur.acteurs) &&
    typeof valeur.cible === "string" &&
    estNombreFini(valeur.moment)
  );
}

function estFaitDeCampagneV1(
  valeur: unknown,
  secondesCourantes: number,
): boolean {
  if (!estFaitDeCampagne(valeur) || !estObjet(valeur)) {
    return false;
  }
  const definition = definitionsDeFaitsDuCatalogue().get(String(valeur.id));
  return (
    definition !== undefined &&
    valeur.cause === definition.cause &&
    memesChaines(valeur.acteurs as string[], definition.acteurs) &&
    valeur.cible === definition.cible &&
    (valeur.moment as number) >= 0 &&
    (valeur.moment as number) <= secondesCourantes
  );
}

function estEffetMaterielDeFait(valeur: unknown): boolean {
  if (!estObjet(valeur) || typeof valeur.type !== "string") {
    return false;
  }
  if (valeur.type === "stock.modifie") {
    return (
      typeof valeur.stock === "string" &&
      IDENTIFIANTS_DE_STOCK.includes(
        valeur.stock as (typeof IDENTIFIANTS_DE_STOCK)[number],
      ) &&
      estNombreFini(valeur.variation)
    );
  }
  if (valeur.type === "installation.etat-modifie") {
    return (
      valeur.installation === "pompe-purification" &&
      ["securisee", "stabilisee", "degradee"].includes(String(valeur.etat))
    );
  }
  if (valeur.type === "plateforme.detachee") {
    return (
      typeof valeur.plateforme === "string" &&
      valeur.plateforme !== "phare" &&
      [
        ...IDENTIFIANTS_DE_PLATEFORME_INITIALE,
        IDENTIFIANT_DE_PLATEFORME_REGIONALE,
      ].includes(valeur.plateforme as never)
    );
  }
  return false;
}

function memesChaines(
  valeurs: readonly string[],
  attendues: readonly string[],
): boolean {
  return (
    valeurs.length === attendues.length &&
    valeurs.every((valeur, index) => valeur === attendues[index])
  );
}

function estEffetStock(
  valeur: unknown,
  variation: number,
  stock = "materiaux",
): boolean {
  return (
    estObjet(valeur) &&
    valeur.type === "stock.modifie" &&
    valeur.stock === stock &&
    valeur.variation === variation
  );
}

function estEffetInstallation(valeur: unknown, etat: string): boolean {
  return (
    estObjet(valeur) &&
    valeur.type === "installation.etat-modifie" &&
    valeur.installation === "pompe-purification" &&
    valeur.etat === etat
  );
}

function estEffetHumain(
  valeur: unknown,
  type: string,
  champ: "nombre" | "variation",
  nombre: number,
): boolean {
  return estObjet(valeur) && valeur.type === type && valeur[champ] === nombre;
}

function estEffetHumainDeFait(valeur: unknown): boolean {
  if (!estObjet(valeur) || typeof valeur.type !== "string") {
    return false;
  }
  if (valeur.type === "habitants.modifies") {
    return estNombreFini(valeur.variation);
  }
  if (
    valeur.type === "habitants.exposes" ||
    valeur.type === "habitants.sous-surveillance"
  ) {
    return estNombreFini(valeur.nombre) && valeur.nombre >= 0;
  }
  return false;
}

function effetsMaterielsDynamiquesDeLAiguillageSontValides(
  faitId: string,
  effets: readonly unknown[],
): boolean | undefined {
  if (
    faitId === "trame.aiguillage-zero.monopole-republicain" ||
    faitId === "trame.aiguillage-zero.soupcons-absents-monopole"
  ) {
    return (
      effets.length === 1 &&
      (estEffetStock(effets[0], -10, "materiaux") ||
        estEffetStock(effets[0], -2, "materiaux"))
    );
  }

  if (
    faitId === "trame.aiguillage-zero.transport-autonome" ||
    faitId === "trame.aiguillage-zero.engagement-transport-autonome"
  ) {
    return (
      effets.length === 1 &&
      estObjet(effets[0]) &&
      effets[0].type === "stock.modifie" &&
      effets[0].stock === "materiaux" &&
      estNombreFini(effets[0].variation) &&
      Number.isInteger(effets[0].variation) &&
      effets[0].variation >= -14 &&
      effets[0].variation <= 0
    );
  }

  return undefined;
}

function effetsMaterielsDynamiquesDeLOuvertureSontValides(
  faitId: string,
  effets: readonly unknown[],
): boolean | undefined {
  if (faitId === "couronne.ouverture.rail-ouverte") {
    return (
      effets.length === 1 &&
      (estEffetStock(effets[0], -6, "materiaux") ||
        estEffetStock(effets[0], -2, "materiaux"))
    );
  }
  if (faitId === "couronne.ouverture.phares-ouvertes") {
    return (
      effets.length === 1 &&
      (estEffetStock(effets[0], -8, "eau") ||
        estEffetStock(effets[0], -2, "eau"))
    );
  }
  if (faitId === "couronne.ouverture.colonies-ouvertes") {
    return (
      effets.length === 2 &&
      ((estEffetStock(effets[0], -4, "eau") &&
        estEffetStock(effets[1], -4, "materiaux")) ||
        (estEffetStock(effets[0], -2, "eau") &&
          estEffetStock(effets[1], -2, "materiaux")))
    );
  }
  return undefined;
}

export function estFaitDeCampagneV2(valeur: unknown): boolean {
  if (!estFaitDeCampagne(valeur) || !estObjet(valeur)) {
    return false;
  }
  const effets = valeur.effets;
  if (
    !estObjet(effets) ||
    !Array.isArray(effets.materiels) ||
    !effets.materiels.every(estEffetMaterielDeFait) ||
    !Array.isArray(effets.humains) ||
    !effets.humains.every(estEffetHumainDeFait)
  ) {
    return false;
  }

  if (String(valeur.id).startsWith("expedition.vannes-grises.")) {
    return effets.materiels.length === 0 && effets.humains.length === 0;
  }
  if (!identifiantsDeFaitsConnus().has(String(valeur.id))) {
    return false;
  }

  const materiels = effets.materiels;
  const humains = effets.humains;
  const acteurs = valeur.acteurs as string[];
  if (estIdentifiantDeFaitDuConseil(String(valeur.id))) {
    return estFaitDuConseil(valeur);
  }
  const definitionDuCatalogue = definitionsDeFaitsDuCatalogue().get(
    String(valeur.id),
  );
  if (definitionDuCatalogue !== undefined) {
    const effetsMaterielsAttendus = definitionDuCatalogue.effets.filter(
      (effet) => effet.type === "stock.modifier",
    ) as readonly {
      readonly type: "stock.modifier";
      readonly stock: string;
      readonly valeur: number;
    }[];
    const effetsHumainsAttendus = definitionDuCatalogue.effets.filter(
      (
        effet,
      ): effet is Extract<
        (typeof definitionDuCatalogue.effets)[number],
        { readonly type: "habitants.modifier" }
      > => effet.type === "habitants.modifier",
    );
    const effetsMaterielsDynamiquesValides =
      effetsMaterielsDynamiquesDeLAiguillageSontValides(
        String(valeur.id),
        materiels,
      ) ??
      effetsMaterielsDynamiquesDeLOuvertureSontValides(
        String(valeur.id),
        materiels,
      );
    return (
      valeur.cause === definitionDuCatalogue.cause &&
      memesChaines(acteurs, definitionDuCatalogue.acteurs) &&
      valeur.cible === definitionDuCatalogue.cible &&
      (effetsMaterielsDynamiquesValides ??
        (materiels.length === effetsMaterielsAttendus.length &&
          effetsMaterielsAttendus.every((effet, index) =>
            estEffetStock(materiels[index], effet.valeur, effet.stock),
          ))) &&
      humains.length === effetsHumainsAttendus.length &&
      effetsHumainsAttendus.every((effet, index) =>
        estEffetHumain(
          humains[index],
          "habitants.modifies",
          "variation",
          effet.valeur,
        ),
      )
    );
  }

  if (IDENTIFIANTS_DE_FAITS_DE_CRISE.includes(valeur.id as never)) {
    if (valeur.id === IDENTIFIANTS_DE_FAITS_DE_CRISE[0]) {
      return (
        valeur.cause === FAIT_ANNONCANT_LA_CRISE &&
        memesChaines(acteurs, [
          "equipes-purification",
          "foyers-du-convoi",
        ]) &&
        valeur.cible === "reserve-deau-purifiee" &&
        materiels.length === 1 &&
        estObjet(materiels[0]) &&
        materiels[0].type === "stock.modifie" &&
        materiels[0].stock === "eau" &&
        estNombreFini(materiels[0].variation) &&
        materiels[0].variation <= 0 &&
        humains.length === 1 &&
        estEffetHumain(humains[0], "habitants.exposes", "nombre", 0)
      );
    }
    if (valeur.id === IDENTIFIANTS_DE_FAITS_DE_CRISE[4]) {
      return (
        valeur.cause === FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE &&
        memesChaines(acteurs, [
          "cohorte-du-sillon",
          "techniciens-veille-basse",
        ]) &&
        valeur.cible === "capacites-accueil-veille-basse" &&
        materiels.length === 0 &&
        humains.length === 1 &&
        estEffetHumain(humains[0], "habitants.exposes", "nombre", 0)
      );
    }
    if (valeur.id === IDENTIFIANTS_DE_FAITS_DE_CRISE[7]) {
      return (
        valeur.cause === FAIT_ANNONCANT_LA_CRISE_DE_TRAME &&
        memesChaines(acteurs, [
          "equipes-entretien",
          "ateliers-grand-aiguillage",
        ]) &&
        valeur.cible === "chassis-de-la-cite-caravane" &&
        materiels.length === 0 &&
        humains.length === 1 &&
        estEffetHumain(humains[0], "habitants.exposes", "nombre", 0)
      );
    }
    const definition = DEFINITIONS_DES_REPONSES_A_LA_CRISE.find(
      (candidate) => candidate.faitProduit === valeur.id,
    );
    const plateformeDetachee =
      valeur.id === "crise.trame.detacher-plateforme" &&
      materiels.length === 1 &&
      estObjet(materiels[0]) &&
      materiels[0].type === "plateforme.detachee" &&
      typeof materiels[0].plateforme === "string"
        ? materiels[0].plateforme
        : undefined;
    return (
      definition !== undefined &&
      (valeur.id !== "crise.trame.detacher-plateforme" ||
        plateformeDetachee !== undefined) &&
      sontStructurellementEgaux(
        valeur,
        faitDeResolutionAttendu(
          definition,
          valeur.moment as number,
          plateformeDetachee,
        ),
      )
    );
  }

  if (
    IDENTIFIANTS_DE_FAITS_DE_RECUPERATION.includes(
      valeur.id as never,
    )
  ) {
    const identifiant = String(valeur.id);
    const accomplie = identifiant.endsWith(".accomplie");
    const garantie = identifiant
      .replace("crise.recuperation.", "")
      .replace(/\.(?:accomplie|manquee)$/, "") as
      RecuperationDeCrise["garantie"];
    const definition = DEFINITIONS_DES_REPONSES_A_LA_CRISE.find(
      (candidate) => candidate.recuperation.garantie === garantie,
    );
    if (definition === undefined) {
      return false;
    }
    const { acteurs: acteursAttendus, cible: cibleAttendue } =
      acteursEtCibleDeRecuperation(garantie);
    const coutMaterielAttendu =
      accomplie &&
      definition.recuperation.coutAttendu === "deux-materiaux";
    return (
      valeur.cause === definition.cicatrice.id &&
      memesChaines(acteurs, acteursAttendus) &&
      valeur.cible === cibleAttendue &&
      humains.length === 0 &&
      (coutMaterielAttendu
        ? materiels.length === 1 &&
          estEffetStock(materiels[0], -2, "materiaux")
        : materiels.length === 0)
    );
  }

  if (
    valeur.cause !== INCIDENT_INITIAL.id ||
    !memesChaines(acteurs, ["porte-lanterne", "equipes-entretien"]) ||
    valeur.cible !== "pompe-purification" ||
    humains.length !== 1
  ) {
    return false;
  }
  if (valeur.id === IDENTIFIANTS_DE_FAITS_D_INCIDENT[0]) {
    return (
      materiels.length === 2 &&
      materiels.some((effet) => estEffetStock(effet, -3)) &&
      materiels.some((effet) => estEffetInstallation(effet, "securisee")) &&
      estEffetHumain(humains[0], "habitants.exposes", "nombre", 0)
    );
  }
  if (valeur.id === IDENTIFIANTS_DE_FAITS_D_INCIDENT[1]) {
    return (
      materiels.length === 2 &&
      materiels.some((effet) => estEffetStock(effet, -2)) &&
      materiels.some((effet) => estEffetInstallation(effet, "stabilisee")) &&
      estEffetHumain(humains[0], "habitants.exposes", "nombre", 0)
    );
  }
  return (
    valeur.id === IDENTIFIANTS_DE_FAITS_D_INCIDENT[2] &&
    materiels.length === 1 &&
    estEffetInstallation(materiels[0], "degradee") &&
    estEffetHumain(humains[0], "habitants.sous-surveillance", "nombre", 2)
  );
}

function estInstallationDuConvoi(
  valeur: unknown,
  secondesCourantes: number,
): boolean {
  return (
    estObjet(valeur) &&
    typeof valeur.id === "string" &&
    typeof valeur.definitionId === "string" &&
    IDENTIFIANTS_D_INSTALLATION.includes(valeur.definitionId as never) &&
    ["operationnelle", "degradee", "hors-service"].includes(
      String(valeur.etatMateriel),
    ) &&
    estNombreFini(valeur.installeeA) &&
    Number.isInteger(valeur.installeeA) &&
    valeur.installeeA >= 0 &&
    valeur.installeeA <= secondesCourantes
  );
}

function dureeAttendueDUnChantier(
  ordre: OrdreDeChantier,
  priorite: string,
): number {
  const dureeNormale = ordre.type === "construction" ? 90 : 45;
  if (priorite === "haute") {
    return Math.round((dureeNormale * 2) / 3);
  }
  if (priorite === "basse") {
    return Math.round((dureeNormale * 4) / 3);
  }
  return dureeNormale;
}

function estChantier(
  valeur: unknown,
  secondesCourantes: number,
  termine: boolean,
): boolean {
  if (
    !estObjet(valeur) ||
    typeof valeur.id !== "string" ||
    !estOrdreDeChantier(valeur.ordre) ||
    !PRIORITES_DE_CHANTIER.has(String(valeur.priorite)) ||
    !estNombreFini(valeur.commenceA) ||
    !Number.isInteger(valeur.commenceA) ||
    valeur.commenceA < 0 ||
    valeur.commenceA > secondesCourantes ||
    !estNombreFini(valeur.dureePrevue) ||
    valeur.dureePrevue !==
      dureeAttendueDUnChantier(valeur.ordre, String(valeur.priorite)) ||
    !estNombreFini(valeur.progression) ||
    !Number.isInteger(valeur.progression) ||
    valeur.progression < 0 ||
    valeur.progression > valeur.dureePrevue ||
    !estNombreFini(valeur.coutMateriaux) ||
    !Number.isInteger(valeur.coutMateriaux) ||
    valeur.coutMateriaux < 0 ||
    !estNombreFini(valeur.materiauxConsommes) ||
    valeur.materiauxConsommes !==
      Math.floor(
        (valeur.coutMateriaux * valeur.progression) / valeur.dureePrevue,
      )
  ) {
    return false;
  }
  const coutAttendu =
    valeur.ordre.type === "construction"
      ? CATALOGUE_D_INSTALLATIONS[valeur.ordre.definitionId].coutMateriaux
      : valeur.ordre.type === "deplacement"
        ? 2
        : 0;
  if (valeur.coutMateriaux !== coutAttendu) {
    return false;
  }
  if (!termine) {
    return valeur.progression < valeur.dureePrevue;
  }
  return (
    valeur.progression === valeur.dureePrevue &&
    estNombreFini(valeur.termineA) &&
    Number.isInteger(valeur.termineA) &&
    valeur.termineA >= valeur.commenceA + valeur.dureePrevue &&
    valeur.termineA <= secondesCourantes
  );
}

function estEtatInfrastructure(
  valeur: unknown,
  secondesCourantes: number,
  faits: readonly ObjetInconnu[],
): valeur is EtatInfrastructure {
  if (
    !estObjet(valeur) ||
    !["voyage", "halte"].includes(String(valeur.deploiement)) ||
    !Array.isArray(valeur.plateformes) ||
    !Array.isArray(valeur.quartiers) ||
    !Array.isArray(valeur.chantiersTermines)
  ) {
    return false;
  }
  const initiale = creerInfrastructureInitiale();
  const faitDeScellement = faits.find(
    (fait) => fait.id === "bassins.deversoir.transformation-scellee",
  );
  const faitDeProjet = faits.find(
    (fait) =>
      fait.id === "bassins.conseil.decanteur-repare" ||
      fait.id === "bassins.conseil.cohorte-reorientee",
  );
  const faitDeGabarits = faits.find(
    (fait) => fait.id === "bassins.deversoir.gabarits-conserves",
  );
  const faitDeDetachement = faits.find(
    (fait) => fait.id === "crise.trame.detacher-plateforme",
  );
  const plateformeDetachee =
    faitDeDetachement !== undefined &&
    estObjet(faitDeDetachement.effets) &&
    Array.isArray(faitDeDetachement.effets.materiels)
      ? (faitDeDetachement.effets.materiels as ObjetInconnu[]).find(
          (effet) => effet.type === "plateforme.detachee",
        )?.plateforme
      : undefined;
  const projetRegionalAttendu =
    faitDeScellement === undefined || faitDeProjet === undefined
      ? null
      : {
          id:
            faitDeProjet.id === "bassins.conseil.decanteur-repare"
              ? ("decanteur-itinerant" as const)
              : ("arche-des-deplaces" as const),
          service:
            faitDeProjet.id === "bassins.conseil.decanteur-repare"
              ? ("purification-mobile" as const)
              : ("accueil-deplaces" as const),
          contrainte:
            faitDeProjet.id === "bassins.conseil.decanteur-repare"
              ? ("entretien-hydraulique-dedie" as const)
              : ("charge-habitable-permanente" as const),
          scelleA: faitDeScellement.moment,
        };
  const plateformesInitialesAttendues = initiale.plateformes.filter(
    ({ id }) => id !== plateformeDetachee,
  );
  const quartiersAttendus = initiale.quartiers.filter(
    ({ plateformeId }) => plateformeId !== plateformeDetachee,
  );
  const plateformeRegionaleAttendue =
    (projetRegionalAttendu !== null || faitDeGabarits !== undefined) &&
    plateformeDetachee !== "chassis-regional-des-bassins";
  if (
    valeur.plateformes.length !==
      plateformesInitialesAttendues.length +
        (plateformeRegionaleAttendue ? 1 : 0) ||
    valeur.quartiers.length !== quartiersAttendus.length ||
    !valeur.quartiers.every((quartier, index) => {
      const quartierInitial = quartiersAttendus[index];
      return (
        estObjet(quartier) &&
        quartier.id === quartierInitial?.id &&
        quartier.nom === quartierInitial.nom &&
        quartier.plateformeId === quartierInitial.plateformeId
      );
    })
  ) {
    return false;
  }
  const installations = new Set<string>();
  for (const [
    index,
    plateformeInitiale,
  ] of plateformesInitialesAttendues.entries()) {
    const plateforme = valeur.plateformes[index];
    if (
      !estObjet(plateforme) ||
      plateforme.id !== plateformeInitiale.id ||
      plateforme.nom !== plateformeInitiale.nom ||
      plateforme.type !== plateformeInitiale.type ||
      plateforme.quartierId !== plateformeInitiale.quartierId ||
      plateforme.projetRegional !== undefined ||
      !Array.isArray(plateforme.emplacements) ||
      plateforme.emplacements.length !== plateformeInitiale.emplacements.length
    ) {
      return false;
    }
    for (const [
      emplacementIndex,
      emplacementInitial,
    ] of plateformeInitiale.emplacements.entries()) {
      const emplacement = plateforme.emplacements[emplacementIndex];
      if (
        !estObjet(emplacement) ||
        emplacement.id !== emplacementInitial.id ||
        emplacement.categorie !== emplacementInitial.categorie ||
        !(
          emplacement.installation === null ||
          estInstallationDuConvoi(emplacement.installation, secondesCourantes)
        )
      ) {
        return false;
      }
      if (estObjet(emplacement.installation)) {
        if (installations.has(String(emplacement.installation.id))) {
          return false;
        }
        installations.add(String(emplacement.installation.id));
        const definition =
          CATALOGUE_D_INSTALLATIONS[
            emplacement.installation
              .definitionId as keyof typeof CATALOGUE_D_INSTALLATIONS
          ];
        if (
          emplacement.categorie !== "polyvalent" &&
          !definition.categoriesCompatibles.includes(
            emplacement.categorie as never,
          )
        ) {
          return false;
        }
      }
    }
  }
  const plateformeRegionale =
    valeur.plateformes[plateformesInitialesAttendues.length];
  if (
    projetRegionalAttendu !== null &&
    plateformeRegionaleAttendue
  ) {
    if (
      !estObjet(plateformeRegionale) ||
        plateformeRegionale.id !== "chassis-regional-des-bassins" ||
        plateformeRegionale.nom !== "chassis-regional-des-bassins" ||
        plateformeRegionale.type !== "standard" ||
        plateformeRegionale.quartierId !== null ||
        !Array.isArray(plateformeRegionale.emplacements) ||
        plateformeRegionale.emplacements.length !== 0 ||
        !sontStructurellementEgaux(
          plateformeRegionale.projetRegional,
          projetRegionalAttendu,
        )
    ) {
      return false;
    }
  } else if (
    faitDeGabarits !== undefined &&
    plateformeRegionaleAttendue
  ) {
    if (
      !estObjet(plateformeRegionale) ||
      plateformeRegionale.id !== "chassis-regional-des-bassins" ||
      plateformeRegionale.nom !== "chassis-regional-des-bassins" ||
      plateformeRegionale.type !== "standard" ||
      plateformeRegionale.quartierId !== null ||
      plateformeRegionale.projetRegional !== undefined ||
      !Array.isArray(plateformeRegionale.emplacements) ||
      plateformeRegionale.emplacements.length !== 3
    ) {
      return false;
    }
    const emplacementsAttendus = [
      ["chassis-regional-des-bassins.habitable", "habitable"],
      ["chassis-regional-des-bassins.technique", "technique"],
      ["chassis-regional-des-bassins.polyvalent", "polyvalent"],
    ] as const;
    for (const [index, [id, categorie]] of emplacementsAttendus.entries()) {
      const emplacement = plateformeRegionale.emplacements[index];
      if (
        !estObjet(emplacement) ||
        emplacement.id !== id ||
        emplacement.categorie !== categorie ||
        !(
          emplacement.installation === null ||
          estInstallationDuConvoi(
            emplacement.installation,
            secondesCourantes,
          )
        )
      ) {
        return false;
      }
      if (estObjet(emplacement.installation)) {
        if (installations.has(String(emplacement.installation.id))) {
          return false;
        }
        installations.add(String(emplacement.installation.id));
        const definition =
          CATALOGUE_D_INSTALLATIONS[
            emplacement.installation
              .definitionId as keyof typeof CATALOGUE_D_INSTALLATIONS
          ];
        if (
          categorie !== "polyvalent" &&
          !definition.categoriesCompatibles.includes(categorie)
        ) {
          return false;
        }
      }
    }
  } else if (
    plateformeRegionale !== undefined &&
    plateformeRegionaleAttendue
  ) {
    return false;
  }
  if (
    valeur.chantierActif !== null &&
    !estChantier(valeur.chantierActif, secondesCourantes, false)
  ) {
    return false;
  }
  if (valeur.chantierActif !== null && valeur.deploiement !== "halte") {
    return false;
  }
  let dernierTerme = 0;
  const infrastructureDeReferenceComplete =
    faitDeGabarits === undefined
      ? initiale
      : ajouterPlateformeRegionaleOrdinaire(initiale);
  const emplacementsInitiaux =
    infrastructureDeReferenceComplete.plateformes.flatMap(
      (plateforme) => plateforme.emplacements,
    );
  const installationsAttendues = new Map(
    emplacementsInitiaux.map((emplacement) => [
      emplacement.id,
      emplacement.installation,
    ] as const),
  );
  const categories = new Map(
    emplacementsInitiaux.map((emplacement) => [
      emplacement.id,
      emplacement.categorie,
    ] as const),
  );
  const compatible = (
    definitionId: keyof typeof CATALOGUE_D_INSTALLATIONS,
    emplacementId: string,
  ) => {
    const categorie = categories.get(emplacementId);
    return (
      categorie !== undefined &&
      (categorie === "polyvalent" ||
        CATALOGUE_D_INSTALLATIONS[definitionId].categoriesCompatibles.includes(
          categorie as never,
        ))
    );
  };
  const estDerniereFonctionVitale = (emplacementId: string) => {
    const installation = installationsAttendues.get(emplacementId);
    if (installation === null || installation === undefined) {
      return false;
    }
    return (
      installationEstVitale(installation.definitionId) &&
      [...installationsAttendues.values()].filter(
        (candidate) =>
          candidate?.definitionId === installation.definitionId,
      ).length <= 1
    );
  };
  const infrastructureAttendue = (
    moment = secondesCourantes,
  ): EtatInfrastructure => {
    const detachementDejaApplique =
      typeof plateformeDetachee === "string" &&
      faitDeDetachement !== undefined &&
      (faitDeDetachement.moment as number) <= moment;
    return {
      ...infrastructureDeReferenceComplete,
      plateformes: infrastructureDeReferenceComplete.plateformes
        .filter(
          ({ id }) =>
            !detachementDejaApplique || id !== plateformeDetachee,
        )
        .map((plateforme) => ({
          ...plateforme,
          emplacements: plateforme.emplacements.map((emplacement) => ({
            ...emplacement,
            installation:
              installationsAttendues.get(emplacement.id) ?? null,
          })),
        })),
      quartiers: infrastructureDeReferenceComplete.quartiers.filter(
        ({ plateformeId }) =>
          !detachementDejaApplique ||
          plateformeId !== plateformeDetachee,
      ),
    };
  };
  const ordreToucheLaPlateformeRegionale = (ordre: OrdreDeChantier) =>
    (ordre.type === "deplacement"
      ? [ordre.origineId, ordre.destinationId]
      : [ordre.emplacementId]
    ).some((id) => id.startsWith("chassis-regional-des-bassins."));
  const ordreToucheLaPlateformeDetachee = (ordre: OrdreDeChantier) =>
    typeof plateformeDetachee === "string" &&
    (ordre.type === "deplacement"
      ? [ordre.origineId, ordre.destinationId]
      : [ordre.emplacementId]
    ).some((id) => id.startsWith(`${plateformeDetachee}.`));
  const ordreEstPosterieurAuChassis = (
    ordre: OrdreDeChantier,
    commenceA: number,
  ) =>
    (!ordreToucheLaPlateformeRegionale(ordre) ||
      (faitDeGabarits !== undefined &&
        commenceA >= (faitDeGabarits.moment as number))) &&
    (!ordreToucheLaPlateformeDetachee(ordre) ||
      faitDeDetachement === undefined ||
      commenceA < (faitDeDetachement.moment as number));
  let momentDesMateriaux = 0;
  let quantiteDeMateriaux = PILOTAGE_INITIAL.economie.stocks.materiaux.quantite;
  let reliquatDeMateriaux =
    PILOTAGE_INITIAL.economie.stocks.materiaux.reliquatDeFlux;
  let fluxDeMateriaux =
    PILOTAGE_INITIAL.economie.stocks.materiaux.fluxParHeure;
  let indexDuFaitMateriel = 0;
  const faitsMateriels = faits.filter((fait) =>
    (fait.effets as ObjetInconnu).materiels instanceof Array,
  );
  const appliquerFluxDeMateriaux = (secondes: number) => {
    const numerateur =
      reliquatDeMateriaux + fluxDeMateriaux * Math.max(0, secondes);
    const variation = Math.trunc(numerateur / 3_600);
    quantiteDeMateriaux = Math.max(0, quantiteDeMateriaux + variation);
    reliquatDeMateriaux =
      quantiteDeMateriaux === 0
        ? 0
        : numerateur - variation * 3_600;
  };
  const avancerMateriauxJusqua = (moment: number) => {
    while (
      indexDuFaitMateriel < faitsMateriels.length &&
      (faitsMateriels[indexDuFaitMateriel]?.moment as number) <= moment
    ) {
      const fait = faitsMateriels[indexDuFaitMateriel]!;
      const momentDuFait = fait.moment as number;
      appliquerFluxDeMateriaux(momentDuFait - momentDesMateriaux);
      momentDesMateriaux = momentDuFait;
      const effets = (fait.effets as ObjetInconnu)
        .materiels as ObjetInconnu[];
      for (const effet of effets) {
        if (
          effet.type === "stock.modifie" &&
          effet.stock === "materiaux"
        ) {
          quantiteDeMateriaux = Math.max(
            0,
            quantiteDeMateriaux + (effet.variation as number),
          );
        }
      }
      indexDuFaitMateriel += 1;
    }
    appliquerFluxDeMateriaux(moment - momentDesMateriaux);
    momentDesMateriaux = moment;
  };
  const reserveDIncidentAuMoment = (moment: number) =>
    faits.some(
      (fait) =>
        fait.cause === INCIDENT_INITIAL.id &&
        (fait.moment as number) <= moment,
    )
      ? 0
      : 3;
  const actualiserFluxDeMateriaux = (moment: number) => {
    fluxDeMateriaux =
      PILOTAGE_INITIAL.economie.stocks.materiaux.fluxParHeure +
      (calculerModificateursEconomiques(infrastructureAttendue(moment))
        .fluxDeStocks.materiaux ?? 0);
  };
  const ressourcesDeConstruction = (moment: number) => {
    const modificateurs = calculerModificateursEconomiques(
      infrastructureAttendue(moment),
    );
    const capacites = PILOTAGE_INITIAL.economie.capacites;
    return {
      margeDeChaleur:
        capacites.chaleur.production -
        (capacites.chaleur.demande + modificateurs.demandeDeChaleur),
      margeDeMainDOeuvre:
        capacites["main-d-oeuvre"].production -
        (capacites["main-d-oeuvre"].demande +
          modificateurs.demandeDeMainDOeuvre),
      margeDeCharge:
        capacites.charge.production -
        (capacites.charge.demande + modificateurs.demandeDeCharge),
      materiauxDisponibles: quantiteDeMateriaux,
      reserveDIncident: reserveDIncidentAuMoment(moment),
    };
  };
  for (const [index, chantierInconnu] of valeur.chantiersTermines.entries()) {
    const chantier =
      chantierInconnu as EtatInfrastructure["chantiersTermines"][number];
    if (
      !estChantier(chantier, secondesCourantes, true) ||
      !estObjet(chantier) ||
      chantier.termineA < dernierTerme ||
      chantier.commenceA < dernierTerme ||
      chantier.termineA !== chantier.commenceA + chantier.dureePrevue ||
      chantier.id !==
        `chantier.${index}.${chantier.commenceA}.${chantier.ordre.type}`
    ) {
      return false;
    }
    avancerMateriauxJusqua(chantier.commenceA);
    const ordre = chantier.ordre;
    if (!ordreEstPosterieurAuChassis(ordre, chantier.commenceA)) {
      return false;
    }
    if (ordre.type === "construction") {
      if (
        installationsAttendues.get(ordre.emplacementId) !== null ||
        !compatible(ordre.definitionId, ordre.emplacementId) ||
        trouverRefusDeConstruction(
          CATALOGUE_D_INSTALLATIONS[ordre.definitionId],
          categories.get(ordre.emplacementId)!,
          ressourcesDeConstruction(chantier.commenceA),
        ) !== null
      ) {
        return false;
      }
      avancerMateriauxJusqua(chantier.termineA);
      if (quantiteDeMateriaux < chantier.materiauxConsommes) {
        return false;
      }
      quantiteDeMateriaux -= chantier.materiauxConsommes;
      installationsAttendues.set(ordre.emplacementId, {
        id: `${ordre.emplacementId}.${ordre.definitionId}`,
        definitionId: ordre.definitionId,
        etatMateriel: "operationnelle",
        installeeA: chantier.termineA,
      });
    } else if (ordre.type === "demontage") {
      if (
        !installationsAttendues.has(ordre.emplacementId) ||
        installationsAttendues.get(ordre.emplacementId) === null ||
        estDerniereFonctionVitale(ordre.emplacementId)
      ) {
        return false;
      }
      avancerMateriauxJusqua(chantier.termineA);
      installationsAttendues.set(ordre.emplacementId, null);
    } else {
      const installation = installationsAttendues.get(ordre.origineId);
      if (
        installation === undefined ||
        installation === null ||
        installationsAttendues.get(ordre.destinationId) !== null ||
        !compatible(installation.definitionId, ordre.destinationId) ||
        demandeDeChargePourCategorie(
          CATALOGUE_D_INSTALLATIONS[installation.definitionId],
          categories.get(ordre.destinationId)!,
        ) -
          demandeDeChargePourCategorie(
            CATALOGUE_D_INSTALLATIONS[installation.definitionId],
            categories.get(ordre.origineId)!,
          ) >
          ressourcesDeConstruction(chantier.commenceA).margeDeCharge ||
        quantiteDeMateriaux <
          2 + reserveDIncidentAuMoment(chantier.commenceA)
      ) {
        return false;
      }
      avancerMateriauxJusqua(chantier.termineA);
      if (quantiteDeMateriaux < chantier.materiauxConsommes) {
        return false;
      }
      quantiteDeMateriaux -= chantier.materiauxConsommes;
      installationsAttendues.set(ordre.origineId, null);
      installationsAttendues.set(ordre.destinationId, installation);
    }
    actualiserFluxDeMateriaux(chantier.termineA);
    dernierTerme = chantier.termineA;
  }
  if (valeur.chantierActif !== null) {
    const chantier = valeur.chantierActif as NonNullable<
      EtatInfrastructure["chantierActif"]
    >;
    if (
      chantier.id !==
        `chantier.${valeur.chantiersTermines.length}.${chantier.commenceA}.${chantier.ordre.type}` ||
      chantier.commenceA < dernierTerme ||
      chantier.commenceA + chantier.progression !== secondesCourantes
    ) {
      return false;
    }
    avancerMateriauxJusqua(chantier.commenceA);
    const ordre = chantier.ordre;
    if (
      !ordreEstPosterieurAuChassis(ordre, chantier.commenceA) ||
      (ordre.type === "construction" &&
        (installationsAttendues.get(ordre.emplacementId) !== null ||
          !compatible(ordre.definitionId, ordre.emplacementId) ||
          trouverRefusDeConstruction(
            CATALOGUE_D_INSTALLATIONS[ordre.definitionId],
            categories.get(ordre.emplacementId)!,
            ressourcesDeConstruction(chantier.commenceA),
          ) !== null)) ||
      (ordre.type === "demontage" &&
        (installationsAttendues.get(ordre.emplacementId) == null ||
          estDerniereFonctionVitale(ordre.emplacementId))) ||
      (ordre.type === "deplacement" &&
        (installationsAttendues.get(ordre.origineId) == null ||
          installationsAttendues.get(ordre.destinationId) !== null ||
          !compatible(
            installationsAttendues.get(ordre.origineId)!.definitionId,
            ordre.destinationId,
          ) ||
          demandeDeChargePourCategorie(
            CATALOGUE_D_INSTALLATIONS[
              installationsAttendues.get(ordre.origineId)!.definitionId
            ],
            categories.get(ordre.destinationId)!,
          ) -
            demandeDeChargePourCategorie(
              CATALOGUE_D_INSTALLATIONS[
                installationsAttendues.get(ordre.origineId)!.definitionId
              ],
              categories.get(ordre.origineId)!,
            ) >
            ressourcesDeConstruction(chantier.commenceA).margeDeCharge ||
          quantiteDeMateriaux <
            2 + reserveDIncidentAuMoment(chantier.commenceA)))
    ) {
      return false;
    }
    avancerMateriauxJusqua(secondesCourantes);
    if (quantiteDeMateriaux < chantier.materiauxConsommes) {
      return false;
    }
  }
  for (const plateforme of valeur.plateformes) {
    if (!estObjet(plateforme) || !Array.isArray(plateforme.emplacements)) {
      return false;
    }
    for (const emplacement of plateforme.emplacements) {
      const installationAttendue = installationsAttendues.get(
        String(emplacement.id),
      );
      const installation = emplacement.installation;
      if (
        !estObjet(emplacement) ||
        !(
          (installation === null && installationAttendue === null) ||
          (estObjet(installation) &&
            installationAttendue !== null &&
            installationAttendue !== undefined &&
            installation.id === installationAttendue.id &&
            installation.definitionId === installationAttendue.definitionId &&
            installation.etatMateriel === installationAttendue.etatMateriel &&
            installation.installeeA === installationAttendue.installeeA)
        )
      ) {
        return false;
      }
    }
  }
  return true;
}

function calculerStockAttendu(
  id: (typeof IDENTIFIANTS_DE_STOCK)[number],
  secondesFinales: number,
  faits: readonly ObjetInconnu[],
  infrastructure: EtatInfrastructure,
  routes: EtatDesRoutes,
  expeditions: EtatDesExpeditions,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
  reinitialiserReliquatApresConsommationMateriaux = true,
  utiliserCoutsHistoriquesDesNacelles = false,
): {
  readonly quantite: number;
  readonly fluxParHeure: number;
  readonly reliquatDeFlux: number;
  readonly coutsDeLancementDExpeditionApplicables: boolean;
  readonly possibilites: readonly {
    readonly quantite: number;
    readonly reliquatDeFlux: number;
    readonly coutsDeLancementDExpeditionApplicables: boolean;
  }[];
} {
  const initial = PILOTAGE_INITIAL.economie.stocks[id];
  type PossibiliteDeStock = {
    readonly stock: typeof initial;
    readonly coutsDeLancementDExpeditionApplicables: boolean;
  };
  let possibilites: PossibiliteDeStock[] = [
    {
      stock: { ...initial },
      coutsDeLancementDExpeditionApplicables: true,
    },
  ];
  let canonique = possibilites[0]!;
  let secondeCourante = 0;
  let fluxParHeure = initial.fluxParHeure;
  const appliquerFlux = (
    possibilite: PossibiliteDeStock,
    secondes: number,
  ): PossibiliteDeStock => {
    const stock = possibilite.stock;
    const numerateur =
      stock.reliquatDeFlux + fluxParHeure * Math.max(0, secondes);
    const variation = Math.trunc(numerateur / 3_600);
    const quantite = Math.max(0, stock.quantite + variation);
    return {
      ...possibilite,
      stock: {
        ...stock,
        quantite,
        reliquatDeFlux:
          quantite === 0 ? 0 : numerateur - variation * 3_600,
      },
    };
  };

  const installationsParEmplacement = new Map(
    creerInfrastructureInitiale().plateformes.flatMap((plateforme) =>
      plateforme.emplacements.map(
        (emplacement) =>
          [
            emplacement.id,
            emplacement.installation?.definitionId ?? null,
          ] as const,
      ),
    ),
  );
  const transitionsDeChantiers = infrastructure.chantiersTermines.map(
    (chantier, index) => {
      let variationDeFlux = 0;
      if (chantier.ordre.type === "construction") {
        variationDeFlux =
          CATALOGUE_D_INSTALLATIONS[chantier.ordre.definitionId]
            .effetsEconomiques.fluxDeStocks[id] ?? 0;
        installationsParEmplacement.set(
          chantier.ordre.emplacementId,
          chantier.ordre.definitionId,
        );
      } else if (chantier.ordre.type === "demontage") {
        const definitionId = installationsParEmplacement.get(
          chantier.ordre.emplacementId,
        );
        if (definitionId !== null && definitionId !== undefined) {
          variationDeFlux = -(
            CATALOGUE_D_INSTALLATIONS[definitionId].effetsEconomiques
              .fluxDeStocks[id] ?? 0
          );
        }
        installationsParEmplacement.set(chantier.ordre.emplacementId, null);
      } else {
        const definitionId = installationsParEmplacement.get(
          chantier.ordre.origineId,
        );
        installationsParEmplacement.set(chantier.ordre.origineId, null);
        installationsParEmplacement.set(
          chantier.ordre.destinationId,
          definitionId ?? null,
        );
      }
      return {
        type: "infrastructure" as const,
        moment: chantier.termineA,
        index,
        variationDeFlux,
      };
    },
  );
  const transitionsDeDetachement = faits.flatMap((fait, index) => {
    if (
      fait.id !== "crise.trame.detacher-plateforme" ||
      !estObjet(fait.effets) ||
      !Array.isArray(fait.effets.materiels)
    ) {
      return [];
    }
    const effet = (fait.effets.materiels as ObjetInconnu[]).find(
      (candidate) => candidate.type === "plateforme.detachee",
    );
    if (effet === undefined || typeof effet.plateforme !== "string") {
      return [];
    }
    const installationsAuMoment = new Map(
      creerInfrastructureInitiale().plateformes.flatMap((plateforme) =>
        plateforme.emplacements.map(
          (emplacement) =>
            [
              emplacement.id,
              emplacement.installation?.definitionId ?? null,
            ] as const,
        ),
      ),
    );
    for (const chantier of infrastructure.chantiersTermines) {
      if (chantier.termineA > (fait.moment as number)) {
        continue;
      }
      if (chantier.ordre.type === "construction") {
        installationsAuMoment.set(
          chantier.ordre.emplacementId,
          chantier.ordre.definitionId,
        );
      } else if (chantier.ordre.type === "demontage") {
        installationsAuMoment.set(chantier.ordre.emplacementId, null);
      } else {
        const definitionId = installationsAuMoment.get(
          chantier.ordre.origineId,
        );
        installationsAuMoment.set(chantier.ordre.origineId, null);
        installationsAuMoment.set(
          chantier.ordre.destinationId,
          definitionId ?? null,
        );
      }
    }
    let variationDeFlux = 0;
    for (const [emplacementId, definitionId] of installationsAuMoment) {
      if (
        !emplacementId.startsWith(`${effet.plateforme}.`) ||
        definitionId === null
      ) {
        continue;
      }
      variationDeFlux -=
        CATALOGUE_D_INSTALLATIONS[definitionId].effetsEconomiques
          .fluxDeStocks[id] ?? 0;
    }
    return [
      {
        type: "infrastructure" as const,
        moment: fait.moment as number,
        index: infrastructure.chantiersTermines.length + index,
        variationDeFlux,
      },
    ];
  });
  const transitions = [
    ...transitionsDeChantiers,
    ...transitionsDeDetachement,
  ];
  const causesDEvenementsDejaComptabilisees = new Set<string>();
  const faitsAvecEffetsUniques = faits.filter((fait) => {
    const definition = definitionsDeFaitsDuCatalogue().get(String(fait.id));
    if (definition === undefined) {
      return true;
    }
    const cause = String(fait.cause);
    if (causesDEvenementsDejaComptabilisees.has(cause)) {
      return false;
    }
    causesDEvenementsDejaComptabilisees.add(cause);
    return true;
  });
  const occurrences = [
    ...faitsAvecEffetsUniques.map((fait, index) => ({
      type: "fait" as const,
      moment: fait.moment as number,
      index,
      fait,
    })),
    ...transitions,
    ...expeditions.operations.flatMap((operation) =>
      operation.mouvementsDeStocks.map((mouvement, index) => ({
        type: "expedition" as const,
        moment: mouvement.moment,
        index,
        mouvement,
        estCoutDeLancement:
          "lanceeA" in operation && mouvement.moment === operation.lanceeA,
      })),
    ),
    ...routes.engagements.map((engagement, index) => ({
      type: "engagement" as const,
      moment: engagement.engageA,
      index,
      engagement,
    })),
    ...hautPuits.marche.offres.flatMap((offre, indexOffre) =>
      offre.echangeA === null
        ? []
        : offre.mouvements.map((mouvement, indexMouvement) => ({
            type: "haut-puits" as const,
            moment: offre.echangeA as number,
            index: indexOffre * 2 + indexMouvement,
            mouvement,
          })),
    ),
  ]
    .filter((occurrence) => occurrence.moment <= secondesFinales)
    .sort((gauche, droite) => {
    if (gauche.moment !== droite.moment) {
      return gauche.moment - droite.moment;
    }
    const priorite = {
      fait: 0,
      infrastructure: 1,
      expedition: 2,
      engagement: 3,
      "haut-puits": 4,
    } as const;
    return (
      priorite[gauche.type] - priorite[droite.type] ||
      gauche.index - droite.index
    );
    });

  type Occurrence = (typeof occurrences)[number];
  const appliquerOccurrence = (
    possibilite: PossibiliteDeStock,
    occurrence: Exclude<Occurrence, { readonly type: "infrastructure" }>,
  ): PossibiliteDeStock => {
    let stock = possibilite.stock;
    let coutsDeLancementDExpeditionApplicables =
      possibilite.coutsDeLancementDExpeditionApplicables;
    if (occurrence.type === "fait") {
      const effets = occurrence.fait.effets as ObjetInconnu;
      for (const effet of effets.materiels as ObjetInconnu[]) {
        if (effet.type === "stock.modifie" && effet.stock === id) {
          stock = appliquerVariationAUnStock(
            stock,
            effet.variation as number,
          );
        }
      }
    } else if (occurrence.type === "expedition") {
      if (occurrence.mouvement.stock === id) {
        if (
          occurrence.estCoutDeLancement &&
          occurrence.mouvement.variation < 0 &&
          stock.quantite < -occurrence.mouvement.variation
        ) {
          coutsDeLancementDExpeditionApplicables = false;
        }
        stock = appliquerVariationAUnStock(
          stock,
          occurrence.mouvement.variation,
        );
      }
    } else if (occurrence.type === "engagement") {
      const offreDesNacelles =
        occurrence.engagement.consommationsAppliquees === undefined &&
        !utiliserCoutsHistoriquesDesNacelles
          ? calculerOffreDesNacelles({
              position: occurrence.engagement.origine,
              hautPuits,
              veilleBasse,
              faits: faits.map((fait) => String(fait.id)),
            })
          : null;
      stock = appliquerConsommationDeRouteAUnStock(
        id,
        stock,
        trouverTronconDeRoute(occurrence.engagement.tronconId),
        occurrence.engagement.consommationsAppliquees ??
          (offreDesNacelles?.tronconId ===
          occurrence.engagement.tronconId
            ? offreDesNacelles.consommations
            : undefined),
      );
    } else if (occurrence.mouvement.stock === id) {
      stock = appliquerVariationAUnStock(
        stock,
        occurrence.mouvement.variation,
      );
    }
    return { stock, coutsDeLancementDExpeditionApplicables };
  };
  const dedupliquer = (
    valeurs: readonly PossibiliteDeStock[],
  ): PossibiliteDeStock[] => [
    ...new Map(
      valeurs.map((possibilite) => [
        [
          possibilite.stock.quantite,
          possibilite.stock.reliquatDeFlux,
          possibilite.coutsDeLancementDExpeditionApplicables ? 1 : 0,
        ].join(":"),
        possibilite,
      ]),
    ).values(),
  ];
  const ordresCompatibles = (
    depart: PossibiliteDeStock,
    groupe: readonly Exclude<
      Occurrence,
      { readonly type: "infrastructure" }
    >[],
  ): PossibiliteDeStock[] => {
    if (groupe.length <= 1) {
      return groupe.length === 0
        ? [depart]
        : [appliquerOccurrence(depart, groupe[0]!)];
    }
    if (groupe.length > 12) {
      return [
        groupe.reduce(
          (courant, occurrence) =>
            appliquerOccurrence(courant, occurrence),
          depart,
        ),
      ];
    }
    const parSousEnsemble = Array.from(
      { length: 1 << groupe.length },
      () => new Map<string, PossibiliteDeStock>(),
    );
    parSousEnsemble[0]!.set(
      `${depart.stock.quantite}:${depart.stock.reliquatDeFlux}:${
        depart.coutsDeLancementDExpeditionApplicables ? 1 : 0
      }`,
      depart,
    );
    for (let masque = 0; masque < parSousEnsemble.length - 1; masque += 1) {
      for (const possibilite of parSousEnsemble[masque]!.values()) {
        for (let index = 0; index < groupe.length; index += 1) {
          const bit = 1 << index;
          if ((masque & bit) !== 0) {
            continue;
          }
          const suivante = appliquerOccurrence(possibilite, groupe[index]!);
          const cle = [
            suivante.stock.quantite,
            suivante.stock.reliquatDeFlux,
            suivante.coutsDeLancementDExpeditionApplicables ? 1 : 0,
          ].join(":");
          parSousEnsemble[masque | bit]!.set(cle, suivante);
        }
      }
    }
    return [...parSousEnsemble.at(-1)!.values()];
  };

  for (let debut = 0; debut < occurrences.length; ) {
    const moment = occurrences[debut]!.moment;
    let fin = debut + 1;
    while (fin < occurrences.length && occurrences[fin]!.moment === moment) {
      fin += 1;
    }
    const groupe = occurrences.slice(debut, fin);
    const secondes = moment - secondeCourante;
    possibilites = possibilites.map((possibilite) =>
      appliquerFlux(possibilite, secondes),
    );
    canonique = appliquerFlux(canonique, secondes);
    const variations = groupe.filter(
      (
        occurrence,
      ): occurrence is Exclude<
        Occurrence,
        { readonly type: "infrastructure" }
      > => occurrence.type !== "infrastructure",
    );
    possibilites = dedupliquer(
      possibilites.flatMap((possibilite) =>
        ordresCompatibles(possibilite, variations),
      ),
    );
    canonique = variations.reduce(
      (courant, occurrence) => appliquerOccurrence(courant, occurrence),
      canonique,
    );
    for (const occurrence of groupe) {
      if (occurrence.type === "infrastructure") {
        fluxParHeure += occurrence.variationDeFlux;
      }
    }
    secondeCourante = moment;
    debut = fin;
  }

  possibilites = possibilites.map((possibilite) =>
    appliquerFlux(possibilite, secondesFinales - secondeCourante),
  );
  canonique = appliquerFlux(
    canonique,
    secondesFinales - secondeCourante,
  );
  if (id === "materiaux") {
    const consommes =
      infrastructure.chantiersTermines.reduce(
        (total, chantier) => total + chantier.materiauxConsommes,
        0,
      ) + (infrastructure.chantierActif?.materiauxConsommes ?? 0);
    if (reinitialiserReliquatApresConsommationMateriaux) {
      possibilites = possibilites.map((possibilite) => ({
        ...possibilite,
        stock: appliquerVariationAUnStock(possibilite.stock, -consommes),
      }));
      canonique = {
        ...canonique,
        stock: appliquerVariationAUnStock(canonique.stock, -consommes),
      };
    } else {
      possibilites = possibilites.map((possibilite) => ({
        ...possibilite,
        stock: {
          ...possibilite.stock,
          quantite: Math.max(0, possibilite.stock.quantite - consommes),
        },
      }));
      canonique = {
        ...canonique,
        stock: {
          ...canonique.stock,
          quantite: Math.max(0, canonique.stock.quantite - consommes),
        },
      };
    }
  }
  return {
    quantite: canonique.stock.quantite,
    fluxParHeure,
    reliquatDeFlux: canonique.stock.reliquatDeFlux,
    coutsDeLancementDExpeditionApplicables:
      canonique.coutsDeLancementDExpeditionApplicables,
    possibilites: possibilites.map((possibilite) => ({
      quantite: possibilite.stock.quantite,
      reliquatDeFlux: possibilite.stock.reliquatDeFlux,
      coutsDeLancementDExpeditionApplicables:
        possibilite.coutsDeLancementDExpeditionApplicables,
    })),
  };
}

function coutsDeLAiguillageSontCausaux(
  faits: readonly ObjetInconnu[],
  infrastructure: EtatInfrastructure,
  routes: EtatDesRoutes,
  expeditions: EtatDesExpeditions,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
): boolean {
  const groupes = [
    {
      id: "trame.aiguillage-zero.monopole-republicain",
      ids: new Set([
        "trame.aiguillage-zero.monopole-republicain",
        "trame.aiguillage-zero.soupcons-absents-monopole",
      ]),
      cibleSansPreparation: 10,
      cibleAvecPreparation: 2,
      preparation: "train-outil" as const,
    },
    {
      id: "trame.aiguillage-zero.transport-autonome",
      ids: new Set([
        "trame.aiguillage-zero.transport-autonome",
        "trame.aiguillage-zero.engagement-transport-autonome",
      ]),
      cibleSansPreparation: 14,
      cibleAvecPreparation: 6,
      preparation: "attelage-federe" as const,
    },
  ] as const;

  return groupes.every((groupe) => {
    const index = faits.findIndex((fait) => fait.id === groupe.id);
    if (index < 0) {
      return true;
    }
    const faitPrincipal = faits[index]!;
    if (!estNombreFini(faitPrincipal.moment)) {
      return false;
    }
    const faitsDuChoix = faits.filter((fait) =>
      groupe.ids.has(String(fait.id)),
    );
    const variations = faitsDuChoix.map((fait) => {
      const effets = fait.effets;
      if (
        !estObjet(effets) ||
        !Array.isArray(effets.materiels) ||
        effets.materiels.length !== 1
      ) {
        return undefined;
      }
      const effet = effets.materiels[0];
      return estObjet(effet) &&
        effet.type === "stock.modifie" &&
        effet.stock === "materiaux" &&
        estNombreFini(effet.variation)
        ? effet.variation
        : undefined;
    });
    if (
      faitsDuChoix.length !== 2 ||
      variations.some((variation) => variation === undefined) ||
      new Set(variations).size !== 1
    ) {
      return false;
    }

    const faitsAvant = faits.slice(0, index);
    const trameAvant = reconstruireEtatDeLaTrameDeFer(
      faitsAvant as unknown as readonly {
        readonly id: string;
        readonly moment: number;
      }[],
    );
    const prepare =
      groupe.preparation === "train-outil"
        ? trameAvant.occasions.trainOutil.statut === "annoncee" ||
          trameAvant.occasions.trainOutil.statut === "reservee"
        : trameAvant.occasions.attelageFedere.statut === "annoncee";
    const cible = prepare
      ? groupe.cibleAvecPreparation
      : groupe.cibleSansPreparation;
    const stocksAvant = calculerStockAttendu(
      "materiaux",
      faitPrincipal.moment,
      faitsAvant,
      infrastructure,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
    ).possibilites;
    const variation = variations[0]!;

    return stocksAvant.some((stock) =>
      groupe.preparation === "train-outil"
        ? stock.quantite >= cible && variation === -cible
        : variation === -Math.min(stock.quantite, cible),
    );
  });
}

export function preparatifsDeLaCouronneSontCausaux(
  faits: readonly ObjetInconnu[],
  infrastructure: EtatInfrastructure,
  routes: EtatDesRoutes,
  expeditions: EtatDesExpeditions,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
): boolean {
  const indexDuMandatRepublicain = faits.findIndex(
    (fait) => fait.id === "couronne.tete-de-ligne.mandat-republicain",
  );
  if (indexDuMandatRepublicain >= 0) {
    const mandatRepublicain = faits[indexDuMandatRepublicain]!;
    if (!estNombreFini(mandatRepublicain.moment)) {
      return false;
    }
    const faitsAvantMandat = faits.slice(0, indexDuMandatRepublicain);
    const trameAvantMandat = reconstruireEtatDeLaTrameDeFer(
      faitsAvantMandat as unknown as readonly {
        readonly id: string;
        readonly moment: number;
      }[],
    );
    if (
      trameAvantMandat.relationRepublique === "fermee" ||
      faitsAvantMandat.some(
        (fait) =>
          fait.id === "trame.aiguillage-zero.trace-du-vol",
      )
    ) {
      return false;
    }
  }

  const sanctuaireRenforce = faits.find(
    (fait) =>
      fait.id === "couronne.veille-des-trois.sanctuaire-renforce",
  );
  if (sanctuaireRenforce !== undefined) {
    if (!estNombreFini(sanctuaireRenforce.moment)) {
      return false;
    }
    const momentDuRenforcement = sanctuaireRenforce.moment as number;
    if (
      veilleBasse.consequencesDifferees.some(
        (consequence) =>
          consequence.id ===
            "veille-basse.perte-apres-intervention-refusee" &&
          consequence.manifesteeA !== null &&
          consequence.manifesteeA <= momentDuRenforcement,
      )
    ) {
      return false;
    }
  }

  const groupes = [
    {
      id: "couronne.approches.berceau-amorce",
      cout: 8,
      specialiste: (
        faitsAvant: readonly ObjetInconnu[],
        trameAvant: ReturnType<typeof reconstruireEtatDeLaTrameDeFer>,
      ) =>
        trameAvant.relationRepublique === "cooperative" ||
        trameAvant.occasions.trainOutil.statut !== "inconnue",
    },
    {
      id: "couronne.approches.etalon-calibre",
      cout: 6,
      specialiste: (faitsAvant: readonly ObjetInconnu[]) => {
        const ids = new Set(faitsAvant.map((fait) => String(fait.id)));
        return (
          (ids.has("trame.signal-zero.interface-rail-lue") ||
            ids.has("trame.signal-zero.interface-libre-lue")) &&
          (ids.has("trame.signal-zero.echos-conserves") ||
            ids.has("trame.signal-zero.frequences-separees"))
        );
      },
    },
    {
      id: "couronne.approches.precipitateur-assemble",
      cout: 10,
      specialiste: (faitsAvant: readonly ObjetInconnu[]) =>
        faitsAvant.some(
          (fait) =>
            fait.id === "bassins.deversoir.ligne-zero-relevee",
        ) ||
        hautPuits.projetRegional?.id === "decanteur-itinerant",
    },
  ] as const;

  return groupes.every((groupe) => {
    const index = faits.findIndex((fait) => fait.id === groupe.id);
    if (index < 0) {
      return true;
    }
    const fait = faits[index]!;
    if (!estNombreFini(fait.moment)) {
      return false;
    }
    const effets = fait.effets;
    if (
      !estObjet(effets) ||
      !Array.isArray(effets.materiels) ||
      effets.materiels.length !== 1
    ) {
      return false;
    }
    const effet = effets.materiels[0];
    if (
      !estObjet(effet) ||
      effet.type !== "stock.modifie" ||
      effet.stock !== "materiaux" ||
      effet.variation !== -groupe.cout
    ) {
      return false;
    }

    const faitsAvant = faits.slice(0, index);
    const trameAvant = reconstruireEtatDeLaTrameDeFer(
      faitsAvant as unknown as readonly {
        readonly id: string;
        readonly moment: number;
      }[],
    );
    if (!groupe.specialiste(faitsAvant, trameAvant)) {
      return false;
    }
    return calculerStockAttendu(
      "materiaux",
      fait.moment,
      faitsAvant,
      infrastructure,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
    ).possibilites.some(({ quantite }) => quantite >= groupe.cout);
  });
}

export function voieDesColoniesEstCausale(
  faits: readonly ObjetInconnu[],
  infrastructure: EtatInfrastructure,
  routes: EtatDesRoutes,
  expeditions: EtatDesExpeditions,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
  trameDeFer: EtatDeLaTrameDeFer,
  traverseLibre: EtatDeTraverseLibre,
): boolean {
  const indexDeLaCoalition = faits.findIndex(
    (fait) =>
      fait.id === "couronne.serres-de-verre.coalition-ralliee",
  );
  if (indexDeLaCoalition >= 0) {
    const faitDeCoalition = faits[indexDeLaCoalition]!;
    if (!estNombreFini(faitDeCoalition.moment)) {
      return false;
    }
    const veilleBasseAlliee =
      (veilleBasse.colonie.statut === "stable" ||
        veilleBasse.colonie.statut === "prospere") &&
      veilleBasse.colonie.techniciens.equipesDisponibles > 0;
    const alliances = [
      hautPuits.relationPublique === "cooperative" &&
        hautPuits.colonie.statut !== "perdue",
      veilleBasseAlliee,
      trameDeFer.grandAiguillage.statut === "atelier-negocie" ||
        trameDeFer.relationRepublique === "cooperative",
      traverseLibre.statut === "autonome" ||
        traverseLibre.relationPuitsLibres === "cooperative",
    ].filter(Boolean).length;
    const equipesDeVeilleBasse = veilleBasseAlliee
      ? veilleBasse.colonie.techniciens.equipesDisponibles
      : 0;
    const equipes =
      equipesDeVeilleBasse +
      veilleBasse.cohorte.integration.equipesIntegrees +
      (trameDeFer.occasions.attelageFedere.statut === "annoncee"
        ? 1
        : 0) +
      (traverseLibre.routeSecondaire.statut === "reparee" ? 1 : 0);
    if (alliances < 2 || equipes < 2) {
      return false;
    }
    const faitsAvant = faits.slice(0, indexDeLaCoalition);
    for (const [stock, seuil] of [
      ["eau", 10],
      ["materiaux", 8],
    ] as const) {
      if (
        !calculerStockAttendu(
          stock,
          faitDeCoalition.moment as number,
          faitsAvant,
          infrastructure,
          routes,
          expeditions,
          hautPuits,
          veilleBasse,
        ).possibilites.some(({ quantite }) => quantite >= seuil)
      ) {
        return false;
      }
    }
  }

  const indexDeLAchat = faits.findIndex(
    (fait) =>
      fait.id === "couronne.seuil.dernieres-pieces-achetees",
  );
  if (indexDeLAchat >= 0) {
    const faitAchat = faits[indexDeLAchat]!;
    if (
      !estNombreFini(faitAchat.moment) ||
      !calculerStockAttendu(
        "eau",
        faitAchat.moment as number,
        faits.slice(0, indexDeLAchat),
        infrastructure,
        routes,
        expeditions,
        hautPuits,
        veilleBasse,
      ).possibilites.some(({ quantite }) => quantite >= 4)
    ) {
      return false;
    }
  }

  const indexDeLaVoieAlliee = faits.findIndex(
    (fait) => fait.id === "couronne.colonies.voie-alliee-preparee",
  );
  return (
    indexDeLaVoieAlliee < 0 ||
    faits
      .slice(0, indexDeLaVoieAlliee)
      .some(
        (fait) =>
          fait.id ===
          "couronne.serres-de-verre.coalition-ralliee",
      )
  );
}

export function ouvertureDeLaCouronneEstCausale(
  faits: readonly ObjetInconnu[],
  infrastructure: EtatInfrastructure,
  routes: EtatDesRoutes,
  expeditions: EtatDesExpeditions,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
): boolean {
  const idsDOuverture = new Set([
    "couronne.ouverture.rail-ouverte",
    "couronne.ouverture.phares-ouvertes",
    "couronne.ouverture.colonies-ouvertes",
    "couronne.ouverture.breche-ouverte",
  ]);
  const ouvertures = faits
    .map((fait, index) => ({ fait, index }))
    .filter(({ fait }) => idsDOuverture.has(String(fait.id)));
  if (ouvertures.length > 1) {
    return false;
  }
  if (ouvertures.length === 1) {
    const { fait: ouverture, index } = ouvertures[0]!;
    if (!estNombreFini(ouverture.moment)) {
      return false;
    }
    const faitsAvant = faits.slice(0, index);
    const idsAvant = new Set(
      faitsAvant.map((fait) => String(fait.id)),
    );
    const effets = ouverture.effets;
    const verifierCoutExact = (
      attendus: Readonly<
        Partial<Record<"eau" | "materiaux", number>>
      >,
    ): boolean => {
      if (
        !estObjet(effets) ||
        !Array.isArray(effets.materiels) ||
        !Array.isArray(effets.humains) ||
        effets.humains.length !== 0
      ) {
        return false;
      }
      const materiels = effets.materiels;
      const entreesAttendues = Object.entries(attendus);
      if (materiels.length !== entreesAttendues.length) {
        return false;
      }
      return entreesAttendues.every(([stock, variation]) =>
        materiels.some(
          (effet) =>
            estObjet(effet) &&
            effet.type === "stock.modifie" &&
            effet.stock === stock &&
            effet.variation === variation,
        ),
      );
    };
    const verifierStock = (
      stock: "eau" | "materiaux",
      seuil: number,
    ) =>
      calculerStockAttendu(
        stock,
        ouverture.moment as number,
        faitsAvant,
        infrastructure,
        routes,
        expeditions,
        hautPuits,
        veilleBasse,
      ).possibilites.some(({ quantite }) => quantite >= seuil);
    if (ouverture.id === "couronne.ouverture.rail-ouverte") {
      const acteursPresents =
        idsAvant.has(
          "couronne.tete-de-ligne.mandat-republicain",
        ) ||
        idsAvant.has("couronne.tete-de-ligne.atelier-commun");
      const cout = idsAvant.has(
        "couronne.approches.berceau-amorce",
      )
        ? 2
        : 6;
      if (
        !acteursPresents ||
        !verifierCoutExact({ materiaux: -cout }) ||
        !verifierStock("materiaux", cout)
      ) {
        return false;
      }
    }
    if (ouverture.id === "couronne.ouverture.phares-ouvertes") {
      const acteursPresents =
        idsAvant.has(
          "couronne.veille-des-trois.sanctuaire-renforce",
        ) ||
        idsAvant.has(
          "couronne.veille-des-trois.releves-evacues",
        );
      const cout = idsAvant.has(
        "couronne.approches.etalon-calibre",
      )
        ? 2
        : 8;
      if (
        !acteursPresents ||
        !verifierCoutExact({ eau: -cout }) ||
        !verifierStock("eau", cout)
      ) {
        return false;
      }
    }
    if (
      ouverture.id === "couronne.ouverture.colonies-ouvertes"
    ) {
      const cout = idsAvant.has(
        "couronne.approches.precipitateur-assemble",
      )
        ? 2
        : 4;
      if (
        !idsAvant.has(
          "couronne.colonies.voie-alliee-preparee",
        ) ||
        !verifierCoutExact({
          eau: -cout,
          materiaux: -cout,
        }) ||
        !verifierStock("eau", cout) ||
        !verifierStock("materiaux", cout)
      ) {
        return false;
      }
    }
    if (
      ouverture.id === "couronne.ouverture.breche-ouverte" &&
      !verifierCoutExact({})
    ) {
      return false;
    }
  }

  const gardes = faits
    .map((fait, index) => ({ fait, index }))
    .filter(({ fait }) =>
      [
        "couronne.ouverture.clef-confiee-aux-gardiennes",
        "couronne.ouverture.clef-collective",
      ].includes(String(fait.id)),
    );
  if (gardes.length > 1) {
    return false;
  }
  if (gardes.length === 1) {
    const { fait: garde, index } = gardes[0]!;
    const idsAvant = new Set(
      faits.slice(0, index).map((fait) => String(fait.id)),
    );
    if (![...idsDOuverture].some((id) => idsAvant.has(id))) {
      return false;
    }
    if (
      garde.id ===
        "couronne.ouverture.clef-confiee-aux-gardiennes" &&
      !idsAvant.has(
        "couronne.approches.plans-confies-a-ilyana",
      ) &&
      !idsAvant.has("couronne.seuil.registre-confie-a-maelys")
    ) {
      return false;
    }
  }
  return true;
}

const IDS_DU_CONTRAT_FINAL = new Set([
  "finale.contrat.causes-publiees",
  "finale.contrat.causes-consignees",
]);
const IDS_DE_SELECTION_FINALE = new Set([
  "finale.ancrage.selection-preparee",
  "finale.ancrage.selection-risquee",
  "finale.reaccord.selection-preparee",
  "finale.reaccord.selection-risquee",
  "finale.precipitation.selection-preparee",
  "finale.precipitation.selection-risquee",
]);
const IDS_DE_VARIANTE_FINALE = new Set([
  "finale.ancrage.refuge-commun",
  "finale.ancrage.citadelle-de-cendre",
  "finale.ancrage.dernier-rempart",
  "finale.reaccord.constellation",
  "finale.reaccord.reseau-de-fer",
  "finale.reaccord.veilles-dispersees",
  "finale.precipitation.ciel-rendu",
  "finale.precipitation.terre-des-sacrifies",
  "finale.precipitation.pluie-noire",
]);

function effetsDeFaitSontExactement(
  fait: ObjetInconnu,
  materielsAttendus: readonly {
    readonly stock: "eau" | "materiaux";
    readonly variation: number;
  }[],
  humainsAttendus: readonly number[],
): boolean {
  const effets = fait.effets;
  if (
    !estObjet(effets) ||
    !Array.isArray(effets.materiels) ||
    !Array.isArray(effets.humains) ||
    effets.materiels.length !== materielsAttendus.length ||
    effets.humains.length !== humainsAttendus.length
  ) {
    return false;
  }
  const materiels = effets.materiels;
  const humains = effets.humains;
  return (
    materielsAttendus.every((attendu, index) =>
      estEffetStock(
        materiels[index],
        attendu.variation,
        attendu.stock,
      ),
    ) &&
    humainsAttendus.every((variation, index) =>
      estEffetHumain(
        humains[index],
        "habitants.modifies",
        "variation",
        variation,
      ),
    )
  );
}

export function contratFinalEstCausal(
  faits: readonly ObjetInconnu[],
  infrastructure: EtatInfrastructure,
  routes: EtatDesRoutes,
  expeditions: EtatDesExpeditions,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
  habitantsCourants: number,
): boolean {
  const contrats = faits
    .map((fait, index) => ({ fait, index }))
    .filter(({ fait }) => IDS_DU_CONTRAT_FINAL.has(String(fait.id)));
  const selections = faits
    .map((fait, index) => ({ fait, index }))
    .filter(({ fait }) =>
      IDS_DE_SELECTION_FINALE.has(String(fait.id)),
    );
  const variantes = faits
    .map((fait, index) => ({ fait, index }))
    .filter(({ fait }) =>
      IDS_DE_VARIANTE_FINALE.has(String(fait.id)),
    );

  if (
    contrats.length > 1 ||
    selections.length > 1 ||
    variantes.length > 1
  ) {
    return false;
  }
  if (
    ![...contrats, ...variantes].every(({ fait }) =>
      effetsDeFaitSontExactement(fait, [], []),
    )
  ) {
    return false;
  }

  const selection = selections[0];
  if (selection !== undefined) {
    const contrat = contrats[0];
    if (
      contrat === undefined ||
      contrat.index >= selection.index ||
      !estNombreFini(selection.fait.moment)
    ) {
      return false;
    }
    const faitsAvant = faits.slice(0, selection.index);
    const idsAvant = new Set(
      faitsAvant.map((fait) => String(fait.id)),
    );
    const selectionId = String(selection.fait.id);
    const solution = selectionId.startsWith("finale.ancrage.")
      ? "ancrer"
      : selectionId.startsWith("finale.reaccord.")
        ? "reaccorder"
        : "precipiter";
    const estPrepare = selectionId.endsWith(
      "selection-preparee",
    );
    const preparationAttendue =
      solution === "ancrer"
        ? ancrageEstPrepare(idsAvant)
        : solution === "reaccorder"
          ? reaccordEstPrepare(idsAvant)
          : precipitationEstPreparee(idsAvant);
    const cout =
      COUTS_DES_SOLUTIONS_FINALES[solution][
        estPrepare ? "preparee" : "risquee"
      ];
    const coutsMateriels = [
      ...(cout.eau === 0
        ? []
        : [{ stock: "eau" as const, variation: -cout.eau }]),
      {
        stock: "materiaux" as const,
        variation: -cout.materiaux,
      },
    ];
    const stockCouvre = (
      stock: "eau" | "materiaux",
      coutAttendu: number,
    ) =>
      coutAttendu === 0 ||
      calculerStockAttendu(
        stock,
        selection.fait.moment as number,
        faitsAvant,
        infrastructure,
        routes,
        expeditions,
        hautPuits,
        veilleBasse,
      ).possibilites.some(
        ({ quantite }) => quantite >= coutAttendu,
      );
    if (
      estPrepare !== preparationAttendue ||
      (solution !== "ancrer" &&
        idsAvant.has("couronne.ouverture.breche-ouverte")) ||
      !effetsDeFaitSontExactement(
        selection.fait,
        coutsMateriels,
        cout.habitants === 0 ? [] : [-cout.habitants],
      ) ||
      habitantsCourants <= 0 ||
      !stockCouvre("eau", cout.eau) ||
      !stockCouvre("materiaux", cout.materiaux)
    ) {
      return false;
    }
  }

  const variante = variantes[0];
  if (variante === undefined) {
    return true;
  }
  if (
    selection === undefined ||
    selection.index >= variante.index
  ) {
    return false;
  }
  const idsAvant = new Set(
    faits
      .slice(0, variante.index)
      .map((fait) => String(fait.id)),
  );
  const familleFinale = (id: string) =>
    id.startsWith("finale.ancrage.")
      ? "ancrage"
      : id.startsWith("finale.reaccord.")
        ? "reaccord"
        : "precipitation";
  if (
    familleFinale(String(selection.fait.id)) !==
    familleFinale(String(variante.fait.id))
  ) {
    return false;
  }
  if (variante.fait.id === "finale.ancrage.refuge-commun") {
    return (
      selection.fait.id === "finale.ancrage.selection-preparee" &&
      refugeCommunEstCredible(idsAvant)
    );
  }
  if (
    variante.fait.id ===
    "finale.ancrage.citadelle-de-cendre"
  ) {
    return citadelleDeCendreEstCredible(idsAvant);
  }
  if (variante.fait.id === "finale.ancrage.dernier-rempart") {
    return true;
  }
  if (variante.fait.id === "finale.reaccord.constellation") {
    return (
      selection.fait.id === "finale.reaccord.selection-preparee" &&
      constellationEstCredible(idsAvant)
    );
  }
  if (variante.fait.id === "finale.reaccord.reseau-de-fer") {
    return reseauDeFerEstCredible(idsAvant);
  }
  if (variante.fait.id === "finale.reaccord.veilles-dispersees") {
    return true;
  }
  if (variante.fait.id === "finale.precipitation.ciel-rendu") {
    return (
      selection.fait.id ===
        "finale.precipitation.selection-preparee" &&
      cielRenduEstCredible(idsAvant)
    );
  }
  if (
    variante.fait.id ===
    "finale.precipitation.terre-des-sacrifies"
  ) {
    return terreDesSacrifiesEstCredible(idsAvant);
  }
  return variante.fait.id === "finale.precipitation.pluie-noire";
}

function estEtatPilotage(
  valeur: unknown,
  secondesCourantes: number,
  faits: readonly ObjetInconnu[],
  infrastructure: EtatInfrastructure,
  routes: EtatDesRoutes,
  expeditions: EtatDesExpeditions,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
  utiliserCoutsHistoriquesDesNacelles = false,
): valeur is EtatPilotage {
  if (!estObjet(valeur)) {
    return false;
  }
  const economie = valeur.economie;
  const doctrine = valeur.doctrine;
  if (
    !estObjet(economie) ||
    !estObjet(economie.stocks) ||
    !estObjet(economie.capacites) ||
    !estObjet(economie.entretien) ||
    !estObjet(economie.prochainJalon) ||
    !estObjet(doctrine)
  ) {
    return false;
  }
  const modificateurs = calculerModificateursEconomiques(infrastructure);

  for (const id of IDENTIFIANTS_DE_STOCK) {
    const stock = economie.stocks[id];
    const attendu = PILOTAGE_INITIAL.economie.stocks[id];
    if (
      !estObjet(stock) ||
      !estNombreFini(stock.quantite) ||
      stock.quantite < 0 ||
      stock.unite !== attendu.unite ||
      stock.fluxParHeure !==
        attendu.fluxParHeure + (modificateurs.fluxDeStocks[id] ?? 0) ||
      !estNombreFini(stock.reliquatDeFlux)
    ) {
      return false;
    }
    const calcule = calculerStockAttendu(
      id,
      secondesCourantes,
      faits,
      infrastructure,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
      true,
      utiliserCoutsHistoriquesDesNacelles,
    );
    if (
      !calcule.possibilites.some(
        (possible) =>
          possible.coutsDeLancementDExpeditionApplicables &&
          stock.quantite === possible.quantite &&
          stock.reliquatDeFlux === possible.reliquatDeFlux,
      )
    ) {
      return false;
    }
  }

  for (const id of IDENTIFIANTS_DE_CAPACITE) {
    const capacite = economie.capacites[id];
    const attendue = PILOTAGE_INITIAL.economie.capacites[id];
    if (
      !estObjet(capacite) ||
      capacite.production !== attendue.production ||
      capacite.demande !==
        attendue.demande +
          (id === "chaleur"
            ? modificateurs.demandeDeChaleur
            : id === "main-d-oeuvre"
              ? modificateurs.demandeDeMainDOeuvre
              : modificateurs.demandeDeCharge) ||
      capacite.unite !== attendue.unite
    ) {
      return false;
    }
  }

  const entretien = economie.entretien;
  const jalon = economie.prochainJalon;
  const incertitudeDuJalon = jalon.incertitude;
  if (
    entretien.equipesMobilisees !==
      PILOTAGE_INITIAL.economie.entretien.equipesMobilisees +
        modificateurs.equipesDEntretien ||
    entretien.materiauxParHeure !==
      PILOTAGE_INITIAL.economie.entretien.materiauxParHeure +
        modificateurs.materiauxDEntretienParHeure ||
    jalon.nom !== PILOTAGE_INITIAL.economie.prochainJalon.nom ||
    jalon.atteintA !== PILOTAGE_INITIAL.economie.prochainJalon.atteintA ||
    !estObjet(incertitudeDuJalon) ||
    incertitudeDuJalon.source !==
      PILOTAGE_INITIAL.economie.prochainJalon.incertitude.source ||
    incertitudeDuJalon.releveeA !==
      PILOTAGE_INITIAL.economie.prochainJalon.incertitude.releveeA ||
    incertitudeDuJalon.variationFluxPourcent !==
      PILOTAGE_INITIAL.economie.prochainJalon.incertitude
        .variationFluxPourcent ||
    incertitudeDuJalon.explication !==
      PILOTAGE_INITIAL.economie.prochainJalon.incertitude.explication
  ) {
    return false;
  }

  for (const politique of IDENTIFIANTS_DE_POLITIQUE) {
    const etatDePolitique = doctrine[politique];
    if (
      !estObjet(etatDePolitique) ||
      typeof etatDePolitique.position !== "string" ||
      !POSITIONS_DE_DOCTRINE[politique].includes(
        etatDePolitique.position as never,
      )
    ) {
      return false;
    }
    const transition = etatDePolitique.transition;
    if (
      transition !== null &&
      (!estObjet(transition) ||
        typeof transition.position !== "string" ||
        !POSITIONS_DE_DOCTRINE[politique].includes(
          transition.position as never,
        ) ||
        !estNombreFini(transition.appliqueA) ||
        transition.appliqueA < 30 ||
        transition.appliqueA <= secondesCourantes ||
        transition.appliqueA > secondesCourantes + 30)
    ) {
      return false;
    }
  }

  const incident = valeur.incidentActif;
  if (incident === null) {
    return true;
  }
  if (!estObjet(incident) || !estObjet(incident.incertitude)) {
    return false;
  }
  return (
    incident.id === INCIDENT_INITIAL.id &&
    incident.titre === INCIDENT_INITIAL.titre &&
    incident.cause === INCIDENT_INITIAL.cause &&
    incident.priorite === INCIDENT_INITIAL.priorite &&
    incident.annonceA === INCIDENT_INITIAL.annonceA &&
    incident.echeance === INCIDENT_INITIAL.echeance &&
    secondesCourantes < incident.echeance &&
    incident.incertitude.source === INCIDENT_INITIAL.incertitude.source &&
    incident.incertitude.releveeA === INCIDENT_INITIAL.incertitude.releveeA &&
    incident.incertitude.observation ===
      INCIDENT_INITIAL.incertitude.observation
  );
}

function estCausaliteDeNarrationValide(
  parties: Omit<EtatCampagneV1, "version">,
  pilotage: EtatPilotage,
  veilleBasse: EtatCampagne["veilleBasse"],
  routes: EtatDesRoutes,
  autoriserCausaliteHistoriqueSansMarqueur = false,
): boolean {
  const narration = parties.narration;
  const faits = narration.faitsDeCampagne;
  const evenementsJoues = narration.evenementsJoues;
  const positionAuMoment = (moment: number) => {
    let position = creerEtatDesRoutesInitial().position;
    for (const engagement of routes.engagements) {
      if (
        engagement.statut === "termine" &&
        engagement.arriveeA <= moment
      ) {
        position = engagement.destination;
      }
    }
    return position;
  };
  const conditionEstRemplie = (
    condition: ConditionDEvenement,
    moment: number,
    faitsDisponibles: readonly FaitDeCampagne[],
  ) => {
    if (condition.type === "temps-au-moins") {
      return moment >= condition.secondes;
    }
    if (condition.type === "fait-present") {
      return faitsDisponibles.some((fait) => fait.id === condition.fait);
    }
    if (condition.type === "lieu-present") {
      return positionAuMoment(moment) === condition.lieu;
    }
    return condition.faits.some((id) =>
      faitsDisponibles.some((fait) => fait.id === id),
    );
  };
  const conditionsSontRemplies = (
    evenement: EvenementDuCatalogue,
    moment: number,
    faitsDisponibles: readonly FaitDeCampagne[],
    ignorerLeLieu = false,
  ) =>
    moment >= evenement.periodeEligibilite.debut &&
    moment <= evenement.periodeEligibilite.fin &&
    evenement.conditions.requises.every((condition) =>
      (ignorerLeLieu && condition.type === "lieu-present") ||
      conditionEstRemplie(condition, moment, faitsDisponibles),
    ) &&
    evenement.conditions.interdites.every(
      (condition) =>
        (ignorerLeLieu && condition.type === "lieu-present") ||
        !conditionEstRemplie(condition, moment, faitsDisponibles),
    );
  const evenementActif =
    narration.evenementActif === null
      ? null
      : trouverEvenement(narration.evenementActif)!;
  if (
    new Set(evenementsJoues).size !== evenementsJoues.length ||
    (narration.evenementActif !== null &&
      (evenementsJoues.includes(narration.evenementActif) ||
        evenementActif === null ||
        !conditionsSontRemplies(
          evenementActif,
          parties.tempsDuConvoi.secondes,
          faits,
        )))
  ) {
    return false;
  }

  let habitantsAttendus = 184;
  let causaliteHistoriqueEstUtilisee = false;
  for (const evenement of catalogueDEvenements.evenements) {
    const faitsDeLEvenement = faits.filter(
      (fait) => fait.cause === evenement.id,
    );
    const choixCorrespondants = evenement.choix.filter((choix) =>
      memesChaines(
        faitsDeLEvenement.map((fait) => fait.id),
        choix.faitsProduits.map((fait) => fait.id),
      ),
    );
    const estJoue = evenementsJoues.includes(evenement.id);
    const premierFaitDeLEvenement = faitsDeLEvenement[0];
    const indexDuPremierFait =
      premierFaitDeLEvenement === undefined
        ? -1
        : faits.indexOf(premierFaitDeLEvenement);
    const conditionsNormalesEtaientRemplies =
      premierFaitDeLEvenement !== undefined &&
      indexDuPremierFait >= 0 &&
      conditionsSontRemplies(
        evenement,
        premierFaitDeLEvenement.moment,
        faits.slice(0, indexDuPremierFait),
      );
    const causaliteHistoriqueEstApplicable =
      !conditionsNormalesEtaientRemplies &&
      premierFaitDeLEvenement !== undefined &&
      indexDuPremierFait >= 0 &&
      evenement.id === "bassins-fendus.eau-de-haut-puits" &&
      positionAuMoment(premierFaitDeLEvenement.moment) === "veille-basse" &&
      conditionsSontRemplies(
        evenement,
        premierFaitDeLEvenement.moment,
        faits.slice(0, indexDuPremierFait),
        true,
      );
    const conditionsEtaientRemplies =
      conditionsNormalesEtaientRemplies ||
      (causaliteHistoriqueEstApplicable &&
        (narration.causaliteHistorique ===
          "eau-haut-puits-a-veille-basse" ||
          autoriserCausaliteHistoriqueSansMarqueur));
    causaliteHistoriqueEstUtilisee ||= causaliteHistoriqueEstApplicable;
    if (
      faitsDeLEvenement.some(
        (fait) => fait.moment < evenement.periodeEligibilite.debut,
      ) ||
      new Set(faitsDeLEvenement.map((fait) => fait.moment)).size > 1 ||
      (estJoue && choixCorrespondants.length !== 1) ||
      (estJoue && !conditionsEtaientRemplies) ||
      (!estJoue && faitsDeLEvenement.length !== 0)
    ) {
      return false;
    }
    if (estJoue) {
      habitantsAttendus += choixCorrespondants[0]!.effets.reduce(
        (total, effet) =>
          effet.type === "habitants.modifier"
            ? total + effet.valeur
            : total,
        0,
      );
    }
  }

  for (const fait of faits) {
    if (
      IDENTIFIANTS_DE_FAITS_DE_CRISE.includes(fait.id as never) &&
      estObjet(fait.effets) &&
      Array.isArray(fait.effets.humains)
    ) {
      for (const effet of fait.effets.humains) {
        if (
          estObjet(effet) &&
          effet.type === "habitants.modifies" &&
          estNombreFini(effet.variation)
        ) {
          habitantsAttendus += effet.variation;
        }
      }
    }
  }
  if (
    veilleBasse.cohorte.integration.statut === "equipes-integrees"
  ) {
    habitantsAttendus += veilleBasse.cohorte.taille;
  }

  const nombreDeFaitsDIncident = faits.filter((fait) =>
    IDENTIFIANTS_DE_FAITS_D_INCIDENT.includes(fait.id as never),
  ).length;
  const faitDIncident = faits.find((fait) =>
    IDENTIFIANTS_DE_FAITS_D_INCIDENT.includes(fait.id as never),
  );
  const resolutionDIncidentEstPossible =
    faitDIncident === undefined ||
    (faitDIncident.moment < INCIDENT_INITIAL.echeance
      ? faitDIncident.id !== IDENTIFIANTS_DE_FAITS_D_INCIDENT[1]
      : faitDIncident.moment === INCIDENT_INITIAL.echeance &&
        faitDIncident.id !== IDENTIFIANTS_DE_FAITS_D_INCIDENT[2]);
  return (
    parties.citeCaravane.habitants === habitantsAttendus &&
    (narration.causaliteHistorique === undefined ||
      causaliteHistoriqueEstUtilisee) &&
    nombreDeFaitsDIncident === (pilotage.incidentActif === null ? 1 : 0) &&
    resolutionDIncidentEstPossible &&
    estCausaliteDuConseilValide(
      faits,
      routes,
      parties.tempsDuConvoi.secondes,
    )
  );
}

export function marquerCausaliteHistoriqueDeNarrationSiNecessaire(
  etat: EtatCampagne,
): EtatCampagne {
  if (
    !etat.narration.evenementsJoues.includes(
      "bassins-fendus.eau-de-haut-puits",
    )
  ) {
    return etat;
  }
  const premierFait = etat.narration.faitsDeCampagne.find(
    (fait) => fait.cause === "bassins-fendus.eau-de-haut-puits",
  );
  if (premierFait === undefined) {
    return etat;
  }
  let position = creerEtatDesRoutesInitial().position;
  for (const engagement of etat.routes.engagements) {
    if (
      engagement.statut === "termine" &&
      engagement.arriveeA <= premierFait.moment
    ) {
      position = engagement.destination;
    }
  }
  if (position !== "veille-basse") {
    return etat;
  }
  return {
    ...etat,
    narration: {
      ...etat.narration,
      causaliteHistorique: "eau-haut-puits-a-veille-basse",
    },
  };
}

function sontStructurellementEgaux(gauche: unknown, droite: unknown): boolean {
  if (Object.is(gauche, droite)) {
    return true;
  }
  if (Array.isArray(gauche) || Array.isArray(droite)) {
    return (
      Array.isArray(gauche) &&
      Array.isArray(droite) &&
      gauche.length === droite.length &&
      gauche.every((membre, index) =>
        sontStructurellementEgaux(membre, droite[index]),
      )
    );
  }
  if (!estObjet(gauche) || !estObjet(droite)) {
    return false;
  }
  const clesGauche = Object.keys(gauche).sort();
  const clesDroite = Object.keys(droite).sort();
  return (
    clesGauche.length === clesDroite.length &&
    clesGauche.every(
      (cle, index) =>
        cle === clesDroite[index] &&
        sontStructurellementEgaux(gauche[cle], droite[cle]),
    )
  );
}

function faitDeResolutionAttendu(
  definition: DefinitionDeReponseALaCrise,
  moment: number,
  plateformeDetachee?: string,
): FaitDeCampagne {
  const variationDeStock =
    definition.cout.stock === undefined
      ? undefined
      : {
          type: "stock.modifie" as const,
          stock: definition.cout.stock,
          variation: -(definition.cout.quantite ?? 0),
        };
  const variationDHabitants = -(definition.cout.habitants ?? 0);
  return {
    id: definition.faitProduit,
    cause: definition.criseId,
    acteurs: definition.acteurs,
    cible: definition.cible,
    moment,
    effets: {
      materiels:
        variationDeStock !== undefined
          ? [variationDeStock]
          : definition.cout.plateformes === undefined
            ? []
            : [
                {
                  type: "plateforme.detachee" as const,
                  plateforme: (plateformeDetachee ??
                    "intendance") as Exclude<
                    IdentifiantPlateformeMobile,
                    "phare"
                  >,
                },
              ],
      humains:
        variationDHabitants === 0
          ? []
          : [
              {
                type: "habitants.modifies",
                variation: variationDHabitants,
              },
            ],
    },
  };
}

function acteursEtCibleDeRecuperation(
  garantie: RecuperationDeCrise["garantie"],
): {
  readonly acteurs: readonly string[];
  readonly cible: string;
} {
  if (garantie === "socle-de-survie") {
    return {
      acteurs: ["porte-lanterne", "equipes-purification"],
      cible: "pompe-purification",
    };
  }
  if (garantie === "mobilite-minimale") {
    return {
      acteurs: ["porte-lanterne", "equipes-medicales"],
      cible: "haut-puits",
    };
  }
  if (garantie === "aide-exterieure-identifiee") {
    return {
      acteurs: ["porte-lanterne", "habitants-haut-puits"],
      cible: "foyers-exposes",
    };
  }
  if (garantie === "cohorte-hydratee") {
    return {
      acteurs: ["porte-lanterne", "cohorte-du-sillon"],
      cible: "hospice-du-sillon",
    };
  }
  if (
    garantie === "charge-repartie-trame" ||
    garantie === "attelage-recale-trame"
  ) {
    return {
      acteurs: ["porte-lanterne", "equipes-entretien"],
      cible:
        garantie === "charge-repartie-trame"
          ? "marche-des-traverses"
          : "signal-zero",
    };
  }
  return {
    acteurs: ["porte-lanterne", "techniciens-veille-basse"],
    cible: "sas-de-veille-basse",
  };
}

function appliquerResolutionAttendue(
  etat: EtatDesCrises,
  definition: DefinitionDeReponseALaCrise,
  moment: number,
): EtatDesCrises | undefined {
  const crise = etat.criseActive;
  if (crise === null || crise.id !== definition.criseId) {
    return undefined;
  }
  const cicatrice: CicatriceDeCampagne = {
    ...definition.cicatrice,
    cause: definition.faitProduit,
    acquiseA: moment,
  };
  const recuperation: RecuperationDeCrise = {
    ...definition.recuperation,
    id: `recuperation.${etat.recuperations.length + 1}`,
    cause: cicatrice.id,
    amorceeA: moment,
    statut: "amorcee",
    accomplieA: null,
    manqueeA: null,
    faitResultat: null,
    coutApplique: [],
  };
  const historique: CriseHistorique = {
    id: crise.id,
    cause: crise.cause,
    declencheeA: crise.declencheeA,
    faitDeclenchement: crise.faitProduit,
    resolueA: moment,
    reponseId: definition.id,
    faitResolution: definition.faitProduit,
  };
  return {
    ...etat,
    approvisionnementEau: "sous-tension",
    alerte: null,
    criseActive: null,
    historique: [...etat.historique, historique],
    cicatrices: [...etat.cicatrices, cicatrice],
    recuperations: [...etat.recuperations, recuperation],
  };
}

function estActionDeRecuperationCausee(
  recuperation: RecuperationDeCrise,
  fait: ObjetInconnu,
  faits: readonly ObjetInconnu[],
  routes: EtatDesRoutes,
): boolean {
  if (recuperation.condition === "rejoindre-haut-puits") {
    return routes.engagements.some(
      (engagement) =>
        engagement.statut === "termine" &&
        engagement.destination === recuperation.destination &&
        engagement.arriveeA === fait.moment,
    );
  }
  const faitCausal =
    recuperation.condition === "demander-aide-haut-puits"
      ? "bassins.haut-puits.partage-promis"
      : recuperation.condition === "ouvrir-hospice-veille-basse"
        ? "veille-basse.hospice-ouvert"
        : recuperation.condition === "renforcer-sas-veille-basse"
          ? "veille-basse.sas-renforce"
          : null;
  return (
    faitCausal === null ||
    faits.some(
      (candidat) =>
        candidat.id === faitCausal && candidat.moment === fait.moment,
    )
  );
}

function appliquerResultatDeRecuperationAttendu(
  etat: EtatDesCrises,
  fait: ObjetInconnu,
  faitsAvant: readonly ObjetInconnu[],
  infrastructure: EtatInfrastructure,
  routes: EtatDesRoutes,
  expeditions: EtatDesExpeditions,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
): EtatDesCrises | undefined {
  if (
    typeof fait.id !== "string" ||
    typeof fait.cause !== "string" ||
    typeof fait.moment !== "number" ||
    !estObjet(fait.effets) ||
    !Array.isArray(fait.effets.materiels) ||
    !Array.isArray(fait.effets.humains) ||
    fait.effets.humains.length !== 0
  ) {
    return undefined;
  }
  const recuperation = etat.recuperations.find(
    (candidate) =>
      candidate.cause === fait.cause && candidate.statut === "amorcee",
  );
  if (recuperation === undefined) {
    return undefined;
  }
  const accomplie = fait.id.endsWith(".accomplie");
  const statut = accomplie ? "accomplie" : "manquee";
  if (
    fait.id !==
    `crise.recuperation.${recuperation.garantie}.${statut}`
  ) {
    return undefined;
  }
  const { acteurs, cible } = acteursEtCibleDeRecuperation(
    recuperation.garantie,
  );
  let coutApplique: RecuperationDeCrise["coutApplique"] = [];
  if (accomplie) {
    if (
      !estActionDeRecuperationCausee(
        recuperation,
        fait,
        faitsAvant,
        routes,
      )
    ) {
      return undefined;
    }
    if (recuperation.coutAttendu === "deux-materiaux") {
      const materiauxAvant = calculerStockAttendu(
        "materiaux",
        fait.moment,
        faitsAvant,
        infrastructure,
        routes,
        expeditions,
        hautPuits,
        veilleBasse,
      ).quantite;
      if (materiauxAvant < 2) {
        return undefined;
      }
      coutApplique = [{ stock: "materiaux", quantite: 2 }];
    } else {
      const engagement = routes.engagements.find(
        (candidate) =>
          candidate.statut === "termine" &&
          candidate.destination === recuperation.destination &&
          candidate.arriveeA === fait.moment,
      );
      if (engagement === undefined) {
        return undefined;
      }
      const troncon = trouverTronconDeRoute(engagement.tronconId);
      coutApplique = [
        {
          stock: "combustible",
          quantite:
            engagement.consommationsAppliquees?.combustible ??
            troncon.consommationConnue.quantite,
        },
        {
          stock: "eau",
          quantite:
            engagement.consommationsAppliquees?.eau ??
            troncon.consommationIncertaine.quantiteReelle,
        },
      ];
    }
  } else {
    const jalonDEcheance = routes.jalons
      .filter((jalon) => jalon.moment > recuperation.amorceeA)
      .sort((gauche, droite) => gauche.moment - droite.moment)[
      recuperation.horizonTroncons - 1
    ];
    if (
      jalonDEcheance === undefined ||
      fait.moment !== jalonDEcheance.moment
    ) {
      return undefined;
    }
  }
  const faitAttendu: FaitDeCampagne = {
    id: fait.id,
    cause: recuperation.cause,
    acteurs,
    cible,
    moment: fait.moment,
    effets: {
      materiels:
        accomplie && recuperation.coutAttendu === "deux-materiaux"
          ? coutApplique.map(({ stock, quantite }) => ({
              type: "stock.modifie" as const,
              stock,
              variation: -quantite,
            }))
          : [],
      humains: [],
    },
  };
  if (!sontStructurellementEgaux(fait, faitAttendu)) {
    return undefined;
  }
  const recuperations = etat.recuperations.map((candidate) =>
    candidate.id !== recuperation.id
      ? candidate
      : accomplie
        ? {
            ...candidate,
            statut: "accomplie" as const,
            accomplieA: fait.moment as number,
            faitResultat: fait.id as string,
            coutApplique,
          }
        : {
            ...candidate,
            statut: "manquee" as const,
            manqueeA: fait.moment as number,
            faitResultat: fait.id as string,
            coutApplique: [],
          },
  );
  const garantitLEau =
    recuperation.garantie === "socle-de-survie" ||
    recuperation.garantie === "mobilite-minimale" ||
    recuperation.garantie === "aide-exterieure-identifiee";
  return {
    ...etat,
    approvisionnementEau:
      accomplie && garantitLEau
        ? "assure"
        : etat.approvisionnementEau,
    recuperations,
  };
}

function projeterMateriauxApresChantier(
  stock: Pick<
    StockDuConvoi,
    "quantite" | "fluxParHeure" | "reliquatDeFlux"
  >,
  infrastructure: EtatInfrastructure,
  secondes: number,
): number {
  const chantier = infrastructure.chantierActif;
  const consommationDuChantier =
    chantier === null
      ? 0
      : chantier.coutMateriaux - chantier.materiauxConsommes;
  return Math.max(
    0,
    projeterQuantiteDUnStock(stock, secondes) -
      consommationDuChantier,
  );
}

function estEtatDesCrises(
  valeur: unknown,
  secondesCourantes: number,
  vitesse: VitesseDuConvoi,
  faits: readonly ObjetInconnu[],
  evenementNarratifActif: unknown,
  infrastructure: EtatInfrastructure,
  pilotage: EtatPilotage,
  plateformes: readonly IdentifiantPlateformeMobile[],
  routes: EtatDesRoutes,
  expeditions: EtatDesExpeditions,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
  autoriserMarqueurHistoriqueSansFait = false,
  ignorerCrisesSequentielles = false,
): valeur is EtatDesCrises {
  if (
    !estObjet(valeur) ||
    typeof valeur.faitAnnonceurHistoriqueIgnore !== "boolean" ||
    typeof valeur.crisesSequentiellesHistoriquesIgnorees !==
      "boolean" ||
    typeof valeur.crisesDeTrameHistoriquesIgnorees !== "boolean" ||
    !Array.isArray(valeur.historique)
  ) {
    return false;
  }
  const faitAnnonceurPresent = faits.some(
    (fait) => fait.id === FAIT_ANNONCANT_LA_CRISE,
  );
  const faitAccueilDeVeilleBassePresent = faits.some(
    (fait) =>
      fait.id === FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE,
  );
  const faitDeTramePresent = faits.some(
    (fait) => fait.id === FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
  );
  if (
    valeur.faitAnnonceurHistoriqueIgnore &&
    !faitAnnonceurPresent &&
    !autoriserMarqueurHistoriqueSansFait
  ) {
    return false;
  }
  if (
    valeur.crisesSequentiellesHistoriquesIgnorees &&
    !faitAccueilDeVeilleBassePresent &&
    !ignorerCrisesSequentielles
  ) {
    return false;
  }
  if (
    valeur.crisesDeTrameHistoriquesIgnorees &&
    !faitDeTramePresent
  ) {
    return false;
  }

  let attendu = {
    ...creerEtatDesCrisesInitial(),
    faitAnnonceurHistoriqueIgnore:
      valeur.faitAnnonceurHistoriqueIgnore,
    crisesSequentiellesHistoriquesIgnorees:
      valeur.crisesSequentiellesHistoriquesIgnorees,
    crisesDeTrameHistoriquesIgnorees:
      valeur.crisesDeTrameHistoriquesIgnorees,
  };
  const faitsVus: ObjetInconnu[] = [];
  const identifiantsDeDeclenchement = new Map([
    [
      "crise.purification.eau-contaminee",
      IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE,
    ],
    [
      "crise.veille-basse.accueil-sous-penurie",
      IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE,
    ],
    [
      "crise.trame.cascade-materielle",
      IDENTIFIANT_DE_LA_CRISE_DE_TRAME,
    ],
  ] as const);
  const definitionsParFait = new Map(
    DEFINITIONS_DES_REPONSES_A_LA_CRISE.map((definition) => [
      definition.faitProduit,
      definition,
    ]),
  );
  const idsDeRecuperation = new Set<string>(
    IDENTIFIANTS_DE_FAITS_DE_RECUPERATION,
  );
  const faitDeDeclenchementDeTrame = faits.find(
    (fait) => fait.id === "crise.trame.cascade-materielle",
  );
  const alerteDeclaree =
    estObjet(valeur.alerte) &&
    valeur.alerte.id === IDENTIFIANT_DE_LA_CRISE_DE_TRAME
      ? valeur.alerte
      : undefined;
  const criseActiveDeclaree =
    estObjet(valeur.criseActive) &&
    valeur.criseActive.id === IDENTIFIANT_DE_LA_CRISE_DE_TRAME
      ? valeur.criseActive
      : undefined;
  const faitAnnonceurDeTrame = faits.find(
    (fait) => fait.id === FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
  );
  const momentAnnonceDeTrame =
    faitDeDeclenchementDeTrame !== undefined
      ? (faitDeDeclenchementDeTrame.moment as number) - 120
      : alerteDeclaree !== undefined
        ? (alerteDeclaree.annonceeA as number)
        : criseActiveDeclaree !== undefined
          ? (criseActiveDeclaree.declencheeA as number) - 120
          : (faitAnnonceurDeTrame?.moment as number | undefined);
  const criseDeTrameDeclareeCommeResolue =
    valeur.historique.some(
      (crise) =>
        estObjet(crise) &&
        crise.id === IDENTIFIANT_DE_LA_CRISE_DE_TRAME,
    );
  const criseDeTrameADejaEteAnnoncee =
    alerteDeclaree !== undefined ||
    criseActiveDeclaree !== undefined ||
    faitDeDeclenchementDeTrame !== undefined ||
    criseDeTrameDeclareeCommeResolue;
  const contexteMaterielAuMoment = (
    moment: number,
    faitsConnus: readonly ObjetInconnu[],
  ) => {
    const dernierJalon = routes.jalons
      .filter((jalon) => jalon.moment <= moment)
      .at(-1);
    const engagement = routes.engagements.find(
      (candidate) =>
        candidate.tronconId === dernierJalon?.tronconId &&
        candidate.arriveeA === dernierJalon.moment,
    );
    const faitDeDetachementPosterieur = faits.find(
      (fait) =>
        fait.id === "crise.trame.detacher-plateforme" &&
        (fait.moment as number) > moment,
    );
    const effetDeDetachement =
      faitDeDetachementPosterieur !== undefined &&
      estObjet(faitDeDetachementPosterieur.effets) &&
      Array.isArray(faitDeDetachementPosterieur.effets.materiels)
        ? (
            faitDeDetachementPosterieur.effets
              .materiels as ObjetInconnu[]
          ).find((effet) => effet.type === "plateforme.detachee")
        : undefined;
    const plateformeInitialeARestaurer =
      effetDeDetachement !== undefined
        ? creerInfrastructureInitiale().plateformes.find(
            ({ id }) => id === effetDeDetachement.plateforme,
          )
        : undefined;
    const quartierInitialARestaurer =
      plateformeInitialeARestaurer === undefined
        ? undefined
        : creerInfrastructureInitiale().quartiers.find(
            ({ plateformeId }) =>
              plateformeId === plateformeInitialeARestaurer.id,
          );
    const infrastructureAuMoment =
      plateformeInitialeARestaurer === undefined
        ? infrastructure
        : {
            ...infrastructure,
            plateformes: [
              ...infrastructure.plateformes,
              plateformeInitialeARestaurer,
            ],
            quartiers:
              quartierInitialARestaurer === undefined
                ? infrastructure.quartiers
                : [
                    ...infrastructure.quartiers,
                    quartierInitialARestaurer,
                  ],
          };
    const modificateursAuMoment =
      calculerModificateursEconomiques(infrastructureAuMoment);
    const chargeInitiale =
      PILOTAGE_INITIAL.economie.capacites.charge;
    const infrastructurePourProjection =
      criseDeTrameDeclareeCommeResolue
        ? { ...infrastructureAuMoment, chantierActif: null }
        : infrastructureAuMoment;
    const materiauxAuMoment = calculerStockAttendu(
      "materiaux",
      moment,
      faitsConnus,
      infrastructureAuMoment,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
    );
    return {
      momentCourant: moment,
      position: engagement?.destination ?? routes.position,
      margeDeCharge:
        chargeInitiale.production -
        (chargeInitiale.demande +
          modificateursAuMoment.demandeDeCharge),
      doctrineEntretien: criseDeTrameADejaEteAnnoncee
        ? ("equilibre" as const)
        : pilotage.doctrine.entretien.position,
      materiauxDisponibles: projeterMateriauxApresChantier(
        materiauxAuMoment,
        infrastructurePourProjection,
        120,
      ),
      plateformesDisponibles:
        criseDeTrameDeclareeCommeResolue
          ? plateformes.length +
            (plateformeInitialeARestaurer === undefined ? 0 : 1)
          : 1 +
            listerPlateformesMobilesDetachables(
              infrastructureAuMoment,
            ).length,
      dernierTronconTermine: dernierJalon?.tronconId ?? null,
      etatDuDernierTroncon:
        dernierJalon === undefined
          ? null
          : (routes.etatsReels[dernierJalon.tronconId] ?? null),
    };
  };
  const annoncerAuMoment = (moment: number) => {
    const annonce = annoncerCriseApresFaits(
      attendu,
      faitsVus as unknown as readonly FaitDeCampagne[],
      contexteMaterielAuMoment(moment, faitsVus),
    ).etat;
    attendu =
      ignorerCrisesSequentielles &&
      annonce.alerte?.id === IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE
        ? attendu
        : annonce;
  };

  for (const fait of faits) {
    if (
      momentAnnonceDeTrame !== undefined &&
      momentAnnonceDeTrame < (fait.moment as number) &&
      attendu.alerte === null &&
      attendu.criseActive === null
    ) {
      annoncerAuMoment(momentAnnonceDeTrame);
    }
    const criseDeclenchee = identifiantsDeDeclenchement.get(
      String(fait.id) as
        | "crise.purification.eau-contaminee"
        | "crise.veille-basse.accueil-sous-penurie"
        | "crise.trame.cascade-materielle",
    );
    const definition = definitionsParFait.get(
      String(fait.id) as DefinitionDeReponseALaCrise["faitProduit"],
    );
    if (criseDeclenchee !== undefined) {
      if (
        attendu.alerte?.id !== criseDeclenchee ||
        fait.moment !== attendu.alerte.ruptureA
      ) {
        return false;
      }
      const eauAvantRupture =
        criseDeclenchee === IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE
          ? calculerStockAttendu(
              "eau",
              fait.moment as number,
              faitsVus,
              infrastructure,
              {
                ...routes,
                engagements: routes.engagements.filter(
                  (engagement) =>
                    engagement.engageA < (fait.moment as number),
                ),
              },
              expeditions,
              hautPuits,
              veilleBasse,
            ).quantite
          : 0;
      const declenchement = declencherCrise(
        attendu,
        eauAvantRupture,
        fait.moment as number,
      );
      if (
        declenchement === undefined ||
        !sontStructurellementEgaux(fait, declenchement.fait)
      ) {
        return false;
      }
      attendu = declenchement.etat;
    } else if (definition !== undefined) {
      const effets = fait.effets as ObjetInconnu;
      const effetsMateriels = effets.materiels as ObjetInconnu[];
      const plateformeDetachee =
        definition.id === "detacher-plateforme" &&
        effetsMateriels.length === 1 &&
        effetsMateriels[0]?.type === "plateforme.detachee"
          ? String(effetsMateriels[0].plateforme)
          : undefined;
      if (
        !sontStructurellementEgaux(
          fait,
          faitDeResolutionAttendu(
            definition,
            fait.moment as number,
            plateformeDetachee,
          ),
        )
      ) {
        return false;
      }
      const resolu = appliquerResolutionAttendue(
        attendu,
        definition,
        fait.moment as number,
      );
      if (resolu === undefined) {
        return false;
      }
      attendu = resolu;
    } else if (idsDeRecuperation.has(String(fait.id))) {
      const resultat = appliquerResultatDeRecuperationAttendu(
        attendu,
        fait,
        faitsVus,
        infrastructure,
        routes,
        expeditions,
        hautPuits,
        veilleBasse,
      );
      if (resultat === undefined) {
        return false;
      }
      attendu = resultat;
    }

    faitsVus.push(fait);
    if (
      momentAnnonceDeTrame === undefined ||
      (fait.moment as number) >= momentAnnonceDeTrame
    ) {
      annoncerAuMoment(
        momentAnnonceDeTrame ?? (fait.moment as number),
      );
    } else {
      const annonce = annoncerCriseApresFaits(
        attendu,
        faitsVus as unknown as readonly FaitDeCampagne[],
      ).etat;
      attendu =
        ignorerCrisesSequentielles &&
        annonce.alerte?.id === IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE
          ? attendu
          : annonce;
    }
  }
  if (
    momentAnnonceDeTrame !== undefined &&
    attendu.alerte === null &&
    attendu.criseActive === null &&
    momentAnnonceDeTrame <= secondesCourantes
  ) {
    annoncerAuMoment(momentAnnonceDeTrame);
  }

  for (const recuperation of attendu.recuperations) {
    if (recuperation.statut !== "amorcee") {
      continue;
    }
    const horizonAtteint =
      routes.jalons.filter(
        (jalon) => jalon.moment > recuperation.amorceeA,
      ).length >= recuperation.horizonTroncons;
    const aideEnAttente =
      recuperation.condition === "demander-aide-haut-puits" &&
      evenementNarratifActif === "bassins-fendus.eau-de-haut-puits";
    if (horizonAtteint && !aideEnAttente) {
      return false;
    }
  }

  const trameReserveSesDeuxReponses =
    attendu.alerte?.id === IDENTIFIANT_DE_LA_CRISE_DE_TRAME ||
    attendu.criseActive?.id === IDENTIFIANT_DE_LA_CRISE_DE_TRAME;
  const ruptureA =
    attendu.alerte?.ruptureA ?? secondesCourantes;
  if (
    trameReserveSesDeuxReponses &&
    (projeterMateriauxApresChantier(
      pilotage.economie.stocks.materiaux,
      infrastructure,
      Math.max(0, ruptureA - secondesCourantes),
    ) <
      7 ||
      listerPlateformesMobilesDetachables(infrastructure).length === 0)
  ) {
    return false;
  }

  const suspensionRequise =
    attendu.criseActive !== null ||
    (attendu.alerte !== null &&
      attendu.alerte.ruptureA <= secondesCourantes);
  return (
    (!suspensionRequise || vitesse === 0) &&
    sontStructurellementEgaux(valeur, attendu)
  );
}

function faitsSontChronologiques(
  faits: unknown,
  secondeCourante: number,
): faits is ObjetInconnu[] {
  if (!Array.isArray(faits)) {
    return false;
  }
  let momentPrecedent = 0;
  return faits.every((fait) => {
    if (
      !estObjet(fait) ||
      typeof fait.moment !== "number" ||
      !Number.isInteger(fait.moment) ||
      fait.moment < momentPrecedent ||
      fait.moment > secondeCourante
    ) {
      return false;
    }
    momentPrecedent = fait.moment;
    return true;
  });
}

function lirePartiesCommunesDEtat(
  valeur: ObjetInconnu,
  validerFait: (fait: unknown) => boolean,
  plateformesAttendues: readonly string[],
  autoriserPlateformeRegionale = false,
): Omit<EtatCampagneV1, "version"> | undefined {
  const temps = valeur.tempsDuConvoi;
  const cite = valeur.citeCaravane;
  const narration = valeur.narration;
  const plateformeDetachee =
    estObjet(narration) &&
    Array.isArray(narration.faitsDeCampagne) &&
    narration.faitsDeCampagne
      .filter(
        (fait) =>
          estObjet(fait) &&
          fait.id === "crise.trame.detacher-plateforme" &&
          estObjet(fait.effets) &&
          Array.isArray(fait.effets.materiels),
      )
      .flatMap((fait) =>
        (fait.effets as ObjetInconnu).materiels as ObjetInconnu[],
      )
      .find((effet) => effet.type === "plateforme.detachee")
      ?.plateforme;
  const plateformeRegionaleHistoriquementAjoutee =
    estObjet(narration) &&
    Array.isArray(narration.faitsDeCampagne) &&
    narration.faitsDeCampagne.some(
      (fait) =>
        estObjet(fait) &&
        (fait.id === "bassins.deversoir.transformation-scellee" ||
          fait.id === "bassins.deversoir.gabarits-conserves"),
    );
  const compositionsAttendues = [
    plateformesAttendues,
    ...(autoriserPlateformeRegionale &&
    plateformeRegionaleHistoriquementAjoutee
      ? [
          [
            ...plateformesAttendues,
            "chassis-regional-des-bassins",
          ],
        ]
      : []),
  ];

  if (
    typeof valeur.graine !== "string" ||
    !estObjet(temps) ||
    typeof temps.secondes !== "number" ||
    !Number.isInteger(temps.secondes) ||
    temps.secondes < 0 ||
    !VITESSES.has(temps.vitesse as number) ||
    !estObjet(cite) ||
    typeof cite.habitants !== "number" ||
    !Number.isInteger(cite.habitants) ||
    cite.habitants < 0 ||
    cite.phare !== "actif" ||
    !estObjet(cite.formation) ||
    cite.formation.type !== "grappe" ||
    !estTableauDeChaines(cite.formation.plateformes) ||
    !(
      compositionsAttendues.some((composition) =>
        memesChaines(
          (cite.formation as ObjetInconnu).plateformes as string[],
          composition,
        ),
      ) ||
      (typeof plateformeDetachee === "string" &&
        compositionsAttendues.some((composition) =>
          memesChaines(
            (cite.formation as ObjetInconnu).plateformes as string[],
            composition.filter(
              (plateforme) => plateforme !== plateformeDetachee,
            ),
          ),
        ))
    ) ||
    !estObjet(narration) ||
    (narration.causaliteHistorique !== undefined &&
      narration.causaliteHistorique !==
        "eau-haut-puits-a-veille-basse") ||
    !(
      narration.evenementActif === null ||
      (typeof narration.evenementActif === "string" &&
        trouverEvenement(narration.evenementActif) !== undefined)
    ) ||
    !estTableauDeChaines(narration.evenementsJoues) ||
    !narration.evenementsJoues.every(
      (id) => trouverEvenement(id) !== undefined,
    ) ||
    !Array.isArray(narration.faitsDeCampagne) ||
    !narration.faitsDeCampagne.every(validerFait)
  ) {
    return undefined;
  }

  return {
    graine: valeur.graine,
    tempsDuConvoi: {
      secondes: temps.secondes,
      vitesse: temps.vitesse as VitesseDuConvoi,
    },
    citeCaravane: {
      habitants: cite.habitants,
      phare: "actif",
      formation: {
        type: "grappe",
        plateformes: cite.formation
          .plateformes as IdentifiantPlateformeMobile[],
      },
    },
    narration: {
      evenementActif: narration.evenementActif,
      evenementsJoues: narration.evenementsJoues,
      faitsDeCampagne: narration.faitsDeCampagne,
      ...(narration.causaliteHistorique ===
      "eau-haut-puits-a-veille-basse"
        ? {
            causaliteHistorique:
              "eau-haut-puits-a-veille-basse" as const,
          }
        : {}),
    },
  } as Omit<EtatCampagneV1, "version">;
}

export function lireEtatV1(valeur: unknown): EtatCampagneV1 | undefined {
  if (!estObjet(valeur) || valeur.version !== VERSION_SIMULATION_INITIALE) {
    return undefined;
  }
  const parties = lirePartiesCommunesDEtat(
    valeur,
    estFaitDeCampagne,
    IDENTIFIANTS_PLATEFORMES_LEGACY_V1,
  );
  if (
    parties === undefined ||
    !parties.narration.faitsDeCampagne.every((fait) =>
      estFaitDeCampagneV1(fait, parties.tempsDuConvoi.secondes),
    ) ||
    !faitsSontChronologiques(
      parties.narration.faitsDeCampagne,
      parties.tempsDuConvoi.secondes,
    )
  ) {
    return undefined;
  }
  return { version: VERSION_SIMULATION_INITIALE, ...parties };
}

function faitExisteAuMoment(
  faits: readonly FaitDeCampagne[],
  id: string,
  moment: number,
): boolean {
  return faits.some((fait) => fait.id === id && fait.moment <= moment);
}

function coutsPersistesDesNacellesSontCausaux(
  routes: EtatDesRoutes,
  hautPuits: EtatDeHautPuits,
  veilleBasse: EtatDeVeilleBasse,
  faits: readonly FaitDeCampagne[],
): boolean {
  const hautPuitsInitial = creerEtatDeHautPuitsInitial();
  const veilleBasseInitiale = creerEtatInitialDeVeilleBasse();

  return routes.engagements.every((engagement) => {
    const consommations = engagement.consommationsAppliquees;
    if (consommations === undefined) {
      return true;
    }

    const faitsAuMoment = faits.filter(
      (fait) => fait.moment <= engagement.engageA,
    );
    const relationPublique =
      hautPuits.decisionPriseA !== null &&
      hautPuits.decisionPriseA <= engagement.engageA
        ? hautPuits.relationPublique
        : hautPuitsInitial.relationPublique;
    const memoireDeLaCohorte = faitExisteAuMoment(
      faits,
      "veille-basse.cohorte-accueillie",
      engagement.engageA,
    )
      ? ("aidee" as const)
      : faitExisteAuMoment(
            faits,
            "veille-basse.cohorte-refusee",
            engagement.engageA,
          )
        ? ("refusee" as const)
        : faitExisteAuMoment(
              faits,
              "veille-basse.cohorte-redirigee",
              engagement.engageA,
            )
          ? ("redirigee" as const)
          : veilleBasseInitiale.cohorte.memoire;
    const perteDeVeilleBasseEstDejaManifestee =
      veilleBasse.consequencesDifferees.some(
        (consequence) =>
          consequence.id ===
            "veille-basse.perte-apres-intervention-refusee" &&
          consequence.manifesteeA !== null &&
          consequence.manifesteeA <= engagement.engageA,
      );
    const statutDeVeilleBasse = perteDeVeilleBasseEstDejaManifestee
      ? ("perdue" as const)
      : faitExisteAuMoment(
            faits,
            "veille-basse.sas-renforce",
            engagement.engageA,
          )
        ? ("stable" as const)
        : veilleBasseInitiale.colonie.statut;
    const offre = calculerOffreDesNacelles({
      position: engagement.origine,
      hautPuits: { ...hautPuits, relationPublique },
      veilleBasse: {
        ...veilleBasse,
        colonie: {
          ...veilleBasse.colonie,
          statut: statutDeVeilleBasse,
        },
        cohorte: {
          ...veilleBasse.cohorte,
          memoire: memoireDeLaCohorte,
        },
      },
      faits: faitsAuMoment.map((fait) => fait.id),
    });

    return (
      offre?.tronconId === engagement.tronconId &&
      offre.consommations.combustible === consommations.combustible &&
      offre.consommations.eau === consommations.eau
    );
  });
}

function lireEtatAvecSchemaCourant(
  valeur: unknown,
  validerCrises: boolean,
  autoriserMarqueurHistoriqueSansFait = false,
  utiliserCoutsHistoriquesDesNacelles = false,
  autoriserCausaliteHistoriqueSansMarqueur = false,
  autoriserTopologieHistoriqueSansMarqueur = false,
  ignorerCrisesSequentielles = false,
): EtatCampagne | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_COURANTE
  ) {
    return undefined;
  }
  const parties = lirePartiesCommunesDEtat(
    valeur,
    estFaitDeCampagneV2,
    IDENTIFIANTS_PLATEFORMES_MOBILES,
    true,
  );
  const flux = valeur.fluxPseudoAleatoires;
  const narration = valeur.narration;
  const pilotage = valeur.pilotage;
  const infrastructure = valeur.infrastructure;
  const routes = valeur.routes;
  const crises = valeur.crises;
  const expeditions = valeur.expeditions;
  const veilleBasse = valeur.veilleBasse;
  const hautPuits = valeur.hautPuits;
  const trameDeFer = valeur.trameDeFer;
  const traverseLibre = valeur.traverseLibre;
  const devenirsDesSites = valeur.devenirsDesSites;
  const denouement = valeur.denouement;
  const faitDePassageRegional =
    estObjet(narration) &&
    Array.isArray(narration.faitsDeCampagne) &&
    narration.faitsDeCampagne.some(
      (fait) =>
        estObjet(fait) &&
        (fait.id === "bassins.deversoir.passage-prepare" ||
          fait.id === "bassins.deversoir.passage-transmis"),
    );
  const faitDePassageDeLaTrame =
    estObjet(narration) &&
    Array.isArray(narration.faitsDeCampagne) &&
    narration.faitsDeCampagne.some(
      (fait) =>
        estObjet(fait) &&
        (fait.id === "trame.aiguillage-zero.passage-consigne" ||
          fait.id === "trame.aiguillage-zero.passage-transmis"),
    );
  const routeV7DesNacellesEstMarquee =
    estObjet(routes) &&
    estObjet(routes.etatsReels) &&
    "nacelles-de-veille-basse" in routes.etatsReels;
  const ancienChenalEstPresent =
    estObjet(routes) &&
    Array.isArray(routes.engagements) &&
    routes.engagements.some(
      (engagement) =>
        estObjet(engagement) &&
        engagement.tronconId === "chenal-des-vannes",
    );
  const coutsHistoriquesDesNacellesRequis =
    utiliserCoutsHistoriquesDesNacelles ||
    (!routeV7DesNacellesEstMarquee && ancienChenalEstPresent);

  if (
    parties === undefined ||
    !estObjet(narration) ||
    !faitsSontChronologiques(
      narration.faitsDeCampagne,
      parties.tempsDuConvoi.secondes,
    ) ||
    !sontStructurellementEgaux(
      denouement,
      reconstruireDenouementReussi(
        narration.faitsDeCampagne as unknown as readonly FaitDeCampagne[],
      ),
    ) ||
    !estEtatInfrastructure(
      infrastructure,
      parties.tempsDuConvoi.secondes,
      narration.faitsDeCampagne,
    ) ||
    !estEtatDesRoutes(
      routes,
      parties.tempsDuConvoi.secondes,
      autoriserTopologieHistoriqueSansMarqueur,
    ) ||
    (parties.citeCaravane.formation.plateformes.includes(
      "chassis-regional-des-bassins",
    ) !==
      (narration.faitsDeCampagne.some(
        (fait) =>
          estObjet(fait) &&
          (fait.id === "bassins.deversoir.transformation-scellee" ||
            fait.id === "bassins.deversoir.gabarits-conserves"),
      ) &&
        !narration.faitsDeCampagne.some(
          (fait) =>
            estObjet(fait) &&
            fait.id === "crise.trame.detacher-plateforme" &&
            estObjet(fait.effets) &&
            Array.isArray(fait.effets.materiels) &&
            (fait.effets.materiels as ObjetInconnu[]).some(
              (effet) =>
                effet.type === "plateforme.detachee" &&
                effet.plateforme ===
                  "chassis-regional-des-bassins",
            ),
        ))) ||
    !engagementsDuDeversoirSontCausaux(
      routes as EtatDesRoutes,
      narration.faitsDeCampagne as unknown as readonly FaitDeCampagne[],
    ) ||
    !estEtatDesExpeditions(expeditions, parties.tempsDuConvoi.secondes) ||
    !estEtatDeVeilleBasse(
      veilleBasse,
      parties.tempsDuConvoi.secondes,
      narration.faitsDeCampagne as unknown as readonly {
        readonly id: string;
        readonly moment: number;
      }[],
    ) ||
    (faitDePassageRegional || faitDePassageDeLaTrame
      ? !sontStructurellementEgaux(
          devenirsDesSites,
          {
            ...calculerDevenirsDesSitesDesBassins({
              routes: routes as EtatDesRoutes,
              veilleBasse: veilleBasse as EtatDeVeilleBasse,
              faits: (
                narration.faitsDeCampagne as unknown as readonly FaitDeCampagne[]
              ).map((fait) => fait.id),
            }),
            ...(faitDePassageDeLaTrame
              ? {
                  trameDeFer: calculerDevenirsDesSitesDeLaTrame({
                    routes: routes as EtatDesRoutes,
                    faits: (
                      narration.faitsDeCampagne as unknown as readonly FaitDeCampagne[]
                    ).map((fait) => fait.id),
                  }),
                }
              : {}),
          },
        )
      : devenirsDesSites !== null) ||
    !estEtatDeHautPuits(hautPuits, parties.tempsDuConvoi.secondes) ||
    !sontStructurellementEgaux(
      trameDeFer,
      reconstruireEtatDeLaTrameDeFer(
        narration.faitsDeCampagne as unknown as readonly {
          readonly id: string;
          readonly moment: number;
        }[],
      ),
    ) ||
    !sontStructurellementEgaux(
      traverseLibre,
      reconstruireEtatDeTraverseLibre(
        narration.faitsDeCampagne as unknown as readonly {
          readonly id: string;
        }[],
      ),
    ) ||
    !activitesDeHautPuitsSontCausales(
      hautPuits,
      routes,
      parties.tempsDuConvoi.secondes,
      narration.faitsDeCampagne as unknown as readonly FaitDeCampagne[],
    ) ||
    (!coutsHistoriquesDesNacellesRequis &&
      !coutsPersistesDesNacellesSontCausaux(
        routes as unknown as EtatDesRoutes,
        hautPuits as unknown as EtatDeHautPuits,
        veilleBasse as unknown as EtatDeVeilleBasse,
        narration.faitsDeCampagne as unknown as readonly FaitDeCampagne[],
      )) ||
    !estJournalDExpeditionCoherent(
      expeditions,
      narration.faitsDeCampagne as unknown as readonly FaitDeCampagne[],
    ) ||
    (validerCrises &&
      !estEtatDesCrises(
        crises,
        parties.tempsDuConvoi.secondes,
        parties.tempsDuConvoi.vitesse,
        narration.faitsDeCampagne,
        narration.evenementActif,
        infrastructure,
        pilotage as EtatPilotage,
        parties.citeCaravane.formation.plateformes,
        routes,
        expeditions,
        hautPuits,
        veilleBasse,
        autoriserMarqueurHistoriqueSansFait,
        ignorerCrisesSequentielles,
      )) ||
    (trouverEngagementDeRouteActif(routes) !== undefined &&
      (infrastructure.deploiement === "halte" ||
        infrastructure.chantierActif !== null)) ||
    !estEtatPilotage(
      pilotage,
      parties.tempsDuConvoi.secondes,
      narration.faitsDeCampagne,
      infrastructure,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
      coutsHistoriquesDesNacellesRequis,
    ) ||
    !coutsDeLAiguillageSontCausaux(
      narration.faitsDeCampagne,
      infrastructure,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
    ) ||
    !preparatifsDeLaCouronneSontCausaux(
      narration.faitsDeCampagne,
      infrastructure,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
    ) ||
    !voieDesColoniesEstCausale(
      narration.faitsDeCampagne,
      infrastructure,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
      trameDeFer as EtatDeLaTrameDeFer,
      traverseLibre as EtatDeTraverseLibre,
    ) ||
    !ouvertureDeLaCouronneEstCausale(
      narration.faitsDeCampagne,
      infrastructure,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
    ) ||
    !contratFinalEstCausal(
      narration.faitsDeCampagne,
      infrastructure,
      routes,
      expeditions,
      hautPuits,
      veilleBasse,
      parties.citeCaravane.habitants,
    ) ||
    !estCausaliteDeNarrationValide(
      parties,
      pilotage,
      veilleBasse as EtatCampagne["veilleBasse"],
      routes as EtatDesRoutes,
      autoriserCausaliteHistoriqueSansMarqueur,
    ) ||
    !Array.isArray(valeur.echeances) ||
    !valeur.echeances.every(
      (echeance) =>
        estObjet(echeance) &&
        typeof echeance.id === "string" &&
        estNombreFini(echeance.secondeDEcheance) &&
        echeance.secondeDEcheance >= 0 &&
        typeof echeance.cause === "string" &&
        estCommande(echeance.commande),
    ) ||
    !estObjet(flux) ||
    !estObjet(flux["evenements-narratifs"]) ||
    flux["evenements-narratifs"].algorithme !== "xoshiro128**" ||
    flux["evenements-narratifs"].version !== VERSION_ALEATOIRE_COURANTE ||
    !Array.isArray(flux["evenements-narratifs"].etat) ||
    flux["evenements-narratifs"].etat.length !== 4 ||
    !flux["evenements-narratifs"].etat.every(estEntierNonSigne) ||
    !flux["evenements-narratifs"].etat.some((mot) => mot !== 0)
  ) {
    return undefined;
  }

  return valeur as unknown as EtatCampagne;
}

export function lireEtatCourant(valeur: unknown): EtatCampagne | undefined {
  return lireEtatAvecSchemaCourant(valeur, true);
}

export function lireSnapshotCourant(
  valeur: unknown,
): EtatCampagne | undefined {
  return lireEtatAvecSchemaCourant(valeur, true, true);
}

function promouvoirCrisesV13(
  valeur: unknown,
  faits: readonly FaitDeCampagne[],
): unknown {
  if (!estObjet(valeur) || "crisesDeTrameHistoriquesIgnorees" in valeur) {
    return valeur;
  }
  return {
    ...valeur,
    crisesDeTrameHistoriquesIgnorees: faits.some(
      ({ id }) => id === FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
    ),
  };
}

function lireEtatAvecSchemaV13(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV13 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_CRISE_DE_TRAME ||
    !estObjet(valeur.narration) ||
    !Array.isArray(valeur.narration.faitsDeCampagne) ||
    !estObjet(valeur.crises) ||
    "crisesDeTrameHistoriquesIgnorees" in valeur.crises
  ) {
    return undefined;
  }
  const faits =
    valeur.narration
      .faitsDeCampagne as unknown as readonly FaitDeCampagne[];
  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      crises: promouvoirCrisesV13(valeur.crises, faits),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV13);
}

export function lireEtatV13(
  valeur: unknown,
): EtatCampagneV13 | undefined {
  return lireEtatAvecSchemaV13(valeur);
}

export function lireSnapshotV13(
  valeur: unknown,
): EtatCampagneV13 | undefined {
  return lireEtatAvecSchemaV13(valeur, true);
}

function promouvoirCrisesV12(
  valeur: unknown,
  faits: readonly FaitDeCampagne[],
): unknown {
  if (!estObjet(valeur) || "historique" in valeur) {
    return valeur;
  }
  return {
    ...valeur,
    crisesDeTrameHistoriquesIgnorees: faits.some(
      ({ id }) => id === FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
    ),
    crisesSequentiellesHistoriquesIgnorees: faits.some(
      ({ id }) => id === FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE,
    ),
    historique: reconstruireHistoriqueDesCrises(faits),
  };
}

function lireEtatAvecSchemaV12(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV12 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_CRISES_SEQUENTIELLES ||
    !estObjet(valeur.narration) ||
    !Array.isArray(valeur.narration.faitsDeCampagne) ||
    !estObjet(valeur.crises) ||
    "historique" in valeur.crises ||
    "crisesSequentiellesHistoriquesIgnorees" in valeur.crises ||
    "crisesDeTrameHistoriquesIgnorees" in valeur.crises
  ) {
    return undefined;
  }
  const faits =
    valeur.narration
      .faitsDeCampagne as unknown as readonly FaitDeCampagne[];
  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      crises: promouvoirCrisesV12(valeur.crises, faits),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
    false,
    false,
    false,
    true,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV12);
}

export function lireEtatV12(
  valeur: unknown,
): EtatCampagneV12 | undefined {
  return lireEtatAvecSchemaV12(valeur);
}

export function lireSnapshotV12(
  valeur: unknown,
): EtatCampagneV12 | undefined {
  return lireEtatAvecSchemaV12(valeur, true);
}

function promouvoirCrisesV11(
  valeur: unknown,
  faits: readonly FaitDeCampagne[],
): unknown {
  if (
    !estObjet(valeur) ||
    !Array.isArray(valeur.recuperations) ||
    !Array.isArray(valeur.cicatrices) ||
    "historique" in valeur ||
    "crisesSequentiellesHistoriquesIgnorees" in valeur ||
    "crisesDeTrameHistoriquesIgnorees" in valeur
  ) {
    return valeur;
  }
  const cicatrices = valeur.cicatrices;
  return {
    ...valeur,
    crisesDeTrameHistoriquesIgnorees: faits.some(
      ({ id }) => id === FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
    ),
    crisesSequentiellesHistoriquesIgnorees: faits.some(
      ({ id }) => id === FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE,
    ),
    historique: reconstruireHistoriqueDesCrises(faits),
    recuperations: valeur.recuperations.map((recuperation) => {
      if (!estObjet(recuperation)) {
        return recuperation;
      }
      const definition = DEFINITIONS_DES_REPONSES_A_LA_CRISE.find(
        ({ recuperation: attendue }) =>
          attendue.garantie === recuperation.garantie &&
          attendue.destination === recuperation.destination &&
          attendue.horizonTroncons === recuperation.horizonTroncons,
      );
      const cicatrice = cicatrices.find(
        (candidate) =>
          estObjet(candidate) && candidate.id === recuperation.cause,
      );
      if (
        definition === undefined ||
        !estObjet(cicatrice) ||
        typeof cicatrice.acquiseA !== "number"
      ) {
        return recuperation;
      }
      return {
        ...recuperation,
        condition: definition.recuperation.condition,
        coutAttendu: definition.recuperation.coutAttendu,
        amorceeA: cicatrice.acquiseA,
        accomplieA: null,
        manqueeA: null,
        faitResultat: null,
        coutApplique: [],
      };
    }),
  };
}

function lireEtatAvecSchemaV11(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV11 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_RECUPERATIONS ||
    !estObjet(valeur.narration) ||
    !Array.isArray(valeur.narration.faitsDeCampagne) ||
    !estObjet(valeur.crises) ||
    "historique" in valeur.crises ||
    valeur.narration.faitsDeCampagne.some(
      (fait) =>
        estObjet(fait) &&
        typeof fait.id === "string" &&
        fait.id.startsWith("crise.recuperation."),
    )
  ) {
    return undefined;
  }
  const faits =
    valeur.narration
      .faitsDeCampagne as unknown as readonly FaitDeCampagne[];
  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      crises: promouvoirCrisesV11(valeur.crises, faits),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
    false,
    false,
    false,
    true,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV11);
}

export function lireEtatV11(
  valeur: unknown,
): EtatCampagneV11 | undefined {
  return lireEtatAvecSchemaV11(valeur);
}

export function lireSnapshotV11(
  valeur: unknown,
): EtatCampagneV11 | undefined {
  return lireEtatAvecSchemaV11(valeur, true);
}

function lireEtatAvecSchemaV10(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV10 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_DENOUEMENT ||
    "denouement" in valeur ||
    !estObjet(valeur.narration) ||
    !Array.isArray(valeur.narration.faitsDeCampagne)
  ) {
    return undefined;
  }
  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      denouement: reconstruireDenouementReussi(
        valeur.narration
          .faitsDeCampagne as unknown as readonly FaitDeCampagne[],
      ),
      crises: promouvoirCrisesV11(
        valeur.crises,
        ((valeur.narration as ObjetInconnu)
          .faitsDeCampagne ?? []) as readonly FaitDeCampagne[],
      ),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
    false,
    false,
    false,
    true,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV10);
}

export function lireEtatV10(
  valeur: unknown,
): EtatCampagneV10 | undefined {
  return lireEtatAvecSchemaV10(valeur);
}

export function lireSnapshotV10(
  valeur: unknown,
): EtatCampagneV10 | undefined {
  return lireEtatAvecSchemaV10(valeur, true);
}

function lireEtatAvecSchemaV9(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV9 | undefined {
  const nouveauxPrefixes = [
    "trame.pompe-neuve.",
    "trame.traverse-libre.",
    "trame.marche.",
    "trame.signal-zero.",
    "trame.aiguillage-zero.",
    "couronne.",
  ];
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_TRAVERSE_LIBRE ||
    "traverseLibre" in valeur ||
    !estObjet(valeur.routes) ||
    !estObjet(valeur.routes.etatsReels) ||
    [
      "embranchement-de-pompe-neuve",
      "galerie-des-reservoirs",
      "rocade-du-marche",
      "voie-des-citernes",
      "ligne-du-signal-zero",
      "voie-des-contremaitres",
      "traverse-des-porteurs",
      "rocade-des-regulateurs",
      "derivation-des-puits",
      "faisceau-de-l-aiguillage-zero",
      "passage-de-la-couronne-muette",
      "voie-de-tete-de-ligne",
      "chemin-des-trois-veilles",
      "piste-des-serres-de-verre",
      "rampe-du-seuil",
      "arc-ferroviaire-du-noeud",
      "galerie-des-trois-phares",
      "porte-logistique-du-seuil",
      "passage-de-la-couronne-ouverte",
      "breche-de-secours-du-noeud",
    ].some(
      (id) =>
        Object.prototype.hasOwnProperty.call(
          (valeur.routes as ObjetInconnu).etatsReels,
          id,
        ),
    ) ||
    !estObjet(valeur.narration) ||
    !Array.isArray(valeur.narration.evenementsJoues) ||
    valeur.narration.evenementsJoues.some(
      (id) =>
        typeof id === "string" &&
        nouveauxPrefixes.some((prefixe) => id.startsWith(prefixe)),
    ) ||
    (typeof (valeur.narration as ObjetInconnu).evenementActif ===
      "string" &&
      nouveauxPrefixes.some((prefixe) =>
        String(
          (valeur.narration as ObjetInconnu).evenementActif,
        ).startsWith(prefixe),
      )) ||
    !Array.isArray(valeur.narration.faitsDeCampagne) ||
    valeur.narration.faitsDeCampagne.some(
      (fait) =>
        estObjet(fait) &&
        typeof fait.id === "string" &&
        nouveauxPrefixes.some((prefixe) =>
          String(fait.id).startsWith(prefixe),
        ),
    )
  ) {
    return undefined;
  }
  const routesInitiales = creerEtatDesRoutesInitial();
  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      denouement: CAMPAGNE_EN_COURS,
      crises: promouvoirCrisesV11(
        valeur.crises,
        ((valeur.narration as ObjetInconnu)
          .faitsDeCampagne ?? []) as readonly FaitDeCampagne[],
      ),
      routes: {
        ...valeur.routes,
        etatsReels: {
          ...routesInitiales.etatsReels,
          ...valeur.routes.etatsReels,
        },
      },
      traverseLibre: creerEtatInitialDeTraverseLibre(),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
    false,
    false,
    false,
    true,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV9);
}

export function lireEtatV9(
  valeur: unknown,
): EtatCampagneV9 | undefined {
  return lireEtatAvecSchemaV9(valeur);
}

export function lireSnapshotV9(
  valeur: unknown,
): EtatCampagneV9 | undefined {
  return lireEtatAvecSchemaV9(valeur, true);
}

function lireEtatAvecSchemaV8(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV8 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_TRAME_DE_FER ||
    "trameDeFer" in valeur ||
    !estObjet(valeur.routes) ||
    !estObjet(valeur.routes.etatsReels) ||
    [
      "rampe-de-barriere-neuve",
      "voie-des-ponts-lourds",
      "embranchement-de-pompe-neuve",
      "galerie-des-reservoirs",
      "rocade-du-marche",
      "voie-des-citernes",
      "ligne-du-signal-zero",
      "voie-des-contremaitres",
      "traverse-des-porteurs",
      "rocade-des-regulateurs",
      "derivation-des-puits",
      "faisceau-de-l-aiguillage-zero",
      "passage-de-la-couronne-muette",
      "voie-de-tete-de-ligne",
      "chemin-des-trois-veilles",
      "piste-des-serres-de-verre",
      "rampe-du-seuil",
      "arc-ferroviaire-du-noeud",
      "galerie-des-trois-phares",
      "porte-logistique-du-seuil",
      "passage-de-la-couronne-ouverte",
      "breche-de-secours-du-noeud",
    ].some((id) =>
      Object.prototype.hasOwnProperty.call(
        (valeur.routes as ObjetInconnu).etatsReels,
        id,
      ),
    ) ||
    !estObjet(valeur.narration) ||
    !Array.isArray(valeur.narration.evenementsJoues) ||
    valeur.narration.evenementsJoues.some(
      (id) =>
        typeof id === "string" &&
        (id.startsWith("trame.") || id.startsWith("couronne.")),
    ) ||
    (typeof valeur.narration.evenementActif === "string" &&
      (valeur.narration.evenementActif.startsWith("trame.") ||
        valeur.narration.evenementActif.startsWith("couronne."))) ||
    !Array.isArray(valeur.narration.faitsDeCampagne) ||
    valeur.narration.faitsDeCampagne.some(
      (fait) =>
        estObjet(fait) &&
        typeof fait.id === "string" &&
        (fait.id.startsWith("trame.") ||
          fait.id.startsWith("couronne.")),
    )
  ) {
    return undefined;
  }
  const routesInitiales = creerEtatDesRoutesInitial();
  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      denouement: CAMPAGNE_EN_COURS,
      crises: promouvoirCrisesV11(
        valeur.crises,
        valeur.narration
          .faitsDeCampagne as unknown as readonly FaitDeCampagne[],
      ),
      routes: {
        ...valeur.routes,
        etatsReels: {
          ...routesInitiales.etatsReels,
          ...valeur.routes.etatsReels,
        },
      },
      trameDeFer: creerEtatInitialDeLaTrameDeFer(),
      traverseLibre: creerEtatInitialDeTraverseLibre(),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
    false,
    false,
    false,
    true,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV8);
}

export function lireEtatV8(
  valeur: unknown,
): EtatCampagneV8 | undefined {
  return lireEtatAvecSchemaV8(valeur);
}

export function lireSnapshotV8(
  valeur: unknown,
): EtatCampagneV8 | undefined {
  return lireEtatAvecSchemaV8(valeur, true);
}

function lireEtatAvecSchemaV7(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV7 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_DEVERSOIR ||
    "devenirsDesSites" in valeur ||
    !estObjet(valeur.hautPuits) ||
    "projetRegional" in valeur.hautPuits ||
    !estObjet(valeur.veilleBasse) ||
    !estObjet(valeur.veilleBasse.cohorte) ||
    "orientationRegionale" in valeur.veilleBasse.cohorte ||
    !estObjet(valeur.routes) ||
    !estObjet(valeur.routes.etatsReels) ||
    [
      "chemin-de-l-hospice",
      "chenal-de-l-hospice",
      "conduite-du-deversoir",
      "passage-de-la-ligne-zero",
      "piste-des-levees",
      "faisceau-de-l-aiguillage-zero",
      "passage-de-la-couronne-muette",
      "voie-de-tete-de-ligne",
      "chemin-des-trois-veilles",
      "piste-des-serres-de-verre",
      "rampe-du-seuil",
      "arc-ferroviaire-du-noeud",
      "galerie-des-trois-phares",
      "porte-logistique-du-seuil",
      "passage-de-la-couronne-ouverte",
      "breche-de-secours-du-noeud",
    ].some((id) =>
      Object.prototype.hasOwnProperty.call(
        (valeur.routes as ObjetInconnu).etatsReels,
        id,
      ),
    ) ||
    !estObjet(valeur.narration) ||
    !Array.isArray(valeur.narration.evenementsJoues) ||
    valeur.narration.evenementsJoues.some(
      (id) => typeof id === "string" && id.startsWith("bassins.deversoir."),
    ) ||
    (typeof valeur.narration.evenementActif === "string" &&
      valeur.narration.evenementActif.startsWith("bassins.deversoir.")) ||
    !Array.isArray(valeur.narration.faitsDeCampagne) ||
    valeur.narration.faitsDeCampagne.some(
      (fait) =>
        estObjet(fait) &&
        typeof fait.id === "string" &&
        fait.id.startsWith("bassins.deversoir."),
    )
  ) {
    return undefined;
  }

  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      denouement: CAMPAGNE_EN_COURS,
      crises: promouvoirCrisesV11(
        valeur.crises,
        valeur.narration
          .faitsDeCampagne as unknown as readonly FaitDeCampagne[],
      ),
      hautPuits: {
        ...valeur.hautPuits,
        projetRegional: null,
      },
      devenirsDesSites: null,
      trameDeFer: creerEtatInitialDeLaTrameDeFer(),
      traverseLibre: creerEtatInitialDeTraverseLibre(),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
    false,
    true,
    true,
    true,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV7);
}

export function lireEtatV7(
  valeur: unknown,
): EtatCampagneV7 | undefined {
  return lireEtatAvecSchemaV7(valeur);
}

export function lireSnapshotV7(
  valeur: unknown,
): EtatCampagneV7 | undefined {
  return lireEtatAvecSchemaV7(valeur, true);
}

function lireEtatAvecSchemaV6(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV6 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_NACELLES ||
    !estObjet(valeur.routes) ||
    !estObjet(valeur.routes.etatsReels) ||
    "nacelles-de-veille-basse" in valeur.routes.etatsReels ||
    !Array.isArray(valeur.routes.engagements) ||
    valeur.routes.engagements.some(
      (engagement) =>
        estObjet(engagement) &&
        engagement.tronconId === "nacelles-de-veille-basse",
    ) ||
    !estObjet(valeur.narration) ||
    !Array.isArray(valeur.narration.evenementsJoues) ||
    valeur.narration.evenementsJoues.some(
      (id) => typeof id === "string" && id.startsWith("bassins.nacelles."),
    ) ||
    (typeof valeur.narration.evenementActif === "string" &&
      valeur.narration.evenementActif.startsWith("bassins.nacelles.")) ||
    !Array.isArray(valeur.narration.faitsDeCampagne) ||
    valeur.narration.faitsDeCampagne.some(
      (fait) =>
        estObjet(fait) &&
        typeof fait.id === "string" &&
        fait.id.startsWith("bassins.nacelles."),
    ) ||
    !estObjet(valeur.hautPuits) ||
    !estObjet(valeur.veilleBasse) ||
    !estObjet(valeur.pilotage) ||
    !estObjet(valeur.pilotage.economie) ||
    !estObjet(valeur.pilotage.economie.stocks) ||
    !estObjet(valeur.pilotage.economie.stocks.combustible) ||
    !estObjet(valeur.pilotage.economie.stocks.eau)
  ) {
    return undefined;
  }

  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      denouement: CAMPAGNE_EN_COURS,
      crises: promouvoirCrisesV11(
        valeur.crises,
        valeur.narration
          .faitsDeCampagne as unknown as readonly FaitDeCampagne[],
      ),
      devenirsDesSites: null,
      trameDeFer: creerEtatInitialDeLaTrameDeFer(),
      traverseLibre: creerEtatInitialDeTraverseLibre(),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
    true,
    true,
    false,
    true,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV6);
}

export function lireEtatV6(
  valeur: unknown,
): EtatCampagneV6 | undefined {
  return lireEtatAvecSchemaV6(valeur);
}

export function lireSnapshotV6(
  valeur: unknown,
): EtatCampagneV6 | undefined {
  return lireEtatAvecSchemaV6(valeur, true);
}

function lireEtatAvecSchemaV5(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV5 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_HAUT_PUITS ||
    "hautPuits" in valeur
  ) {
    return undefined;
  }
  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      denouement: CAMPAGNE_EN_COURS,
      crises: promouvoirCrisesV11(
        valeur.crises,
        ((valeur.narration as ObjetInconnu)
          .faitsDeCampagne ?? []) as readonly FaitDeCampagne[],
      ),
      hautPuits: creerEtatDeHautPuitsInitial(),
      devenirsDesSites: null,
      trameDeFer: creerEtatInitialDeLaTrameDeFer(),
      traverseLibre: creerEtatInitialDeTraverseLibre(),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
    false,
    true,
    false,
    true,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV5);
}

export function lireEtatV5(
  valeur: unknown,
): EtatCampagneV5 | undefined {
  return lireEtatAvecSchemaV5(valeur);
}

export function lireSnapshotV5(
  valeur: unknown,
): EtatCampagneV5 | undefined {
  return lireEtatAvecSchemaV5(valeur, true);
}

function lireEtatAvecSchemaV4(
  valeur: unknown,
  autoriserMarqueurHistoriqueSansFait = false,
): EtatCampagneV4 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_VEILLE_BASSE ||
    "veilleBasse" in valeur ||
    "hautPuits" in valeur
  ) {
    return undefined;
  }
  const etatCourant = lireEtatAvecSchemaCourant(
    {
      ...valeur,
      version: VERSION_SIMULATION_COURANTE,
      denouement: CAMPAGNE_EN_COURS,
      crises: promouvoirCrisesV11(
        valeur.crises,
        ((valeur.narration as ObjetInconnu)
          .faitsDeCampagne ?? []) as readonly FaitDeCampagne[],
      ),
      veilleBasse: creerEtatInitialDeVeilleBasse(),
      hautPuits: creerEtatDeHautPuitsInitial(),
      devenirsDesSites: null,
      trameDeFer: creerEtatInitialDeLaTrameDeFer(),
      traverseLibre: creerEtatInitialDeTraverseLibre(),
    },
    true,
    autoriserMarqueurHistoriqueSansFait,
    false,
    true,
    false,
    true,
  );
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV4);
}

export function lireEtatV4(
  valeur: unknown,
): EtatCampagneV4 | undefined {
  return lireEtatAvecSchemaV4(valeur);
}

export function lireSnapshotV4(
  valeur: unknown,
): EtatCampagneV4 | undefined {
  return lireEtatAvecSchemaV4(valeur, true);
}

export function lireEtatAvantRoutes(
  valeur: unknown,
): EtatCampagneAvantRoutes | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_CRISES ||
    "routes" in valeur ||
    "crises" in valeur ||
    "expeditions" in valeur
  ) {
    return undefined;
  }
  const pilotage = valeur.pilotage;
  if (!estObjet(pilotage) || !estObjet(pilotage.economie)) {
    return undefined;
  }
  const stocks = pilotage.economie.stocks;
  if (!estObjet(stocks) || !estObjet(stocks.materiaux)) {
    return undefined;
  }
  const materiaux = stocks.materiaux;
  const valeurNormalisee =
    materiaux.quantite === 0
      ? {
          ...valeur,
          pilotage: {
            ...pilotage,
            economie: {
              ...pilotage.economie,
              stocks: {
                ...stocks,
                materiaux: { ...materiaux, reliquatDeFlux: 0 },
              },
            },
          },
        }
      : valeur;
  const routes = creerEtatDesRoutesInitial();
  const etatNormalise = lireEtatAvecSchemaCourant({
    ...valeurNormalisee,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    routes,
    crises: creerEtatDesCrisesInitial(),
    expeditions: creerEtatDesExpeditionsInitial(),
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    hautPuits: creerEtatDeHautPuitsInitial(),
    devenirsDesSites: null,
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
  }, false);
  if (etatNormalise === undefined) {
    return undefined;
  }
  const materiauxHistoriques = calculerStockAttendu(
    "materiaux",
    etatNormalise.tempsDuConvoi.secondes,
    etatNormalise.narration.faitsDeCampagne as unknown as readonly ObjetInconnu[],
    etatNormalise.infrastructure,
    routes,
    creerEtatDesExpeditionsInitial(),
    creerEtatDeHautPuitsInitial(),
    creerEtatInitialDeVeilleBasse(),
    false,
  );
  return materiaux.quantite !== materiauxHistoriques.quantite ||
    materiaux.reliquatDeFlux !== materiauxHistoriques.reliquatDeFlux
    ? undefined
    : (valeur as unknown as EtatCampagneAvantRoutes);
}

export function projeterEtatAvantRoutesHistorique(
  etat: EtatCampagne,
): EtatCampagneAvantRoutes {
  const materiaux = calculerStockAttendu(
    "materiaux",
    etat.tempsDuConvoi.secondes,
    etat.narration.faitsDeCampagne as unknown as readonly ObjetInconnu[],
    etat.infrastructure,
    creerEtatDesRoutesInitial(),
    creerEtatDesExpeditionsInitial(),
    creerEtatDeHautPuitsInitial(),
    creerEtatInitialDeVeilleBasse(),
    false,
  );
  return {
    version: VERSION_SIMULATION_AVANT_CRISES,
    graine: etat.graine,
    tempsDuConvoi: etat.tempsDuConvoi,
    citeCaravane: etat.citeCaravane,
    narration: etat.narration,
    pilotage: {
      ...etat.pilotage,
      economie: {
        ...etat.pilotage.economie,
        stocks: {
          ...etat.pilotage.economie.stocks,
          materiaux: {
            ...etat.pilotage.economie.stocks.materiaux,
            quantite: materiaux.quantite,
            reliquatDeFlux: materiaux.reliquatDeFlux,
          },
        },
      },
    },
    infrastructure: etat.infrastructure,
    echeances: etat.echeances,
    fluxPseudoAleatoires: etat.fluxPseudoAleatoires,
  };
}

export function lireEtatV3(valeur: unknown): EtatCampagneV3 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_CRISES ||
    "crises" in valeur ||
    "expeditions" in valeur ||
    !Array.isArray(valeur.echeances) ||
    !valeur.echeances.every(
      (echeance) => estObjet(echeance) && estCommandeV3(echeance.commande),
    )
  ) {
    return undefined;
  }
  const etatCourant = lireEtatAvecSchemaCourant({
    ...valeur,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    crises: creerEtatDesCrisesInitial(),
    expeditions: creerEtatDesExpeditionsInitial(),
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    hautPuits: creerEtatDeHautPuitsInitial(),
    devenirsDesSites: null,
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
  }, false);
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV3);
}

export function lireEtatV2(valeur: unknown): EtatCampagneV2 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_AVANT_ROUTES ||
    "routes" in valeur ||
    "infrastructure" in valeur ||
    "crises" in valeur ||
    "expeditions" in valeur
  ) {
    return undefined;
  }
  const infrastructure = creerInfrastructureInitiale();
  const etatCourant = lireEtatAvecSchemaCourant({
    ...valeur,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    citeCaravane: estObjet(valeur.citeCaravane)
      ? {
          ...valeur.citeCaravane,
          formation: {
            type: "grappe",
            plateformes: infrastructure.plateformes.map(
              (plateforme) => plateforme.id,
            ),
          },
        }
      : valeur.citeCaravane,
    infrastructure,
    routes: creerEtatDesRoutesInitial(),
    crises: creerEtatDesCrisesInitial(),
    expeditions: creerEtatDesExpeditionsInitial(),
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    hautPuits: creerEtatDeHautPuitsInitial(),
    devenirsDesSites: null,
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
  }, false);
  return etatCourant === undefined
    ? undefined
    : (valeur as unknown as EtatCampagneV2);
}

export function lireEtatAvantCrises(
  valeur: unknown,
): EtatCampagneAvantCrises | undefined {
  return lireEtatV3(valeur);
}

function lireReproductionCourante(
  valeur: unknown,
): ReproductionDeCampagne | undefined {
  if (
    !estObjet(valeur) ||
    !EMPREINTE.test(String(valeur.empreinteSnapshot)) ||
    !Array.isArray(valeur.commandes)
  ) {
    return undefined;
  }
  const snapshot = lireSnapshotCourant(valeur.snapshot);
  if (snapshot === undefined) {
    return undefined;
  }

  const commandes: CommandeDeReproduction[] = [];
  for (const [index, entree] of valeur.commandes.entries()) {
    if (
      !estObjet(entree) ||
      entree.sequence !== index ||
      !estCommande(entree.commande) ||
      typeof entree.empreinteApres !== "string" ||
      !EMPREINTE.test(entree.empreinteApres)
    ) {
      return undefined;
    }
    commandes.push(entree as unknown as CommandeDeReproduction);
  }

  return {
    snapshot,
    empreinteSnapshot: valeur.empreinteSnapshot as string,
    commandes,
  };
}

export function lireSauvegardeCourante(
  valeur: unknown,
): SauvegardeCampagne | undefined {
  if (
    !estObjet(valeur) ||
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_COURANTE ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSIONS_DU_SNAPSHOT_COURANT.simulation ||
    valeur.versions.contenu !== VERSIONS_DU_SNAPSHOT_COURANT.contenu ||
    valeur.versions.aleatoire !== VERSIONS_DU_SNAPSHOT_COURANT.aleatoire ||
    valeur.versions.empreinte !== VERSIONS_DU_SNAPSHOT_COURANT.empreinte ||
    typeof valeur.graine !== "string" ||
    !estObjet(valeur.horloge) ||
    !estNombreFini(valeur.horloge.secondes) ||
    typeof valeur.empreinte !== "string" ||
    !EMPREINTE.test(valeur.empreinte)
  ) {
    return undefined;
  }

  const etat = lireEtatCourant(valeur.etat);
  const reproduction = lireReproductionCourante(valeur.reproduction);
  if (
    etat === undefined ||
    reproduction === undefined ||
    valeur.graine !== etat.graine ||
    valeur.horloge.secondes !== etat.tempsDuConvoi.secondes ||
    valeur.empreinte !== empreinteEtat(etat)
  ) {
    return undefined;
  }

  const replay = rejouerReproduction(reproduction);
  if (replay.statut !== "termine" || replay.empreinte !== valeur.empreinte) {
    return undefined;
  }

  return valeur as unknown as SauvegardeCampagne;
}
