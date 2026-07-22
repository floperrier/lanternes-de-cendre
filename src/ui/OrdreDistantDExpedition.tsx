import { useEffect, useRef } from "react";

import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDExpedition } from "../application/expeditions";
import type { Langue } from "../content/types";

interface OrdreDistantDExpeditionProps {
  readonly application: ApplicationCampagne;
  readonly expedition: ProjectionDExpedition;
  readonly langue: Langue;
}

export function OrdreDistantDExpedition({
  application,
  expedition,
  langue,
}: OrdreDistantDExpeditionProps) {
  const ordre = expedition.ordreImportant;
  const titre = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titre.current?.focus();
  }, []);

  if (ordre === null) {
    return null;
  }
  const titreId = `titre-ordre-${expedition.id}`;
  const libelles = expedition.libelles;
  return (
    <section
      className="ruban-narratif ruban-narratif--sans-asset ordre-distant-expedition"
      aria-labelledby={titreId}
      lang={langue}
    >
      <div className="ruban-narratif__contenu">
        <p className="ruban-narratif__origine">
          Liora · {libelles.expedition} · {libelles.decision}
        </p>
        <h2 ref={titre} id={titreId} tabIndex={-1}>{ordre.titre}</h2>
        <dl className="ordre-distant-expedition__contexte">
          <div><dt>{libelles.faitConnu}</dt><dd>{ordre.faitConnu}</dd></div>
          <div><dt>{libelles.source}</dt><dd>{ordre.source}</dd></div>
          <div><dt>{libelles.recommandation}</dt><dd>{ordre.recommandation}</dd></div>
          <div><dt>{libelles.enjeuPersonnel}</dt><dd>{ordre.enjeuPersonnel}</dd></div>
        </dl>
        <p className="ordre-distant-expedition__temps">{ordre.regleTemps}</p>
        <div
          className="ruban-narratif__choix"
          role="group"
          aria-label={libelles.decision}
        >
          {ordre.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                application.envoyerCommande({
                  type: "expedition.ordonner",
                  expeditionId: expedition.id,
                  intention: option.id,
                })
              }
            >
              <span>{option.intention}</span>
              <small>{option.consequences}</small>
              <small>{option.source} · {option.age}</small>
              {option.recommandee ? <small>{libelles.recommandee}</small> : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
