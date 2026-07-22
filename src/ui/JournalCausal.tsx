import type { ProjectionDuJournalCausal } from "../application/pilotage";

interface JournalCausalProps {
  readonly entrees: readonly ProjectionDuJournalCausal[];
}

export function JournalCausal({ entrees }: JournalCausalProps) {
  return (
    <details className="journal-causal">
      <summary>Journal causal ({entrees.length})</summary>
      {entrees.length === 0 ? (
        <p>Aucune résolution inscrite.</p>
      ) : (
        <ol>
          {entrees.map((entree) => (
            <li key={entree.id}>
              <article>
                <header>
                  <h2>{entree.titre}</h2>
                  <time>{entree.moment}</time>
                </header>
                <p>
                  <strong>Cause</strong> — {entree.cause}
                </p>
                <p>
                  <strong>Acteurs</strong> — {entree.acteurs.join(", ")}
                </p>
                <p>
                  <strong>Cible</strong> — {entree.cible}
                </p>
                <ul>
                  {entree.effetsMateriels.map((effet) => (
                    <li key={effet}>Matériel — {effet}</li>
                  ))}
                  {entree.effetsHumains.map((effet) => (
                    <li key={effet}>Humain — {effet}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      )}
    </details>
  );
}
