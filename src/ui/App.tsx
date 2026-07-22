import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import {
  creerApplicationCampagne,
  projeterCampagne,
} from "../application/application";
import { projeterPilotage } from "../application/pilotage";
import type { Langue } from "../content/types";
import { CommandesDuTemps } from "./CommandesDuTemps";
import { CoupeHabitee } from "./CoupeHabitee";
import { EtatTextuel } from "./EtatTextuel";
import { PanneauDePilotage } from "./PanneauDePilotage";
import { RubanNarratif } from "./RubanNarratif";
import { SelecteurDeLangue } from "./SelecteurDeLangue";

const GRAINE_DE_DEMONSTRATION = "CENDRE-01";

export function App() {
  const [langue, choisirLangue] = useState<Langue>("fr");
  const application = useMemo(
    () => creerApplicationCampagne(GRAINE_DE_DEMONSTRATION),
    [],
  );
  const etat = useSyncExternalStore(
    application.sabonner,
    application.lireEtat,
    application.lireEtat,
  );
  const projection = projeterCampagne(etat, langue);
  const projectionDuPilotage = projeterPilotage(etat, langue);

  useEffect(() => {
    const horloge = window.setInterval(() => {
      if (application.lireEtat().tempsDuConvoi.vitesse !== 0) {
        application.envoyerCommande({
          type: "temps-du-convoi.ecouler",
          secondesReelles: 1,
        });
      }
    }, 1_000);

    return () => window.clearInterval(horloge);
  }, [application]);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Les Lanternes de Cendre</h1>
          <p aria-label={`Graine de campagne ${projection.graine}`}>
            {projection.graine}
          </p>
        </div>
        <SelecteurDeLangue langue={langue} choisirLangue={choisirLangue} />
      </header>

      <div className="scene-layout">
        <CoupeHabitee />
        <div className="colonne-de-pilotage">
          <EtatTextuel projection={projection} />
          <PanneauDePilotage
            application={application}
            projection={projectionDuPilotage}
          />
        </div>
      </div>

      {projection.evenementNarratif !== null ? (
        <RubanNarratif
          application={application}
          evenement={projection.evenementNarratif}
          langue={langue}
        />
      ) : null}

      <CommandesDuTemps application={application} projection={projection} />
    </main>
  );
}
