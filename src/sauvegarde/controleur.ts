import type { ApplicationCampagne } from "../application/application";
import {
  empreinteEtat,
  type EtatCampagne,
  type GraineDeCampagne,
} from "../simulation/campagne";
import {
  creerPortDePersistanceIndexedDb,
  type ArchivePersistante,
  type PortDePersistanceSauvegardes,
} from "./persistance";
import type {
  ResultatImportCampagne,
  ResultatOuvertureCampagne,
} from "./session";
import {
  exporterCampagne,
  importerCampagne,
  ouvrirCampagne,
  sauvegarderCampagne,
} from "./session";
import type {
  CommandeDeReproduction,
  ReproductionDeCampagne,
} from "./types";

export type EtatDuControleurDeSession =
  | { readonly statut: "chargement" }
  | { readonly statut: "erreur"; readonly explication: string }
  | {
      readonly statut: "ouverte";
      readonly ouverture: ResultatOuvertureCampagne;
      readonly statutSauvegarde: string;
      readonly erreurSauvegarde: string | undefined;
    };

export interface ControleurDeSessionCampagne {
  readonly lireEtat: () => EtatDuControleurDeSession;
  readonly sabonner: (ecouteur: () => void) => () => void;
  readonly attendreOuverture: () => Promise<void>;
  readonly sauvegarderMaintenant: () => Promise<void>;
  readonly exporter: () => string;
  readonly importer: (archiveOriginale: string) => Promise<ResultatImportCampagne>;
  readonly fermer: () => void;
}

export interface OptionsDuControleur {
  readonly port: PortDePersistanceSauvegardes;
  readonly graine: GraineDeCampagne;
  readonly delaiDEcriture?: number;
}

interface JournalMutable {
  snapshot: EtatCampagne;
  empreinteSnapshot: string;
  commandes: CommandeDeReproduction[];
}

interface CaptureDeSauvegarde {
  readonly application: ApplicationCampagne;
  readonly etat: EtatCampagne;
  readonly reproduction: ReproductionDeCampagne;
  readonly nombreDeCommandes: number;
}

function messageDErreur(erreur: unknown): string {
  return erreur instanceof Error
    ? erreur.message
    : "La sauvegarde locale a échoué.";
}

export function creerControleurDeSessionCampagne({
  port,
  graine,
  delaiDEcriture = 300,
}: OptionsDuControleur): ControleurDeSessionCampagne {
  let etat: EtatDuControleurDeSession = { statut: "chargement" };
  let application: ApplicationCampagne | undefined;
  let journal: JournalMutable | undefined;
  let generation = 0;
  let remplacementEnCours = false;
  let nombreDImportsEnAttente = 0;
  let fermee = false;
  let temporisation: ReturnType<typeof setTimeout> | undefined;
  let fileDOperations: Promise<void> = Promise.resolve();
  let seDesabonnerDesCommandes: (() => void) | undefined;
  const ecouteurs = new Set<() => void>();

  const publier = (nouvelEtat: EtatDuControleurDeSession) => {
    etat = nouvelEtat;
    ecouteurs.forEach((ecouteur) => ecouteur());
  };

  const publierStatutSauvegarde = (
    statutSauvegarde: string,
    erreurSauvegarde: string | undefined = undefined,
  ) => {
    if (etat.statut === "ouverte") {
      publier({ ...etat, statutSauvegarde, erreurSauvegarde });
    }
  };

  const enfilerOperation = <Resultat,>(
    operation: () => Promise<Resultat>,
  ): Promise<Resultat> => {
    const resultat = fileDOperations.then(operation);
    fileDOperations = resultat.then(
      () => undefined,
      () => undefined,
    );
    return resultat;
  };

  const reproductionCourante = (): ReproductionDeCampagne => {
    if (journal === undefined) {
      throw new Error("La Campagne n’est pas encore ouverte.");
    }
    return {
      snapshot: journal.snapshot,
      empreinteSnapshot: journal.empreinteSnapshot,
      commandes: [...journal.commandes],
    };
  };

  const capturer = (): CaptureDeSauvegarde => {
    if (application === undefined || journal === undefined) {
      throw new Error("La Campagne n’est pas encore ouverte.");
    }
    const etatCapture = application.lireEtat();
    return {
      application,
      etat: etatCapture,
      reproduction: reproductionCourante(),
      nombreDeCommandes: journal.commandes.length,
    };
  };

  const avancerCheckpoint = (
    capture: CaptureDeSauvegarde,
    generationDeLEcriture: number,
  ) => {
    if (
      generationDeLEcriture !== generation ||
      application !== capture.application ||
      journal === undefined
    ) {
      return;
    }

    journal.snapshot = capture.etat;
    journal.empreinteSnapshot = empreinteEtat(capture.etat);
    journal.commandes = journal.commandes
      .slice(capture.nombreDeCommandes)
      .map((entree, sequence) => ({ ...entree, sequence }));
  };

  const enfilerSauvegarde = (
    generationDeLEcriture: number,
  ): Promise<void> => {
    return enfilerOperation(async () => {
      if (generationDeLEcriture !== generation) {
        return;
      }
      const capture = capturer();
      publierStatutSauvegarde("Sauvegarde en cours…");
      await sauvegarderCampagne(
        port,
        capture.application,
        capture.reproduction,
      );
      avancerCheckpoint(capture, generationDeLEcriture);
      if (generationDeLEcriture === generation) {
        publierStatutSauvegarde("Sauvegarde à jour.");
      }
    });
  };

  const planifierSauvegarde = () => {
    if (remplacementEnCours || application === undefined) {
      return;
    }
    if (temporisation !== undefined) {
      clearTimeout(temporisation);
    }
    const generationPlanifiee = generation;
    temporisation = setTimeout(() => {
      temporisation = undefined;
      void enfilerSauvegarde(generationPlanifiee).catch((erreur: unknown) => {
        if (generationPlanifiee === generation) {
          const message = messageDErreur(erreur);
          publierStatutSauvegarde(message, message);
        }
      });
    }, delaiDEcriture);
  };

  const brancherOuverture = (
    ouverture: ResultatOuvertureCampagne,
    erreurSauvegarde: string | undefined = undefined,
  ) => {
    seDesabonnerDesCommandes?.();
    application = ouverture.application;
    journal = {
      snapshot: ouverture.reproduction.snapshot,
      empreinteSnapshot: ouverture.reproduction.empreinteSnapshot,
      commandes: [...ouverture.reproduction.commandes],
    };
    seDesabonnerDesCommandes = application.sabonnerAuxCommandes(
      (commande, nouvelEtat) => {
        if (journal === undefined) {
          return;
        }
        journal.commandes.push({
          sequence: journal.commandes.length,
          commande,
          empreinteApres: empreinteEtat(nouvelEtat),
        });
        planifierSauvegarde();
      },
    );
    publier({
      statut: "ouverte",
      ouverture,
      statutSauvegarde: ouverture.explication ?? "",
      erreurSauvegarde,
    });
  };

  const ouverture = ouvrirCampagne(port, graine)
    .then((resultat) => {
      brancherOuverture(resultat);
      planifierSauvegarde();
    })
    .catch((erreur: unknown) => {
      publier({ statut: "erreur", explication: messageDErreur(erreur) });
      throw erreur;
    });

  return {
    lireEtat: () => etat,
    sabonner: (ecouteur) => {
      ecouteurs.add(ecouteur);
      return () => ecouteurs.delete(ecouteur);
    },
    attendreOuverture: () => ouverture,
    sauvegarderMaintenant: async () => {
      if (temporisation !== undefined) {
        clearTimeout(temporisation);
        temporisation = undefined;
      }
      try {
        await enfilerSauvegarde(generation);
      } catch (erreur) {
        const message = messageDErreur(erreur);
        publierStatutSauvegarde(message, message);
        throw erreur;
      }
    },
    exporter: () => {
      if (application === undefined) {
        throw new Error("La Campagne n’est pas encore ouverte.");
      }
      if (remplacementEnCours) {
        throw new Error("L’export attend la fin de l’import en cours.");
      }
      return exporterCampagne(application, reproductionCourante());
    },
    importer: async (archiveOriginale) => {
      generation += 1;
      nombreDImportsEnAttente += 1;
      remplacementEnCours = true;
      if (temporisation !== undefined) {
        clearTimeout(temporisation);
        temporisation = undefined;
      }
      publierStatutSauvegarde("Import en cours…");
      return enfilerOperation(async () => {
        const terminerImport = () => {
          nombreDImportsEnAttente -= 1;
          remplacementEnCours = nombreDImportsEnAttente > 0 || fermee;
        };

        let resultat: ResultatImportCampagne;
        try {
          resultat = await importerCampagne(port, archiveOriginale);
        } catch (erreur) {
          terminerImport();
          if (!fermee && nombreDImportsEnAttente === 0) {
            const message = messageDErreur(erreur);
            publierStatutSauvegarde(message, message);
            planifierSauvegarde();
          }
          throw erreur;
        }

        terminerImport();
        if (fermee) {
          return resultat;
        }

        try {
          if (
            resultat.statut === "compatible" ||
            resultat.statut === "migree"
          ) {
            brancherOuverture(
              {
                statut: "reprise",
                application: resultat.application,
                reproduction: resultat.reproduction,
                explication:
                  resultat.erreurPersistance ??
                  (resultat.statut === "migree"
                    ? "Sauvegarde migrée et reprise. L’original reste exportable."
                    : "Sauvegarde importée et reprise."),
              },
              resultat.erreurPersistance,
            );
            return resultat;
          }

          if (etat.statut === "ouverte") {
            const archiveIncompatible: ArchivePersistante | undefined =
              resultat.statut === "incompatible"
                ? {
                    id: resultat.id,
                    version: resultat.version,
                    contenu: resultat.archiveOriginale,
                  }
                : etat.ouverture.archiveIncompatible;
            const erreurDePersistance =
              resultat.statut === "incompatible"
                ? resultat.erreurPersistance
                : undefined;
            const explication =
              erreurDePersistance === undefined
                ? resultat.explication
                : `${resultat.explication} ${erreurDePersistance}`;
            publier({
              ...etat,
              ouverture: {
                ...etat.ouverture,
                explication,
                ...(archiveIncompatible === undefined
                  ? {}
                  : { archiveIncompatible }),
              },
              statutSauvegarde: explication,
              erreurSauvegarde:
                erreurDePersistance === undefined
                  ? undefined
                  : explication,
            });
          }
          planifierSauvegarde();
          return resultat;
        } catch (erreur) {
          if (!fermee && nombreDImportsEnAttente === 0) {
            const message = messageDErreur(erreur);
            publierStatutSauvegarde(message, message);
            planifierSauvegarde();
          }
          throw erreur;
        }
      });
    },
    fermer: () => {
      fermee = true;
      generation += 1;
      remplacementEnCours = true;
      if (temporisation !== undefined) {
        clearTimeout(temporisation);
      }
      seDesabonnerDesCommandes?.();
      port.fermer();
      ecouteurs.clear();
    },
  };
}

export function creerControleurDeSessionNavigateur(
  graine: GraineDeCampagne,
): ControleurDeSessionCampagne {
  return creerControleurDeSessionCampagne({
    port: creerPortDePersistanceIndexedDb(),
    graine,
  });
}
