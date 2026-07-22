import { useEffect, useMemo, useSyncExternalStore } from "react";

import {
  creerApplicationCampagne,
  projeterCampagne,
} from "../application/application";
import { CommandesDuTemps } from "./CommandesDuTemps";
import { CoupeHabitee } from "./CoupeHabitee";
import { EtatTextuel } from "./EtatTextuel";

const GRAINE_DE_DEMONSTRATION = "CENDRE-01";

export function App() {
  const application = useMemo(
    () => creerApplicationCampagne(GRAINE_DE_DEMONSTRATION),
    [],
  );
  const etat = useSyncExternalStore(
    application.sabonner,
    application.lireEtat,
    application.lireEtat,
  );
  const projection = projeterCampagne(etat);

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
        <h1>Les Lanternes de Cendre</h1>
        <p aria-label={`Graine de campagne ${projection.graine}`}>
          {projection.graine}
        </p>
      </header>

      <div className="scene-layout">
        <CoupeHabitee />
        <EtatTextuel projection={projection} />
      </div>

      <CommandesDuTemps application={application} projection={projection} />
    </main>
  );
}
