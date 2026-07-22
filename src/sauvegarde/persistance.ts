import { exporterSauvegarde } from "./sauvegarde";
import { formaterEmpreinteFnv1a32V1 } from "../simulation/empreinte";
import type { SauvegardeCampagne } from "./types";
import { VERSION_SAUVEGARDE_COURANTE } from "./version";

export interface ArchivePersistante {
  readonly id: string;
  readonly version: number;
  readonly contenu: string;
  readonly protegeeDeLaRotation?: true;
}

export interface PortDePersistanceSauvegardes {
  readonly enregistrer: (archive: ArchivePersistante) => Promise<void>;
  readonly protegerDeLaRotation: (
    archive: ArchivePersistante,
  ) => Promise<void>;
  readonly lirePlusRecente: () => Promise<ArchivePersistante | null>;
  readonly lister: () => Promise<readonly ArchivePersistante[]>;
  readonly fermer: () => void;
}

export interface OptionsDeRotation {
  readonly nombreDeSnapshots?: number;
}

interface EnregistrementInterne {
  readonly cle: string;
  readonly ordre: number;
  readonly archive: ArchivePersistante;
}

interface OptionsMemoire extends OptionsDeRotation {
  readonly quotaOctets?: number;
}

export class ErreurQuotaSauvegarde extends Error {
  readonly code = "quota-sauvegarde";

  constructor(message = "L’espace disponible ne permet pas d’enregistrer la sauvegarde.") {
    super(message);
    this.name = "ErreurQuotaSauvegarde";
  }
}

function copierArchive(archive: ArchivePersistante): ArchivePersistante {
  return { ...archive };
}

function cleArchiveCourante(archive: ArchivePersistante): string {
  return `${archive.version}:courante:${archive.id}`;
}

function memeIdentiteEtContenu(
  enregistrement: EnregistrementInterne,
  archive: ArchivePersistante,
): boolean {
  return (
    enregistrement.archive.id === archive.id &&
    enregistrement.archive.version === archive.version &&
    enregistrement.archive.contenu === archive.contenu
  );
}

function resoudreCleArchiveProtegee(
  existants: readonly EnregistrementInterne[],
  archive: ArchivePersistante,
): string {
  const cleDeBase = `${archive.version}:protegee:${formaterEmpreinteFnv1a32V1(archive.contenu)}:${archive.id}`;
  const identiqueDejaNormalise = existants.find(
    (enregistrement) =>
      enregistrement.archive.protegeeDeLaRotation === true &&
      memeIdentiteEtContenu(enregistrement, archive) &&
      (enregistrement.cle === cleDeBase ||
        enregistrement.cle.startsWith(`${cleDeBase}:collision-`)),
  );
  if (identiqueDejaNormalise !== undefined) {
    return identiqueDejaNormalise.cle;
  }

  let suffixeDeCollision = 0;
  while (true) {
    const cle =
      suffixeDeCollision === 0
        ? cleDeBase
        : `${cleDeBase}:collision-${suffixeDeCollision}`;
    const occupant = existants.find(
      (enregistrement) => enregistrement.cle === cle,
    );
    if (occupant === undefined || memeIdentiteEtContenu(occupant, archive)) {
      return cle;
    }
    suffixeDeCollision += 1;
  }
}

function validerOptions(nombreDeSnapshots: number): void {
  if (!Number.isInteger(nombreDeSnapshots) || nombreDeSnapshots < 1) {
    throw new Error("Le nombre de snapshots tournants doit être positif.");
  }
}

function selectionnerEnregistrementsConserves(
  enregistrements: readonly EnregistrementInterne[],
  nombreDeSnapshots: number,
): readonly EnregistrementInterne[] {
  const courants = enregistrements
    .filter(
      (enregistrement) =>
        enregistrement.archive.version === VERSION_SAUVEGARDE_COURANTE &&
        enregistrement.archive.protegeeDeLaRotation !== true,
    )
    .sort((gauche, droite) => droite.ordre - gauche.ordre)
    .slice(0, nombreDeSnapshots);
  const archivesProtegees = enregistrements.filter(
    (enregistrement) =>
      enregistrement.archive.version !== VERSION_SAUVEGARDE_COURANTE ||
      enregistrement.archive.protegeeDeLaRotation === true,
  );

  return [...courants, ...archivesProtegees].sort(
    (gauche, droite) => droite.ordre - gauche.ordre,
  );
}

function tailleEnOctets(
  enregistrements: readonly EnregistrementInterne[],
): number {
  const encodeur = new TextEncoder();
  return enregistrements.reduce(
    (total, enregistrement) =>
      total +
      encodeur.encode(enregistrement.cle).byteLength +
      encodeur.encode(enregistrement.archive.contenu).byteLength,
    0,
  );
}

export function creerArchivePersistante(
  sauvegarde: SauvegardeCampagne,
): ArchivePersistante {
  return {
    id: sauvegarde.id,
    version: sauvegarde.version,
    contenu: exporterSauvegarde(sauvegarde),
  };
}

export function creerPortDePersistanceMemoire({
  nombreDeSnapshots = 5,
  quotaOctets = Number.POSITIVE_INFINITY,
}: OptionsMemoire = {}): PortDePersistanceSauvegardes {
  validerOptions(nombreDeSnapshots);
  let prochainOrdre = 1;
  let enregistrements = new Map<string, EnregistrementInterne>();

  const enregistrerAtomiquement = (
    archive: ArchivePersistante,
    cleARemplacer?: string,
  ) => {
    const candidat = new Map(enregistrements);
    const cle =
      archive.protegeeDeLaRotation === true
        ? resoudreCleArchiveProtegee([...candidat.values()], archive)
        : cleArchiveCourante(archive);
    const clesProtegeesIdentiques = [...candidat.values()]
      .filter(
        (enregistrement) =>
          enregistrement.cle !== cle &&
          enregistrement.archive.protegeeDeLaRotation === true &&
          memeIdentiteEtContenu(enregistrement, archive),
      )
      .map((enregistrement) => enregistrement.cle);
    clesProtegeesIdentiques.forEach((cleIdentique) =>
      candidat.delete(cleIdentique),
    );
    const candidatARemplacer =
      cleARemplacer === undefined
        ? undefined
        : candidat.get(cleARemplacer);
    const remplace =
      candidatARemplacer?.archive.contenu === archive.contenu
        ? candidatARemplacer
        : candidat.get(cle);
    if (candidatARemplacer?.archive.contenu === archive.contenu) {
      candidat.delete(candidatARemplacer.cle);
    }
    candidat.set(cle, {
      cle,
      ordre: remplace?.ordre ?? prochainOrdre,
      archive: copierArchive(archive),
    });
    const conserves = selectionnerEnregistrementsConserves(
      [...candidat.values()],
      nombreDeSnapshots,
    );

    if (tailleEnOctets(conserves) > quotaOctets) {
      throw new ErreurQuotaSauvegarde();
    }

    enregistrements = new Map(
      conserves.map((enregistrement) => [
        enregistrement.cle,
        enregistrement,
      ]),
    );
    if (remplace === undefined) {
      prochainOrdre += 1;
    }
  };

  return {
    enregistrer: async (archive) => {
      enregistrerAtomiquement(archive);
    },
    protegerDeLaRotation: async (archive) => {
      const archiveNonProtegee: ArchivePersistante = {
        id: archive.id,
        version: archive.version,
        contenu: archive.contenu,
      };
      enregistrerAtomiquement(
        { ...archive, protegeeDeLaRotation: true },
        cleArchiveCourante(archiveNonProtegee),
      );
    },
    lirePlusRecente: async () => {
      const [plusRecente] = [...enregistrements.values()].sort(
        (gauche, droite) => droite.ordre - gauche.ordre,
      );
      return plusRecente === undefined
        ? null
        : copierArchive(plusRecente.archive);
    },
    lister: async () =>
      [...enregistrements.values()]
        .sort((gauche, droite) => droite.ordre - gauche.ordre)
        .map((enregistrement) => copierArchive(enregistrement.archive)),
    fermer: () => undefined,
  };
}

function convertirErreurIndexedDb(erreur: unknown): Error {
  if (
    erreur instanceof DOMException &&
    erreur.name === "QuotaExceededError"
  ) {
    return new ErreurQuotaSauvegarde();
  }
  return erreur instanceof Error
    ? erreur
    : new Error("La persistance IndexedDB a échoué.");
}

function attendreTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () =>
      reject(convertirErreurIndexedDb(transaction.error));
    transaction.onerror = () =>
      reject(convertirErreurIndexedDb(transaction.error));
  });
}

function attendreRequete<T>(requete: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    requete.onsuccess = () => resolve(requete.result);
    requete.onerror = () => reject(convertirErreurIndexedDb(requete.error));
  });
}

export interface OptionsIndexedDb extends OptionsDeRotation {
  readonly nomDeBase?: string;
}

export function creerPortDePersistanceIndexedDb({
  nombreDeSnapshots = 5,
  nomDeBase = "lanternes-de-cendre",
}: OptionsIndexedDb = {}): PortDePersistanceSauvegardes {
  validerOptions(nombreDeSnapshots);
  let fermee = false;
  const ouverture = new Promise<IDBDatabase>((resolve, reject) => {
    const requete = indexedDB.open(nomDeBase, 1);
    requete.onupgradeneeded = () => {
      if (!requete.result.objectStoreNames.contains("sauvegardes")) {
        requete.result.createObjectStore("sauvegardes", { keyPath: "cle" });
      }
    };
    requete.onsuccess = () => {
      const base = requete.result;
      base.onversionchange = () => base.close();
      if (fermee) {
        base.close();
        reject(new Error("Le port IndexedDB a été fermé avant son ouverture."));
        return;
      }
      resolve(base);
    };
    requete.onerror = () => reject(convertirErreurIndexedDb(requete.error));
    requete.onblocked = () => {
      fermee = true;
      try {
        requete.result.close();
      } catch {
        // Aucune connexion n'est encore disponible sur la plupart des blocages.
      }
      reject(
        new Error(
          "La base de sauvegardes est bloquée par une autre session ouverte.",
        ),
      );
    };
  });

  const enregistrerAtomiquement = async (
    archive: ArchivePersistante,
    cleARemplacer?: string,
  ) => {
    const base = await ouverture;
    const transaction = base.transaction(
      "sauvegardes",
      "readwrite",
      { durability: "strict" },
    );
    const magasin = transaction.objectStore("sauvegardes");
    const existants = (await attendreRequete(
      magasin.getAll(),
    )) as EnregistrementInterne[];
    const cle =
      archive.protegeeDeLaRotation === true
        ? resoudreCleArchiveProtegee(existants, archive)
        : cleArchiveCourante(archive);
    const clesProtegeesIdentiques = existants
      .filter(
        (enregistrement) =>
          enregistrement.cle !== cle &&
          enregistrement.archive.protegeeDeLaRotation === true &&
          memeIdentiteEtContenu(enregistrement, archive),
      )
      .map((enregistrement) => enregistrement.cle);
    const candidatARemplacer = existants.find(
      (enregistrement) => enregistrement.cle === cleARemplacer,
    );
    const cleEffectivementRemplacee =
      candidatARemplacer?.archive.contenu === archive.contenu
        ? cleARemplacer
        : undefined;
    const remplace =
      cleEffectivementRemplacee === undefined
        ? existants.find((enregistrement) => enregistrement.cle === cle)
        : candidatARemplacer;
    const prochainOrdre =
      existants.reduce(
        (maximum, enregistrement) =>
          Math.max(maximum, enregistrement.ordre),
        0,
      ) + 1;
    const clesRemplacees = new Set(
      [
        cle,
        cleEffectivementRemplacee,
        ...clesProtegeesIdentiques,
      ].filter(
        (valeur): valeur is string => valeur !== undefined,
      ),
    );
    const candidat = [
      ...existants.filter(
        (enregistrement) => !clesRemplacees.has(enregistrement.cle),
      ),
      {
        cle,
        ordre: remplace?.ordre ?? prochainOrdre,
        archive: copierArchive(archive),
      },
    ];
    const conserves = selectionnerEnregistrementsConserves(
      candidat,
      nombreDeSnapshots,
    );
    const clesConservees = new Set(
      conserves.map((enregistrement) => enregistrement.cle),
    );

    for (const enregistrement of existants) {
      if (!clesConservees.has(enregistrement.cle)) {
        magasin.delete(enregistrement.cle);
      }
    }
    magasin.put({
      cle,
      ordre: remplace?.ordre ?? prochainOrdre,
      archive: copierArchive(archive),
    });

    await attendreTransaction(transaction);
  };

  return {
    enregistrer: async (archive) => {
      await enregistrerAtomiquement(archive);
    },
    protegerDeLaRotation: async (archive) => {
      const archiveNonProtegee: ArchivePersistante = {
        id: archive.id,
        version: archive.version,
        contenu: archive.contenu,
      };
      await enregistrerAtomiquement(
        { ...archive, protegeeDeLaRotation: true },
        cleArchiveCourante(archiveNonProtegee),
      );
    },
    lirePlusRecente: async () => {
      const base = await ouverture;
      const transaction = base.transaction("sauvegardes", "readonly");
      const enregistrements = (await attendreRequete(
        transaction.objectStore("sauvegardes").getAll(),
      )) as EnregistrementInterne[];
      await attendreTransaction(transaction);
      const [plusRecente] = enregistrements.sort(
        (gauche, droite) => droite.ordre - gauche.ordre,
      );
      return plusRecente === undefined
        ? null
        : copierArchive(plusRecente.archive);
    },
    lister: async () => {
      const base = await ouverture;
      const transaction = base.transaction("sauvegardes", "readonly");
      const enregistrements = (await attendreRequete(
        transaction.objectStore("sauvegardes").getAll(),
      )) as EnregistrementInterne[];
      await attendreTransaction(transaction);
      return enregistrements
        .sort((gauche, droite) => droite.ordre - gauche.ordre)
        .map((enregistrement) => copierArchive(enregistrement.archive));
    },
    fermer: () => {
      fermee = true;
      void ouverture.then(
        (base) => base.close(),
        () => undefined,
      );
    },
  };
}
