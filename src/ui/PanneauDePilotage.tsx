import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDuPilotage } from "../application/pilotage";
import type { ProjectionDuCompagnon } from "../application/conseil";
import type { Langue } from "../content/types";
import type { ProjectionDesCrises } from "../application/crise";
import { DoctrineDuConvoi } from "./DoctrineDuConvoi";
import { EconomieDuConvoi } from "./EconomieDuConvoi";
import { IncidentDuConvoi } from "./IncidentDuConvoi";
import { JournalCausal } from "./JournalCausal";
import { PanneauCompagnon } from "./PanneauCompagnon";
import { EtatDesCrisesDuConvoi } from "./EtatDesCrisesDuConvoi";

interface PanneauDePilotageProps {
  readonly application: ApplicationCampagne;
  readonly projection: ProjectionDuPilotage;
  readonly compagnon: ProjectionDuCompagnon;
  readonly langue: Langue;
  readonly crises: ProjectionDesCrises;
}

export function PanneauDePilotage({
  application,
  projection,
  compagnon,
  langue,
  crises,
}: PanneauDePilotageProps) {
  return (
    <aside className="panneau-de-pilotage" aria-label="Pilotage du convoi">
      <EconomieDuConvoi projection={projection} />
      <PanneauCompagnon
        application={application}
        compagnon={compagnon}
        langue={langue}
      />
      <EtatDesCrisesDuConvoi projection={crises} langue={langue} />
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
