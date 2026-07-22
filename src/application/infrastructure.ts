import type { EtatCampagne } from "../simulation/campagne";
import { trouverTextesDInstallation } from "../content/catalogue";
import type { Langue, TextesDInstallation } from "../content/types";
import {
  CATALOGUE_D_INSTALLATIONS,
  calculerClasseDeChargeEffective,
  type CategorieDEmplacement,
  type EtatMateriel,
  type IdentifiantDInstallation,
} from "../simulation/infrastructure";

const LIBELLES = {
  fr: {
    priorites: { basse: "Basse", normale: "Normale", haute: "Haute" },
    construction: "Construction",
    demontage: "Démontage",
    deplacement: "Déplacement",
    vers: "vers",
  },
  en: {
    priorites: { basse: "Low", normale: "Normal", haute: "High" },
    construction: "Construction",
    demontage: "Dismantling",
    deplacement: "Move",
    vers: "to",
  },
} as const;

const NOMS_DE_PLATEFORMES: Readonly<
  Record<Langue, Readonly<Record<string, string>>>
> = {
  fr: {
    phare: "Plateforme du Phare",
    intendance: "Intendance",
    foyers: "Foyers",
    machines: "Machines",
    "atelier-operations": "Atelier–Opérations",
  },
  en: {
    phare: "Lighthouse Platform",
    intendance: "Stewardship",
    foyers: "Hearths",
    machines: "Machinery",
    "atelier-operations": "Workshop–Operations",
  },
};

function nomDePlateforme(id: string, langue: Langue, repli: string): string {
  return NOMS_DE_PLATEFORMES[langue][id] ?? repli;
}

export interface ProjectionDInstallation {
  readonly id: string;
  readonly definitionId: IdentifiantDInstallation;
  readonly nom: string;
  readonly etatMateriel: EtatMateriel;
  readonly emplacementId: string;
  readonly plateformeId: string;
  readonly plateforme: string;
  readonly categorie: CategorieDEmplacement;
  readonly service: string;
  readonly transformationsDeStocks: readonly string[];
  readonly postesRequis: number;
  readonly effetThermique: number;
  readonly charge: "faible" | "normale" | "forte";
  readonly entretien: "faible" | "normal" | "fort";
  readonly consequences: Readonly<Record<EtatMateriel, string>>;
}

export interface ProjectionDInfrastructure {
  readonly deploiement: "voyage" | "halte";
  readonly plateformes: readonly {
    readonly id: string;
    readonly nom: string;
    readonly type: "phare" | "standard";
    readonly emplacements: readonly {
      readonly id: string;
      readonly categorie: CategorieDEmplacement;
      readonly installation: string | null;
    }[];
  }[];
  readonly installations: readonly ProjectionDInstallation[];
  readonly emplacementsLibres: readonly {
    readonly id: string;
    readonly categorie: CategorieDEmplacement;
    readonly plateformeId: string;
    readonly plateforme: string;
  }[];
  readonly definitionsConstructibles: readonly {
    readonly id: IdentifiantDInstallation;
    readonly nom: string;
  }[];
  readonly chantierActif: {
    readonly id: string;
    readonly operation: string;
    readonly priorite: string;
    readonly progressionPourcent: number;
    readonly materiauxConsommes: number;
    readonly coutMateriaux: number;
    readonly secondesRestantes: number;
  } | null;
}

function decrireOrdre(
  ordre: NonNullable<EtatCampagne["infrastructure"]["chantierActif"]>["ordre"],
  langue: Langue,
): string {
  const libelles = LIBELLES[langue];
  if (ordre.type === "construction") {
    return `${libelles.construction} — ${textesDInstallation(ordre.definitionId, langue).nom.modele}`;
  }
  if (ordre.type === "demontage") {
    return `${libelles.demontage} — ${ordre.emplacementId}`;
  }
  return `${libelles.deplacement} — ${ordre.origineId} ${libelles.vers} ${ordre.destinationId}`;
}

function textesDInstallation(
  id: IdentifiantDInstallation,
  langue: Langue,
): TextesDInstallation {
  const textes = trouverTextesDInstallation(id, langue);
  if (textes === undefined) {
    throw new Error(`Installation ${id} absente du catalogue de contenu.`);
  }
  return textes;
}

export function projeterInfrastructure(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDInfrastructure {
  const installations: ProjectionDInstallation[] = [];
  const emplacementsLibres: ProjectionDInfrastructure["emplacementsLibres"] extends readonly (infer T)[]
    ? T[]
    : never = [];

  for (const plateforme of etat.infrastructure.plateformes) {
    for (const emplacement of plateforme.emplacements) {
      if (emplacement.installation === null) {
        emplacementsLibres.push({
          id: emplacement.id,
          categorie: emplacement.categorie,
          plateformeId: plateforme.id,
          plateforme: nomDePlateforme(plateforme.id, langue, plateforme.nom),
        });
        continue;
      }
      const definition =
        CATALOGUE_D_INSTALLATIONS[emplacement.installation.definitionId];
      const textes = textesDInstallation(definition.id, langue);
      installations.push({
        id: emplacement.installation.id,
        definitionId: definition.id,
        nom: textes.nom.modele,
        etatMateriel: emplacement.installation.etatMateriel,
        emplacementId: emplacement.id,
        plateformeId: plateforme.id,
        plateforme: nomDePlateforme(plateforme.id, langue, plateforme.nom),
        categorie: emplacement.categorie,
        service: textes.service.modele,
        transformationsDeStocks: textes.transformationsDeStocks.map(
          (transformation) => transformation.modele,
        ),
        postesRequis: definition.postesRequis,
        effetThermique: definition.effetThermique,
        charge: calculerClasseDeChargeEffective(
          definition,
          emplacement.categorie,
        ),
        entretien: definition.entretien,
        consequences: {
          operationnelle: textes.consequences.operationnelle.modele,
          degradee: textes.consequences.degradee.modele,
          "hors-service": textes.consequences["hors-service"].modele,
        },
      });
    }
  }

  const chantier = etat.infrastructure.chantierActif;
  return {
    deploiement: etat.infrastructure.deploiement,
    plateformes: etat.infrastructure.plateformes.map((plateforme) => ({
      id: plateforme.id,
      nom: nomDePlateforme(plateforme.id, langue, plateforme.nom),
      type: plateforme.type,
      emplacements: plateforme.emplacements.map((emplacement) => ({
        id: emplacement.id,
        categorie: emplacement.categorie,
        installation:
          emplacement.installation === null
            ? null
            : textesDInstallation(
                emplacement.installation.definitionId,
                langue,
              ).nom.modele,
      })),
    })),
    installations,
    emplacementsLibres,
    definitionsConstructibles: Object.values(CATALOGUE_D_INSTALLATIONS).map(
      (definition) => ({
        id: definition.id,
        nom: textesDInstallation(definition.id, langue).nom.modele,
      }),
    ),
    chantierActif:
      chantier === null
        ? null
        : {
            id: chantier.id,
            operation: decrireOrdre(chantier.ordre, langue),
            priorite: LIBELLES[langue].priorites[chantier.priorite],
            progressionPourcent: Math.round(
              (chantier.progression / chantier.dureePrevue) * 100,
            ),
            materiauxConsommes: chantier.materiauxConsommes,
            coutMateriaux: chantier.coutMateriaux,
            secondesRestantes: Math.max(
              0,
              chantier.dureePrevue - chantier.progression,
            ),
          },
  };
}

export function projeterImplantationPixi(
  projection: ProjectionDInfrastructure,
): string {
  return projection.plateformes
    .map(
      (plateforme) =>
        `${plateforme.id}:${plateforme.emplacements
          .map((emplacement) =>
            emplacement.installation === null ? "0" : "1",
          )
          .join("")}`,
    )
    .join("|");
}
