import type { ProjectionDeLaVoieDesColonies } from "../application/voieColonies";

export function VoieColonies({
  projection,
}: {
  readonly projection: ProjectionDeLaVoieDesColonies;
}) {
  if (!projection.visible) {
    return null;
  }
  return (
    <section className="panneau-local" aria-label={projection.titre}>
      <p className="eyebrow">{projection.eyebrow}</p>
      <h2>{projection.titre}</h2>
      <dl>
        <div>
          <dt>{projection.libelles.serres}</dt>
          <dd>{projection.serres}</dd>
        </div>
        <div>
          <dt>{projection.libelles.retours}</dt>
          <dd>
            <ul>
              {projection.retours.map((retour) => (
                <li key={retour}>{retour}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>{projection.libelles.cohorte}</dt>
          <dd>{projection.cohorte}</dd>
        </div>
        <div>
          <dt>{projection.libelles.credibilite}</dt>
          <dd>{projection.credibilite}</dd>
        </div>
        <div>
          <dt>{projection.libelles.seuil}</dt>
          <dd>{projection.seuil}</dd>
        </div>
        <div>
          <dt>{projection.libelles.acces}</dt>
          <dd>{projection.acces}</dd>
        </div>
        <div>
          <dt>{projection.libelles.garde}</dt>
          <dd>{projection.garde}</dd>
        </div>
      </dl>
    </section>
  );
}
