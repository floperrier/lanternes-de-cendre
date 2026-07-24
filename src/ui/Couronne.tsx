import type { ProjectionDesApprochesDeLaCouronne } from "../application/couronne";

export function Couronne({
  projection,
}: {
  readonly projection: ProjectionDesApprochesDeLaCouronne;
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
          <dt>{projection.libelles.teteDeLigne}</dt>
          <dd>{projection.teteDeLigne}</dd>
        </div>
        <div>
          <dt>{projection.libelles.veilleDesTrois}</dt>
          <dd>{projection.veilleDesTrois}</dd>
        </div>
        <div>
          <dt>{projection.libelles.delegations}</dt>
          <dd>{projection.delegations}</dd>
        </div>
        <div>
          <dt>{projection.libelles.diagnostic}</dt>
          <dd>{projection.diagnostic}</dd>
        </div>
        <div>
          <dt>{projection.libelles.preparatifs}</dt>
          <dd>
            <ul>
              {projection.preparatifs.map((preparatif) => (
                <li key={preparatif}>{preparatif}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>{projection.libelles.gardeDesPlans}</dt>
          <dd>{projection.gardeDesPlans}</dd>
        </div>
      </dl>
    </section>
  );
}
