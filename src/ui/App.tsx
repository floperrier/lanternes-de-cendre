import { useEffect, useState, useSyncExternalStore } from "react";

import { projeterCampagne } from "../application/application";
import {
  projeterImplantationPixi,
  projeterInfrastructure,
} from "../application/infrastructure";
import { projeterPilotage } from "../application/pilotage";
import { projeterCompagnonEtConseil } from "../application/conseil";
import { projeterAtlas } from "../application/routes";
import { projeterCrises } from "../application/crise";
import { projeterExpedition } from "../application/expeditions";
import { projeterDemonstration } from "../application/demonstration";
import type { Langue } from "../content/types";
import { criseAttendSonCheckpoint } from "../simulation/crise";
import {
  type ControleurDeSessionCampagne,
  type EtatDuControleurDeSession,
} from "../sauvegarde/controleur";
import { CommandesDuTemps } from "./CommandesDuTemps";
import { ConseilDuConvoi } from "./ConseilDuConvoi";
import { Atlas } from "./Atlas";
import { CoupeHabitee } from "./CoupeHabitee";
import { EtatTextuel } from "./EtatTextuel";
import { InfrastructureDuConvoi } from "./InfrastructureDuConvoi";
import { PanneauDePilotage } from "./PanneauDePilotage";
import { PanneauSauvegarde } from "./PanneauSauvegarde";
import { RubanNarratif } from "./RubanNarratif";
import { SelecteurDeLangue } from "./SelecteurDeLangue";
import { CriseDuConvoi } from "./CriseDuConvoi";
import { OrdreDistantDExpedition } from "./OrdreDistantDExpedition";
import { JalonFinalDeLaDemonstration } from "./JalonFinalDeLaDemonstration";
import { choisirSurfacePrioritaire } from "./ordreDesSurfaces";

interface PropsCampagne {
  readonly etatDuControleur: Extract<
    EtatDuControleurDeSession,
    { readonly statut: "ouverte" }
  >;
  readonly controleur: ControleurDeSessionCampagne;
}

function CampagnePersistante({ etatDuControleur, controleur }: PropsCampagne) {
  const [langue, choisirLangue] = useState<Langue>("fr");
  const application = etatDuControleur.ouverture.application;
  const etat = useSyncExternalStore(
    application.sabonner,
    application.lireEtat,
    application.lireEtat,
  );
  const projection = projeterCampagne(etat, langue);
  const projectionDuPilotage = projeterPilotage(etat, langue);
  const projectionDInfrastructure = projeterInfrastructure(etat, langue);
  const projectionDuConseil = projeterCompagnonEtConseil(etat, langue);
  const projectionDeLAtlas = projeterAtlas(
    etat,
    langue,
    application.commandeEstAutorisee,
  );
  const projectionDesCrises = projeterCrises(etat, langue);
  const checkpointDeCriseRequis = criseAttendSonCheckpoint(
    etat.crises,
    etat.tempsDuConvoi.secondes,
  );
  const criseBloquante =
    checkpointDeCriseRequis || projectionDesCrises.active !== null;
  const projectionDExpedition = projeterExpedition(etat, langue);
  const projectionDeDemonstration = projeterDemonstration(etat, langue);
  const surfacePrioritaire = choisirSurfacePrioritaire({
    criseActive: projectionDesCrises.active !== null,
    checkpointDeCriseRequis,
    demonstrationTerminee: projectionDeDemonstration.terminee,
    ordreDExpedition: projectionDExpedition.ordreImportant !== null,
    evenementNarratif: projection.evenementNarratif !== null,
    conseil: projectionDuConseil.conseil !== null,
  });
  const jalonDeDemonstrationAffiche =
    surfacePrioritaire === "jalon-demonstration";

  useEffect(() => {
    let dernierInstant = Date.now();
    let millisecondesResiduelle = 0;
    const horloge = window.setInterval(() => {
      const maintenant = Date.now();
      const millisecondesEcoulees = Math.max(0, maintenant - dernierInstant);
      dernierInstant = maintenant;
      if (application.lireEtat().tempsDuConvoi.vitesse === 0) {
        millisecondesResiduelle = 0;
        return;
      }

      millisecondesResiduelle += millisecondesEcoulees;
      const secondesReelles = Math.floor(millisecondesResiduelle / 1_000);
      if (secondesReelles > 0) {
        millisecondesResiduelle -= secondesReelles * 1_000;
        application.envoyerCommande({
          type: "temps-du-convoi.ecouler",
          secondesReelles,
        });
      }
    }, 1_000);

    return () => window.clearInterval(horloge);
  }, [application]);

  useEffect(() => {
    if (
      projectionDeDemonstration.terminee &&
      application.lireEtat().tempsDuConvoi.vitesse !== 0
    ) {
      application.envoyerCommande({
        type: "temps-du-convoi.regler-vitesse",
        vitesse: 0,
      });
    }
  }, [application, projectionDeDemonstration.terminee]);

  return (
    <main className="app-shell">
      <header
        className="app-header"
        inert={
          projectionDesCrises.active !== null || jalonDeDemonstrationAffiche
            ? true
            : undefined
        }
      >
        <div>
          <h1>Les Lanternes de Cendre</h1>
          <p aria-label={`Graine de campagne ${projection.graine}`}>
            {projection.graine}
          </p>
        </div>
        {jalonDeDemonstrationAffiche ? null : (
          <div className="app-header__outils">
            <SelecteurDeLangue langue={langue} choisirLangue={choisirLangue} />
            <PanneauSauvegarde
              controleur={controleur}
              statutAutomatique={etatDuControleur.statutSauvegarde}
              erreurAsynchrone={etatDuControleur.erreurSauvegarde}
              explicationInitiale={etatDuControleur.ouverture.explication}
              archiveIncompatibleInitiale={
                etatDuControleur.ouverture.archiveIncompatible
              }
            />
          </div>
        )}
      </header>

      <div
        className="scene-layout"
        inert={
          criseBloquante || jalonDeDemonstrationAffiche ? true : undefined
        }
      >
        <div className="surface-du-monde">
          <CoupeHabitee
            implantation={projeterImplantationPixi(projectionDInfrastructure)}
            chantierActif={projectionDInfrastructure.chantierActif !== null}
          />
          <Atlas
            application={application}
            projection={projectionDeLAtlas}
            expedition={projectionDExpedition}
            langue={langue}
          />
        </div>
        <div className="colonne-de-pilotage">
          <EtatTextuel projection={projection} />
          <InfrastructureDuConvoi
            application={application}
            langue={langue}
            projection={projectionDInfrastructure}
          />
          <PanneauDePilotage
            application={application}
            projection={projectionDuPilotage}
            compagnon={projectionDuConseil.compagnon}
            langue={langue}
            crises={projectionDesCrises}
          />
        </div>
      </div>

      {surfacePrioritaire === "crise" && projectionDesCrises.active !== null ? (
        <CriseDuConvoi
          application={application}
          crise={projectionDesCrises.active}
          langue={langue}
        />
      ) : surfacePrioritaire === "checkpoint-crise" ? null : surfacePrioritaire ===
        "jalon-demonstration" ? (
        <JalonFinalDeLaDemonstration
          projection={projectionDeDemonstration}
          langue={langue}
        >
          <SelecteurDeLangue langue={langue} choisirLangue={choisirLangue} />
          <PanneauSauvegarde
            controleur={controleur}
            statutAutomatique={etatDuControleur.statutSauvegarde}
            erreurAsynchrone={etatDuControleur.erreurSauvegarde}
          />
        </JalonFinalDeLaDemonstration>
      ) : surfacePrioritaire === "ordre-expedition" &&
        projectionDExpedition.ordreImportant !== null ? (
        <OrdreDistantDExpedition
          application={application}
          expedition={projectionDExpedition}
          langue={langue}
        />
      ) : surfacePrioritaire === "evenement-narratif" &&
        projection.evenementNarratif !== null ? (
        <RubanNarratif
          application={application}
          evenement={projection.evenementNarratif}
          langue={langue}
        />
      ) : surfacePrioritaire === "conseil" &&
        projectionDuConseil.conseil !== null ? (
        <ConseilDuConvoi
          application={application}
          conseil={projectionDuConseil.conseil}
          langue={langue}
        />
      ) : null}

      <CommandesDuTemps
        application={application}
        projection={projection}
        bloque={criseBloquante || projectionDeDemonstration.terminee}
      />
    </main>
  );
}

interface PropsApp {
  readonly controleur: ControleurDeSessionCampagne;
}

export function App({ controleur }: PropsApp) {
  const etatDuControleur = useSyncExternalStore(
    controleur.sabonner,
    controleur.lireEtat,
    controleur.lireEtat,
  );

  if (etatDuControleur.statut === "erreur") {
    return (
      <main className="chargement-campagne">
        <h1>Les Lanternes de Cendre</h1>
        <p role="alert">{etatDuControleur.explication}</p>
      </main>
    );
  }

  if (etatDuControleur.statut === "chargement") {
    return (
      <main className="chargement-campagne">
        <h1>Les Lanternes de Cendre</h1>
        <p role="status">Reprise de la Campagne…</p>
      </main>
    );
  }

  return (
    <CampagnePersistante
      etatDuControleur={etatDuControleur}
      controleur={controleur}
    />
  );
}
