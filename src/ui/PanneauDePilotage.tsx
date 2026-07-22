import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDuPilotage } from "../application/pilotage";
import type { ProjectionDuCompagnon } from "../application/conseil";
import type { Langue } from "../content/types";
import { DoctrineDuConvoi } from "./DoctrineDuConvoi";
import { EconomieDuConvoi } from "./EconomieDuConvoi";
import { IncidentDuConvoi } from "./IncidentDuConvoi";
import { JournalCausal } from "./JournalCausal";
import { PanneauCompagnon } from "./PanneauCompagnon";

interface PanneauDePilotageProps {
  readonly application: ApplicationCampagne;
  readonly projection: ProjectionDuPilotage;
  readonly compagnon: ProjectionDuCompagnon;
  readonly langue: Langue;
}

export function PanneauDePilotage({
  application,
  projection,
  compagnon,
  langue,
}: PanneauDePilotageProps) {
  return (
    <aside className="panneau-de-pilotage" aria-label="Pilotage du convoi">
      <EconomieDuConvoi projection={projection} />
      <PanneauCompagnon
        application={application}
        compagnon={compagnon}
        langue={langue}
      />
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
      <JournalCausal entrees={projection.journalCausal} langue={langue} />
    </aside>
  );
}
