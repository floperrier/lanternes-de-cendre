import type { ProjectionDeTraverseLibre } from "../application/traverseLibre";

export function TraverseLibre({
  projection,
}: {
  readonly projection: ProjectionDeTraverseLibre;
}) {
  if (!projection.visible) {
    return null;
  }

  return (
    <section className="panneau-local" aria-label={projection.titre}>
      <p className="eyebrow">{projection.libelles.eyebrow}</p>
      <h2>{projection.titre}</h2>
      <p>{projection.statut}</p>
      <dl>
        <dt>{projection.libelles.pressions}</dt>
        <dd>{projection.pressions.join(" · ")}</dd>
        <dt>{projection.libelles.marche}</dt>
        <dd>{projection.marche.join(" · ")}</dd>
        <dt>{projection.libelles.dependances}</dt>
        <dd>{projection.dependances.join(" · ")}</dd>
        <dt>{projection.libelles.contournement}</dt>
        <dd>{projection.contournement}</dd>
        <dt>{projection.libelles.route}</dt>
        <dd>{projection.route}</dd>
        <dt>{projection.libelles.aide}</dt>
        <dd>{projection.aide}</dd>
        <dt>{projection.libelles.puitsLibres}</dt>
        <dd>{projection.relationPuitsLibres}</dd>
        <dt>{projection.libelles.republique}</dt>
        <dd>{projection.relationRepublique}</dd>
      </dl>
    </section>
  );
}
