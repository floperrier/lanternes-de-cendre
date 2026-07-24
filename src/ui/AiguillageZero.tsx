import type { ProjectionDeLAiguillageZero } from "../application/aiguillageZero";

export function AiguillageZero({
  projection,
}: {
  readonly projection: ProjectionDeLAiguillageZero;
}) {
  if (!projection.visible) {
    return null;
  }
  const champs = [
    ["accordRegional", projection.accordRegional],
    ["grandAiguillage", projection.grandAiguillage],
    ["traverseLibre", projection.traverseLibre],
    ["sites", projection.sites],
    ["routes", projection.routes],
    ["engagements", projection.engagements],
    ["relations", projection.relations],
    ["soupcons", projection.soupcons],
    ["echoFutur", projection.echoFutur],
  ] as const;
  return (
    <section className="panneau-local" aria-label={projection.titre}>
      <p className="eyebrow">{projection.eyebrow}</p>
      <h2>{projection.titre}</h2>
      <dl>
        {champs.map(([cle, valeur]) => (
          <div key={cle}>
            <dt>{projection.libelles[cle]}</dt>
            <dd>{valeur}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
