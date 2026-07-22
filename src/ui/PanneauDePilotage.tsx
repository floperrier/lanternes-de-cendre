import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDuPilotage } from "../application/pilotage";
import { DoctrineDuConvoi } from "./DoctrineDuConvoi";
import { EconomieDuConvoi } from "./EconomieDuConvoi";
import { IncidentDuConvoi } from "./IncidentDuConvoi";
import { JournalCausal } from "./JournalCausal";

interface PanneauDePilotageProps {
  readonly application: ApplicationCampagne;
  readonly projection: ProjectionDuPilotage;
}

export function PanneauDePilotage({
  application,
  projection,
}: PanneauDePilotageProps) {
  return (
    <aside className="panneau-de-pilotage" aria-label="Pilotage du convoi">
      <EconomieDuConvoi projection={projection} />
      {projection.incident === null ? null : (
        <IncidentDuConvoi
          application={application}
          incident={projection.incident}
        />
      )}
      <DoctrineDuConvoi
        application={application}
        politiques={projection.doctrine}
      />
      <JournalCausal entrees={projection.journalCausal} />
    </aside>
  );
}
