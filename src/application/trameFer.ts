import type { Langue } from "../content/types";
import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { EtatCampagne } from "../simulation/campagne";

export interface ProjectionDeLaTrameDeFer {
  readonly visible: boolean;
  readonly titre: string;
  readonly statut: string;
  readonly relationRepublique: string;
  readonly pressions: readonly string[];
  readonly marche: readonly string[];
  readonly engagements: readonly string[];
  readonly voiesDeLaPiece: readonly string[];
  readonly occasions: readonly string[];
  readonly libelles: {
    readonly eyebrow: string;
    readonly republique: string;
    readonly pressions: string;
    readonly marche: string;
    readonly engagements: string;
    readonly aucunEngagement: string;
    readonly piece: string;
    readonly voieAOuvrir: string;
  };
}

export function projeterTrameDeFer(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeLaTrameDeFer {
  const visible =
    etat.routes.position === "grand-aiguillage" &&
    !etat.routes.engagements.some(({ statut }) => statut === "en-cours");
  const textes = lirePresentationsPremium()?.trame?.[langue];
  if (!visible || textes === undefined) {
    return {
      visible: false,
      titre: "",
      statut: "",
      relationRepublique: "",
      pressions: [],
      marche: [],
      engagements: [],
      voiesDeLaPiece: [],
      occasions: [],
      libelles: {
        eyebrow: "",
        republique: "",
        pressions: "",
        marche: "",
        engagements: "",
        aucunEngagement: "",
        piece: "",
        voieAOuvrir: "",
      },
    };
  }
  const grandAiguillage = etat.trameDeFer.grandAiguillage;
  return {
    visible,
    titre: textes.titre,
    statut: textes.statuts[grandAiguillage.statut]!,
    relationRepublique:
      textes.relations[etat.trameDeFer.relationRepublique]!,
    pressions: [
      textes.eau[grandAiguillage.pressions.eauDeRefroidissement]!,
      textes.requisitions[grandAiguillage.pressions.requisitions]!,
    ],
    marche: [
      textes.servicesLourdsRestants.replace(
        "{nombre}",
        String(grandAiguillage.marche.servicesLourdsRestants),
      ),
      textes.reserveDeRefroidissementRestante.replace(
        "{nombre}",
        String(grandAiguillage.marche.eauDeRefroidissementRestante),
      ),
    ],
    engagements: etat.trameDeFer.engagements.map(
      ({ id }) => textes.engagements[id]!,
    ),
    voiesDeLaPiece: etat.trameDeFer.pieceDeRegulation.voiesOuvertes.map(
      (voie) => textes.voies[voie]!,
    ),
    occasions: [
      ...(etat.trameDeFer.occasions.trainOutil.statut === "inconnue"
        ? []
        : [
            textes.occasionTrainOutil.replace(
              "{nombre}",
              String(
                etat.trameDeFer.occasions.trainOutil.coutServicesLourds,
              ),
            ),
          ]),
      ...(etat.trameDeFer.occasions.attelageFedere.statut === "inconnue"
        ? []
        : [
            textes.occasionAttelageFedere.replace(
              "{nombre}",
              String(etat.trameDeFer.occasions.attelageFedere.coutMateriaux),
            ),
          ]),
    ],
    libelles: textes.libelles,
  };
}
