import type {
  ApplicationCampagne,
  ProjectionDeCampagne,
} from "../application/application";
import type { VitesseDuConvoi } from "../simulation/campagne";

interface CommandesDuTempsProps {
  readonly application: ApplicationCampagne;
  readonly projection: ProjectionDeCampagne;
}

const VITESSES: readonly Exclude<VitesseDuConvoi, 0>[] = [1, 2, 4];

export function CommandesDuTemps({
  application,
  projection,
}: CommandesDuTempsProps) {
  const reglerVitesse = (vitesse: VitesseDuConvoi) => {
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse,
    });
  };

  return (
    <footer className="commandes-du-temps">
      <time dateTime={projection.dureeIso}>
        {projection.horloge}
      </time>

      <div className="statut-du-temps">
        <span>Temps du convoi</span>
        <span aria-live="polite">{projection.statutDuTemps}</span>
      </div>

      <fieldset>
        <legend className="sr-only">Temps du convoi</legend>
        <button
          type="button"
          aria-pressed={projection.vitesse === 0}
          onClick={() => reglerVitesse(0)}
        >
          Pause
        </button>
        {VITESSES.map((vitesse) => (
          <button
            key={vitesse}
            type="button"
            aria-label={`Vitesse ${vitesse}×`}
            aria-pressed={projection.vitesse === vitesse}
            onClick={() => reglerVitesse(vitesse)}
          >
            {vitesse}×
          </button>
        ))}
      </fieldset>
    </footer>
  );
}
