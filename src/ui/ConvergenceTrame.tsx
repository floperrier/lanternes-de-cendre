import type { ProjectionDeConvergenceDeLaTrame } from "../application/convergenceTrame";

export function ConvergenceTrame({
  projection,
}: {
  readonly projection: ProjectionDeConvergenceDeLaTrame;
}) {
  if (!projection.visible) {
    return null;
  }

  return (
    <section className="panneau-local" aria-label={projection.titre}>
      <p className="eyebrow">{projection.eyebrow}</p>
      <h2>{projection.titre}</h2>
      <dl>
        <dt>{projection.libelles.offreOfficielle}</dt>
        <dd>{projection.offreOfficielle}</dd>
        <dt>{projection.libelles.offreClandestine}</dt>
        <dd>{projection.offreClandestine}</dd>
        <dt>{projection.libelles.interface}</dt>
        <dd>{projection.interfaceLigneZero}</dd>
        <dt>{projection.libelles.trace}</dt>
        <dd>{projection.trace}</dd>
        <dt>{projection.libelles.echoGrandAiguillage}</dt>
        <dd>{projection.echoGrandAiguillage}</dd>
        <dt>{projection.libelles.echoTraverseLibre}</dt>
        <dd>{projection.echoTraverseLibre}</dd>
        <dt>{projection.libelles.options}</dt>
        <dd>{projection.optionsDuClimax.join(" · ")}</dd>
      </dl>
    </section>
  );
}
