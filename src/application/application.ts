import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
  type EtatCampagne,
  type EvenementDeDomaine,
  type VitesseDuConvoi,
} from "../simulation/campagne";

export interface ProjectionDeCampagne {
  readonly graine: string;
  readonly horloge: string;
  readonly statutDuTemps: "En pause" | "En marche";
  readonly vitesse: VitesseDuConvoi;
  readonly habitants: number;
  readonly phare: "actif";
  readonly formation: "grappe";
  readonly nombreDePlateformes: number;
  readonly empreinte: string;
}

export interface ApplicationCampagne {
  readonly lireEtat: () => EtatCampagne;
  readonly lireProjection: () => ProjectionDeCampagne;
  readonly envoyerCommande: (
    commande: CommandeCampagne,
  ) => readonly EvenementDeDomaine[];
  readonly sabonner: (ecouteur: () => void) => () => void;
}

function formaterHorloge(secondes: number): string {
  const minutes = Math.floor(secondes / 60);
  const reste = secondes % 60;

  return `${minutes.toString().padStart(2, "0")}:${reste
    .toString()
    .padStart(2, "0")}`;
}

export function projeterCampagne(etat: EtatCampagne): ProjectionDeCampagne {
  return {
    graine: etat.graine,
    horloge: formaterHorloge(etat.tempsDuConvoi.secondes),
    statutDuTemps:
      etat.tempsDuConvoi.vitesse === 0 ? "En pause" : "En marche",
    vitesse: etat.tempsDuConvoi.vitesse,
    habitants: etat.citeCaravane.habitants,
    phare: etat.citeCaravane.phare,
    formation: etat.citeCaravane.formation.type,
    nombreDePlateformes: etat.citeCaravane.formation.plateformes.length,
    empreinte: empreinteEtat(etat),
  };
}

export function creerApplicationCampagne(
  graine: string,
): ApplicationCampagne {
  let etat = creerCampagneInitiale(graine);
  const ecouteurs = new Set<() => void>();

  return {
    lireEtat: () => etat,
    lireProjection: () => projeterCampagne(etat),
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
