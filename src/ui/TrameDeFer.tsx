import type { ProjectionDeLaTrameDeFer } from "../application/trameFer";

export function TrameDeFer({
  projection,
}: {
  readonly projection: ProjectionDeLaTrameDeFer;
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
        <dt>{projection.libelles.republique}</dt>
        <dd>{projection.relationRepublique}</dd>
        <dt>{projection.libelles.pressions}</dt>
        <dd>{projection.pressions.join(" · ")}</dd>
        <dt>{projection.libelles.marche}</dt>
        <dd>{projection.marche.join(" · ")}</dd>
        <dt>{projection.libelles.engagements}</dt>
        <dd>
          {projection.engagements.length === 0
            ? projection.libelles.aucunEngagement
            : projection.engagements.join(" · ")}
        </dd>
        <dt>{projection.libelles.piece}</dt>
        <dd>
          {projection.voiesDeLaPiece.length === 0
            ? projection.libelles.voieAOuvrir
            : projection.voiesDeLaPiece.join(" · ")}
        </dd>
      </dl>
      {projection.occasions.length > 0 ? (
        <ul>
          {projection.occasions.map((occasion) => (
            <li key={occasion}>{occasion}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
