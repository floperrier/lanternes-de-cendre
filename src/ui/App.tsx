import { useEffect, useState, useSyncExternalStore } from "react";

import type { ControleurAccesPremium } from "../commercial/controleur";
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
import { projeterVeilleBasse } from "../application/veilleBasse";
import { projeterHautPuits } from "../application/hautPuits";
import { projeterTrameDeFer } from "../application/trameFer";
import { projeterTraverseLibre } from "../application/traverseLibre";
import { projeterConvergenceDeLaTrame } from "../application/convergenceTrame";
import { projeterAiguillageZero } from "../application/aiguillageZero";
import { projeterApprochesDeLaCouronne } from "../application/couronne";
import { projeterVoieDesColonies } from "../application/voieColonies";
import { projeterOuvertureDeLaCouronne } from "../application/ouvertureCouronne";
import { projeterContratFinal } from "../application/finale";
import { projeterEpilogue } from "../application/epilogue";
import type { Langue } from "../content/types";
import { criseAttendSonCheckpoint } from "../simulation/crise";
import { gestionnaireDeBundlesCampagne } from "../assets/bundles";
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
import { HautPuits } from "./HautPuits";
import { PanneauAccesPremium } from "./PanneauAccesPremium";
import { choisirSurfacePrioritaire } from "./ordreDesSurfaces";
import { VeilleBasseEtCohorte } from "./VeilleBasseEtCohorte";
import { TrameDeFer } from "./TrameDeFer";
import { TraverseLibre } from "./TraverseLibre";
import { ConvergenceTrame } from "./ConvergenceTrame";
import { AiguillageZero } from "./AiguillageZero";
import { Couronne } from "./Couronne";
import { VoieColonies } from "./VoieColonies";
import { OuvertureCouronne } from "./OuvertureCouronne";
import { ContratFinal } from "./ContratFinal";
import { Epilogue } from "./Epilogue";

interface PropsCampagne {
  readonly etatDuControleur: Extract<
    EtatDuControleurDeSession,
    { readonly statut: "ouverte" }
  >;
  readonly controleur: ControleurDeSessionCampagne;
  readonly controleurAccesPremium: ControleurAccesPremium;
}

function CampagnePersistante({
  etatDuControleur,
  controleur,
  controleurAccesPremium,
}: PropsCampagne) {
  const [langue, choisirLangue] = useState<Langue>("fr");
  const application = etatDuControleur.ouverture.application;
  const etatAccesPremium = useSyncExternalStore(
    controleurAccesPremium.sabonner,
    controleurAccesPremium.lireEtat,
    controleurAccesPremium.lireEtat,
  );
  const accesPremiumActif = etatAccesPremium.statut === "premium";
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
  const projectionDeVeilleBasse = projeterVeilleBasse(etat, langue);
  const projectionDeHautPuits = projeterHautPuits(etat, langue);
  const projectionDeLaTrame = projeterTrameDeFer(etat, langue);
  const projectionDeTraverseLibre = projeterTraverseLibre(etat, langue);
  const projectionDeConvergence = projeterConvergenceDeLaTrame(
    etat,
    langue,
  );
  const projectionDeLAiguillageZero = projeterAiguillageZero(etat, langue);
  const projectionDesApprochesDeLaCouronne =
    projeterApprochesDeLaCouronne(etat, langue);
  const projectionDeLaVoieDesColonies = projeterVoieDesColonies(
    etat,
    langue,
  );
  const projectionDeLOuvertureDeLaCouronne =
    projeterOuvertureDeLaCouronne(etat, langue);
  const projectionDuContratFinal = projeterContratFinal(etat, langue);
  const projectionDeLEpilogue = projeterEpilogue(etat, langue);
  const surfacePrioritaire = choisirSurfacePrioritaire({
    criseActive: projectionDesCrises.active !== null,
    checkpointDeCriseRequis,
    demonstrationTerminee:
      projectionDeDemonstration.terminee && !accesPremiumActif,
    ordreDExpedition: projectionDExpedition.ordreImportant !== null,
    evenementNarratif: projection.evenementNarratif !== null,
    conseil: projectionDuConseil.conseil !== null,
  });
  const jalonDeDemonstrationAffiche =
    surfacePrioritaire === "jalon-demonstration";

  useEffect(() => {
    gestionnaireDeBundlesCampagne.synchroniser(
      etat.routes.position,
      accesPremiumActif,
    );
  }, [accesPremiumActif, etat.routes.position]);

  useEffect(
    () => () => gestionnaireDeBundlesCampagne.arreter(),
    [],
  );

  useEffect(() => {
    let dernierInstant = Math.floor(Date.now() / 1_000) * 1_000;
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
      const secondesMesurees = Math.floor(millisecondesResiduelle / 1_000);
      const secondesReelles = Math.max(1, secondesMesurees);
      millisecondesResiduelle =
        secondesMesurees === 0
          ? 0
          : millisecondesResiduelle - secondesMesurees * 1_000;
      application.envoyerCommande({
        type: "temps-du-convoi.ecouler",
        secondesReelles,
      });
    }, 1_000);

    return () => window.clearInterval(horloge);
  }, [application]);

  useEffect(() => {
    if (
      (jalonDeDemonstrationAffiche || projectionDeLEpilogue.visible) &&
      application.lireEtat().tempsDuConvoi.vitesse !== 0
    ) {
      application.envoyerCommande({
        type: "temps-du-convoi.regler-vitesse",
        vitesse: 0,
      });
    }
  }, [
    application,
    jalonDeDemonstrationAffiche,
    projectionDeLEpilogue.visible,
  ]);

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
        <div className="app-header__marque">
          <span className="app-header__lanterne" aria-hidden="true" />
          <div>
            <h1>Les Lanternes de Cendre</h1>
            <p aria-label={`Graine de campagne ${projection.graine}`}>
              {projection.graine}
            </p>
          </div>
        </div>
        {jalonDeDemonstrationAffiche ? null : (
          <div className="app-header__outils">
            <SelecteurDeLangue langue={langue} choisirLangue={choisirLangue} />
            <PanneauAccesPremium
              controleur={controleurAccesPremium}
              langue={langue}
              achatDisponible={false}
            />
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

      {projectionDeLEpilogue.visible ? (
        <Epilogue projection={projectionDeLEpilogue} langue={langue} />
      ) : (
        <>
          <div
            className="scene-layout"
            inert={
              criseBloquante || jalonDeDemonstrationAffiche
                ? true
                : undefined
            }
          >
            <div className="surface-du-monde">
              <section
                className="theatre-du-convoi"
                aria-label={
                  langue === "fr"
                    ? "Vue panoramique du convoi"
                    : "Caravan panorama"
                }
              >
                <CoupeHabitee
                  implantation={projeterImplantationPixi(
                    projectionDInfrastructure,
                  )}
                  chantierActif={
                    projectionDInfrastructure.chantierActif !== null
                  }
                  vitesse={projection.vitesse}
                />
                <div
                  className="theatre-du-convoi__voile"
                  aria-hidden="true"
                />
                <EtatTextuel projection={projection} />
              </section>
              <Atlas
                application={application}
                projection={projectionDeLAtlas}
                expedition={projectionDExpedition}
                langue={langue}
              />
            </div>
            <div className="colonne-de-pilotage">
              <PanneauDePilotage
                application={application}
                projection={projectionDuPilotage}
                compagnon={projectionDuConseil.compagnon}
                langue={langue}
                crises={projectionDesCrises}
              />
              <InfrastructureDuConvoi
                application={application}
                langue={langue}
                projection={projectionDInfrastructure}
              />
              <HautPuits
                application={application}
                projection={projectionDeHautPuits}
              />
              {projectionDeVeilleBasse.visible ? (
                <VeilleBasseEtCohorte
                  projection={projectionDeVeilleBasse}
                  langue={langue}
                />
              ) : null}
              <TrameDeFer projection={projectionDeLaTrame} />
              <TraverseLibre projection={projectionDeTraverseLibre} />
              <ConvergenceTrame projection={projectionDeConvergence} />
              <AiguillageZero projection={projectionDeLAiguillageZero} />
              <Couronne projection={projectionDesApprochesDeLaCouronne} />
              <VoieColonies projection={projectionDeLaVoieDesColonies} />
              <OuvertureCouronne
                projection={projectionDeLOuvertureDeLaCouronne}
              />
              <ContratFinal projection={projectionDuContratFinal} />
            </div>
          </div>

          {surfacePrioritaire === "crise" &&
          projectionDesCrises.active !== null ? (
            <CriseDuConvoi
              application={application}
              crise={projectionDesCrises.active}
              langue={langue}
            />
          ) : surfacePrioritaire ===
            "checkpoint-crise" ? null : surfacePrioritaire ===
            "jalon-demonstration" ? (
            <JalonFinalDeLaDemonstration
              projection={projectionDeDemonstration}
              langue={langue}
            >
              <SelecteurDeLangue
                langue={langue}
                choisirLangue={choisirLangue}
              />
              <PanneauSauvegarde
                controleur={controleur}
                statutAutomatique={etatDuControleur.statutSauvegarde}
                erreurAsynchrone={etatDuControleur.erreurSauvegarde}
              />
              <PanneauAccesPremium
                controleur={controleurAccesPremium}
                langue={langue}
                achatDisponible
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
            bloque={
              criseBloquante ||
              (projectionDeDemonstration.terminee && !accesPremiumActif)
            }
          />
        </>
      )}
    </main>
  );
}

interface PropsApp {
  readonly controleur: ControleurDeSessionCampagne;
  readonly controleurAccesPremium: ControleurAccesPremium;
}

export function App({ controleur, controleurAccesPremium }: PropsApp) {
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
      controleurAccesPremium={controleurAccesPremium}
    />
  );
}
