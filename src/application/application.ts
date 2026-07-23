import { trouverEvenement } from "../content/catalogue";
import { remplacerVariables } from "../content/texte";
import type { Langue, TexteCompile } from "../content/types";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type CommandeCampagne,
  type EtatCampagne,
  type EvenementDeDomaine,
  type GraineDeCampagne,
  type VitesseDuConvoi,
} from "../simulation/campagne";

export interface ProjectionEvenementNarratif {
  readonly id: string;
  readonly origine: string;
  readonly libelleIntentions: string;
  readonly titre: string;
  readonly presentation: string;
  readonly variante: string;
  readonly informations: readonly string[];
  readonly asset: {
    readonly fichier: string;
    readonly alternative: string;
  } | null;
  readonly choix: readonly {
    readonly id: string;
    readonly intention: string;
    readonly coutsConnus: readonly string[];
  }[];
}

export interface ProjectionDeCampagne {
  readonly graine: GraineDeCampagne;
  readonly horloge: string;
  readonly dureeIso: string;
  readonly statutDuTemps: "En pause" | "En marche";
  readonly vitesse: VitesseDuConvoi;
  readonly habitants: number;
  readonly phare: "actif";
  readonly formation: "grappe";
  readonly nombreDePlateformes: number;
  readonly evenementNarratif: ProjectionEvenementNarratif | null;
}

export interface ApplicationCampagne {
  readonly lireEtat: () => EtatCampagne;
  readonly commandeEstAutorisee: (commande: CommandeCampagne) => boolean;
  readonly envoyerCommande: (
    commande: CommandeCampagne,
  ) => readonly EvenementDeDomaine[];
  readonly sabonner: (ecouteur: () => void) => () => void;
  readonly sabonnerAuxCommandes: (
    ecouteur: (
      commande: CommandeCampagne,
      etat: EtatCampagne,
      evenements: readonly EvenementDeDomaine[],
    ) => void,
  ) => () => void;
}

export interface PolitiqueDAccesAuContenu {
  readonly verifierCommande: (
    etat: EtatCampagne,
    commande: CommandeCampagne,
  ) => RefusDeCommande | null;
}

export interface RefusDeCommande {
  readonly code: "acces-premium-requis";
}

export class ErreurDeCommandeRefusee extends Error {
  constructor(readonly refus: RefusDeCommande) {
    super(refus.code);
    this.name = "ErreurDeCommandeRefusee";
  }
}

export interface OptionsDApplicationCampagne {
  readonly politiqueDAcces?: PolitiqueDAccesAuContenu;
}

const ACCES_AU_CONTENU_DE_LA_DEMONSTRATION: PolitiqueDAccesAuContenu = {
  verifierCommande: (etat, commande) =>
    commande.type === "haut-puits.marche.echanger" ||
    (commande.type === "engagement-de-route.confirmer" &&
      etat.routes.jalons.length > 0)
      ? { code: "acces-premium-requis" }
      : null,
};

export const ACCES_AU_CONTENU_COMPLET: PolitiqueDAccesAuContenu = {
  verifierCommande: () => null,
};

export function creerPolitiqueDAccesPremium(
  possedeAccesPremium: () => boolean,
): PolitiqueDAccesAuContenu {
  return {
    verifierCommande: (etat, commande) =>
      possedeAccesPremium()
        ? null
        : ACCES_AU_CONTENU_DE_LA_DEMONSTRATION.verifierCommande(
            etat,
            commande,
          ),
  };
}

interface TempsDecompose {
  readonly minutes: number;
  readonly secondesRestantes: number;
}

function decomposerTemps(secondes: number): TempsDecompose {
  return {
    minutes: Math.floor(secondes / 60),
    secondesRestantes: secondes % 60,
  };
}

function formaterHorloge({
  minutes,
  secondesRestantes,
}: TempsDecompose): string {
  return `${minutes.toString().padStart(2, "0")}:${secondesRestantes
    .toString()
    .padStart(2, "0")}`;
}

function formaterDureeIso({
  minutes,
  secondesRestantes,
}: TempsDecompose): string {
  return `PT${minutes}M${secondesRestantes}S`;
}

function rendreTexte(
  texte: TexteCompile,
  valeursDuContexte: Readonly<Record<string, string | number>>,
): string {
  const valeurs = { ...valeursDuContexte, ...texte.valeurs };

  return remplacerVariables(texte.modele, (variable) => {
    const valeur = valeurs[variable];
    if (valeur === undefined) {
      throw new Error(
        `La variable « ${variable} » manque pour le texte « ${texte.cle} ».`,
      );
    }
    return String(valeur);
  });
}

function projeterEvenementNarratif(
  etat: EtatCampagne,
  langue: Langue,
): ProjectionEvenementNarratif | null {
  const id = etat.narration.evenementActif;
  if (id === null) {
    return null;
  }

  const evenement = trouverEvenement(id);
  if (evenement === undefined) {
    throw new Error(`L’Événement narratif actif « ${id} » est introuvable.`);
  }

  const textes = evenement.textes[langue];
  const contexte = { habitants: etat.citeCaravane.habitants };
  const idVariante = evenement.variantes.find(({ condition }) => {
    if (condition.type === "toujours") {
      return true;
    }
    return etat.narration.faitsDeCampagne.some(
      (fait) => fait.id === condition.fait,
    );
  })?.id;
  const texteVariante =
    idVariante === undefined ? undefined : textes.variantes[idVariante];
  if (texteVariante === undefined) {
    throw new Error(
      `La variante de présentation de « ${evenement.id} » est introuvable.`,
    );
  }

  return {
    id: evenement.id,
    origine: rendreTexte(textes.origine, contexte),
    libelleIntentions: rendreTexte(textes.libelleIntentions, contexte),
    titre: rendreTexte(textes.titre, contexte),
    presentation: rendreTexte(textes.presentation, contexte),
    variante: rendreTexte(texteVariante, contexte),
    informations: textes.informations.map((information) =>
      rendreTexte(information, contexte),
    ),
    asset:
      evenement.asset === null
        ? null
        : {
            fichier: evenement.asset.fichier,
            alternative: evenement.asset.alternatives[langue],
          },
    choix: evenement.choix.map((choix) => {
      const textesDuChoix = textes.choix[choix.id];
      if (textesDuChoix === undefined) {
        throw new Error(
          `Les textes du choix « ${choix.id} » de « ${evenement.id} » sont introuvables.`,
        );
      }

      return {
        id: choix.id,
        intention: rendreTexte(textesDuChoix.intention, contexte),
        coutsConnus: textesDuChoix.coutsConnus.map((cout) =>
          rendreTexte(cout, contexte),
        ),
      };
    }),
  };
}

export function projeterCampagne(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeCampagne {
  const temps = decomposerTemps(etat.tempsDuConvoi.secondes);

  return {
    graine: etat.graine,
    horloge: formaterHorloge(temps),
    dureeIso: formaterDureeIso(temps),
    statutDuTemps:
      etat.tempsDuConvoi.vitesse === 0 ? "En pause" : "En marche",
    vitesse: etat.tempsDuConvoi.vitesse,
    habitants: etat.citeCaravane.habitants,
    phare: etat.citeCaravane.phare,
    formation: etat.citeCaravane.formation.type,
    nombreDePlateformes: etat.citeCaravane.formation.plateformes.length,
    evenementNarratif: projeterEvenementNarratif(etat, langue),
  };
}

function creerApplication(
  etatInitial: EtatCampagne,
  politiqueDAcces: PolitiqueDAccesAuContenu,
): ApplicationCampagne {
  let etat = etatInitial;
  const ecouteurs = new Set<() => void>();
  const ecouteursDeCommandes = new Set<
    (
      commande: CommandeCampagne,
      etat: EtatCampagne,
      evenements: readonly EvenementDeDomaine[],
    ) => void
  >();

  return {
    lireEtat: () => etat,
    commandeEstAutorisee: (commande) =>
      politiqueDAcces.verifierCommande(etat, commande) === null,
    envoyerCommande: (commande) => {
      const refus = politiqueDAcces.verifierCommande(etat, commande);
      if (refus !== null) {
        throw new ErreurDeCommandeRefusee(refus);
      }
      const transition = appliquerCommande(etat, commande);
      etat = transition.etat;
      ecouteursDeCommandes.forEach((ecouteur) =>
        ecouteur(commande, etat, transition.evenements),
      );
      ecouteurs.forEach((ecouteur) => ecouteur());
      return transition.evenements;
    },
    sabonner: (ecouteur) => {
      ecouteurs.add(ecouteur);
      return () => ecouteurs.delete(ecouteur);
    },
    sabonnerAuxCommandes: (ecouteur) => {
      ecouteursDeCommandes.add(ecouteur);
      return () => ecouteursDeCommandes.delete(ecouteur);
    },
  };
}

export function creerApplicationCampagne(
  graine: GraineDeCampagne,
  options: OptionsDApplicationCampagne = {},
): ApplicationCampagne {
  const etatInitial = creerCampagneInitiale(graine);

  return creerApplication(
    etatInitial,
    options.politiqueDAcces ?? ACCES_AU_CONTENU_DE_LA_DEMONSTRATION,
  );
}

export function reprendreApplicationCampagne(
  etat: EtatCampagne,
  options: OptionsDApplicationCampagne = {},
): ApplicationCampagne {
  return creerApplication(
    etat,
    options.politiqueDAcces ?? ACCES_AU_CONTENU_DE_LA_DEMONSTRATION,
  );
}
