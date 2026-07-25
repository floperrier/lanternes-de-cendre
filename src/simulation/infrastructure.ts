import {
  appliquerVariationAUnStock,
  type EtatPilotage,
  type IdentifiantDeStock,
} from "./pilotage";

export const IDENTIFIANTS_DE_QUARTIER = [
  "intendance",
  "foyers",
  "machines",
  "atelier-operations",
] as const;

export const IDENTIFIANTS_DE_PLATEFORME_INITIALE = [
  "phare",
  ...IDENTIFIANTS_DE_QUARTIER,
] as const;

export type IdentifiantDeQuartier = (typeof IDENTIFIANTS_DE_QUARTIER)[number];
export type IdentifiantDePlateformeInitiale =
  (typeof IDENTIFIANTS_DE_PLATEFORME_INITIALE)[number];
export const IDENTIFIANT_DE_PLATEFORME_REGIONALE =
  "chassis-regional-des-bassins" as const;
export type IdentifiantDePlateformeMobile =
  | IdentifiantDePlateformeInitiale
  | typeof IDENTIFIANT_DE_PLATEFORME_REGIONALE;
export type CategorieDEmplacement = "technique" | "habitable" | "polyvalent";
export type EtatMateriel = "operationnelle" | "degradee" | "hors-service";
export type PrioriteDeChantier = "basse" | "normale" | "haute";

export const IDENTIFIANTS_D_INSTALLATION = [
  "cuisine-conserverie",
  "station-filtration",
  "dortoirs-etanches",
  "infirmerie-filtree",
  "chaudiere-commune",
  "groupe-traction",
  "atelier-bord",
  "poste-operations",
  "condenseur-thermique",
] as const;

const INSTALLATIONS_VITALES = new Set<IdentifiantDInstallation>([
  "cuisine-conserverie",
  "station-filtration",
  "infirmerie-filtree",
  "chaudiere-commune",
  "atelier-bord",
]);

export function installationEstVitale(
  definitionId: IdentifiantDInstallation,
): boolean {
  return INSTALLATIONS_VITALES.has(definitionId);
}

export type IdentifiantDInstallation =
  (typeof IDENTIFIANTS_D_INSTALLATION)[number];

type ClasseDeCharge = "faible" | "normale" | "forte";
type ClasseDEntretien = "faible" | "normal" | "fort";

export interface EffetsEconomiquesDInstallation {
  readonly fluxDeStocks: Readonly<Partial<Record<IdentifiantDeStock, number>>>;
  readonly demandeDeChaleur: number;
  readonly demandeDeMainDOeuvre: number;
  readonly demandeDeCharge: number;
  readonly equipesDEntretien: number;
  readonly materiauxDEntretienParHeure: number;
}

export interface DefinitionDInstallation {
  readonly id: IdentifiantDInstallation;
  readonly famille:
    | "subsistance"
    | "hydraulique"
    | "thermique"
    | "traction"
    | "atelier"
    | "sante"
    | "habitat"
    | "operations";
  readonly categoriesCompatibles: readonly Exclude<
    CategorieDEmplacement,
    "polyvalent"
  >[];
  readonly postesRequis: number;
  readonly effetThermique: number;
  readonly charge: ClasseDeCharge;
  readonly entretien: ClasseDEntretien;
  readonly coutMateriaux: number;
  readonly effetsEconomiques: EffetsEconomiquesDInstallation;
}

function definirInstallation(
  definition: DefinitionDInstallation,
): DefinitionDInstallation {
  return definition;
}

export const CATALOGUE_D_INSTALLATIONS = {
  "cuisine-conserverie": definirInstallation({
    id: "cuisine-conserverie",
    famille: "subsistance",
    categoriesCompatibles: ["habitable"],
    postesRequis: 2,
    effetThermique: 2,
    charge: "normale",
    entretien: "faible",
    coutMateriaux: 10,
    effetsEconomiques: {
      fluxDeStocks: { vivres: 8 },
      demandeDeChaleur: 2,
      demandeDeMainDOeuvre: 1,
      demandeDeCharge: 2,
      equipesDEntretien: 0,
      materiauxDEntretienParHeure: 0,
    },
  }),
  "station-filtration": definirInstallation({
    id: "station-filtration",
    famille: "hydraulique",
    categoriesCompatibles: ["technique"],
    postesRequis: 1,
    effetThermique: 1,
    charge: "normale",
    entretien: "normal",
    coutMateriaux: 10,
    effetsEconomiques: {
      fluxDeStocks: { eau: 10 },
      demandeDeChaleur: 1,
      demandeDeMainDOeuvre: 1,
      demandeDeCharge: 2,
      equipesDEntretien: 0,
      materiauxDEntretienParHeure: 0,
    },
  }),
  "dortoirs-etanches": definirInstallation({
    id: "dortoirs-etanches",
    famille: "habitat",
    categoriesCompatibles: ["habitable"],
    postesRequis: 0,
    effetThermique: 5,
    charge: "forte",
    entretien: "normal",
    coutMateriaux: 10,
    effetsEconomiques: {
      fluxDeStocks: {},
      demandeDeChaleur: 5,
      demandeDeMainDOeuvre: 0,
      demandeDeCharge: 4,
      equipesDEntretien: 0,
      materiauxDEntretienParHeure: 0,
    },
  }),
  "infirmerie-filtree": definirInstallation({
    id: "infirmerie-filtree",
    famille: "sante",
    categoriesCompatibles: ["habitable"],
    postesRequis: 2,
    effetThermique: 3,
    charge: "normale",
    entretien: "normal",
    coutMateriaux: 12,
    effetsEconomiques: {
      fluxDeStocks: { remedes: -1 },
      demandeDeChaleur: 3,
      demandeDeMainDOeuvre: 1,
      demandeDeCharge: 2,
      equipesDEntretien: 0,
      materiauxDEntretienParHeure: 0,
    },
  }),
  "chaudiere-commune": definirInstallation({
    id: "chaudiere-commune",
    famille: "thermique",
    categoriesCompatibles: ["technique"],
    postesRequis: 1,
    effetThermique: -18,
    charge: "normale",
    entretien: "fort",
    coutMateriaux: 14,
    effetsEconomiques: {
      fluxDeStocks: { combustible: -10 },
      demandeDeChaleur: -18,
      demandeDeMainDOeuvre: 1,
      demandeDeCharge: 2,
      equipesDEntretien: 1,
      materiauxDEntretienParHeure: 1,
    },
  }),
  "groupe-traction": definirInstallation({
    id: "groupe-traction",
    famille: "traction",
    categoriesCompatibles: ["technique"],
    postesRequis: 2,
    effetThermique: 2,
    charge: "forte",
    entretien: "fort",
    coutMateriaux: 16,
    effetsEconomiques: {
      fluxDeStocks: { combustible: -12 },
      demandeDeChaleur: 2,
      demandeDeMainDOeuvre: 2,
      demandeDeCharge: 4,
      equipesDEntretien: 1,
      materiauxDEntretienParHeure: 1,
    },
  }),
  "atelier-bord": definirInstallation({
    id: "atelier-bord",
    famille: "atelier",
    categoriesCompatibles: ["technique"],
    postesRequis: 2,
    effetThermique: 2,
    charge: "normale",
    entretien: "normal",
    coutMateriaux: 12,
    effetsEconomiques: {
      fluxDeStocks: {},
      demandeDeChaleur: 2,
      demandeDeMainDOeuvre: 2,
      demandeDeCharge: 2,
      equipesDEntretien: 0,
      materiauxDEntretienParHeure: 0,
    },
  }),
  "poste-operations": definirInstallation({
    id: "poste-operations",
    famille: "operations",
    categoriesCompatibles: ["habitable"],
    postesRequis: 1,
    effetThermique: 1,
    charge: "faible",
    entretien: "faible",
    coutMateriaux: 8,
    effetsEconomiques: {
      fluxDeStocks: {},
      demandeDeChaleur: 1,
      demandeDeMainDOeuvre: 1,
      demandeDeCharge: 1,
      equipesDEntretien: 0,
      materiauxDEntretienParHeure: 0,
    },
  }),
  "condenseur-thermique": definirInstallation({
    id: "condenseur-thermique",
    famille: "hydraulique",
    categoriesCompatibles: ["technique"],
    postesRequis: 2,
    effetThermique: 4,
    charge: "normale",
    entretien: "fort",
    coutMateriaux: 12,
    effetsEconomiques: {
      fluxDeStocks: { eau: 8, combustible: -2 },
      demandeDeChaleur: 4,
      demandeDeMainDOeuvre: 2,
      demandeDeCharge: 3,
      equipesDEntretien: 1,
      materiauxDEntretienParHeure: 1,
    },
  }),
} as const satisfies Readonly<
  Record<IdentifiantDInstallation, DefinitionDInstallation>
>;

export interface InstallationDuConvoi {
  readonly id: string;
  readonly definitionId: IdentifiantDInstallation;
  readonly etatMateriel: EtatMateriel;
  readonly installeeA: number;
}

export interface EmplacementConstructible {
  readonly id: string;
  readonly categorie: CategorieDEmplacement;
  readonly installation: InstallationDuConvoi | null;
}

export interface PlateformeMobile {
  readonly id: IdentifiantDePlateformeMobile;
  readonly nom: string;
  readonly type: "phare" | "standard";
  readonly quartierId: IdentifiantDeQuartier | null;
  readonly emplacements: readonly EmplacementConstructible[];
  readonly projetRegional?: {
    readonly id: "decanteur-itinerant" | "arche-des-deplaces";
    readonly service: "purification-mobile" | "accueil-deplaces";
    readonly contrainte:
      | "entretien-hydraulique-dedie"
      | "charge-habitable-permanente";
    readonly scelleA: number;
  };
}

export interface QuartierMobile {
  readonly id: IdentifiantDeQuartier;
  readonly nom: string;
  readonly plateformeId: IdentifiantDePlateformeInitiale;
}

export type OrdreDeChantier =
  | {
      readonly type: "construction";
      readonly definitionId: IdentifiantDInstallation;
      readonly emplacementId: string;
    }
  | {
      readonly type: "demontage";
      readonly emplacementId: string;
    }
  | {
      readonly type: "deplacement";
      readonly origineId: string;
      readonly destinationId: string;
    };

export interface Chantier {
  readonly id: string;
  readonly ordre: OrdreDeChantier;
  readonly priorite: PrioriteDeChantier;
  readonly commenceA: number;
  readonly dureePrevue: number;
  readonly progression: number;
  readonly coutMateriaux: number;
  readonly materiauxConsommes: number;
}

export interface ChantierTermine extends Chantier {
  readonly termineA: number;
}

export interface EtatInfrastructure {
  readonly deploiement: "voyage" | "halte";
  readonly plateformes: readonly PlateformeMobile[];
  readonly quartiers: readonly QuartierMobile[];
  readonly chantierActif: Chantier | null;
  readonly chantiersTermines: readonly ChantierTermine[];
}

export type CommandeDInfrastructure =
  | { readonly type: "halte.deployer" }
  | { readonly type: "halte.replier" }
  | {
      readonly type: "chantier.engager";
      readonly ordre: OrdreDeChantier;
      readonly priorite: PrioriteDeChantier;
    };

export type EvenementDInfrastructure =
  | { readonly type: "halte.deployee"; readonly moment: number }
  | { readonly type: "halte.repliee"; readonly moment: number }
  | {
      readonly type: "chantier.engage";
      readonly chantierId: string;
      readonly ordre: OrdreDeChantier;
      readonly priorite: PrioriteDeChantier;
      readonly moment: number;
    }
  | {
      readonly type: "chantier.progresse";
      readonly chantierId: string;
      readonly progression: number;
      readonly materiauxConsommes: number;
      readonly moment: number;
    }
  | {
      readonly type: "chantier.termine";
      readonly chantierId: string;
      readonly installationId: string | null;
      readonly moment: number;
    };

function creerInstallationInitiale(
  emplacementId: string,
  definitionId: IdentifiantDInstallation,
): InstallationDuConvoi {
  return {
    id: `${emplacementId}.${definitionId}`,
    definitionId,
    etatMateriel: "operationnelle",
    installeeA: 0,
  };
}

function creerEmplacement(
  id: string,
  categorie: CategorieDEmplacement,
  definitionId?: IdentifiantDInstallation,
): EmplacementConstructible {
  return {
    id,
    categorie,
    installation:
      definitionId === undefined
        ? null
        : creerInstallationInitiale(id, definitionId),
  };
}

export function creerInfrastructureInitiale(): EtatInfrastructure {
  return {
    deploiement: "voyage",
    plateformes: [
      {
        id: "phare",
        nom: "Plateforme du Phare",
        type: "phare",
        quartierId: null,
        emplacements: [],
      },
      {
        id: "intendance",
        nom: "Intendance",
        type: "standard",
        quartierId: "intendance",
        emplacements: [
          creerEmplacement(
            "intendance.habitable",
            "habitable",
            "cuisine-conserverie",
          ),
          creerEmplacement(
            "intendance.technique",
            "technique",
            "station-filtration",
          ),
          creerEmplacement("intendance.polyvalent", "polyvalent"),
        ],
      },
      {
        id: "foyers",
        nom: "Foyers",
        type: "standard",
        quartierId: "foyers",
        emplacements: [
          creerEmplacement(
            "foyers.habitable-1",
            "habitable",
            "dortoirs-etanches",
          ),
          creerEmplacement(
            "foyers.habitable-2",
            "habitable",
            "infirmerie-filtree",
          ),
          creerEmplacement("foyers.polyvalent", "polyvalent"),
        ],
      },
      {
        id: "machines",
        nom: "Machines",
        type: "standard",
        quartierId: "machines",
        emplacements: [
          creerEmplacement(
            "machines.technique-1",
            "technique",
            "chaudiere-commune",
          ),
          creerEmplacement(
            "machines.technique-2",
            "technique",
            "groupe-traction",
          ),
          creerEmplacement("machines.polyvalent", "polyvalent"),
        ],
      },
      {
        id: "atelier-operations",
        nom: "Atelier–Opérations",
        type: "standard",
        quartierId: "atelier-operations",
        emplacements: [
          creerEmplacement(
            "atelier-operations.technique",
            "technique",
            "atelier-bord",
          ),
          creerEmplacement(
            "atelier-operations.habitable",
            "habitable",
            "poste-operations",
          ),
          creerEmplacement("atelier-operations.polyvalent", "polyvalent"),
        ],
      },
    ],
    quartiers: [
      { id: "intendance", nom: "Intendance", plateformeId: "intendance" },
      { id: "foyers", nom: "Foyers", plateformeId: "foyers" },
      { id: "machines", nom: "Machines", plateformeId: "machines" },
      {
        id: "atelier-operations",
        nom: "Atelier–Opérations",
        plateformeId: "atelier-operations",
      },
    ],
    chantierActif: null,
    chantiersTermines: [],
  };
}

export function ajouterPlateformeRegionale(
  etat: EtatInfrastructure,
  projetId: "decanteur-itinerant" | "arche-des-deplaces",
  moment: number,
): EtatInfrastructure {
  if (
    etat.plateformes.some(
      ({ id }) => id === IDENTIFIANT_DE_PLATEFORME_REGIONALE,
    )
  ) {
    throw new Error("Le châssis régional est déjà intégré au convoi.");
  }
  return {
    ...etat,
    plateformes: [
      ...etat.plateformes,
      {
        id: IDENTIFIANT_DE_PLATEFORME_REGIONALE,
        nom: IDENTIFIANT_DE_PLATEFORME_REGIONALE,
        type: "standard",
        quartierId: null,
        emplacements: [],
        projetRegional: {
          id: projetId,
          service:
            projetId === "decanteur-itinerant"
              ? "purification-mobile"
              : "accueil-deplaces",
          contrainte:
            projetId === "decanteur-itinerant"
              ? "entretien-hydraulique-dedie"
              : "charge-habitable-permanente",
          scelleA: moment,
        },
      },
    ],
  };
}

export function ajouterPlateformeRegionaleOrdinaire(
  etat: EtatInfrastructure,
): EtatInfrastructure {
  if (
    etat.plateformes.some(
      ({ id }) => id === IDENTIFIANT_DE_PLATEFORME_REGIONALE,
    )
  ) {
    throw new Error("Le châssis régional est déjà intégré au convoi.");
  }
  return {
    ...etat,
    plateformes: [
      ...etat.plateformes,
      {
        id: IDENTIFIANT_DE_PLATEFORME_REGIONALE,
        nom: IDENTIFIANT_DE_PLATEFORME_REGIONALE,
        type: "standard",
        quartierId: null,
        emplacements: [
          {
            id: "chassis-regional-des-bassins.habitable",
            categorie: "habitable",
            installation: null,
          },
          {
            id: "chassis-regional-des-bassins.technique",
            categorie: "technique",
            installation: null,
          },
          {
            id: "chassis-regional-des-bassins.polyvalent",
            categorie: "polyvalent",
            installation: null,
          },
        ],
      },
    ],
  };
}

export function trouverEmplacement(
  etat: EtatInfrastructure,
  emplacementId: string,
): EmplacementConstructible {
  const emplacement = etat.plateformes
    .flatMap((plateforme) => plateforme.emplacements)
    .find((candidat) => candidat.id === emplacementId);
  if (emplacement === undefined) {
    throw new Error(`L’Emplacement « ${emplacementId} » est inconnu.`);
  }
  return emplacement;
}

export function compterEmplacements(etat: EtatInfrastructure): {
  readonly techniques: number;
  readonly habitables: number;
  readonly polyvalents: number;
  readonly installations: number;
  readonly libres: number;
} {
  const emplacements = etat.plateformes.flatMap(
    (plateforme) => plateforme.emplacements,
  );
  return {
    techniques: emplacements.filter(
      (emplacement) => emplacement.categorie === "technique",
    ).length,
    habitables: emplacements.filter(
      (emplacement) => emplacement.categorie === "habitable",
    ).length,
    polyvalents: emplacements.filter(
      (emplacement) => emplacement.categorie === "polyvalent",
    ).length,
    installations: emplacements.filter(
      (emplacement) => emplacement.installation !== null,
    ).length,
    libres: emplacements.filter(
      (emplacement) => emplacement.installation === null,
    ).length,
  };
}

export function calculerModificateursEconomiques(
  etat: EtatInfrastructure,
): EffetsEconomiquesDInstallation {
  const totaliser = (infrastructure: EtatInfrastructure) => {
    const resultat: {
      fluxDeStocks: Partial<Record<IdentifiantDeStock, number>>;
      demandeDeChaleur: number;
      demandeDeMainDOeuvre: number;
      demandeDeCharge: number;
      equipesDEntretien: number;
      materiauxDEntretienParHeure: number;
    } = {
      fluxDeStocks: {},
      demandeDeChaleur: 0,
      demandeDeMainDOeuvre: 0,
      demandeDeCharge: 0,
      equipesDEntretien: 0,
      materiauxDEntretienParHeure: 0,
    };
    for (const emplacement of infrastructure.plateformes.flatMap(
      (plateforme) => plateforme.emplacements,
    )) {
      if (emplacement.installation === null) {
        continue;
      }
      const definition =
        CATALOGUE_D_INSTALLATIONS[emplacement.installation.definitionId];
      for (const [id, variation] of Object.entries(
        definition.effetsEconomiques.fluxDeStocks,
      ) as Array<[IdentifiantDeStock, number]>) {
        resultat.fluxDeStocks[id] =
          (resultat.fluxDeStocks[id] ?? 0) + variation;
      }
      resultat.demandeDeChaleur +=
        definition.effetsEconomiques.demandeDeChaleur;
      resultat.demandeDeMainDOeuvre +=
        definition.effetsEconomiques.demandeDeMainDOeuvre;
      resultat.demandeDeCharge += demandeDeCharge(definition, emplacement);
      resultat.equipesDEntretien +=
        definition.effetsEconomiques.equipesDEntretien;
      resultat.materiauxDEntretienParHeure +=
        definition.effetsEconomiques.materiauxDEntretienParHeure;
    }
    return resultat;
  };
  const courant = totaliser(etat);
  const initial = totaliser(creerInfrastructureInitiale());
  const resultat: {
    fluxDeStocks: Partial<Record<IdentifiantDeStock, number>>;
    demandeDeChaleur: number;
    demandeDeMainDOeuvre: number;
    demandeDeCharge: number;
    equipesDEntretien: number;
    materiauxDEntretienParHeure: number;
  } = {
    fluxDeStocks: {},
    demandeDeChaleur: 0,
    demandeDeMainDOeuvre: 0,
    demandeDeCharge: 0,
    equipesDEntretien: 0,
    materiauxDEntretienParHeure: 0,
  };
  for (const id of Object.keys({
    ...initial.fluxDeStocks,
    ...courant.fluxDeStocks,
  }) as IdentifiantDeStock[]) {
    resultat.fluxDeStocks[id] =
      (courant.fluxDeStocks[id] ?? 0) - (initial.fluxDeStocks[id] ?? 0);
  }
  resultat.demandeDeChaleur =
    courant.demandeDeChaleur - initial.demandeDeChaleur;
  resultat.demandeDeMainDOeuvre =
    courant.demandeDeMainDOeuvre - initial.demandeDeMainDOeuvre;
  resultat.demandeDeCharge =
    courant.demandeDeCharge - initial.demandeDeCharge;
  resultat.equipesDEntretien =
    courant.equipesDEntretien - initial.equipesDEntretien;
  resultat.materiauxDEntretienParHeure =
    courant.materiauxDEntretienParHeure -
    initial.materiauxDEntretienParHeure;
  return resultat;
}

function ordreTouchePlateforme(
  ordre: OrdreDeChantier,
  plateformeId: IdentifiantDePlateformeMobile,
): boolean {
  const prefixe = `${plateformeId}.`;
  return (
    ordre.type === "deplacement"
      ? [ordre.origineId, ordre.destinationId]
      : [ordre.emplacementId]
  ).some((emplacementId) => emplacementId.startsWith(prefixe));
}

export function listerPlateformesMobilesDetachables(
  infrastructure: EtatInfrastructure,
): readonly IdentifiantDePlateformeMobile[] {
  return infrastructure.plateformes
    .map(({ id }) => id)
    .filter(
      (id) =>
        id !== "phare" &&
        (infrastructure.chantierActif === null ||
          !ordreTouchePlateforme(infrastructure.chantierActif.ordre, id)),
    );
}

export function detacherPlateformeMobile(
  infrastructure: EtatInfrastructure,
  pilotage: EtatPilotage,
  plateformeId: IdentifiantDePlateformeMobile,
): {
  readonly infrastructure: EtatInfrastructure;
  readonly pilotage: EtatPilotage;
} {
  if (plateformeId === "phare") {
    throw new Error("La Plateforme du Phare ne peut pas être détachée.");
  }
  const plateforme = infrastructure.plateformes.find(
    ({ id }) => id === plateformeId,
  );
  if (plateforme === undefined) {
    throw new Error(`La Plateforme « ${plateformeId} » est absente.`);
  }
  if (
    infrastructure.chantierActif !== null &&
    ordreTouchePlateforme(
      infrastructure.chantierActif.ordre,
      plateformeId,
    )
  ) {
    throw new Error("Un chantier actif retient cette Plateforme.");
  }

  let pilotageApresDetachement = pilotage;
  for (const emplacement of plateforme.emplacements) {
    if (emplacement.installation === null) {
      continue;
    }
    pilotageApresDetachement = appliquerEffetsEconomiques(
      pilotageApresDetachement,
      CATALOGUE_D_INSTALLATIONS[emplacement.installation.definitionId],
      emplacement,
      -1,
    );
  }

  return {
    infrastructure: {
      ...infrastructure,
      plateformes: infrastructure.plateformes.filter(
        ({ id }) => id !== plateformeId,
      ),
      quartiers: infrastructure.quartiers.filter(
        ({ plateformeId: id }) => id !== plateformeId,
      ),
    },
    pilotage: pilotageApresDetachement,
  };
}

function remplacerEmplacements(
  etat: EtatInfrastructure,
  remplacements: Readonly<Record<string, EmplacementConstructible>>,
): EtatInfrastructure {
  return {
    ...etat,
    plateformes: etat.plateformes.map((plateforme) => ({
      ...plateforme,
      emplacements: plateforme.emplacements.map(
        (emplacement) => remplacements[emplacement.id] ?? emplacement,
      ),
    })),
  };
}

function emplacementAccepte(
  emplacement: EmplacementConstructible,
  definition: DefinitionDInstallation,
): boolean {
  return (
    emplacement.categorie === "polyvalent" ||
    definition.categoriesCompatibles.includes(emplacement.categorie)
  );
}

export function calculerClasseDeChargeEffective(
  definition: DefinitionDInstallation,
  categorie: CategorieDEmplacement,
): ClasseDeCharge {
  if (categorie !== "polyvalent" || definition.charge === "forte") {
    return definition.charge;
  }
  return definition.charge === "faible" ? "normale" : "forte";
}

export function demandeDeChargePourCategorie(
  definition: DefinitionDInstallation,
  categorie: CategorieDEmplacement,
): number {
  return (
    definition.effetsEconomiques.demandeDeCharge +
    (categorie === "polyvalent" ? 1 : 0)
  );
}

function demandeDeCharge(
  definition: DefinitionDInstallation,
  emplacement: EmplacementConstructible,
): number {
  return demandeDeChargePourCategorie(definition, emplacement.categorie);
}

function marge(
  pilotage: EtatPilotage,
  capacite: "chaleur" | "main-d-oeuvre" | "charge",
): number {
  const valeur = pilotage.economie.capacites[capacite];
  return valeur.production - valeur.demande;
}

export interface RessourcesDeConstruction {
  readonly margeDeChaleur: number;
  readonly margeDeMainDOeuvre: number;
  readonly margeDeCharge: number;
  readonly materiauxDisponibles: number;
  readonly reserveDIncident: number;
}

export function trouverRefusDeConstruction(
  definition: DefinitionDInstallation,
  categorie: CategorieDEmplacement,
  ressources: RessourcesDeConstruction,
): string | null {
  if (
    ressources.margeDeChaleur <
    definition.effetsEconomiques.demandeDeChaleur
  ) {
    return "La contrainte de Chaleur empêche ce Chantier.";
  }
  if (ressources.margeDeMainDOeuvre < definition.postesRequis) {
    return "La contrainte de Main-d’œuvre empêche ce Chantier.";
  }
  if (
    ressources.margeDeMainDOeuvre - definition.postesRequis <
    definition.effetsEconomiques.equipesDEntretien
  ) {
    return "La contrainte d’Entretien empêche ce Chantier.";
  }
  if (
    ressources.margeDeCharge <
    demandeDeChargePourCategorie(definition, categorie)
  ) {
    return "La contrainte de Charge empêche ce Chantier.";
  }
  if (
    ressources.materiauxDisponibles <
    definition.coutMateriaux + ressources.reserveDIncident
  ) {
    return "Les Matériaux disponibles ne couvrent pas ce Chantier.";
  }
  return null;
}

function verifierContraintesDeConstruction(
  pilotage: EtatPilotage,
  definition: DefinitionDInstallation,
  emplacement: EmplacementConstructible,
): void {
  const refus = trouverRefusDeConstruction(definition, emplacement.categorie, {
    margeDeChaleur: marge(pilotage, "chaleur"),
    margeDeMainDOeuvre: marge(pilotage, "main-d-oeuvre"),
    margeDeCharge: marge(pilotage, "charge"),
    materiauxDisponibles:
      pilotage.economie.stocks.materiaux.quantite,
    reserveDIncident: pilotage.incidentActif === null ? 0 : 3,
  });
  if (refus !== null) {
    throw new Error(refus);
  }
}

function dureePrevue(
  ordre: OrdreDeChantier,
  priorite: PrioriteDeChantier,
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

function coutMateriaux(
  ordre: OrdreDeChantier,
  etat: EtatInfrastructure,
): number {
  if (ordre.type === "construction") {
    return CATALOGUE_D_INSTALLATIONS[ordre.definitionId].coutMateriaux;
  }
  if (ordre.type === "deplacement") {
    return 2;
  }
  trouverEmplacement(etat, ordre.emplacementId);
  return 0;
}

export function engagerChantier(
  infrastructure: EtatInfrastructure,
  pilotage: EtatPilotage,
  ordre: OrdreDeChantier,
  priorite: PrioriteDeChantier,
  moment: number,
): {
  readonly etat: EtatInfrastructure;
  readonly evenement: EvenementDInfrastructure;
} {
  if (infrastructure.deploiement !== "halte") {
    throw new Error(
      "Un Chantier structurel exige un Déploiement de halte ; le convoi est en voyage.",
    );
  }
  if (infrastructure.chantierActif !== null) {
    throw new Error("Un autre Chantier structurel est déjà actif.");
  }

  if (ordre.type === "construction") {
    const emplacement = trouverEmplacement(infrastructure, ordre.emplacementId);
    if (emplacement.installation !== null) {
      throw new Error("Cet Emplacement est déjà occupé.");
    }
    const definition = CATALOGUE_D_INSTALLATIONS[ordre.definitionId];
    if (!emplacementAccepte(emplacement, definition)) {
      throw new Error(
        `L’Emplacement ${emplacement.categorie} est incompatible avec cette installation.`,
      );
    }
    verifierContraintesDeConstruction(pilotage, definition, emplacement);
  } else if (ordre.type === "demontage") {
    const emplacement = trouverEmplacement(infrastructure, ordre.emplacementId);
    if (emplacement.installation === null) {
      throw new Error("Aucune installation ne peut être démontée ici.");
    }
    if (
      installationEstVitale(emplacement.installation.definitionId) &&
      infrastructure.plateformes
        .flatMap((plateforme) => plateforme.emplacements)
        .filter(
          (candidat) =>
            candidat.installation?.definitionId ===
            emplacement.installation?.definitionId,
        ).length <= 1
    ) {
      throw new Error(
        "Cette installation assure la dernière fonction vitale de ce type.",
      );
    }
  } else {
    const origine = trouverEmplacement(infrastructure, ordre.origineId);
    const destination = trouverEmplacement(infrastructure, ordre.destinationId);
    if (origine.installation === null) {
      throw new Error(
        "Aucune installation ne peut être déplacée depuis l’origine.",
      );
    }
    if (destination.installation !== null) {
      throw new Error("L’Emplacement de destination est déjà occupé.");
    }
    const definition =
      CATALOGUE_D_INSTALLATIONS[origine.installation.definitionId];
    if (!emplacementAccepte(destination, definition)) {
      throw new Error("L’Emplacement de destination est incompatible.");
    }
    const surcroitDeCharge =
      demandeDeCharge(definition, destination) -
      demandeDeCharge(definition, origine);
    if (surcroitDeCharge > marge(pilotage, "charge")) {
      throw new Error("La contrainte de Charge empêche ce déplacement.");
    }
    const reserveDIncident = pilotage.incidentActif === null ? 0 : 3;
    if (pilotage.economie.stocks.materiaux.quantite < 2 + reserveDIncident) {
      throw new Error(
        "Les Matériaux disponibles ne couvrent pas ce déplacement.",
      );
    }
  }

  const chantier: Chantier = {
    id: `chantier.${infrastructure.chantiersTermines.length}.${moment}.${ordre.type}`,
    ordre,
    priorite,
    commenceA: moment,
    dureePrevue: dureePrevue(ordre, priorite),
    progression: 0,
    coutMateriaux: coutMateriaux(ordre, infrastructure),
    materiauxConsommes: 0,
  };
  return {
    etat: { ...infrastructure, chantierActif: chantier },
    evenement: {
      type: "chantier.engage",
      chantierId: chantier.id,
      ordre,
      priorite,
      moment,
    },
  };
}

function appliquerEffetsEconomiques(
  pilotage: EtatPilotage,
  definition: DefinitionDInstallation,
  emplacement: EmplacementConstructible,
  sens: 1 | -1,
): EtatPilotage {
  const effets = definition.effetsEconomiques;
  const stocks = { ...pilotage.economie.stocks };
  for (const [id, variation] of Object.entries(effets.fluxDeStocks) as Array<
    [IdentifiantDeStock, number]
  >) {
    stocks[id] = {
      ...stocks[id],
      fluxParHeure: stocks[id].fluxParHeure + variation * sens,
    };
  }
  return {
    ...pilotage,
    economie: {
      ...pilotage.economie,
      stocks,
      capacites: {
        ...pilotage.economie.capacites,
        chaleur: {
          ...pilotage.economie.capacites.chaleur,
          demande:
            pilotage.economie.capacites.chaleur.demande +
            effets.demandeDeChaleur * sens,
        },
        "main-d-oeuvre": {
          ...pilotage.economie.capacites["main-d-oeuvre"],
          demande:
            pilotage.economie.capacites["main-d-oeuvre"].demande +
            effets.demandeDeMainDOeuvre * sens,
        },
        charge: {
          ...pilotage.economie.capacites.charge,
          demande:
            pilotage.economie.capacites.charge.demande +
            demandeDeCharge(definition, emplacement) * sens,
        },
      },
      entretien: {
        equipesMobilisees:
          pilotage.economie.entretien.equipesMobilisees +
          effets.equipesDEntretien * sens,
        materiauxParHeure:
          pilotage.economie.entretien.materiauxParHeure +
          effets.materiauxDEntretienParHeure * sens,
      },
    },
  };
}

function terminerOrdre(
  infrastructure: EtatInfrastructure,
  pilotage: EtatPilotage,
  chantier: Chantier,
  moment: number,
): {
  readonly infrastructure: EtatInfrastructure;
  readonly pilotage: EtatPilotage;
  readonly installationId: string | null;
} {
  const ordre = chantier.ordre;
  if (ordre.type === "construction") {
    const emplacement = trouverEmplacement(infrastructure, ordre.emplacementId);
    const definition = CATALOGUE_D_INSTALLATIONS[ordre.definitionId];
    const installation: InstallationDuConvoi = {
      id: `${emplacement.id}.${definition.id}`,
      definitionId: definition.id,
      etatMateriel: "operationnelle",
      installeeA: moment,
    };
    return {
      infrastructure: remplacerEmplacements(infrastructure, {
        [emplacement.id]: { ...emplacement, installation },
      }),
      pilotage: appliquerEffetsEconomiques(
        pilotage,
        definition,
        emplacement,
        1,
      ),
      installationId: installation.id,
    };
  }
  if (ordre.type === "demontage") {
    const emplacement = trouverEmplacement(infrastructure, ordre.emplacementId);
    const installation = emplacement.installation!;
    const definition = CATALOGUE_D_INSTALLATIONS[installation.definitionId];
    return {
      infrastructure: remplacerEmplacements(infrastructure, {
        [emplacement.id]: { ...emplacement, installation: null },
      }),
      pilotage: appliquerEffetsEconomiques(
        pilotage,
        definition,
        emplacement,
        -1,
      ),
      installationId: null,
    };
  }

  const origine = trouverEmplacement(infrastructure, ordre.origineId);
  const destination = trouverEmplacement(infrastructure, ordre.destinationId);
  const installation = origine.installation!;
  const definition = CATALOGUE_D_INSTALLATIONS[installation.definitionId];
  let pilotageApresDeplacement = appliquerEffetsEconomiques(
    pilotage,
    definition,
    origine,
    -1,
  );
  pilotageApresDeplacement = appliquerEffetsEconomiques(
    pilotageApresDeplacement,
    definition,
    destination,
    1,
  );
  return {
    infrastructure: remplacerEmplacements(infrastructure, {
      [origine.id]: { ...origine, installation: null },
      [destination.id]: { ...destination, installation },
    }),
    pilotage: pilotageApresDeplacement,
    installationId: installation.id,
  };
}

export function faireProgresserChantier(
  infrastructure: EtatInfrastructure,
  pilotage: EtatPilotage,
  secondesEcoulees: number,
  momentFinal: number,
): {
  readonly infrastructure: EtatInfrastructure;
  readonly pilotage: EtatPilotage;
  readonly evenements: readonly EvenementDInfrastructure[];
} {
  const chantier = infrastructure.chantierActif;
  if (chantier === null || secondesEcoulees <= 0) {
    return { infrastructure, pilotage, evenements: [] };
  }
  const progression = Math.min(
    chantier.dureePrevue,
    chantier.progression + secondesEcoulees,
  );
  const materiauxConsommes = Math.floor(
    (chantier.coutMateriaux * progression) / chantier.dureePrevue,
  );
  const consommation = materiauxConsommes - chantier.materiauxConsommes;
  if (pilotage.economie.stocks.materiaux.quantite < consommation) {
    throw new Error("Le Chantier manque de Matériaux pour poursuivre.");
  }
  const pilotageApresConsommation: EtatPilotage = {
    ...pilotage,
    economie: {
      ...pilotage.economie,
      stocks: {
        ...pilotage.economie.stocks,
        materiaux: appliquerVariationAUnStock(
          pilotage.economie.stocks.materiaux,
          -consommation,
        ),
      },
    },
  };
  const chantierProgresse: Chantier = {
    ...chantier,
    progression,
    materiauxConsommes,
  };
  const evenementDeProgression: EvenementDInfrastructure = {
    type: "chantier.progresse",
    chantierId: chantier.id,
    progression,
    materiauxConsommes,
    moment: momentFinal,
  };
  if (progression < chantier.dureePrevue) {
    return {
      infrastructure: {
        ...infrastructure,
        chantierActif: chantierProgresse,
      },
      pilotage: pilotageApresConsommation,
      evenements: [evenementDeProgression],
    };
  }

  const resultat = terminerOrdre(
    infrastructure,
    pilotageApresConsommation,
    chantierProgresse,
    momentFinal,
  );
  const chantierTermine: ChantierTermine = {
    ...chantierProgresse,
    termineA: momentFinal,
  };
  return {
    infrastructure: {
      ...resultat.infrastructure,
      chantierActif: null,
      chantiersTermines: [...infrastructure.chantiersTermines, chantierTermine],
    },
    pilotage: resultat.pilotage,
    evenements: [
      evenementDeProgression,
      {
        type: "chantier.termine",
        chantierId: chantier.id,
        installationId: resultat.installationId,
        moment: momentFinal,
      },
    ],
  };
}

export function secondesAvantFinDuChantier(
  infrastructure: EtatInfrastructure,
): number | undefined {
  const chantier = infrastructure.chantierActif;
  return chantier === null
    ? undefined
    : chantier.dureePrevue - chantier.progression;
}
