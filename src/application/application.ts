import { trouverEvenement } from "../content/catalogue";
import { remplacerVariables } from "../content/texte";
import type { Langue, TexteCompile } from "../content/types";
import { lirePresentationsPremium } from "../content/presentationsPremium";
import {
  appliquerCommande,
  choixNarratifEstDisponible,
  creerCampagneInitiale,
  type CommandeCampagne,
  type EtatCampagne,
  type EvenementDeDomaine,
  type GraineDeCampagne,
  type VitesseDuConvoi,
} from "../simulation/campagne";
import { calculerDevenirsDesSitesDesBassins } from "../simulation/sites";

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
    readonly disponible?: boolean;
    readonly indisponibilite?: string;
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
  readonly transformationRegionale: {
    readonly nom: string;
    readonly statut: string;
  } | null;
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

function recapitulatifDesBassins(
  etat: EtatCampagne,
  langue: Langue,
): readonly string[] {
  const textes = lirePresentationsPremium()?.deversoir?.[langue];
  if (textes === undefined) {
    throw new Error(
      "Les présentations premium du récapitulatif régional sont absentes.",
    );
  }
  const nomsDesLieux = textes.nomsDesLieux;
  const formater = (
    modele: string,
    valeurs: Readonly<Record<string, string>>,
  ) =>
    modele.replace(
      /\{([^}]+)\}/g,
      (_correspondance, cle: string) => valeurs[cle] ?? `{${cle}}`,
    );
  const lieuxParcourus = new Set<string>(
    etat.routes.engagements.flatMap(({ origine, destination }) => [
      origine,
      destination,
    ]),
  );
  lieuxParcourus.add(etat.routes.position);
  if (
    etat.veilleBasse.cohorte.destination === "hospice-du-sillon" ||
    etat.veilleBasse.maelysRive.position === "hospice-du-sillon" ||
    etat.veilleBasse.hospiceDuSillon.devenir !== "ouvert"
  ) {
    lieuxParcourus.add("hospice-du-sillon");
  }
  if (
    etat.routes.engagements.some(
      ({ tronconId }) =>
        tronconId === "nacelles-de-veille-basse" ||
        tronconId === "chenal-des-vannes",
    ) ||
    etat.narration.faitsDeCampagne.some((fait) =>
      fait.id.startsWith("bassins.nacelles."),
    )
  ) {
    lieuxParcourus.add("nacelles");
  }
  const lieuxDesBassins = [
    "halte-du-puits-sec",
    "haut-puits",
    "les-vanniers",
    "veille-basse",
    "hospice-du-sillon",
    "nacelles",
    "relais-des-vannes",
    "deversoir-noir",
  ] as const;
  const visites = lieuxDesBassins.filter((lieu) => lieuxParcourus.has(lieu));
  const nonRejoints = lieuxDesBassins.filter(
    (lieu) => !lieuxParcourus.has(lieu),
  );
  const faitPresent = (id: string) =>
    etat.narration.faitsDeCampagne.some((fait) => fait.id === id);
  const projet = etat.hautPuits.projetRegional;
  const devenirsDesSites =
    etat.devenirsDesSites ??
    calculerDevenirsDesSitesDesBassins({
      routes: etat.routes,
      veilleBasse: etat.veilleBasse,
      faits: etat.narration.faitsDeCampagne.map((fait) => fait.id),
    });
  const devenirParLieu: Readonly<Record<string, string>> = {
    "halte-du-puits-sec":
      textes.devenirsDeSites[devenirsDesSites.maisonDesFiltres],
    "les-vanniers": textes.devenirsDeSites[devenirsDesSites.vanniers],
    "hospice-du-sillon":
      textes.devenirsDeSites[devenirsDesSites.hospiceDuSillon],
    nacelles: textes.devenirsDeSites[devenirsDesSites.nacelles],
  };
  const nommerLieuAvecDevenir = (id: (typeof lieuxDesBassins)[number]) =>
    devenirParLieu[id] === undefined
      ? nomsDesLieux[id]
      : `${nomsDesLieux[id]} (${devenirParLieu[id]})`;
  const projetDecrit =
    projet === null || projet === undefined
      ? textes.projetNonRetenu
      : `${textes.projets[projet.id]}, ${textes.statutsDeProjet[projet.statut]}`;
  return [
    formater(textes.lieuxTraverses, {
      lieux: visites.map(nommerLieuAvecDevenir).join(", "),
    }),
    formater(textes.lieuxNonRejoints, {
      lieux:
        nonRejoints.length === 0
          ? textes.aucunLieu
          : nonRejoints.map(nommerLieuAvecDevenir).join(", "),
    }),
    formater(textes.etatDesColonies, {
      hautPuitsStatut:
        textes.statutsDeColonie[etat.hautPuits.colonie.statut],
      hautPuitsDevenir:
        textes.devenirsDeHautPuits[etat.hautPuits.colonie.devenir],
      veilleBasseStatut:
        textes.statutsDeColonie[etat.veilleBasse.colonie.statut],
      hospiceDevenir:
        textes.devenirsDeHospice[
          etat.veilleBasse.hospiceDuSillon.devenir
        ],
      cohorteDestination:
        textes.destinationsDeCohorte[
          etat.veilleBasse.cohorte.destination
        ],
    }),
    formater(textes.occasions, {
      ligneZero: faitPresent("bassins.deversoir.ligne-zero-relevee")
        ? textes.ligneZeroEmportee
        : textes.ligneZeroNonEmportee,
      projet: projetDecrit,
      archives:
        textes.etatsDArchives[etat.veilleBasse.colonie.archives.etat],
    }),
  ];
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
    informations: [
      ...textes.informations.map((information) =>
        rendreTexte(information, contexte),
      ),
      ...(evenement.id ===
      "bassins.deversoir.le-passage-sans-retour"
        ? recapitulatifDesBassins(etat, langue)
        : []),
    ],
    asset:
      evenement.asset === null
        ? null
        : {
            fichier: evenement.asset.fichier,
            alternative: evenement.asset.alternatives[langue],
          },
    choix: evenement.choix
      .filter(
        (choix) =>
          (evenement.id !==
            "bassins.deversoir.le-chassis-des-bassins" ||
            choix.id !== "sceller-transformation" ||
            (etat.hautPuits.projetRegional?.statut === "retenu" &&
              etat.pilotage.economie.stocks.materiaux.quantite >=
                12)) &&
          (!evenement.id.startsWith("trame.marche.") ||
            choixNarratifEstDisponible(etat, evenement.id, {
              id: choix.id,
              effets: [],
            })),
      )
      .map((choix) => {
        const textesDuChoix = textes.choix[choix.id];
        if (textesDuChoix === undefined) {
          throw new Error(
            `Les textes du choix « ${choix.id} » de « ${evenement.id} » sont introuvables.`,
          );
        }

        const disponible = choixNarratifEstDisponible(
          etat,
          evenement.id,
          choix,
        );
        return {
          id: choix.id,
          intention: rendreTexte(textesDuChoix.intention, contexte),
          coutsConnus: textesDuChoix.coutsConnus.map((cout) =>
            rendreTexte(cout, contexte),
          ),
          ...(evenement.id.startsWith("trame.")
            ? {
                disponible,
                ...(!disponible
                  ? {
                      indisponibilite:
                        langue === "fr"
                          ? "Stock insuffisant pour ce coût."
                          : "Insufficient stock for this cost.",
                    }
                  : {}),
              }
            : {}),
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
    transformationRegionale:
      etat.hautPuits.projetRegional === null ||
      etat.hautPuits.projetRegional === undefined
        ? null
        : {
            nom:
              lirePresentationsPremium()?.deversoir?.[langue].projets[
                etat.hautPuits.projetRegional.id
              ] ?? etat.hautPuits.projetRegional.id,
            statut:
              lirePresentationsPremium()?.deversoir?.[langue]
                .statutsDeProjet[
                etat.hautPuits.projetRegional.statut
              ] ?? etat.hautPuits.projetRegional.statut,
          },
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
