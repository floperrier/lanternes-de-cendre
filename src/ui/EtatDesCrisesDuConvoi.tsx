import type { ProjectionDesCrises } from "../application/crise";
import type { Langue } from "../content/types";

interface EtatDesCrisesDuConvoiProps {
  readonly projection: ProjectionDesCrises;
  readonly langue: Langue;
}

const TEXTES = {
  fr: {
    aria: "Crises et Cicatrices",
    fenetre: "Fenêtre de décision",
    cicatrices: "Cicatrices de campagne",
    cause: "Cause",
    cout: "Coût",
    recuperation: "Récupération",
  },
  en: {
    aria: "Crises and Scars",
    fenetre: "Decision window",
    cicatrices: "Campaign Scars",
    cause: "Cause",
    cout: "Cost",
    recuperation: "Recovery",
  },
} as const;

export function EtatDesCrisesDuConvoi({
  projection,
  langue,
}: EtatDesCrisesDuConvoiProps) {
  const textes = TEXTES[langue];
  if (
    projection.alerte === null &&
    projection.cicatrices.length === 0 &&
    projection.recuperations.length === 0
  ) {
    return null;
  }
  return (
    <section className="etat-des-crises" aria-label={textes.aria}>
      {projection.alerte === null ? null : (
        <div role="status" className="alerte-de-crise">
          <h2>{projection.alerte.titre}</h2>
          <p>{projection.alerte.cause}</p>
          <p>
            {textes.fenetre} : <strong>{projection.alerte.echeance}</strong>
          </p>
        </div>
      )}
      {projection.cicatrices.length === 0 ? null : (
        <div>
          <h2>{textes.cicatrices}</h2>
          {projection.cicatrices.map((cicatrice) => (
            <article key={cicatrice.id}>
              <h3>{cicatrice.titre}</h3>
              <p>{textes.cause} : {cicatrice.cause}</p>
              <p>{cicatrice.consequence}</p>
            </article>
          ))}
        </div>
      )}
      {projection.recuperations.length === 0 ? null : (
        <div>
          <h2>{textes.recuperation}</h2>
          {projection.recuperations.map((recuperation) => (
            <article key={recuperation.id}>
              <h3>{recuperation.statut}</h3>
              <p>{recuperation.garantie}</p>
              <p>
                {recuperation.destination} · {recuperation.horizon}
              </p>
              <p>{recuperation.condition}</p>
              <p>{textes.cout} : {recuperation.cout}</p>
              <p>{textes.cause} : {recuperation.cause}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
