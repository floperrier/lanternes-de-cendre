import type { ProjectionDeCampagne } from "../application/application";

interface EtatTextuelProps {
  readonly projection: ProjectionDeCampagne;
}

export function EtatTextuel({ projection }: EtatTextuelProps) {
  return (
    <aside className="etat-textuel" aria-labelledby="titre-cite-caravane">
      <div className="veille">
        <h2>Première veille</h2>
        <time dateTime={projection.dureeIso}>
          {projection.horloge}
        </time>
        <p>Temps du convoi</p>
        <p aria-live="polite">{projection.statutDuTemps}</p>
      </div>

      <section
        className="etat-cite"
        aria-labelledby="titre-cite-caravane"
      >
        <h2 id="titre-cite-caravane">Cité-caravane</h2>
        <ul>
          <li>Phare — {projection.phare}</li>
          <li>
            Formation en {projection.formation} — {projection.nombreDePlateformes}{" "}
            plateformes
          </li>
          <li>Habitants — {projection.habitants}</li>
        </ul>
      </section>
    </aside>
  );
}
