import {
  creerApplicationCampagne,
  reprendreApplicationCampagne,
  type ApplicationCampagne,
  type PolitiqueDAccesAuContenu,
} from "../application/application";
import type { GraineDeCampagne } from "../simulation/campagne";
import {
  creerArchivePersistante,
  type ArchivePersistante,
  type PortDePersistanceSauvegardes,
} from "./persistance";
import {
  creerSauvegarde,
  creerReproductionInitiale,
  exporterSauvegarde,
  importerSauvegarde,
} from "./sauvegarde";
import type {
  ReproductionDeCampagne,
  ResultatImportSauvegarde,
  SauvegardeCampagne,
} from "./types";

export interface ResultatOuvertureCampagne {
  readonly statut: "nouvelle" | "reprise";
  readonly application: ApplicationCampagne;
  readonly reproduction: ReproductionDeCampagne;
  readonly explication?: string;
  readonly archiveIncompatible?: ArchivePersistante;
}

export type ResultatImportCampagne =
  | {
      readonly statut: "compatible";
      readonly application: ApplicationCampagne;
      readonly sauvegarde: SauvegardeCampagne;
      readonly reproduction: ReproductionDeCampagne;
      readonly erreurPersistance?: string;
    }
  | {
      readonly statut: "migree";
      readonly application: ApplicationCampagne;
      readonly sauvegarde: SauvegardeCampagne;
      readonly reproduction: ReproductionDeCampagne;
      readonly archiveOriginale: string;
      readonly erreurPersistance?: string;
    }
  | (Extract<
      ResultatImportSauvegarde,
      { readonly statut: "incompatible" }
    > & { readonly erreurPersistance?: string })
  | Extract<ResultatImportSauvegarde, { readonly statut: "invalide" }>;

export interface OptionsDAccesDeSession {
  readonly politiqueDAcces?: PolitiqueDAccesAuContenu;
}

function reprendreSauvegarde(
  sauvegarde: SauvegardeCampagne,
  options: OptionsDAccesDeSession,
): ApplicationCampagne {
  return reprendreApplicationCampagne(sauvegarde.etat, options);
}

function archiverTexte(
  id: string,
  version: number,
  contenu: string,
  protegeeDeLaRotation = false,
): ArchivePersistante {
  return {
    id,
    version,
    contenu,
    ...(protegeeDeLaRotation ? { protegeeDeLaRotation: true as const } : {}),
  };
}

function ajouterExplication(
  explication: string | undefined,
  complement: string,
): string {
  return explication === undefined
    ? complement
    : `${explication} ${complement}`;
}

export async function sauvegarderCampagne(
  port: PortDePersistanceSauvegardes,
  application: ApplicationCampagne,
  reproduction: ReproductionDeCampagne,
): Promise<SauvegardeCampagne> {
  const sauvegarde = creerSauvegarde(
    application.lireEtat(),
    reproduction,
  );
  await port.enregistrer(creerArchivePersistante(sauvegarde));
  return sauvegarde;
}

export function exporterCampagne(
  application: ApplicationCampagne,
  reproduction: ReproductionDeCampagne,
): string {
  return exporterSauvegarde(
    creerSauvegarde(application.lireEtat(), reproduction),
  );
}

async function persisterSansMasquerLeResultat(
  port: PortDePersistanceSauvegardes,
  archive: ArchivePersistante,
): Promise<string | undefined> {
  try {
    await port.enregistrer(archive);
    return undefined;
  } catch (erreur) {
    return erreur instanceof Error
      ? erreur.message
      : "La sauvegarde locale de l’archive importée a échoué.";
  }
}

async function protegerSansMasquerLeResultat(
  port: PortDePersistanceSauvegardes,
  archive: ArchivePersistante,
): Promise<string | undefined> {
  try {
    await port.protegerDeLaRotation(archive);
    return undefined;
  } catch (erreur) {
    return erreur instanceof Error
      ? erreur.message
      : "La protection locale de l’archive incompatible a échoué.";
  }
}

async function persisterSauvegardeSansMasquerLeResultat(
  port: PortDePersistanceSauvegardes,
  sauvegarde: SauvegardeCampagne,
): Promise<string | undefined> {
  try {
    return await persisterSansMasquerLeResultat(
      port,
      creerArchivePersistante(sauvegarde),
    );
  } catch (erreur) {
    return erreur instanceof Error
      ? erreur.message
      : "La préparation du snapshot migré a échoué.";
  }
}

export async function importerCampagne(
  port: PortDePersistanceSauvegardes,
  archiveOriginale: string,
  options: OptionsDAccesDeSession = {},
): Promise<ResultatImportCampagne> {
  const importation = importerSauvegarde(archiveOriginale);

  if (importation.statut === "compatible") {
    const erreurPersistance = await persisterSansMasquerLeResultat(
      port,
      archiverTexte(
        importation.sauvegarde.id,
        importation.sauvegarde.version,
        archiveOriginale,
      ),
    );
    return {
      statut: "compatible",
      sauvegarde: importation.sauvegarde,
      application: reprendreSauvegarde(importation.sauvegarde, options),
      reproduction: importation.sauvegarde.reproduction,
      ...(erreurPersistance === undefined ? {} : { erreurPersistance }),
    };
  }

  if (importation.statut === "migree") {
    const originalParse = JSON.parse(archiveOriginale) as {
      readonly id: string;
      readonly version: number;
    };
    const erreurOriginal = await persisterSansMasquerLeResultat(
      port,
      archiverTexte(
        originalParse.id,
        originalParse.version,
        archiveOriginale,
      ),
    );
    const erreurMigree = await persisterSauvegardeSansMasquerLeResultat(
      port,
      importation.sauvegarde,
    );
    const erreurPersistance = [erreurOriginal, erreurMigree]
      .filter((erreur): erreur is string => erreur !== undefined)
      .join(" ") || undefined;
    return {
      statut: "migree",
      sauvegarde: importation.sauvegarde,
      application: reprendreSauvegarde(importation.sauvegarde, options),
      reproduction: importation.sauvegarde.reproduction,
      archiveOriginale,
      ...(erreurPersistance === undefined ? {} : { erreurPersistance }),
    };
  }

  if (importation.statut === "incompatible") {
    const archive = archiverTexte(
      importation.id,
      importation.version,
      importation.archiveOriginale,
      true,
    );
    const erreurPersistance = await protegerSansMasquerLeResultat(
      port,
      archive,
    );
    return {
      ...importation,
      ...(erreurPersistance === undefined ? {} : { erreurPersistance }),
    };
  }

  return importation;
}

export async function ouvrirCampagne(
  port: PortDePersistanceSauvegardes,
  graine: GraineDeCampagne,
  options: OptionsDAccesDeSession = {},
): Promise<ResultatOuvertureCampagne> {
  let archiveIncompatible: ArchivePersistante | undefined;
  let explication: string | undefined;
  let sauvegardeTrouvee: SauvegardeCampagne | undefined;
  let sauvegardeMigree: SauvegardeCampagne | undefined;
  const archivesAProteger = new Map<string, ArchivePersistante>();

  for (const archive of await port.lister()) {
    const importation = importerSauvegarde(archive.contenu);

    if (
      sauvegardeTrouvee === undefined &&
      (importation.statut === "compatible" ||
        importation.statut === "migree") &&
      importation.sauvegarde.graine === graine
    ) {
      sauvegardeTrouvee = importation.sauvegarde;
      if (importation.statut === "migree") {
        sauvegardeMigree = importation.sauvegarde;
      }
    }

    if (importation.statut === "incompatible") {
      const archiveDetectee: ArchivePersistante = {
        id: importation.id,
        version: importation.version,
        contenu: importation.archiveOriginale,
        protegeeDeLaRotation: true,
      };
      archivesAProteger.set(archiveDetectee.contenu, archiveDetectee);
      if (archiveIncompatible === undefined) {
        archiveIncompatible = archiveDetectee;
        explication = importation.explication;
      }
    }
  }

  for (const archiveAProteger of archivesAProteger.values()) {
    const erreurDeProtection = await protegerSansMasquerLeResultat(
      port,
      archiveAProteger,
    );
    if (erreurDeProtection !== undefined) {
      explication = ajouterExplication(
        explication,
        `L’archive « ${archiveAProteger.id} » reste réexportable dans cette session, mais sa protection locale a échoué : ${erreurDeProtection}`,
      );
    }
  }

  if (sauvegardeMigree !== undefined) {
    const erreurPersistance = await persisterSauvegardeSansMasquerLeResultat(
      port,
      sauvegardeMigree,
    );
    if (erreurPersistance !== undefined) {
      explication = ajouterExplication(
        explication,
        `La Campagne migrée est reprise en mémoire, mais son nouveau snapshot n’a pas pu être enregistré : ${erreurPersistance}`,
      );
    }
  }

  if (sauvegardeTrouvee !== undefined) {
    return {
      statut: "reprise",
      application: reprendreSauvegarde(sauvegardeTrouvee, options),
      reproduction: sauvegardeTrouvee.reproduction,
      ...(explication === undefined ? {} : { explication }),
      ...(archiveIncompatible === undefined
        ? {}
        : { archiveIncompatible }),
    };
  }

  const application = creerApplicationCampagne(graine, options);
  return {
    statut: "nouvelle",
    application,
    reproduction: creerReproductionInitiale(application.lireEtat()),
    ...(explication === undefined ? {} : { explication }),
    ...(archiveIncompatible === undefined
      ? {}
      : { archiveIncompatible }),
  };
}
