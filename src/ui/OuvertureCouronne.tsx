import type { ProjectionDeLOuvertureDeLaCouronne } from "../application/ouvertureCouronne";

export function OuvertureCouronne({
  projection,
}: {
  readonly projection: ProjectionDeLOuvertureDeLaCouronne;
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
          <dt>{projection.libelles.ouvertures}</dt>
          <dd>
            <ul>
              {projection.ouvertures.map((ouverture) => (
                <li key={ouverture}>{ouverture}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>{projection.libelles.projets}</dt>
          <dd>
            <ul>
              {projection.projets.map((projet) => (
                <li key={projet}>{projet}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>{projection.libelles.conseil}</dt>
          <dd>{projection.conseil}</dd>
        </div>
        <div>
          <dt>{projection.libelles.choix}</dt>
          <dd>{projection.choix}</dd>
        </div>
        <div>
          <dt>{projection.libelles.noeud}</dt>
          <dd>{projection.noeud}</dd>
        </div>
        <div>
          <dt>{projection.libelles.solutions}</dt>
          <dd>
            <ul>
              {projection.solutions.map((solution) => (
                <li key={solution}>{solution}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>{projection.libelles.garde}</dt>
          <dd>{projection.garde}</dd>
        </div>
      </dl>
    </section>
  );
}
