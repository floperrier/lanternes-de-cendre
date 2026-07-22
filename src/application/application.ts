import {
  appliquerCommande,
  creerCampagneInitiale,
  type CommandeCampagne,
  type EtatCampagne,
  type EvenementDeDomaine,
  type GraineDeCampagne,
  type VitesseDuConvoi,
} from "../simulation/campagne";

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
}

export interface ApplicationCampagne {
  readonly lireEtat: () => EtatCampagne;
  readonly envoyerCommande: (
    commande: CommandeCampagne,
  ) => readonly EvenementDeDomaine[];
  readonly sabonner: (ecouteur: () => void) => () => void;
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

export function projeterCampagne(etat: EtatCampagne): ProjectionDeCampagne {
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
  };
}

export function creerApplicationCampagne(
  graine: GraineDeCampagne,
): ApplicationCampagne {
  let etat = creerCampagneInitiale(graine);
  const ecouteurs = new Set<() => void>();

  return {
    lireEtat: () => etat,
    envoyerCommande: (commande) => {
      const transition = appliquerCommande(etat, commande);
      etat = transition.etat;
      ecouteurs.forEach((ecouteur) => ecouteur());
      return transition.evenements;
    },
    sabonner: (ecouteur) => {
      ecouteurs.add(ecouteur);
      return () => ecouteurs.delete(ecouteur);
    },
  };
}
