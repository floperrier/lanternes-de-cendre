import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDExpedition } from "../application/expeditions";
import type {
  ProjectionDeLAtlas,
  TronconProjete,
} from "../application/routes";
import { AtlasPixi } from "./AtlasPixi";
import { ExpeditionDansAtlas } from "./ExpeditionDansAtlas";

interface AtlasProps {
  readonly application: ApplicationCampagne;
  readonly projection: ProjectionDeLAtlas;
  readonly expedition: ProjectionDExpedition;
  readonly langue: "fr" | "en";
}

interface TronconDansAtlasProps {
  readonly projection: ProjectionDeLAtlas;
  readonly troncon: TronconProjete;
  readonly etudier: (
    troncon: TronconProjete,
    declencheur: HTMLButtonElement,
  ) => void;
}

function TronconDansAtlas({
  projection,
  troncon,
  etudier,
}: TronconDansAtlasProps) {
  return (
    <article className="atlas__troncon">
      <header>
        <div>
          <h3>{troncon.libelle}</h3>
          <p>{troncon.connexion}</p>
        </div>
        <p>{troncon.duree}</p>
      </header>
      <p>{troncon.consommation}</p>

      {troncon.engageable ? (
        <button
          type="button"
          onClick={(evenement) => etudier(troncon, evenement.currentTarget)}
          aria-label={`${projection.actionEtudier} ${troncon.libelle}`}
        >
          {projection.actionEtudier} {troncon.libelle}
        </button>
      ) : null}

      <section aria-label={projection.libelleRenseignements}>
        <h4>{projection.libelleRenseignements}</h4>
        <ol className="atlas__renseignements">
          {troncon.renseignements.map((renseignement) => (
            <li key={`${renseignement.source}-${renseignement.age}`}>
              <p>
                <strong>{renseignement.source}</strong> · {renseignement.age} ·{" "}
                {renseignement.fiabilite}
              </p>
              <ul>
                <li>{renseignement.etat}</li>
                <li>{renseignement.meteo}</li>
                <li>{renseignement.panache}</li>
                <li>{renseignement.danger}</li>
                <li>{renseignement.controlePolitique}</li>
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="atlas__bilan" aria-label={projection.libelleBilan}>
        <h4>{projection.libelleBilan}</h4>
        <h5>{projection.libelleConnu}</h5>
        <ul>
          {troncon.bilan.consequencesConnues.map((consequence) => (
            <li key={consequence}>{consequence}</li>
          ))}
        </ul>
        <h5>{projection.libelleIncertain}</h5>
        <ul>
          {troncon.bilan.incertitudes.map((incertitude) => (
            <li key={incertitude.valeur}>
              {incertitude.valeur}
              <small>
                {incertitude.source} · {incertitude.age}
              </small>
            </li>
          ))}
        </ul>
      </section>

    </article>
  );
}

export function Atlas({ application, projection, expedition, langue }: AtlasProps) {
  const [tronconAConfirmer, choisirTroncon] = useState<TronconProjete | null>(
    null,
  );
  const dialogueDeConfirmation = useRef<HTMLDialogElement>(null);
  const declencheurDuDialogue = useRef<HTMLButtonElement | null>(null);
  const boutonDeConfirmation = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialogue = dialogueDeConfirmation.current;
    if (
      tronconAConfirmer !== null &&
      dialogue !== null &&
      !dialogue.open
    ) {
      dialogue.showModal();
      boutonDeConfirmation.current?.focus();
    }
  }, [tronconAConfirmer]);

  const etudier = (
    troncon: TronconProjete,
    declencheur: HTMLButtonElement,
  ) => {
    declencheurDuDialogue.current = declencheur;
    choisirTroncon(troncon);
  };

  const annuler = () => {
    dialogueDeConfirmation.current?.close();
    choisirTroncon(null);
    declencheurDuDialogue.current?.focus();
  };

  const maintenirFocusDansDialogue = (
    evenement: KeyboardEvent<HTMLDialogElement>,
  ) => {
    if (evenement.key !== "Tab") {
      return;
    }
    const elements = Array.from(
      evenement.currentTarget.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      ),
    );
    const premier = elements.at(0);
    const dernier = elements.at(-1);
    if (premier === undefined || dernier === undefined) {
      return;
    }
    if (
      evenement.shiftKey &&
      (document.activeElement === premier ||
        !evenement.currentTarget.contains(document.activeElement))
    ) {
      evenement.preventDefault();
      dernier.focus();
      return;
    }
    if (!evenement.shiftKey && document.activeElement === dernier) {
      evenement.preventDefault();
      premier.focus();
    }
  };

  const confirmer = () => {
    if (tronconAConfirmer === null) {
      return;
    }
    dialogueDeConfirmation.current?.close();
    application.envoyerCommande({
      type: "engagement-de-route.confirmer",
      tronconId: tronconAConfirmer.id,
    });
    choisirTroncon(null);
  };

  return (
    <section
      className="atlas"
      aria-labelledby="titre-atlas"
      lang={langue}
    >
      <header className="atlas__entete">
        <div>
          <p>{projection.libellePosition}</p>
          <p>{projection.position}</p>
        </div>
        <h2 id="titre-atlas">{projection.titre}</h2>
      </header>

      <ExpeditionDansAtlas
        application={application}
        projection={expedition}
        langue={langue}
      />

      {projection.engagement === null ? null : (
        <p className="atlas__engagement" role="status">
          {projection.engagement.destination} · {projection.engagement.arrivee} ·{" "}
          {projection.engagement.retour}
        </p>
      )}
      {projection.dernierJalon === null ? null : (
        <p className="atlas__jalon">
          <time>{projection.dernierJalon.moment}</time> ·{" "}
          {projection.dernierJalon.cause}
        </p>
      )}

      <div className="atlas__reseau">
        <AtlasPixi projection={projection} />
      </div>

      <div className="atlas__actions">
        {projection.troncons
          .filter((troncon) => troncon.engageable)
          .map((troncon) => (
            <button
              key={troncon.id}
              type="button"
              onClick={(evenement) =>
                etudier(troncon, evenement.currentTarget)
              }
              aria-label={`${projection.actionEtudier} ${troncon.libelle}`}
            >
              {projection.actionEtudier} {troncon.libelle}
            </button>
          ))}
      </div>

      <details className="atlas__alternative">
        <summary>{projection.libelleVueListe}</summary>
        <ul className="atlas__liste-dom">
          {projection.troncons.map((troncon) => (
            <li key={troncon.id}>
              <TronconDansAtlas
                projection={projection}
                troncon={troncon}
                etudier={etudier}
              />
            </li>
          ))}
        </ul>
      </details>

      {tronconAConfirmer === null ? null : (
        <dialog
          ref={dialogueDeConfirmation}
          className="atlas__confirmation"
          aria-labelledby="titre-confirmation-engagement"
          onCancel={(evenement) => {
            evenement.preventDefault();
            annuler();
          }}
          onKeyDown={maintenirFocusDansDialogue}
        >
          <h2 id="titre-confirmation-engagement">
            {langue === "fr" ? "Engagement vers" : "Commitment to"}{" "}
            {tronconAConfirmer.destination}
          </h2>
          <p>{projection.avertissementIrreversible}</p>
          <ul>
            {tronconAConfirmer.bilan.consequencesConnues.map((consequence) => (
              <li key={consequence}>{consequence}</li>
            ))}
            {tronconAConfirmer.bilan.incertitudes.map((incertitude) => (
              <li key={incertitude.valeur}>
                {incertitude.valeur} · {incertitude.source} · {incertitude.age}
              </li>
            ))}
          </ul>
          <div>
            <button
              ref={boutonDeConfirmation}
              autoFocus
              type="button"
              aria-label={`${projection.actionConfirmer} ${tronconAConfirmer.destination}`}
              onClick={confirmer}
            >
              {projection.actionConfirmer} {tronconAConfirmer.destination}
            </button>
            <button type="button" onClick={annuler}>
              {projection.actionAnnuler}
            </button>
          </div>
        </dialog>
      )}
    </section>
  );
}
