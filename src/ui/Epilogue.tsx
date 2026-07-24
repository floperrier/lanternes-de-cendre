import { useEffect, useRef } from "react";

import type { ProjectionDeLEpilogue } from "../application/epilogue";
import type { Langue } from "../content/types";

export function Epilogue({
  projection,
  langue,
}: {
  readonly projection: ProjectionDeLEpilogue;
  readonly langue: Langue;
}) {
  const titre = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titre.current?.focus({ preventScroll: true });
  }, []);

  if (!projection.visible) {
    return null;
  }

  return (
    <article
      className="epilogue-campagne"
      aria-labelledby="titre-epilogue"
      lang={langue}
    >
      <header className="epilogue-campagne__entete">
        <p className="eyebrow">{projection.eyebrow}</p>
        <h2 ref={titre} id="titre-epilogue" tabIndex={-1}>
          {projection.titre}
        </h2>
        <p>{projection.introduction}</p>
      </header>

      <section
        className="epilogue-campagne__bilan"
        aria-labelledby="titre-bilan-epilogue"
      >
        <h3 id="titre-bilan-epilogue">
          {projection.libelles.axes}
        </h3>
        <dl className="epilogue-campagne__axes">
          {projection.axes.map((axe) => (
            <div key={axe.id}>
              <dt>{axe.libelle}</dt>
              <dd>{axe.valeur}</dd>
            </div>
          ))}
          <div>
            <dt>{projection.sortDuCoeur.libelle}</dt>
            <dd>{projection.sortDuCoeur.valeur}</dd>
          </div>
        </dl>
      </section>

      <section
        className="epilogue-campagne__revelation"
        aria-labelledby="titre-revelation-epilogue"
      >
        <h3 id="titre-revelation-epilogue">
          {projection.revelation.libelle}
        </h3>
        <p>{projection.revelation.valeur}</p>
      </section>

      <section
        className="epilogue-campagne__compagnons"
        aria-labelledby="titre-compagnons-epilogue"
      >
        <h3 id="titre-compagnons-epilogue">
          {projection.libelles.compagnons}
        </h3>
        <div className="epilogue-campagne__grille">
          {projection.compagnons.map((compagnon) => (
            <article key={compagnon.id}>
              <h4>{compagnon.nom}</h4>
              <dl>
                <div>
                  <dt>{projection.libelles.statut}</dt>
                  <dd>{compagnon.statut}</dd>
                </div>
                <div>
                  <dt>{projection.libelles.sante}</dt>
                  <dd>{compagnon.sante}</dd>
                </div>
                <div>
                  <dt>{projection.libelles.projet}</dt>
                  <dd>{compagnon.projet}</dd>
                </div>
                {compagnon.lien === null ? null : (
                  <div>
                    <dt>{projection.libelles.lien}</dt>
                    <dd>{compagnon.lien}</dd>
                  </div>
                )}
                {compagnon.rancune === null ? null : (
                  <div>
                    <dt>{projection.libelles.rancune}</dt>
                    <dd>{compagnon.rancune}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <div className="epilogue-campagne__retours">
        {projection.retours.map((retour) => (
          <section key={retour.id} aria-labelledby={`epilogue-${retour.id}`}>
            <h3 id={`epilogue-${retour.id}`}>{retour.titre}</h3>
            {retour.elements.length === 0 ? (
              <p>{projection.libelles.aucun}</p>
            ) : (
              <ul>
                {retour.elements.map((element) => (
                  <li key={element.id}>
                    <strong>{element.nom}</strong>
                    <span>{element.devenir}</span>
                    <details>
                      <summary>{projection.libelles.causes}</summary>
                      <ul>
                        {element.causes.map((cause) => (
                          <li key={cause}>{cause}</li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
