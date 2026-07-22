import type { ProjectionDuJournalCausal } from "../application/pilotage";
import type { Langue } from "../content/types";

interface JournalCausalProps {
  readonly entrees: readonly ProjectionDuJournalCausal[];
  readonly langue: Langue;
}

const LIBELLES = {
  fr: {
    journal: "Journal causal",
    vide: "Aucune résolution inscrite.",
    cause: "Cause",
    acteurs: "Acteurs",
    cible: "Cible",
    materiel: "Matériel",
    humain: "Humain",
  },
  en: {
    journal: "Causal journal",
    vide: "No resolution recorded.",
    cause: "Cause",
    acteurs: "Actors",
    cible: "Target",
    materiel: "Material",
    humain: "Human",
  },
} as const;

export function JournalCausal({ entrees, langue }: JournalCausalProps) {
  const libelles = LIBELLES[langue];
  return (
    <details className="journal-causal" lang={langue}>
      <summary>{libelles.journal} ({entrees.length})</summary>
      {entrees.length === 0 ? (
        <p>{libelles.vide}</p>
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
                  <strong>{libelles.cause}</strong> — {entree.cause}
                </p>
                <p>
                  <strong>{libelles.acteurs}</strong> — {entree.acteurs.join(", ")}
                </p>
                <p>
                  <strong>{libelles.cible}</strong> — {entree.cible}
                </p>
                <ul>
                  {entree.effetsMateriels.map((effet) => (
                    <li key={effet}>{libelles.materiel} — {effet}</li>
                  ))}
                  {entree.effetsHumains.map((effet) => (
                    <li key={effet}>{libelles.humain} — {effet}</li>
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
