import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDIncident } from "../application/pilotage";

interface IncidentDuConvoiProps {
  readonly application: ApplicationCampagne;
  readonly incident: ProjectionDIncident;
}

export function IncidentDuConvoi({
  application,
  incident,
}: IncidentDuConvoiProps) {
  const titreId = `titre-${incident.id}`;

  return (
    <section className="incident-du-convoi" aria-labelledby={titreId}>
      <p className="type-d-incident">Incident ordinaire</p>
      <h2 id={titreId}>{incident.titre}</h2>
      <dl>
        <div>
          <dt>Cause annoncée</dt>
          <dd>{incident.cause}</dd>
        </div>
        <div>
          <dt>Priorité</dt>
          <dd>{incident.priorite}</dd>
        </div>
        <div>
          <dt>Échéance</dt>
          <dd>{incident.echeance}</dd>
        </div>
      </dl>
      <p className="incertitude-sourcee">
        <strong>Incertitude</strong>
        <span>{incident.incertitude.observation}</span>
        <span>
          {incident.incertitude.source} · {incident.incertitude.age}
        </span>
      </p>
      <div className="ordres-d-incident">
        {incident.ordres.map((ordre) => (
          <div key={ordre.id}>
            <button
              type="button"
              onClick={() =>
                application.envoyerCommande({
                  type: "incident.ordonner",
                  incidentId: incident.id,
                  ordre: ordre.id,
                })
              }
            >
              {ordre.nom}
            </button>
            <small>Coût connu : {ordre.coutConnu}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
