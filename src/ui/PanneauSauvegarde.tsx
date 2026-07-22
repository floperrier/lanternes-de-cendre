import { useRef, useState, type ChangeEvent } from "react";

import type { ControleurDeSessionCampagne } from "../sauvegarde/controleur";
import type { ArchivePersistante } from "../sauvegarde/persistance";
import { TAILLE_MAX_ARCHIVE_SAUVEGARDE } from "../sauvegarde/sauvegarde";
import type { ResultatImportCampagne } from "../sauvegarde/session";
import { choisirMessageDeSauvegarde } from "./messageSauvegarde";

interface PropsPanneauSauvegarde {
  readonly controleur: ControleurDeSessionCampagne;
  readonly statutAutomatique: string;
  readonly erreurAsynchrone?: string;
  readonly explicationInitiale?: string;
  readonly archiveIncompatibleInitiale?: ArchivePersistante;
}

function telechargerArchive(contenu: string, nom: string): void {
  const url = URL.createObjectURL(
    new Blob([contenu], { type: "application/json" }),
  );
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = nom;
  lien.click();
  URL.revokeObjectURL(url);
}

export function PanneauSauvegarde({
  controleur,
  statutAutomatique,
  erreurAsynchrone,
  explicationInitiale,
  archiveIncompatibleInitiale,
}: PropsPanneauSauvegarde) {
  const [message, definirMessage] = useState<string | null>(
    explicationInitiale ?? null,
  );
  const [archiveIncompatible, definirArchiveIncompatible] = useState(
    archiveIncompatibleInitiale,
  );
  const importeur = useRef<HTMLInputElement>(null);

  const sauvegarder = async () => {
    definirMessage("Sauvegarde en cours…");
    try {
      await controleur.sauvegarderMaintenant();
      definirMessage("Sauvegarde à jour.");
    } catch (erreur) {
      definirMessage(
        erreur instanceof Error
          ? erreur.message
          : "La sauvegarde a échoué.",
      );
    }
  };

  const exporter = () => {
    definirMessage("Préparation de l’export…");
    try {
      const contenu = controleur.exporter();
      telechargerArchive(contenu, "lanternes-de-cendre-sauvegarde.json");
      definirMessage("Export portable prêt.");
    } catch (erreur) {
      definirMessage(
        erreur instanceof Error ? erreur.message : "L’export a échoué.",
      );
    }
  };

  const importer = async (evenement: ChangeEvent<HTMLInputElement>) => {
    const entreeFichier = evenement.currentTarget;
    const fichier = entreeFichier.files?.[0];
    if (fichier === undefined) {
      return;
    }

    if (fichier.size > TAILLE_MAX_ARCHIVE_SAUVEGARDE) {
      definirMessage("Le fichier dépasse la limite de 8 Mio.");
      entreeFichier.value = "";
      return;
    }

    definirMessage("Import en cours…");
    let resultat: ResultatImportCampagne;
    try {
      const archiveOriginale = await fichier.text();
      resultat = await controleur.importer(archiveOriginale);
    } catch (erreur) {
      definirMessage(
        erreur instanceof Error ? erreur.message : "L’import a échoué.",
      );
      return;
    } finally {
      entreeFichier.value = "";
    }

    if (resultat.statut === "compatible" || resultat.statut === "migree") {
      if (resultat.statut === "migree") {
        const original = JSON.parse(resultat.archiveOriginale) as {
          readonly id: string;
          readonly version: number;
        };
        definirArchiveIncompatible({
          id: original.id,
          version: original.version,
          contenu: resultat.archiveOriginale,
        });
      } else {
        definirArchiveIncompatible(undefined);
      }
      const messageDeReprise =
        resultat.erreurPersistance ??
        (resultat.statut === "migree"
          ? "Sauvegarde migrée et reprise. L’original reste exportable."
          : "Sauvegarde importée et reprise.");
      definirMessage(messageDeReprise);
      return;
    }

    definirMessage(
      resultat.statut === "incompatible" &&
        resultat.erreurPersistance !== undefined
        ? `${resultat.explication} ${resultat.erreurPersistance}`
        : resultat.explication,
    );
    if (resultat.statut === "incompatible") {
      definirArchiveIncompatible({
        id: resultat.id,
        version: resultat.version,
        contenu: resultat.archiveOriginale,
      });
    }
  };

  const statutAffiche = choisirMessageDeSauvegarde({
    erreurAsynchrone,
    messageLocal: message,
    statutAutomatique,
  });

  return (
    <section className="panneau-sauvegarde" aria-label="Sauvegarde de Campagne">
      <div className="panneau-sauvegarde__commandes">
        <button type="button" onClick={() => void sauvegarder()}>
          Sauvegarder
        </button>
        <button type="button" onClick={() => void exporter()}>
          Exporter
        </button>
        <button type="button" onClick={() => importeur.current?.click()}>
          Importer
        </button>
        <input
          ref={importeur}
          className="sr-only"
          type="file"
          accept="application/json,.json"
          aria-label="Choisir une sauvegarde à importer"
          onChange={(evenement) => void importer(evenement)}
        />
        {archiveIncompatible === undefined ? null : (
          <button
            type="button"
            onClick={() =>
              telechargerArchive(
                archiveIncompatible.contenu,
                `lanternes-de-cendre-${archiveIncompatible.id}-original.json`,
              )
            }
          >
            Réexporter l’original
          </button>
        )}
      </div>
      <p role="status" aria-live="polite">
        {statutAffiche}
      </p>
    </section>
  );
}
