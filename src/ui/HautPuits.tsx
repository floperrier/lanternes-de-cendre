import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDeHautPuits } from "../application/hautPuits";

interface PropsHautPuits {
  readonly application: ApplicationCampagne;
  readonly projection: ProjectionDeHautPuits;
}

export function HautPuits({
  application,
  projection,
}: PropsHautPuits) {
  if (!projection.visible) {
    return null;
  }

  return (
    <section className="haut-puits" aria-labelledby="titre-haut-puits">
      <header>
        <p>{projection.libelleColonie}</p>
        <h2 id="titre-haut-puits">{projection.titre}</h2>
      </header>

      <dl className="haut-puits__etat">
        <div>
          <dt>{projection.libelleStatut}</dt>
          <dd>{projection.colonie.statut}</dd>
        </div>
        <div>
          <dt>{projection.libelleDevenir}</dt>
          <dd>{projection.colonie.devenir}</dd>
        </div>
        <div>
          <dt>{projection.libelleRelation}</dt>
          <dd>{projection.colonie.relationPublique}</dd>
        </div>
      </dl>

      <section aria-labelledby="pressions-haut-puits">
        <h3 id="pressions-haut-puits">{projection.libellePressions}</h3>
        <ul>
          {projection.colonie.pressions.map((pression) => (
            <li key={pression}>{pression}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="engagements-haut-puits">
        <h3 id="engagements-haut-puits">
          {projection.libelleEngagements}
        </h3>
        {projection.colonie.engagementsDiplomatiques.length === 0 ? (
          <p>{projection.aucunEngagement}</p>
        ) : (
          <ul>
            {projection.colonie.engagementsDiplomatiques.map((engagement) => (
              <li key={engagement}>{engagement}</li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="marche-haut-puits">
        <h3 id="marche-haut-puits">{projection.marche.titre}</h3>
        <ul className="haut-puits__offres">
          {projection.marche.offres.map((offre) => (
            <li key={offre.id}>
              <h4>{offre.besoin}</h4>
              <p>
                {projection.marche.echangesRestants} :{" "}
                {offre.echangesRestants}
              </p>
              <ul>
                {offre.mouvements.map((mouvement) => (
                  <li key={mouvement}>{mouvement}</li>
                ))}
              </ul>
              <button
                type="button"
                disabled={!offre.disponible}
                aria-label={`${
                  offre.echangesRestants === 0
                    ? projection.marche.epuisee
                    : projection.marche.action
                } — ${offre.besoin}`}
                onClick={() =>
                  application.envoyerCommande({
                    type: "haut-puits.marche.echanger",
                    offreId: offre.id,
                  })
                }
              >
                {offre.echangesRestants === 0
                  ? projection.marche.epuisee
                  : projection.marche.action}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="projets-haut-puits">
        <h3 id="projets-haut-puits">{projection.libelleProjets}</h3>
        <ul>
          {projection.projets.map((projet) => (
            <li key={projet}>{projet}</li>
          ))}
        </ul>
        <p>
          <strong>{projection.libelleProjetChoisi} : </strong>
          {projection.projetChoisi ?? projection.aucunProjetChoisi}
        </p>
      </section>

      <section aria-labelledby="negociation-haut-puits">
        <h3 id="negociation-haut-puits">{projection.negociation.titre}</h3>
        {projection.negociation.ouverte ? (
          <>
            <p>{projection.negociation.instruction}</p>
            <ul className="haut-puits__decisions">
              {projection.negociation.decisions.map((decision) => (
                <li key={decision.id}>
                  <p>
                    <strong>{decision.libelle}</strong> —{" "}
                    {decision.consequence}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>{projection.negociation.tranchee}</p>
        )}
      </section>
    </section>
  );
}
