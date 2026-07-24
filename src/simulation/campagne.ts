import { catalogueDEvenements, trouverEvenement } from "../content/catalogue";
import type {
  ChoixDEvenement,
  ConditionDEvenement,
  EffetDEvenement,
  EvenementDuCatalogue,
} from "../content/types";
import type { EffetsDeFait, FaitDeCampagne } from "./faits";
import {
  creerFluxPseudoAleatoire,
  type FluxPseudoAleatoire,
} from "./aleatoire";
import type { GraineDeCampagne } from "./graine";
import { formaterEmpreinteFnv1a32V1 } from "./empreinte";
import {
  appliquerVariationAUnStock,
  creerPilotageInitial,
  engagerTransitionDeDoctrine,
  ordonnerResolutionDIncident,
  traiterEcheancesDePilotage,
  type CommandeDeDoctrine,
  type CommandeDIncident,
  type EtatPilotage,
  type EvenementDeDoctrine,
  type EvenementDIncidentResolu,
} from "./pilotage";
import {
  creerInfrastructureInitiale,
  ajouterPlateformeRegionale,
  ajouterPlateformeRegionaleOrdinaire,
  IDENTIFIANT_DE_PLATEFORME_REGIONALE,
  engagerChantier,
  faireProgresserChantier,
  IDENTIFIANTS_DE_PLATEFORME_INITIALE,
  secondesAvantFinDuChantier,
  type CommandeDInfrastructure,
  type EtatInfrastructure,
  type IdentifiantDePlateformeMobile,
  type EvenementDInfrastructure,
} from "./infrastructure";
import {
  appliquerConsommationDeRouteAUnStock,
  confirmerEngagementDeRoute,
  creerEtatDesRoutesInitial,
  traiterJalonsDeRoute,
  trouverEngagementDeRouteActif,
  trouverTronconDeRoute,
  type EtatDesRoutes,
  type EvenementDeRoute,
  type IdentifiantDeTroncon,
} from "./routes";
import { VERSION_SIMULATION_COURANTE } from "./versions";
import {
  affecterCompagnon,
  deciderAuConseil,
  type CommandeDAffectationDeCompagnon,
  type CommandeDeDecisionDuConseil,
  type EvenementDAffectationDeCompagnon,
  type EvenementDeDecisionDuConseil,
} from "./conseil";
import {
  annoncerCriseApresFaits,
  creerEtatDesCrisesInitial,
  criseAttendSonCheckpoint,
  declencherCrise,
  prochaineSecondeDeCrise,
  resoudreCrise as resoudreCriseActive,
  type CommandeDeDeclenchementDeCrise,
  type CommandeDeResolutionDeCrise,
  type EtatDesCrises,
  type EvenementDeCrise,
} from "./crise";
import {
  appliquerCommandeAHautPuits,
  creerEtatDeHautPuitsInitial,
  type CommandeDeMarcheDeHautPuits,
  type EtatDeHautPuits,
  type EvenementDeHautPuits,
} from "./hautPuits";
import {
  creerFaitPourRapportDExpedition,
  creerEtatDesExpeditionsInitial,
  lancerExpedition,
  ordonnerExpedition,
  secondesAvantProchaineEcheanceDExpedition,
  traiterEcheancesDExpedition,
  type CommandeDExpedition,
  type EtatDesExpeditions,
  type EvenementDExpedition,
  type MouvementDeStockDExpedition,
} from "./expeditions";
import {
  accueillirOuOrienterLaCohorte,
  creerEtatInitialDeVeilleBasse,
  deciderPourMaelys,
  interventionDeVeilleBasseEstPrete,
  intervenirPourVeilleBasse,
  laisserPasserLOccasionDIntervenir,
  preparerInterventionPourVeilleBasse,
  revelerLesRegistresDuReflux,
  traiterEcheancesDeVeilleBasse,
  type EtatDeVeilleBasse,
  type EvenementDeVeilleBasse,
} from "./veilleBasse";
import {
  calculerOffreDesNacelles,
  routeAvalDesBassinsEstPreparee,
} from "./nacelles";
import {
  calculerDevenirsDesSitesDesBassins,
  calculerDevenirsDesSitesDeLaTrame,
  type DevenirsDesSitesDesBassins,
} from "./sites";
import {
  appliquerDecisionDeLaTrameDeFer,
  creerEtatInitialDeLaTrameDeFer,
  type EtatDeLaTrameDeFer,
} from "./trameFer";
import {
  appliquerDecisionDeTraverseLibre,
  creerEtatInitialDeTraverseLibre,
  type EtatDeTraverseLibre,
} from "./traverseLibre";
import {
  ajusterEffetsDuChoixDeLAiguillageZero,
  choixDeLAiguillageZeroEstDisponible,
} from "./aiguillageZero";

export type { GraineDeCampagne } from "./graine";
export const IDENTIFIANTS_PLATEFORMES_MOBILES =
  IDENTIFIANTS_DE_PLATEFORME_INITIALE;
export type IdentifiantPlateformeMobile = IdentifiantDePlateformeMobile;
export const VITESSES_DU_CONVOI = [0, 1, 2, 4] as const;
export type VitesseDuConvoi = (typeof VITESSES_DU_CONVOI)[number];

export type { FaitDeCampagne } from "./faits";

export interface EcheanceDeCampagne {
  readonly id: string;
  readonly secondeDEcheance: number;
  readonly cause: string;
  readonly commande: CommandeCampagne;
}

export interface EtatCampagne {
  readonly version: typeof VERSION_SIMULATION_COURANTE;
  readonly graine: GraineDeCampagne;
  readonly tempsDuConvoi: {
    readonly secondes: number;
    readonly vitesse: VitesseDuConvoi;
  };
  readonly citeCaravane: {
    readonly habitants: number;
    readonly phare: "actif";
    readonly formation: {
      readonly type: "grappe";
      readonly plateformes: readonly IdentifiantPlateformeMobile[];
    };
  };
  readonly narration: {
    readonly evenementActif: string | null;
    readonly evenementsJoues: readonly string[];
    readonly faitsDeCampagne: readonly FaitDeCampagne[];
    readonly causaliteHistorique?: "eau-haut-puits-a-veille-basse";
  };
  readonly pilotage: EtatPilotage;
  readonly infrastructure: EtatInfrastructure;
  readonly routes: EtatDesRoutes;
  readonly crises: EtatDesCrises;
  readonly expeditions: EtatDesExpeditions;
  readonly veilleBasse: EtatDeVeilleBasse;
  readonly hautPuits: EtatDeHautPuits;
  readonly trameDeFer: EtatDeLaTrameDeFer;
  readonly traverseLibre: EtatDeTraverseLibre;
  readonly devenirsDesSites: DevenirsDesSitesDesBassins | null;
  readonly echeances: readonly EcheanceDeCampagne[];
  readonly fluxPseudoAleatoires: Readonly<{
    "evenements-narratifs": FluxPseudoAleatoire;
  }>;
}

export type CommandeCampagne =
  | {
      readonly type: "temps-du-convoi.regler-vitesse";
      readonly vitesse: VitesseDuConvoi;
    }
  | {
      readonly type: "temps-du-convoi.ecouler";
      readonly secondesReelles: number;
    }
  | {
      readonly type: "evenement-narratif.choisir";
      readonly evenementId: string;
      readonly choixId: string;
    }
  | CommandeDAffectationDeCompagnon
  | CommandeDeDecisionDuConseil
  | {
      readonly type: "engagement-de-route.confirmer";
      readonly tronconId: IdentifiantDeTroncon;
    }
  | CommandeDeDoctrine
  | CommandeDIncident
  | CommandeDInfrastructure
  | CommandeDeDeclenchementDeCrise
  | CommandeDeResolutionDeCrise
  | CommandeDExpedition
  | CommandeDeMarcheDeHautPuits;

export type EvenementDeDomaine =
  | {
      readonly type: "temps-du-convoi.vitesse-modifiee";
      readonly vitessePrecedente: VitesseDuConvoi;
      readonly vitesse: VitesseDuConvoi;
    }
  | {
      readonly type: "temps-du-convoi.ecoule";
      readonly secondeInitiale: number;
      readonly secondeFinale: number;
    }
  | {
      readonly type: "temps-du-convoi.premiere-minute-atteinte";
      readonly secondeAtteinte: 60;
    }
  | {
      readonly type: "evenement-narratif.declenche";
      readonly evenementId: string;
      readonly fenetre: string;
    }
  | {
      readonly type: "evenement-narratif.choix-resolu";
      readonly evenementId: string;
      readonly choixId: string;
      readonly effets: readonly EffetDEvenement[];
      readonly faitsProduits: readonly string[];
    }
  | EvenementDAffectationDeCompagnon
  | EvenementDeDecisionDuConseil
  | EvenementDeDoctrine
  | EvenementDIncidentResolu
  | EvenementDInfrastructure
  | EvenementDeRoute
  | EvenementDeCrise
  | EvenementDExpedition
  | EvenementDeVeilleBasse
  | EvenementDeHautPuits;

export interface TransitionDeCampagne {
  readonly etat: EtatCampagne;
  readonly evenements: readonly EvenementDeDomaine[];
}

export function creerCampagneInitiale(graine: GraineDeCampagne): EtatCampagne {
  return {
    version: VERSION_SIMULATION_COURANTE,
    graine,
    tempsDuConvoi: {
      secondes: 0,
      vitesse: 1,
    },
    citeCaravane: {
      habitants: 184,
      phare: "actif",
      formation: {
        type: "grappe",
        plateformes: IDENTIFIANTS_PLATEFORMES_MOBILES,
      },
    },
    narration: {
      evenementActif: null,
      evenementsJoues: [],
      faitsDeCampagne: [],
    },
    pilotage: creerPilotageInitial(),
    infrastructure: creerInfrastructureInitiale(),
    routes: creerEtatDesRoutesInitial(),
    crises: creerEtatDesCrisesInitial(),
    expeditions: creerEtatDesExpeditionsInitial(),
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    hautPuits: creerEtatDeHautPuitsInitial(),
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
    echeances: [],
    fluxPseudoAleatoires: {
      "evenements-narratifs": creerFluxPseudoAleatoire(
        graine,
        "evenements-narratifs",
      ),
    },
  };
}

function conditionEstRemplie(
  etat: EtatCampagne,
  condition: ConditionDEvenement,
): boolean {
  if (condition.type === "temps-au-moins") {
    return etat.tempsDuConvoi.secondes >= condition.secondes;
  }

  if (condition.type === "fait-present") {
    return etat.narration.faitsDeCampagne.some(
      (fait) => fait.id === condition.fait,
    );
  }

  if (condition.type === "lieu-present") {
    return etat.routes.position === condition.lieu;
  }

  return condition.faits.some((faitAttendu) =>
    etat.narration.faitsDeCampagne.some((fait) => fait.id === faitAttendu),
  );
}

function evenementEstEligible(
  etat: EtatCampagne,
  evenement: EvenementDuCatalogue,
  fenetre: string,
): boolean {
  if (
    evenement.id === "veille-basse.la-porte-des-filtres" &&
    !interventionDeVeilleBasseEstPrete(etat.veilleBasse)
  ) {
    return false;
  }
  return (
    evenement.fenetre === fenetre &&
    etat.tempsDuConvoi.secondes >= evenement.periodeEligibilite.debut &&
    etat.tempsDuConvoi.secondes <= evenement.periodeEligibilite.fin &&
    !etat.narration.evenementsJoues.includes(evenement.id) &&
    evenement.conditions.requises.every((condition) =>
      conditionEstRemplie(etat, condition),
    ) &&
    evenement.conditions.interdites.every(
      (condition) => !conditionEstRemplie(etat, condition),
    )
  );
}

function declencherEvenement(
  etat: EtatCampagne,
  fenetre: string,
): TransitionDeCampagne | undefined {
  if (etat.narration.evenementActif !== null) {
    return undefined;
  }

  const evenement = catalogueDEvenements.evenements
    .filter((candidat) => evenementEstEligible(etat, candidat, fenetre))
    .sort((gauche, droite) => droite.priorite - gauche.priorite)[0];

  if (evenement === undefined) {
    return undefined;
  }

  return {
    etat: {
      ...etat,
      narration: {
        ...etat.narration,
        evenementActif: evenement.id,
      },
    },
    evenements: [
      {
        type: "evenement-narratif.declenche",
        evenementId: evenement.id,
        fenetre,
      },
    ],
  };
}

function declencherSuiteNarrativeDeLaDemonstration(
  etat: EtatCampagne,
): TransitionDeCampagne | undefined {
  const prologue = declencherEvenement(etat, "prologue-enchaine");
  if (prologue !== undefined) {
    return prologue;
  }
  if (etat.routes.jalons.length > 0) {
    const premierJalon = declencherEvenement(
      etat,
      "premier-jalon-bassins-fendus",
    );
    if (premierJalon !== undefined) {
      return premierJalon;
    }
  }
  if (
    etat.routes.position === "relais-des-vannes" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
  ) {
    return declencherEvenement(etat, "relais-des-nacelles");
  }
  if (
    etat.routes.position === "deversoir-noir" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
  ) {
    return declencherEvenement(etat, "deversoir-noir");
  }
  if (
    etat.routes.position === "barriere-neuve" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
  ) {
    return declencherEvenement(etat, "barriere-neuve");
  }
  if (
    etat.routes.position === "grand-aiguillage" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
  ) {
    return declencherEvenement(etat, "grand-aiguillage");
  }
  if (
    etat.routes.position === "pompe-neuve" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
  ) {
    return declencherEvenement(etat, "pompe-neuve");
  }
  if (
    etat.routes.position === "traverse-libre" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
  ) {
    return declencherEvenement(etat, "traverse-libre");
  }
  if (
    etat.routes.position === "marche-des-traverses" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
  ) {
    return declencherEvenement(etat, "marche-des-traverses");
  }
  if (
    etat.routes.position === "signal-zero" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
  ) {
    return declencherEvenement(etat, "signal-zero");
  }
  if (
    etat.routes.position === "aiguillage-zero" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
  ) {
    return declencherEvenement(etat, "aiguillage-zero");
  }
  return etat.routes.position === "haut-puits" &&
    trouverEngagementDeRouteActif(etat.routes) === undefined
    ? declencherEvenement(etat, "halte-haut-puits")
    : undefined;
}

function appliquerEffets(
  etat: EtatCampagne,
  effets: readonly EffetDEvenement[],
): EtatCampagne {
  const variationHabitants = effets.reduce(
    (total, effet) =>
      effet.type === "habitants.modifier" ? total + effet.valeur : total,
    0,
  );

  const variationsDeStocks = effets.filter(
    (
      effet,
    ): effet is Extract<
      EffetDEvenement,
      { readonly type: "stock.modifier" }
    > => effet.type === "stock.modifier",
  );

  return {
    ...etat,
    citeCaravane: {
      ...etat.citeCaravane,
      habitants: etat.citeCaravane.habitants + variationHabitants,
    },
    pilotage: {
      ...etat.pilotage,
      economie: {
        ...etat.pilotage.economie,
        stocks: variationsDeStocks.reduce(
          (stocks, effet) => ({
            ...stocks,
            [effet.stock]: appliquerVariationAUnStock(
              stocks[effet.stock],
              effet.valeur,
            ),
          }),
          etat.pilotage.economie.stocks,
        ),
      },
    },
  };
}

export function choixNarratifEstDisponible(
  etat: EtatCampagne,
  evenementId: string,
  choix: Pick<ChoixDEvenement, "id" | "effets">,
): boolean {
  if (!evenementId.startsWith("trame.")) {
    return true;
  }
  if (
    evenementId === "trame.aiguillage-zero.le-conseil-des-voies" &&
    !choixDeLAiguillageZeroEstDisponible(etat, choix.id)
  ) {
    return false;
  }
  if (
    evenementId ===
    "trame.marche.les-services-de-la-voie-principale"
  ) {
    const servicesDisponibles =
      etat.trameDeFer.grandAiguillage.marche
        .servicesLourdsRestants > 0;
    if (
      (choix.id === "acheter-coupleur-officiel" &&
        servicesDisponibles) ||
      (choix.id === "ceder-reserve-refroidissement" &&
        !servicesDisponibles)
    ) {
      return false;
    }
  }
  if (
    evenementId === "trame.marche.la-bascule-sans-manifeste"
  ) {
    const filtresEncoreNecessaires =
      etat.traverseLibre.marche.lotsDeFiltresManquants > 0;
    if (
      (choix.id === "acheter-filtres-sans-marque" &&
        !filtresEncoreNecessaires) ||
      (choix.id === "intervenir-sur-bascule" &&
        filtresEncoreNecessaires)
    ) {
      return false;
    }
  }

  const coutsParStock = new Map<
    Extract<EffetDEvenement, { readonly type: "stock.modifier" }>["stock"],
    number
  >();
  const effetsApplicables = ajusterEffetsDuChoixDeLAiguillageZero(
    etat,
    evenementId,
    choix.id,
    choix.effets,
  );
  for (const effet of effetsApplicables) {
    if (effet.type === "stock.modifier" && effet.valeur < 0) {
      coutsParStock.set(
        effet.stock,
        (coutsParStock.get(effet.stock) ?? 0) - effet.valeur,
      );
    }
  }
  return [...coutsParStock].every(
    ([stock, cout]) =>
      etat.pilotage.economie.stocks[stock].quantite >= cout,
  );
}

function decrireEffetsDeFait(effets: readonly EffetDEvenement[]): EffetsDeFait {
  return {
    materiels: effets
      .filter(
        (
          effet,
        ): effet is Extract<
          EffetDEvenement,
          { readonly type: "stock.modifier" }
        > => effet.type === "stock.modifier",
      )
      .map((effet) => ({
        type: "stock.modifie" as const,
        stock: effet.stock,
        variation: effet.valeur,
      })),
    humains: effets
      .filter(
        (
          effet,
        ): effet is Extract<
          EffetDEvenement,
          { readonly type: "habitants.modifier" }
        > => effet.type === "habitants.modifier",
      )
      .map((effet) => ({
        type: "habitants.modifies" as const,
        variation: effet.valeur,
      })),
  };
}

function enregistrerFaitsDeCampagne(
  etat: EtatCampagne,
  faits: readonly FaitDeCampagne[],
): EtatCampagne {
  if (faits.length === 0) {
    return etat;
  }

  return {
    ...etat,
    narration: {
      ...etat.narration,
      faitsDeCampagne: [...etat.narration.faitsDeCampagne, ...faits],
    },
  };
}

function appliquerMouvementsDeStocksDExpedition(
  etat: EtatCampagne,
  mouvements: readonly MouvementDeStockDExpedition[],
): EtatCampagne {
  if (mouvements.length === 0) {
    return etat;
  }
  const stocks = { ...etat.pilotage.economie.stocks };
  for (const mouvement of mouvements) {
    stocks[mouvement.stock] = appliquerVariationAUnStock(
      stocks[mouvement.stock],
      mouvement.variation,
    );
  }
  return {
    ...etat,
    pilotage: {
      ...etat.pilotage,
      economie: { ...etat.pilotage.economie, stocks },
    },
  };
}

function enregistrerNouveauxRapportsDExpedition(
  etatAvant: EtatCampagne,
  etatApres: EtatCampagne,
): EtatCampagne {
  const nombresDeRapportsAvant = new Map(
    etatAvant.expeditions.operations.map((operation) => [
      operation.id,
      operation.rapports.length,
    ]),
  );
  const faits = etatApres.expeditions.operations.flatMap((operation) =>
    operation.rapports
      .slice(nombresDeRapportsAvant.get(operation.id) ?? 0)
      .map((rapport) =>
        creerFaitPourRapportDExpedition(operation.id, rapport),
      ),
  );
  return enregistrerFaitsDeCampagne(etatApres, faits);
}

function verifierStocksPourMouvementsDExpedition(
  etat: EtatCampagne,
  mouvements: readonly MouvementDeStockDExpedition[],
): void {
  const variations = new Map<string, number>();
  for (const mouvement of mouvements) {
    variations.set(
      mouvement.stock,
      (variations.get(mouvement.stock) ?? 0) + mouvement.variation,
    );
  }
  const stockInsuffisant = [...variations].some(
    ([stock, variation]) =>
      variation < 0 &&
      etat.pilotage.economie.stocks[
        stock as keyof typeof etat.pilotage.economie.stocks
      ].quantite < -variation,
  );
  if (stockInsuffisant) {
    throw new Error(
      "Les stocks requis pour l’Expédition des Vannes Grises sont insuffisants.",
    );
  }
}

function traiterPilotageEtChantier(
  etat: EtatCampagne,
  secondeInitiale: number,
  secondeFinale: number,
): TransitionDeCampagne {
  let nouvelEtat = etat;
  let curseur = secondeInitiale;
  const evenements: EvenementDeDomaine[] = [];

  while (curseur < secondeFinale) {
    const secondesAvantFin = secondesAvantFinDuChantier(
      nouvelEtat.infrastructure,
    );
    const secondesAvantEcheanceDExpedition =
      secondesAvantProchaineEcheanceDExpedition(
        nouvelEtat.expeditions,
        curseur,
      );
    const prochainesLimites = [secondesAvantFin, secondesAvantEcheanceDExpedition]
      .filter((secondes): secondes is number => secondes !== undefined)
      .map((secondes) => curseur + secondes);
    const prochaineLimite = Math.min(secondeFinale, ...prochainesLimites);
    const pilotage = traiterEcheancesDePilotage(
      nouvelEtat.pilotage,
      curseur,
      prochaineLimite,
    );
    nouvelEtat = enregistrerFaitsDeCampagne(
      { ...nouvelEtat, pilotage: pilotage.etat },
      pilotage.faitsProduits,
    );
    evenements.push(...pilotage.evenements);

    const infrastructure = faireProgresserChantier(
      nouvelEtat.infrastructure,
      nouvelEtat.pilotage,
      prochaineLimite - curseur,
      prochaineLimite,
    );
    nouvelEtat = {
      ...nouvelEtat,
      pilotage: infrastructure.pilotage,
      infrastructure: infrastructure.infrastructure,
    };
    evenements.push(...infrastructure.evenements);

    const etatAvantExpeditions = nouvelEtat;
    const expeditions = traiterEcheancesDExpedition(
      nouvelEtat.expeditions,
      curseur,
      prochaineLimite,
    );
    nouvelEtat = appliquerMouvementsDeStocksDExpedition(
      { ...nouvelEtat, expeditions: expeditions.etat },
      expeditions.mouvementsDeStocks,
    );
    nouvelEtat = enregistrerNouveauxRapportsDExpedition(
      etatAvantExpeditions,
      nouvelEtat,
    );
    evenements.push(...expeditions.evenements);
    curseur = prochaineLimite;
  }

  return { etat: nouvelEtat, evenements };
}

function choisirDansEvenement(
  etat: EtatCampagne,
  commande: Extract<
    CommandeCampagne,
    { readonly type: "evenement-narratif.choisir" }
  >,
): TransitionDeCampagne {
  if (etat.narration.evenementActif !== commande.evenementId) {
    throw new Error(
      `L’Événement narratif « ${commande.evenementId} » n’est pas actif.`,
    );
  }

  const evenement = trouverEvenement(commande.evenementId);
  const choix = evenement?.choix.find(
    (candidat) => candidat.id === commande.choixId,
  );
  if (evenement === undefined || choix === undefined) {
    throw new Error(
      `L’intention « ${commande.choixId} » est inconnue pour « ${commande.evenementId} ».`,
    );
  }
  if (!choixNarratifEstDisponible(etat, evenement.id, choix)) {
    throw new Error(
      `Les stocks sont insuffisants pour « ${commande.choixId} ».`,
    );
  }
  if (
    evenement.id === "bassins.deversoir.le-chassis-des-bassins" &&
    choix.id === "sceller-transformation"
  ) {
    if (etat.hautPuits.projetRegional?.statut !== "retenu") {
      throw new Error(
        "Aucune transformation régionale retenue ne peut être scellée.",
      );
    }
    if (etat.pilotage.economie.stocks.materiaux.quantite < 12) {
      throw new Error(
        "Il faut 12 Matériaux pour sceller le châssis régional.",
      );
    }
  }

  const etatApresDecisionDeVeilleBasse = (() => {
    if (evenement.id === "veille-basse.la-place-sous-le-phare") {
      return {
        ...etat,
        veilleBasse: accueillirOuOrienterLaCohorte(
          etat.veilleBasse,
          commande.choixId as "accueillir" | "refuser" | "rediriger",
          etat.tempsDuConvoi.secondes,
        ).etat,
      };
    }
    if (evenement.id === "veille-basse.la-porte-des-filtres") {
      return {
        ...etat,
        veilleBasse:
          commande.choixId === "renoncer-intervention"
            ? laisserPasserLOccasionDIntervenir(
                etat.veilleBasse,
                etat.tempsDuConvoi.secondes,
              )
            : intervenirPourVeilleBasse(
                etat.veilleBasse,
                commande.choixId as "renforcer-sas" | "ouvrir-hospice",
                etat.tempsDuConvoi.secondes,
              ),
      };
    }
    if (evenement.id === "veille-basse.les-registres-du-reflux") {
      return {
        ...etat,
        veilleBasse: revelerLesRegistresDuReflux(
          etat.veilleBasse,
          commande.choixId as "copier-registres" | "laisser-registres",
        ),
      };
    }
    if (evenement.id === "veille-basse.maelys-et-le-coffret") {
      return {
        ...etat,
        veilleBasse: deciderPourMaelys(
          etat.veilleBasse,
          commande.choixId as "confier-coffret" | "garder-equipes",
          etat.tempsDuConvoi.secondes,
        ),
      };
    }
    return etat;
  })();
  const effetsApplicables = ajusterEffetsDuChoixDeLAiguillageZero(
    etatApresDecisionDeVeilleBasse,
    evenement.id,
    choix.id,
    choix.effets,
  );
  const etatApresEffets = appliquerEffets(
    {
      ...etatApresDecisionDeVeilleBasse,
      trameDeFer: appliquerDecisionDeLaTrameDeFer(
        etatApresDecisionDeVeilleBasse.trameDeFer,
        evenement.id,
        choix.id,
        etat.tempsDuConvoi.secondes,
      ),
      traverseLibre: appliquerDecisionDeTraverseLibre(
        etatApresDecisionDeVeilleBasse.traverseLibre,
        evenement.id,
        choix.id,
      ),
    },
    effetsApplicables,
  );
  let etatApresDecision =
    evenement.id === "trame.traverse-libre.la-galerie-qui-cede"
      ? {
          ...etatApresEffets,
          routes: {
            ...etatApresEffets.routes,
            etatsReels: {
              ...etatApresEffets.routes.etatsReels,
              "galerie-des-reservoirs": "degrade" as const,
            },
          },
        }
      : etatApresEffets;
  const scellerTransformation =
    evenement.id === "bassins.deversoir.le-chassis-des-bassins" &&
    choix.id === "sceller-transformation" &&
    etatApresEffets.hautPuits.projetRegional !== null &&
    etatApresEffets.hautPuits.projetRegional !== undefined;
  const integrerPlateformeOrdinaire =
    evenement.id === "bassins.deversoir.le-chassis-des-bassins" &&
    choix.id === "conserver-gabarits";
  if (scellerTransformation || integrerPlateformeOrdinaire) {
    etatApresDecision = {
      ...etatApresEffets,
      citeCaravane: {
        ...etatApresEffets.citeCaravane,
        formation: {
          ...etatApresEffets.citeCaravane.formation,
          plateformes: [
            ...etatApresEffets.citeCaravane.formation.plateformes,
            IDENTIFIANT_DE_PLATEFORME_REGIONALE,
          ],
        },
      },
      infrastructure: scellerTransformation
        ? ajouterPlateformeRegionale(
            etatApresEffets.infrastructure,
            etatApresEffets.hautPuits.projetRegional!.id,
            etat.tempsDuConvoi.secondes,
          )
        : ajouterPlateformeRegionaleOrdinaire(
            etatApresEffets.infrastructure,
          ),
      hautPuits: scellerTransformation
        ? {
            ...etatApresEffets.hautPuits,
            projetRegional: {
              ...etatApresEffets.hautPuits.projetRegional!,
              statut: "scelle",
              scelleA: etat.tempsDuConvoi.secondes,
              coutMateriaux: 12,
            },
          }
        : etatApresEffets.hautPuits,
    };
  }
  const evenementsDeHautPuits: readonly EvenementDeHautPuits[] =
    evenement.id === "bassins.haut-puits.pacte-des-citernes"
      ? (() => {
          const decision =
            choix.id === "ouvrir-citerne"
              ? ("partager-eau" as const)
              : ("proteger-reserves" as const);
          if (
            etatApresEffets.hautPuits.colonie.devenir !==
            "negociation-ouverte"
          ) {
            const devenirAttendu =
              decision === "partager-eau"
                ? "partage-organise"
                : "reserves-protegees";
            if (
              etatApresEffets.hautPuits.colonie.devenir !== devenirAttendu
            ) {
              throw new Error(
                "Le choix narratif contredit la négociation déjà tranchée à Haut-Puits.",
              );
            }
            return [];
          }
          const transition = appliquerCommandeAHautPuits(
            etatApresEffets.hautPuits,
            etat.pilotage.economie.stocks,
            {
              type: "haut-puits.negociation.decider",
              decision,
            },
            etatApresEffets.tempsDuConvoi.secondes,
          );
          etatApresDecision = {
            ...etatApresEffets,
            hautPuits: transition.etat,
          };
          return transition.evenements;
        })()
      : [];
  const effetsDeFait = decrireEffetsDeFait(effetsApplicables);
  if (
    evenement.id === "bassins.deversoir.le-passage-sans-retour"
  ) {
    etatApresDecision = {
      ...etatApresDecision,
      devenirsDesSites: calculerDevenirsDesSitesDesBassins({
        routes: etatApresDecision.routes,
        veilleBasse: etatApresDecision.veilleBasse,
        faits: etatApresDecision.narration.faitsDeCampagne.map(
          (fait) => fait.id,
        ),
      }),
    };
  }
  if (
    evenement.id === "trame.aiguillage-zero.le-passage-de-la-couronne"
  ) {
    etatApresDecision = {
      ...etatApresDecision,
      devenirsDesSites: {
        ...(etatApresDecision.devenirsDesSites ??
          calculerDevenirsDesSitesDesBassins({
            routes: etatApresDecision.routes,
            veilleBasse: etatApresDecision.veilleBasse,
            faits: etatApresDecision.narration.faitsDeCampagne.map(
              (fait) => fait.id,
            ),
          })),
        trameDeFer: calculerDevenirsDesSitesDeLaTrame({
          routes: etatApresDecision.routes,
          faits: etatApresDecision.narration.faitsDeCampagne.map(
            (fait) => fait.id,
          ),
        }),
      },
    };
  }
  const faitsProduits = choix.faitsProduits.map((fait) => ({
    id: fait.id,
    cause: evenement.id,
    acteurs: evenement.acteurs,
    cible: fait.cible,
    moment: etat.tempsDuConvoi.secondes,
    effets: effetsDeFait,
  }));

  return {
    etat: {
      ...etatApresDecision,
      narration: {
        ...etatApresDecision.narration,
        evenementActif: null,
        evenementsJoues: [...etat.narration.evenementsJoues, evenement.id],
        faitsDeCampagne: [...etat.narration.faitsDeCampagne, ...faitsProduits],
      },
    },
    evenements: [
      {
        type: "evenement-narratif.choix-resolu",
        evenementId: evenement.id,
        choixId: choix.id,
        effets: effetsApplicables,
        faitsProduits: faitsProduits.map((fait) => fait.id),
      },
      ...evenementsDeHautPuits,
    ],
  };
}

export function appliquerCommande(
  etat: EtatCampagne,
  commande: CommandeCampagne,
  options: {
    readonly coutsDesNacelles?: "historiques-v6";
  } = {},
): TransitionDeCampagne {
  const checkpointDeCriseRequis = criseAttendSonCheckpoint(
    etat.crises,
    etat.tempsDuConvoi.secondes,
  );
  if (
    (etat.crises.criseActive !== null && commande.type !== "crise.resoudre") ||
    (checkpointDeCriseRequis && commande.type !== "crise.declencher")
  ) {
    throw new Error(
      "La Crise doit être résolue avant de donner un autre ordre au convoi.",
    );
  }

  if (commande.type === "temps-du-convoi.ecouler") {
    if (
      !Number.isInteger(commande.secondesReelles) ||
      commande.secondesReelles < 0
    ) {
      throw new Error(
        "Le Temps du convoi exige une durée entière positive ou nulle.",
      );
    }

    const secondesDemandees =
      etat.tempsDuConvoi.secondes +
      commande.secondesReelles * etat.tempsDuConvoi.vitesse;
    const secondeDeCrise = prochaineSecondeDeCrise(
      etat.crises,
      secondesDemandees,
    );
    const nouvellesSecondes = secondeDeCrise ?? secondesDemandees;
    const evenements: EvenementDeDomaine[] = [];

    if (nouvellesSecondes !== etat.tempsDuConvoi.secondes) {
      evenements.push({
        type: "temps-du-convoi.ecoule",
        secondeInitiale: etat.tempsDuConvoi.secondes,
        secondeFinale: nouvellesSecondes,
      });
    }

    let nouvelEtat: EtatCampagne = {
      ...etat,
      tempsDuConvoi: {
        ...etat.tempsDuConvoi,
        secondes: nouvellesSecondes,
      },
    };

    const premiereMinuteAtteinte =
      etat.tempsDuConvoi.secondes < 60 && nouvellesSecondes >= 60;
    const premiereLimiteDEcheance = premiereMinuteAtteinte
      ? 60
      : nouvellesSecondes;
    const premieresEcheances = traiterPilotageEtChantier(
      nouvelEtat,
      etat.tempsDuConvoi.secondes,
      premiereLimiteDEcheance,
    );
    nouvelEtat = premieresEcheances.etat;
    evenements.push(...premieresEcheances.evenements);

    if (premiereMinuteAtteinte) {
      evenements.push({
        type: "temps-du-convoi.premiere-minute-atteinte",
        secondeAtteinte: 60,
      });
      const declenchement = declencherEvenement(
        nouvelEtat,
        "premiere-minute-atteinte",
      );
      if (declenchement !== undefined) {
        nouvelEtat = declenchement.etat;
        evenements.push(...declenchement.evenements);
      }
    }

    if (premiereLimiteDEcheance < nouvellesSecondes) {
      const echeancesRestantes = traiterPilotageEtChantier(
        nouvelEtat,
        premiereLimiteDEcheance,
        nouvellesSecondes,
      );
      nouvelEtat = echeancesRestantes.etat;
      evenements.push(...echeancesRestantes.evenements);
    }

    const veilleBasse = traiterEcheancesDeVeilleBasse(
      nouvelEtat.veilleBasse,
      etat.tempsDuConvoi.secondes,
      nouvellesSecondes,
    );
    nouvelEtat = {
      ...nouvelEtat,
      veilleBasse: veilleBasse.etat,
      citeCaravane: veilleBasse.evenements.some(
        (evenement) =>
          evenement.type === "cohorte.integration-terminee",
      )
        ? {
            ...nouvelEtat.citeCaravane,
            habitants:
              nouvelEtat.citeCaravane.habitants +
              veilleBasse.etat.cohorte.taille,
          }
        : nouvelEtat.citeCaravane,
    };
    evenements.push(...veilleBasse.evenements);

    const jalonsDeRoute = traiterJalonsDeRoute(
      nouvelEtat.routes,
      etat.tempsDuConvoi.secondes,
      nouvellesSecondes,
    );
    nouvelEtat = { ...nouvelEtat, routes: jalonsDeRoute.etat };
    evenements.push(...jalonsDeRoute.evenements);

    if (
      nouvelEtat.narration.evenementActif === null &&
      interventionDeVeilleBasseEstPrete(nouvelEtat.veilleBasse) &&
      !nouvelEtat.narration.evenementsJoues.includes(
        "veille-basse.la-porte-des-filtres",
      )
    ) {
      const evenementOuvrantLIntervention =
        veilleBasse.evenements.find(
          (evenement) =>
            evenement.type === "cohorte.integration-terminee" ||
            (evenement.type === "consequence-differee.manifestee" &&
              (evenement.consequenceId ===
                "veille-basse.cohorte-refusee-revient-aux-portes" ||
                evenement.consequenceId ===
                  "veille-basse.hospice-accueille-la-cohorte")),
        );
      nouvelEtat = {
        ...nouvelEtat,
        veilleBasse: preparerInterventionPourVeilleBasse(
          nouvelEtat.veilleBasse,
          evenementOuvrantLIntervention?.moment ?? nouvellesSecondes,
        ),
      };
    }

    const suiteNarrative =
      declencherSuiteNarrativeDeLaDemonstration(nouvelEtat);
    if (suiteNarrative !== undefined) {
      nouvelEtat = suiteNarrative.etat;
      evenements.push(...suiteNarrative.evenements);
    }

    const alerteDeCrise = nouvelEtat.crises.alerte;
    if (secondeDeCrise !== undefined && alerteDeCrise !== null) {
      nouvelEtat = {
        ...nouvelEtat,
        tempsDuConvoi: { ...nouvelEtat.tempsDuConvoi, vitesse: 0 },
      };
      evenements.push({
        type: "crise.checkpoint-requis",
        criseId: alerteDeCrise.id,
        cause: alerteDeCrise.cause,
        moment: secondeDeCrise,
        sauvegardeAtomiqueRequise: true,
      });
      if (etat.tempsDuConvoi.vitesse !== 0) {
        evenements.push({
          type: "temps-du-convoi.vitesse-modifiee",
          vitessePrecedente: etat.tempsDuConvoi.vitesse,
          vitesse: 0,
        });
      }
    }

    return { etat: nouvelEtat, evenements };
  }

  if (commande.type === "evenement-narratif.choisir") {
    return choisirDansEvenement(etat, commande);
  }

  if (commande.type === "halte.deployer") {
    if (etat.tempsDuConvoi.vitesse !== 0) {
      throw new Error(
        "Il faut suspendre le Temps du convoi avant de déployer la Halte.",
      );
    }
    if (etat.infrastructure.deploiement === "halte") {
      return { etat, evenements: [] };
    }
    if (trouverEngagementDeRouteActif(etat.routes) !== undefined) {
      throw new Error(
        "La Halte ne peut pas être déployée pendant une traversée en cours.",
      );
    }
    return {
      etat: {
        ...etat,
        infrastructure: { ...etat.infrastructure, deploiement: "halte" },
      },
      evenements: [
        {
          type: "halte.deployee",
          moment: etat.tempsDuConvoi.secondes,
        },
      ],
    };
  }

  if (commande.type === "halte.replier") {
    if (etat.tempsDuConvoi.vitesse !== 0) {
      throw new Error(
        "Il faut suspendre le Temps du convoi avant de replier la Halte.",
      );
    }
    if (etat.infrastructure.chantierActif !== null) {
      throw new Error(
        "Le Déploiement de halte reste requis par le Chantier actif.",
      );
    }
    if (etat.infrastructure.deploiement === "voyage") {
      return { etat, evenements: [] };
    }
    return {
      etat: {
        ...etat,
        infrastructure: { ...etat.infrastructure, deploiement: "voyage" },
      },
      evenements: [
        {
          type: "halte.repliee",
          moment: etat.tempsDuConvoi.secondes,
        },
      ],
    };
  }

  if (commande.type === "chantier.engager") {
    const engagement = engagerChantier(
      etat.infrastructure,
      etat.pilotage,
      commande.ordre,
      commande.priorite,
      etat.tempsDuConvoi.secondes,
    );
    return {
      etat: { ...etat, infrastructure: engagement.etat },
      evenements: [engagement.evenement],
    };
  }

  if (commande.type === "doctrine.regler") {
    const transition = engagerTransitionDeDoctrine(
      etat.pilotage,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    return {
      etat: { ...etat, pilotage: transition.etat },
      evenements: transition.evenements,
    };
  }

  if (commande.type === "incident.ordonner") {
    const transition = ordonnerResolutionDIncident(
      etat.pilotage,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    const etatAvecFaits = enregistrerFaitsDeCampagne(
        { ...etat, pilotage: transition.etat },
        transition.faitsProduits,
      );
    const annonce = annoncerCriseApresFaits(
      etatAvecFaits.crises,
      transition.faitsProduits,
    );
    return {
      etat: { ...etatAvecFaits, crises: annonce.etat },
      evenements: [...transition.evenements, ...annonce.evenements],
    };
  }

  if (commande.type === "crise.declencher") {
    if (
      commande.criseId !== etat.crises.alerte?.id ||
      !checkpointDeCriseRequis ||
      etat.tempsDuConvoi.vitesse !== 0
    ) {
      throw new Error(
        `La Crise « ${commande.criseId} » n’attend pas de checkpoint.`,
      );
    }
    const crise = declencherCrise(
      etat.crises,
      etat.pilotage.economie.stocks.eau.quantite,
      etat.tempsDuConvoi.secondes,
    );
    if (crise === undefined) {
      throw new Error(`La Crise « ${commande.criseId} » ne peut pas débuter.`);
    }
    const eau = etat.pilotage.economie.stocks.eau;
    const etatEnCrise = enregistrerFaitsDeCampagne(
      {
        ...etat,
        crises: crise.etat,
        pilotage: {
          ...etat.pilotage,
          economie: {
            ...etat.pilotage.economie,
            stocks: {
              ...etat.pilotage.economie.stocks,
              eau: appliquerVariationAUnStock(eau, crise.variationDEau),
            },
          },
        },
      },
      [crise.fait],
    );
    return { etat: etatEnCrise, evenements: [crise.evenement] };
  }

  if (commande.type === "crise.resoudre") {
    const resolution = resoudreCriseActive(
      etat.crises,
      etat.pilotage,
      etat.citeCaravane.habitants,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    let stocks = etat.pilotage.economie.stocks;
    if (resolution.variationDeStock !== undefined) {
      const { stock, variation } = resolution.variationDeStock;
      stocks = {
        ...stocks,
        [stock]: appliquerVariationAUnStock(stocks[stock], variation),
      };
    }
    const etatResolu = enregistrerFaitsDeCampagne(
      {
        ...etat,
        citeCaravane: {
          ...etat.citeCaravane,
          habitants:
            etat.citeCaravane.habitants + resolution.variationDHabitants,
        },
        pilotage: {
          ...etat.pilotage,
          economie: { ...etat.pilotage.economie, stocks },
        },
        crises: resolution.etat,
      },
      [resolution.fait],
    );
    return { etat: etatResolu, evenements: [resolution.evenement] };
  }

  if (commande.type === "compagnon.affecter") {
    const transition = affecterCompagnon(
      etat.narration.faitsDeCampagne,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    return {
      etat: enregistrerFaitsDeCampagne(etat, [transition.faitProduit]),
      evenements: [transition.evenement],
    };
  }

  if (commande.type === "expedition.lancer") {
    const transition = lancerExpedition(
      etat.expeditions,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    verifierStocksPourMouvementsDExpedition(
      etat,
      transition.mouvementsDeStocks,
    );
    const etatApresLancement = appliquerMouvementsDeStocksDExpedition(
      { ...etat, expeditions: transition.etat },
      transition.mouvementsDeStocks,
    );
    return {
      etat: enregistrerNouveauxRapportsDExpedition(
        etat,
        etatApresLancement,
      ),
      evenements: transition.evenements,
    };
  }

  if (commande.type === "expedition.ordonner") {
    const transition = ordonnerExpedition(
      etat.expeditions,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    const etatApresOrdre = { ...etat, expeditions: transition.etat };
    return {
      etat: enregistrerNouveauxRapportsDExpedition(etat, etatApresOrdre),
      evenements: transition.evenements,
    };
  }

  if (commande.type === "conseil.decider") {
    const transition = deciderAuConseil(
      etat.narration.faitsDeCampagne,
      etat.routes.position,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    const etatAvecFait = enregistrerFaitsDeCampagne(etat, [
      transition.faitProduit,
    ]);
    const etatApresDecisionRegionale =
      commande.conseilId !== "conseil.des-vannes"
        ? etatAvecFait
        : commande.decisionId === "reparer-decanteur"
            ? {
                ...etatAvecFait,
                hautPuits: {
                  ...etatAvecFait.hautPuits,
                  projetChoisi: "decanteur-itinerant" as const,
                  projetRegional: {
                    id: "decanteur-itinerant" as const,
                    statut: "retenu" as const,
                    retenuA: etat.tempsDuConvoi.secondes,
                    scelleA: null,
                    coutMateriaux: 0 as const,
                  },
                },
              }
            : commande.decisionId === "reorienter-cohorte"
              ? {
                  ...etatAvecFait,
                  hautPuits: {
                    ...etatAvecFait.hautPuits,
                    projetChoisi: "arche-des-deplaces" as const,
                    projetRegional: {
                      id: "arche-des-deplaces" as const,
                      statut: "retenu" as const,
                      retenuA: etat.tempsDuConvoi.secondes,
                      scelleA: null,
                      coutMateriaux: 0 as const,
                    },
                  },
                  veilleBasse: {
                    ...etatAvecFait.veilleBasse,
                    cohorte: {
                      ...etatAvecFait.veilleBasse.cohorte,
                      orientationRegionale:
                        "arche-des-deplaces" as const,
                    },
                  },
                }
              : etatAvecFait;
    return {
      etat: etatApresDecisionRegionale,
      evenements: [transition.evenement],
    };
  }

  if (commande.type === "engagement-de-route.confirmer") {
    if (
      etat.infrastructure.deploiement === "halte" ||
      etat.infrastructure.chantierActif !== null
    ) {
      throw new Error(
        "La Halte doit être repliée et tout Chantier terminé avant une traversée.",
      );
    }
    if (
      options.coutsDesNacelles !== "historiques-v6" &&
      !routeAvalDesBassinsEstPreparee(
        commande.tronconId,
        etat.narration.evenementActif,
        etat.narration.faitsDeCampagne.map((fait) => fait.id),
      )
    ) {
      throw new Error(
        "Le récit de la branche doit être résolu avant cet Engagement irréversible.",
      );
    }
    const offreDesNacelles =
      options.coutsDesNacelles === "historiques-v6"
        ? null
        : calculerOffreDesNacelles({
            position: etat.routes.position,
            hautPuits: etat.hautPuits,
            veilleBasse: etat.veilleBasse,
            faits: etat.narration.faitsDeCampagne.map((fait) => fait.id),
          });
    const consommationsDesNacelles =
      offreDesNacelles?.tronconId === commande.tronconId
        ? offreDesNacelles.consommations
        : undefined;
    const transition = confirmerEngagementDeRoute(
      etat.routes,
      commande.tronconId,
      etat.tempsDuConvoi.secondes,
      consommationsDesNacelles,
    );
    const routesApresEngagement =
      consommationsDesNacelles === undefined
        ? transition.etat
        : {
            ...transition.etat,
            etatsReels: {
              ...transition.etat.etatsReels,
              "nacelles-de-veille-basse":
                transition.etat.etatsReels[
                  "nacelles-de-veille-basse"
                ] ?? "degrade",
            },
          };
    const troncon = trouverTronconDeRoute(commande.tronconId);
    const stocks = etat.pilotage.economie.stocks;
    return {
      etat: {
        ...etat,
        routes: routesApresEngagement,
        pilotage: {
          ...etat.pilotage,
          economie: {
            ...etat.pilotage.economie,
            stocks: {
              ...stocks,
              combustible: appliquerConsommationDeRouteAUnStock(
                "combustible",
                stocks.combustible,
                troncon,
                consommationsDesNacelles,
              ),
              eau: appliquerConsommationDeRouteAUnStock(
                "eau",
                stocks.eau,
                troncon,
                consommationsDesNacelles,
              ),
            },
          },
        },
        tempsDuConvoi: {
          ...etat.tempsDuConvoi,
          vitesse: 0,
        },
      },
      evenements: [
        ...transition.evenements,
        ...(etat.tempsDuConvoi.vitesse === 0
          ? []
          : [
              {
                type: "temps-du-convoi.vitesse-modifiee" as const,
                vitessePrecedente: etat.tempsDuConvoi.vitesse,
                vitesse: 0 as const,
              },
            ]),
      ],
    };
  }

  if (commande.type === "haut-puits.marche.echanger") {
    if (
      etat.routes.position !== "haut-puits" ||
      trouverEngagementDeRouteActif(etat.routes) !== undefined
    ) {
      throw new Error(
        "Le convoi doit être présent à Haut-Puits pour négocier.",
      );
    }
    const transition = appliquerCommandeAHautPuits(
      etat.hautPuits,
      etat.pilotage.economie.stocks,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    return {
      etat: {
        ...etat,
        hautPuits: transition.etat,
        pilotage: {
          ...etat.pilotage,
          economie: {
            ...etat.pilotage.economie,
            stocks: transition.stocks,
          },
        },
      },
      evenements: transition.evenements,
    };
  }

  return {
    etat: {
      ...etat,
      tempsDuConvoi: {
        ...etat.tempsDuConvoi,
        vitesse: commande.vitesse,
      },
    },
    evenements: [
      {
        type: "temps-du-convoi.vitesse-modifiee",
        vitessePrecedente: etat.tempsDuConvoi.vitesse,
        vitesse: commande.vitesse,
      },
    ],
  };
}

function serialiserCanonicalement(valeur: unknown): string {
  if (Array.isArray(valeur)) {
    return `[${valeur.map(serialiserCanonicalement).join(",")}]`;
  }

  if (valeur !== null && typeof valeur === "object") {
    const objet = valeur as Record<string, unknown>;
    const membres = Object.keys(objet)
      .sort()
      .map(
        (cle) =>
          `${JSON.stringify(cle)}:${serialiserCanonicalement(objet[cle])}`,
      );

    return `{${membres.join(",")}}`;
  }

  return JSON.stringify(valeur);
}

export function empreinteEtat(etat: EtatCampagne): string {
  return formaterEmpreinteFnv1a32V1(serialiserCanonicalement(etat));
}
