import type {
  ApplicationCampagne,
} from "../application/application";
import type {
  ProjectionDePolitique,
} from "../application/pilotage";
import { creerCommandeDeDoctrine } from "../simulation/pilotage";

interface DoctrineDuConvoiProps {
  readonly application: ApplicationCampagne;
  readonly politiques: readonly ProjectionDePolitique[];
}

export function DoctrineDuConvoi({
  application,
  politiques,
}: DoctrineDuConvoiProps) {
  return (
    <details className="doctrine-du-convoi">
      <summary>Doctrine du convoi</summary>
      <div className="politiques-de-doctrine">
        {politiques.map((politique) => (
          <fieldset key={politique.id}>
            <legend>{politique.nom}</legend>
            <p>
              Position actuelle : <strong>{politique.position}</strong>
            </p>
            <div className="positions-de-doctrine">
              {politique.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={politique.position === option.nom}
                  onClick={() =>
                    application.envoyerCommande(
                      creerCommandeDeDoctrine(politique.id, option.id),
                    )
                  }
                >
                  {option.nom}
                </button>
              ))}
            </div>
            {politique.transition === null ? null : (
              <p className="transition-de-doctrine" aria-live="polite">
                Transition vers {politique.transition.position} · {politique.transition.delai}
              </p>
            )}
          </fieldset>
        ))}
      </div>
    </details>
  );
}
