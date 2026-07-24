import type { ProjectionDuContratFinal } from "../application/finale";

export function ContratFinal({
  projection,
}: {
  readonly projection: ProjectionDuContratFinal;
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
          <dt>{projection.libelles.solutions}</dt>
          <dd>
            <ul>
              {projection.solutions.map((solution) => (
                <li key={solution.id}>
                  <strong>{solution.resume}</strong>
                  <p>{solution.cout}</p>
                  <details>
                    <summary>{projection.libelles.causes}</summary>
                    <ul>
                      {solution.causes.map((cause) => (
                        <li key={cause}>{cause}</li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>{projection.libelles.selection}</dt>
          <dd>{projection.selection}</dd>
        </div>
        <div>
          <dt>{projection.libelles.negociation}</dt>
          <dd>
            {projection.negociation.length === 0 ? (
              projection.variante
            ) : (
              <ul>
                {projection.negociation.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            )}
          </dd>
        </div>
        <div>
          <dt>{projection.libelles.variante}</dt>
          <dd>{projection.variante}</dd>
        </div>
        <div>
          <dt>{projection.libelles.bilan}</dt>
          <dd>{projection.bilan}</dd>
        </div>
      </dl>
    </section>
  );
}
