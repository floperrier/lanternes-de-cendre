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
  VERSION_SIMULATION_COURANTE,
  VERSION_SIMULATION_INITIALE,
} from "../simulation/versions";
import {
  creerPilotageInitial,
  IDENTIFIANTS_DE_CAPACITE,
  IDENTIFIANTS_DE_POLITIQUE,
  IDENTIFIANTS_DE_STOCK,
  INCIDENT_INITIAL,
  POSITIONS_DE_DOCTRINE,
  type EtatPilotage,
} from "../simulation/pilotage";
import {
  catalogueDEvenements,
  trouverEvenement,
} from "../content/catalogue";
import { IDENTIFIANTS_DE_FAITS_D_INCIDENT } from "../simulation/faits";
import { rejouerReproduction } from "./replay";
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

const EMPREINTE = /^[0-9a-f]{8}$/;
const VITESSES = new Set<number>(VITESSES_DU_CONVOI);
const PILOTAGE_INITIAL = creerPilotageInitial();
const ORDRES_D_INCIDENT = new Set(["securiser-pompe", "maintenir-debit"]);
const IDENTIFIANTS_DE_FAITS_DU_CATALOGUE = new Set(
  catalogueDEvenements.evenements.flatMap((evenement) =>
    evenement.choix.flatMap((choix) =>
      choix.faitsProduits.map((fait) => fait.id),
    ),
  ),
);
const IDENTIFIANTS_DE_FAITS_CONNUS = new Set([
  ...IDENTIFIANTS_DE_FAITS_DU_CATALOGUE,
  ...IDENTIFIANTS_DE_FAITS_D_INCIDENT,
]);
const DEFINITIONS_DE_FAITS_DU_CATALOGUE = new Map(
  catalogueDEvenements.evenements.flatMap((evenement) =>
    evenement.choix.flatMap((choix) =>
      choix.faitsProduits.map((fait) => [
        fait.id,
        {
          cause: evenement.id,
          acteurs: evenement.acteurs,
          cible: fait.cible,
          effets: choix.effets,
        },
      ] as const),
    ),
  ),
);

export type ObjetInconnu = Record<string, unknown>;

export interface EtatCampagneV1 {
  readonly version: typeof VERSION_SIMULATION_INITIALE;
  readonly graine: GraineDeCampagne;
  readonly tempsDuConvoi: EtatCampagne["tempsDuConvoi"];
  readonly citeCaravane: EtatCampagne["citeCaravane"];
  readonly narration: EtatCampagne["narration"];
}

export function estObjet(valeur: unknown): valeur is ObjetInconnu {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
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
  return Array.isArray(valeur) && valeur.every((item) => typeof item === "string");
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

export function estCommande(valeur: unknown): valeur is CommandeCampagne {
  if (estCommandeV1(valeur)) {
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
  const definition = DEFINITIONS_DE_FAITS_DU_CATALOGUE.get(String(valeur.id));
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
      ["securisee", "stabilisee", "degradee"].includes(
        String(valeur.etat),
      )
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
): boolean {
  return (
    estObjet(valeur) &&
    valeur.type === "stock.modifie" &&
    valeur.stock === "materiaux" &&
    valeur.variation === variation
  );
}

function estEffetInstallation(
  valeur: unknown,
  etat: string,
): boolean {
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
  return (
    estObjet(valeur) &&
    valeur.type === type &&
    valeur[champ] === nombre
  );
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

function estFaitDeCampagneV2(valeur: unknown): boolean {
  if (!estFaitDeCampagne(valeur) || !estObjet(valeur)) {
    return false;
  }
  const effets = valeur.effets;
  if (
    !IDENTIFIANTS_DE_FAITS_CONNUS.has(String(valeur.id)) ||
    !estObjet(effets) ||
    !Array.isArray(effets.materiels) ||
    !effets.materiels.every(estEffetMaterielDeFait) ||
    !Array.isArray(effets.humains) ||
    !effets.humains.every(estEffetHumainDeFait)
  ) {
    return false;
  }

  const materiels = effets.materiels;
  const humains = effets.humains;
  const acteurs = valeur.acteurs as string[];
  const definitionDuCatalogue = DEFINITIONS_DE_FAITS_DU_CATALOGUE.get(
    String(valeur.id),
  );
  if (definitionDuCatalogue !== undefined) {
    return (
      valeur.cause === definitionDuCatalogue.cause &&
      memesChaines(acteurs, definitionDuCatalogue.acteurs) &&
      valeur.cible === definitionDuCatalogue.cible &&
      materiels.length === 0 &&
      humains.length === definitionDuCatalogue.effets.length &&
      definitionDuCatalogue.effets.every((effet, index) =>
        estEffetHumain(
          humains[index],
          "habitants.modifies",
          "variation",
          effet.valeur,
        ),
      )
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
      materiels.some((effet) =>
        estEffetInstallation(effet, "securisee"),
      ) &&
      estEffetHumain(humains[0], "habitants.exposes", "nombre", 0)
    );
  }
  if (valeur.id === IDENTIFIANTS_DE_FAITS_D_INCIDENT[1]) {
    return (
      materiels.length === 2 &&
      materiels.some((effet) => estEffetStock(effet, -2)) &&
      materiels.some((effet) =>
        estEffetInstallation(effet, "stabilisee"),
      ) &&
      estEffetHumain(humains[0], "habitants.exposes", "nombre", 0)
    );
  }
  return (
    valeur.id === IDENTIFIANTS_DE_FAITS_D_INCIDENT[2] &&
    materiels.length === 1 &&
    estEffetInstallation(materiels[0], "degradee") &&
    estEffetHumain(
      humains[0],
      "habitants.sous-surveillance",
      "nombre",
      2,
    )
  );
}

function calculerStockAttendu(
  id: (typeof IDENTIFIANTS_DE_STOCK)[number],
  secondesFinales: number,
  faits: readonly ObjetInconnu[],
): { readonly quantite: number; readonly reliquatDeFlux: number } {
  const initial = PILOTAGE_INITIAL.economie.stocks[id];
  let quantite = initial.quantite;
  let reliquatDeFlux = initial.reliquatDeFlux;
  let secondeCourante = 0;
  const appliquerFlux = (secondes: number) => {
    const numerateur = reliquatDeFlux + initial.fluxParHeure * secondes;
    const variation = Math.trunc(numerateur / 3_600);
    quantite = Math.max(0, quantite + variation);
    reliquatDeFlux =
      quantite === 0 ? 0 : numerateur - variation * 3_600;
  };

  for (const fait of faits) {
    const moment = fait.moment as number;
    appliquerFlux(moment - secondeCourante);
    secondeCourante = moment;
    const effets = fait.effets as ObjetInconnu;
    for (const effet of effets.materiels as ObjetInconnu[]) {
      if (effet.type === "stock.modifie" && effet.stock === id) {
        quantite = Math.max(0, quantite + (effet.variation as number));
      }
    }
  }
  appliquerFlux(secondesFinales - secondeCourante);
  return { quantite, reliquatDeFlux };
}

function estEtatPilotage(
  valeur: unknown,
  secondesCourantes: number,
  faits: readonly ObjetInconnu[],
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

  for (const id of IDENTIFIANTS_DE_STOCK) {
    const stock = economie.stocks[id];
    const attendu = PILOTAGE_INITIAL.economie.stocks[id];
    if (
      !estObjet(stock) ||
      !estNombreFini(stock.quantite) ||
      stock.quantite < 0 ||
      stock.unite !== attendu.unite ||
      stock.fluxParHeure !== attendu.fluxParHeure ||
      !estNombreFini(stock.reliquatDeFlux)
    ) {
      return false;
    }
    const calcule = calculerStockAttendu(id, secondesCourantes, faits);
    if (
      stock.quantite !== calcule.quantite ||
      stock.reliquatDeFlux !== calcule.reliquatDeFlux
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
      capacite.demande !== attendue.demande ||
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
      PILOTAGE_INITIAL.economie.entretien.equipesMobilisees ||
    entretien.materiauxParHeure !==
      PILOTAGE_INITIAL.economie.entretien.materiauxParHeure ||
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
    incident.incertitude.releveeA ===
      INCIDENT_INITIAL.incertitude.releveeA &&
    incident.incertitude.observation ===
      INCIDENT_INITIAL.incertitude.observation
  );
}

function estCausaliteDeNarrationValide(
  parties: Omit<EtatCampagneV1, "version">,
  pilotage: EtatPilotage,
): boolean {
  const narration = parties.narration;
  const faits = narration.faitsDeCampagne;
  const evenementsJoues = narration.evenementsJoues;
  if (
    new Set(evenementsJoues).size !== evenementsJoues.length ||
    (narration.evenementActif !== null &&
      (evenementsJoues.includes(narration.evenementActif) ||
        parties.tempsDuConvoi.secondes <
          trouverEvenement(narration.evenementActif)!.periodeEligibilite
            .debut))
  ) {
    return false;
  }

  let habitantsAttendus = 184;
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
    if (
      faitsDeLEvenement.some(
        (fait) => fait.moment < evenement.periodeEligibilite.debut,
      ) ||
      (estJoue && choixCorrespondants.length !== 1) ||
      (!estJoue && faitsDeLEvenement.length !== 0)
    ) {
      return false;
    }
    if (estJoue) {
      habitantsAttendus += choixCorrespondants[0]!.effets.reduce(
        (total, effet) => total + effet.valeur,
        0,
      );
    }
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
    nombreDeFaitsDIncident === (pilotage.incidentActif === null ? 1 : 0) &&
    resolutionDIncidentEstPossible
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
): Omit<EtatCampagneV1, "version"> | undefined {
  const temps = valeur.tempsDuConvoi;
  const cite = valeur.citeCaravane;
  const narration = valeur.narration;

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
    !memesChaines(
      cite.formation.plateformes,
      IDENTIFIANTS_PLATEFORMES_MOBILES,
    ) ||
    !estObjet(narration) ||
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
        plateformes:
          cite.formation.plateformes as IdentifiantPlateformeMobile[],
      },
    },
    narration: {
      evenementActif: narration.evenementActif,
      evenementsJoues: narration.evenementsJoues,
      faitsDeCampagne: narration.faitsDeCampagne,
    },
  } as Omit<EtatCampagneV1, "version">;
}

export function lireEtatV1(valeur: unknown): EtatCampagneV1 | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_INITIALE
  ) {
    return undefined;
  }
  const parties = lirePartiesCommunesDEtat(valeur, estFaitDeCampagne);
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

export function lireEtatV2(valeur: unknown): EtatCampagne | undefined {
  if (
    !estObjet(valeur) ||
    valeur.version !== VERSION_SIMULATION_COURANTE
  ) {
    return undefined;
  }
  const parties = lirePartiesCommunesDEtat(valeur, estFaitDeCampagneV2);
  const flux = valeur.fluxPseudoAleatoires;
  const narration = valeur.narration;
  const pilotage = valeur.pilotage;

  if (
    parties === undefined ||
    !estObjet(narration) ||
    !faitsSontChronologiques(
      narration.faitsDeCampagne,
      parties.tempsDuConvoi.secondes,
    ) ||
    !estEtatPilotage(
      pilotage,
      parties.tempsDuConvoi.secondes,
      narration.faitsDeCampagne,
    ) ||
    !estCausaliteDeNarrationValide(parties, pilotage) ||
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
    flux["evenements-narratifs"].version !==
      VERSION_ALEATOIRE_COURANTE ||
    !Array.isArray(flux["evenements-narratifs"].etat) ||
    flux["evenements-narratifs"].etat.length !== 4 ||
    !flux["evenements-narratifs"].etat.every(estEntierNonSigne) ||
    !flux["evenements-narratifs"].etat.some((mot) => mot !== 0)
  ) {
    return undefined;
  }

  return valeur as unknown as EtatCampagne;
}

function lireReproductionV2(
  valeur: unknown,
): ReproductionDeCampagne | undefined {
  if (
    !estObjet(valeur) ||
    !EMPREINTE.test(String(valeur.empreinteSnapshot)) ||
    !Array.isArray(valeur.commandes)
  ) {
    return undefined;
  }
  const snapshot = lireEtatV2(valeur.snapshot);
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

export function lireSauvegardeV2(
  valeur: unknown,
): SauvegardeCampagne | undefined {
  if (
    !estObjet(valeur) ||
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_COURANTE ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !==
      VERSIONS_DU_SNAPSHOT_COURANT.simulation ||
    valeur.versions.contenu !== VERSIONS_DU_SNAPSHOT_COURANT.contenu ||
    valeur.versions.aleatoire !== VERSIONS_DU_SNAPSHOT_COURANT.aleatoire ||
    valeur.versions.empreinte !==
      VERSIONS_DU_SNAPSHOT_COURANT.empreinte ||
    typeof valeur.graine !== "string" ||
    !estObjet(valeur.horloge) ||
    !estNombreFini(valeur.horloge.secondes) ||
    typeof valeur.empreinte !== "string" ||
    !EMPREINTE.test(valeur.empreinte)
  ) {
    return undefined;
  }

  const etat = lireEtatV2(valeur.etat);
  const reproduction = lireReproductionV2(valeur.reproduction);
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
  if (
    replay.statut !== "termine" ||
    replay.empreinte !== valeur.empreinte
  ) {
    return undefined;
  }

  return valeur as unknown as SauvegardeCampagne;
}
