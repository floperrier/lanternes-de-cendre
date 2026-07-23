import type { Langue, TexteCompile } from "../content/types";
import { trouverConseil } from "../content/catalogue";
import type { EtatCampagne } from "../simulation/campagne";
import {
  COMPAGNON_DE_REFERENCE,
  IDENTIFIANT_DU_CONSEIL_DES_VANNES,
  PREMIER_CONSEIL,
  compagnonEstAffecte,
  conseilDesVannesEstConvoque,
  conseilDesVannesEstTermine,
  conseilEstTermine,
  decisionDuConseilDesVannesEstDisponible,
  selectionnerVoixPertinentes,
  type CritereDePertinence,
} from "../simulation/conseil";

export interface LibellesDuPanneauCompagnon {
  readonly type: string;
  readonly majeure: string;
  readonly secondaire: string;
  readonly trait: string;
  readonly conviction: string;
  readonly projet: string;
  readonly etat: string;
  readonly soin: string;
  readonly affecter: string;
  readonly affectee: string;
  readonly information: string;
}

export interface LibellesDeLaProjectionDuConseil {
  readonly conseil: string;
  readonly fait: string;
  readonly source: string;
  readonly recommandation: string;
  readonly enjeu: string;
  readonly decision: string;
  readonly reponseOuverte: string;
}

export interface ProjectionDuCompagnon {
  readonly id: string;
  readonly nom: string;
  readonly competenceMajeure: string;
  readonly competenceSecondaire: string;
  readonly trait: {
    readonly nom: string;
    readonly ambivalence: string;
  };
  readonly conviction: string;
  readonly projet: string;
  readonly etatPersonnel: {
    readonly nom: string;
    readonly contrainte: string;
    readonly voieDeSoin: string;
  };
  readonly affectation: {
    readonly quartierId: string;
    readonly quartier: string;
    readonly informationOuverte: string;
  } | null;
  readonly quartierDAffectationId: string;
  readonly libelles: LibellesDuPanneauCompagnon;
}

export interface ProjectionDuConseil {
  readonly id: string;
  readonly titre: string;
  readonly libelles: LibellesDeLaProjectionDuConseil;
  readonly sujets: readonly {
    readonly id: string;
    readonly titre: string;
    readonly voix: readonly {
      readonly compagnonId: string;
      readonly compagnon: string;
      readonly faitConnu: string;
      readonly source: {
        readonly nom: string;
        readonly date: string;
      };
      readonly recommandationMorale: string;
      readonly enjeuPersonnel: string;
    }[];
    readonly decisions: readonly {
      readonly id: string;
      readonly libelle: string;
      readonly ouverteParAffectation: boolean;
    }[];
  }[];
}

export interface ProjectionDuCompagnonEtDuConseil {
  readonly compagnon: ProjectionDuCompagnon;
  readonly conseil: ProjectionDuConseil | null;
}

function lire(texte: TexteCompile): string {
  return texte.modele;
}

function exiger<T>(valeur: T | undefined, message: string): T {
  if (valeur === undefined) {
    throw new Error(message);
  }
  return valeur;
}

export function projeterCompagnonEtConseil(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDuCompagnonEtDuConseil {
  const textes = PREMIER_CONSEIL.textes[langue];
  const textesDuCompagnon = textes.compagnon;
  const libelles = textes.libelles;
  const faits = etat.narration.faitsDeCampagne;
  const estAffecte = compagnonEstAffecte(faits);
  const compagnon: ProjectionDuCompagnon = {
    id: COMPAGNON_DE_REFERENCE.id,
    nom: lire(textesDuCompagnon.nom),
    competenceMajeure: lire(textesDuCompagnon.competenceMajeure),
    competenceSecondaire: lire(textesDuCompagnon.competenceSecondaire),
    trait: {
      nom: lire(textesDuCompagnon.trait),
      ambivalence: lire(textesDuCompagnon.ambivalence),
    },
    conviction: lire(textesDuCompagnon.conviction),
    projet: lire(textesDuCompagnon.projet),
    etatPersonnel: {
      nom: lire(textesDuCompagnon.etatPersonnel),
      contrainte: lire(textesDuCompagnon.contrainte),
      voieDeSoin: lire(textesDuCompagnon.voieDeSoin),
    },
    affectation: estAffecte
      ? {
          quartierId: PREMIER_CONSEIL.compagnon.affectation.quartier,
          quartier: lire(textesDuCompagnon.quartier),
          informationOuverte: lire(textesDuCompagnon.informationOuverte),
        }
      : null,
    quartierDAffectationId: PREMIER_CONSEIL.compagnon.affectation.quartier,
    libelles: {
      type: lire(libelles.typeCompagnon),
      majeure: lire(libelles.competenceMajeure),
      secondaire: lire(libelles.competenceSecondaire),
      trait: lire(libelles.trait),
      conviction: lire(libelles.conviction),
      projet: lire(libelles.projet),
      etat: lire(libelles.etatPersonnel),
      soin: lire(libelles.soin),
      affecter: lire(libelles.affecter),
      affectee: lire(libelles.affectee),
      information: lire(libelles.informationOuverte),
    },
  };

  const conseilDesVannes = trouverConseil(
    IDENTIFIANT_DU_CONSEIL_DES_VANNES,
  );
  const definitionDuConseil =
    etat.routes.position === "deversoir-noir" &&
    etat.narration.evenementActif === null &&
    conseilDesVannes !== undefined &&
    conseilDesVannesEstConvoque(faits) &&
    !conseilDesVannesEstTermine(faits)
      ? conseilDesVannes
      : estAffecte && !conseilEstTermine(faits)
        ? PREMIER_CONSEIL
        : null;
  if (definitionDuConseil === null) {
    return { compagnon, conseil: null };
  }
  const textesDuConseil = definitionDuConseil.textes[langue];
  const libellesDuConseil = textesDuConseil.libelles;
  const sujets = definitionDuConseil.sujets.slice(0, 3).map((sujet) => {
    const textesDuSujet = exiger(
      textesDuConseil.sujets[sujet.id],
      `Textes absents pour le sujet « ${sujet.id} ».`,
    );
    const voix = selectionnerVoixPertinentes(
      sujet.voix.map((definitionDeVoix) => {
        const textesDeLaVoix = exiger(
          textesDuSujet.voix[definitionDeVoix.compagnonId],
          `Textes absents pour la voix « ${definitionDeVoix.compagnonId} ».`,
        );
        return {
          compagnonId: definitionDeVoix.compagnonId,
          criteres:
            definitionDeVoix.criteres as readonly CritereDePertinence[],
          compagnon: lire(
            textesDuConseil.compagnon.nom,
          ),
          faitConnu: lire(textesDeLaVoix.faitConnu),
          source: {
            nom: lire(textesDeLaVoix.source),
            date: lire(textesDeLaVoix.dateSource),
          },
          recommandationMorale: lire(textesDeLaVoix.recommandationMorale),
          enjeuPersonnel: lire(textesDeLaVoix.enjeuPersonnel),
        };
      }),
    ).map((voixSelectionnee) => ({
      compagnonId: voixSelectionnee.compagnonId,
      compagnon: voixSelectionnee.compagnon,
      faitConnu: voixSelectionnee.faitConnu,
      source: voixSelectionnee.source,
      recommandationMorale: voixSelectionnee.recommandationMorale,
      enjeuPersonnel: voixSelectionnee.enjeuPersonnel,
    }));

    return {
      id: sujet.id,
      titre: lire(textesDuSujet.titre),
      voix,
      decisions: sujet.decisions
        .filter(
          (decision) =>
            definitionDuConseil.id !==
              IDENTIFIANT_DU_CONSEIL_DES_VANNES ||
            decisionDuConseilDesVannesEstDisponible(
              decision.id,
              faits,
            ),
        )
        .map((decision) => ({
          id: decision.id,
          libelle: lire(
            exiger(
              textesDuSujet.decisions[decision.id],
              `Texte absent pour la décision « ${decision.id} ».`,
            ),
          ),
          ouverteParAffectation: decision.ouverteParAffectation,
        })),
    };
  });

  return {
    compagnon,
    conseil: {
      id: definitionDuConseil.id,
      titre: lire(textesDuConseil.titre),
      libelles: {
        conseil: lire(libellesDuConseil.conseil),
        fait: lire(libellesDuConseil.faitConnu),
        source: lire(libellesDuConseil.source),
        recommandation: lire(libellesDuConseil.recommandationMorale),
        enjeu: lire(libellesDuConseil.enjeuPersonnel),
        decision: lire(libellesDuConseil.decision),
        reponseOuverte: lire(libellesDuConseil.reponseOuverte),
      },
      sujets,
    },
  };
}
