import {
  migrerSauvegardeV1,
  migrerSauvegardeV2,
  migrerSauvegardeV3,
  migrerSauvegardeV4,
  migrerSauvegardeV5,
  migrerSauvegardeV6,
  migrerSauvegardeV7,
  migrerSauvegardeV8,
  migrerSauvegardeV9,
  migrerSauvegardeV10,
} from "./migration";
import { lireSauvegardeCourante, estObjet } from "./validation";
import type {
  ResultatImportSauvegarde,
  SauvegardeCampagne,
} from "./types";
import {
  FORMAT_SAUVEGARDE,
  NOMS_DES_SOUS_VERSIONS,
  VERSION_SAUVEGARDE_COURANTE,
  VERSION_SAUVEGARDE_AVANT_ROUTES,
  VERSION_SAUVEGARDE_AVANT_CRISES,
  VERSION_SAUVEGARDE_AVANT_DENOUEMENT,
  VERSION_SAUVEGARDE_AVANT_DEVERSOIR,
  VERSION_SAUVEGARDE_AVANT_HAUT_PUITS,
  VERSION_SAUVEGARDE_AVANT_NACELLES,
  VERSION_SAUVEGARDE_AVANT_TRAME_DE_FER,
  VERSION_SAUVEGARDE_AVANT_TRAVERSE_LIBRE,
  VERSION_SAUVEGARDE_AVANT_VEILLE_BASSE,
  VERSION_SAUVEGARDE_INITIALE,
  VERSIONS_DU_SNAPSHOT_COURANT,
  type NomDeSousVersion,
} from "./version";

export const TAILLE_MAX_ARCHIVE_SAUVEGARDE = 8 * 1024 * 1024;

export function exporterSauvegarde(sauvegarde: SauvegardeCampagne): string {
  const archive = `${JSON.stringify(sauvegarde)}\n`;
  if (archiveDepasseLaLimite(archive)) {
    throw new Error("L’archive produite dépasse la limite de 8 Mio.");
  }
  return archive;
}

function archiveDepasseLaLimite(archive: string): boolean {
  return (
    archive.length > TAILLE_MAX_ARCHIVE_SAUVEGARDE ||
    new TextEncoder().encode(archive).byteLength >
      TAILLE_MAX_ARCHIVE_SAUVEGARDE
  );
}

function trouverSousVersionFuture(
  valeur: Record<string, unknown>,
):
  | {
      readonly nom: NomDeSousVersion;
      readonly version: number;
    }
  | undefined {
  if (!estObjet(valeur.versions)) {
    return undefined;
  }

  for (const nom of NOMS_DES_SOUS_VERSIONS) {
    const version = valeur.versions[nom];
    if (
      typeof version === "number" &&
      Number.isInteger(version) &&
      version > VERSIONS_DU_SNAPSHOT_COURANT[nom]
    ) {
      return { nom, version };
    }
  }

  return undefined;
}

export function importerSauvegarde(
  archiveOriginale: string,
): ResultatImportSauvegarde {
  if (archiveDepasseLaLimite(archiveOriginale)) {
    return {
      statut: "invalide",
      archiveOriginale,
      explication: `Le fichier dépasse la limite de ${TAILLE_MAX_ARCHIVE_SAUVEGARDE / 1024 / 1024} Mio.`,
    };
  }

  let valeur: unknown;
  try {
    valeur = JSON.parse(archiveOriginale);
  } catch {
    return {
      statut: "invalide",
      archiveOriginale,
      explication: "Le fichier n’est pas un document JSON valide.",
    };
  }

  if (
    !estObjet(valeur) ||
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    !Number.isInteger(valeur.version)
  ) {
    return {
      statut: "invalide",
      archiveOriginale,
      explication: "Le fichier n’est pas une sauvegarde des Lanternes de Cendre.",
    };
  }

  const version = valeur.version as number;
  if (version > VERSION_SAUVEGARDE_COURANTE) {
    return {
      statut: "incompatible",
      id: valeur.id,
      version,
      archiveOriginale,
      explication: `Cette sauvegarde utilise la version ${version}, plus récente que la version ${VERSION_SAUVEGARDE_COURANTE} prise en charge. L’original est conservé et peut être réexporté.`,
    };
  }

  const sousVersionFuture = trouverSousVersionFuture(valeur);
  if (sousVersionFuture !== undefined) {
    return {
      statut: "incompatible",
      id: valeur.id,
      version,
      archiveOriginale,
      explication: `Cette sauvegarde utilise la sous-version ${sousVersionFuture.nom} ${sousVersionFuture.version}, plus récente que la sous-version ${VERSIONS_DU_SNAPSHOT_COURANT[sousVersionFuture.nom]} prise en charge. L’original est conservé et peut être réexporté.`,
    };
  }

  if (version === VERSION_SAUVEGARDE_INITIALE) {
    const sauvegarde = migrerSauvegardeV1(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication: "La sauvegarde v1 est incomplète ou incohérente.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
        };
  }

  if (version === VERSION_SAUVEGARDE_AVANT_ROUTES) {
    const sauvegarde = migrerSauvegardeV2(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication: "La sauvegarde v2 est incomplète ou incohérente.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
        };
  }

  if (version === VERSION_SAUVEGARDE_AVANT_CRISES) {
    const sauvegarde = migrerSauvegardeV3(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication: "La sauvegarde v3 est incomplète ou incohérente.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
        };
  }

  if (version === VERSION_SAUVEGARDE_AVANT_VEILLE_BASSE) {
    const sauvegarde = migrerSauvegardeV4(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication: "La sauvegarde v4 est incomplète ou incohérente.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
        };
  }

  if (version === VERSION_SAUVEGARDE_AVANT_HAUT_PUITS) {
    const sauvegarde = migrerSauvegardeV5(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication: "La sauvegarde v5 est incomplète ou incohérente.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
      };
  }

  if (version === VERSION_SAUVEGARDE_AVANT_NACELLES) {
    const sauvegarde = migrerSauvegardeV6(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication: "La sauvegarde v6 est incomplète ou incohérente.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
        };
  }

  if (version === VERSION_SAUVEGARDE_AVANT_DEVERSOIR) {
    const sauvegarde = migrerSauvegardeV7(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication: "La sauvegarde v7 est incomplète ou incohérente.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
        };
  }

  if (version === VERSION_SAUVEGARDE_AVANT_TRAME_DE_FER) {
    const sauvegarde = migrerSauvegardeV8(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication:
            "La sauvegarde v8 est incomplète, altérée ou diverge lors du replay.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
        };
  }

  if (version === VERSION_SAUVEGARDE_AVANT_TRAVERSE_LIBRE) {
    const sauvegarde = migrerSauvegardeV9(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication:
            "La sauvegarde v9 est incomplète, altérée ou diverge lors du replay.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
        };
  }

  if (version === VERSION_SAUVEGARDE_AVANT_DENOUEMENT) {
    const sauvegarde = migrerSauvegardeV10(valeur);
    return sauvegarde === undefined
      ? {
          statut: "invalide",
          archiveOriginale,
          explication:
            "La sauvegarde v10 est incomplète, altérée ou diverge lors du replay.",
        }
      : {
          statut: "migree",
          sauvegarde,
          archiveOriginale,
        };
  }

  const sauvegarde = lireSauvegardeCourante(valeur);
  return sauvegarde === undefined
    ? {
        statut: "invalide",
        archiveOriginale,
        explication:
          "La sauvegarde v11 est incomplète, altérée ou diverge lors du replay.",
      }
    : { statut: "compatible", sauvegarde };
}
