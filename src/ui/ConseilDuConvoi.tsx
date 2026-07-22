import { useEffect, useRef } from "react";

import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDuConseil } from "../application/conseil";
import type { Langue } from "../content/types";

interface ConseilDuConvoiProps {
  readonly application: ApplicationCampagne;
  readonly conseil: ProjectionDuConseil;
  readonly langue: Langue;
}

export function ConseilDuConvoi({
  application,
  conseil,
  langue,
}: ConseilDuConvoiProps) {
  const titreId = `titre-${conseil.id}`;
  const titre = useRef<HTMLHeadingElement>(null);
  const libelles = conseil.libelles;

  useEffect(() => {
    titre.current?.focus();
  }, []);

  return (
    <section
      className="ruban-narratif ruban-narratif--sans-asset ruban-du-conseil"
      aria-labelledby={titreId}
      lang={langue}
    >
      <div className="ruban-narratif__contenu">
        <p className="ruban-narratif__origine">{libelles.conseil}</p>
        <h2 ref={titre} id={titreId} tabIndex={-1}>{conseil.titre}</h2>

        <div className="sujets-du-conseil">
          {conseil.sujets.map((sujet) => (
            <section key={sujet.id} aria-labelledby={`sujet-${sujet.id}`}>
              <h3 id={`sujet-${sujet.id}`}>{sujet.titre}</h3>
              <div className="voix-du-conseil">
                {sujet.voix.map((voix) => (
                  <article key={voix.compagnonId}>
                    <h4>{voix.compagnon}</h4>
                    <dl>
                      <div>
                        <dt>{libelles.fait}</dt>
                        <dd>{voix.faitConnu}</dd>
                      </div>
                      <div>
                        <dt>{libelles.source}</dt>
                        <dd>
                          {voix.source.nom} · {voix.source.date}
                        </dd>
                      </div>
                      <div>
                        <dt>{libelles.recommandation}</dt>
                        <dd>{voix.recommandationMorale}</dd>
                      </div>
                      <div>
                        <dt>{libelles.enjeu}</dt>
                        <dd>{voix.enjeuPersonnel}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
              <div
                className="ruban-narratif__choix"
                role="group"
                aria-label={libelles.decision}
              >
                {sujet.decisions.map((decision) => (
                  <button
                    key={decision.id}
                    type="button"
                    onClick={() =>
                      application.envoyerCommande({
                        type: "conseil.decider",
                        conseilId: conseil.id,
                        sujetId: sujet.id,
                        decisionId: decision.id,
                      })
                    }
                  >
                    <span>{decision.libelle}</span>
                    {decision.ouverteParAffectation ? (
                      <small>{libelles.reponseOuverte}</small>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
