import { useEffect, useRef, type KeyboardEvent } from "react";

import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDeCriseActive } from "../application/crise";
import type { Langue } from "../content/types";

interface CriseDuConvoiProps {
  readonly application: ApplicationCampagne;
  readonly crise: ProjectionDeCriseActive;
  readonly langue: Langue;
}

const TEXTES = {
  fr: {
    type: "Décision irréversible",
    chaine: "Chaîne causale visible",
    dernierRecours: "Dernier recours",
    cout: "Coût connu",
    consequence: "Conséquence",
    mitigation: "Mitigation",
    pireConsequence: "Pire conséquence crédible",
    attribution: "Population concernée",
    confirmer: "Confirmer cette réponse",
  },
  en: {
    type: "Irreversible decision",
    chaine: "Visible causal chain",
    dernierRecours: "Last resort",
    cout: "Known cost",
    consequence: "Consequence",
    mitigation: "Mitigation",
    pireConsequence: "Worst credible consequence",
    attribution: "Affected population",
    confirmer: "Confirm this response",
  },
} as const;

export function CriseDuConvoi({
  application,
  crise,
  langue,
}: CriseDuConvoiProps) {
  const textes = TEXTES[langue];
  const titreId = `titre-${crise.id}`;
  const dialogue = useRef<HTMLElement>(null);

  useEffect(() => {
    const focusPrecedent =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const premiereReponse =
      dialogue.current?.querySelector<HTMLButtonElement>("button:not(:disabled)");
    (premiereReponse ?? dialogue.current)?.focus();
    return () => focusPrecedent?.focus();
  }, []);

  const contenirLeFocus = (evenement: KeyboardEvent<HTMLElement>) => {
    if (evenement.key !== "Tab" || dialogue.current === null) {
      return;
    }
    const controles = [...dialogue.current.querySelectorAll<HTMLElement>(
      'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
    )];
    const premier = controles[0];
    const dernier = controles.at(-1);
    if (premier === undefined || dernier === undefined) {
      evenement.preventDefault();
      dialogue.current.focus();
    } else if (evenement.shiftKey && document.activeElement === premier) {
      evenement.preventDefault();
      dernier.focus();
    } else if (!evenement.shiftKey && document.activeElement === dernier) {
      evenement.preventDefault();
      premier.focus();
    }
  };

  return (
    <section
      ref={dialogue}
      className="crise-du-convoi"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titreId}
      aria-describedby={`${titreId}-instruction`}
      tabIndex={-1}
      onKeyDown={contenirLeFocus}
    >
      <p className="type-de-crise">{textes.type}</p>
      <h2 id={titreId}>{crise.titre}</h2>
      <p>{crise.cause}</p>
      <ol aria-label={textes.chaine}>
        {crise.chaineVisible.map((maillon) => (
          <li key={maillon}>{maillon}</li>
        ))}
      </ol>
      <p id={`${titreId}-instruction`}>
        <strong>{crise.instruction}</strong>
      </p>
      <div className="reponses-de-crise">
        {crise.reponses.map((reponse) => (
          <article key={reponse.id}>
            <h3>{reponse.intention}</h3>
            {reponse.dernierRecours ? (
              <p className="dernier-recours">{textes.dernierRecours}</p>
            ) : null}
            <dl>
              <div>
                <dt>{textes.cout}</dt>
                <dd>{reponse.coutConnu}</dd>
              </div>
              <div>
                <dt>{textes.consequence}</dt>
                <dd>{reponse.consequence}</dd>
              </div>
              <div>
                <dt>{textes.mitigation}</dt>
                <dd>{reponse.mitigation}</dd>
              </div>
              <div>
                <dt>{textes.pireConsequence}</dt>
                <dd>{reponse.pireConsequence}</dd>
              </div>
              <div>
                <dt>{textes.attribution}</dt>
                <dd>{reponse.attribution}</dd>
              </div>
            </dl>
            <button
              type="button"
              disabled={!reponse.viable}
              aria-label={`${textes.confirmer} — ${reponse.intention}`}
              aria-describedby={
                reponse.refus === null ? undefined : `${reponse.id}-refus`
              }
              onClick={() =>
                application.envoyerCommande({
                  type: "crise.resoudre",
                  criseId: crise.id,
                  reponseId: reponse.id,
                })
              }
            >
              {textes.confirmer}
            </button>
            {reponse.refus === null ? null : (
              <p id={`${reponse.id}-refus`}>{reponse.refus}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
