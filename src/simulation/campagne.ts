import { catalogueDEvenements, trouverEvenement } from "../content/catalogue";
import type {
  ConditionDEvenement,
  EffetDEvenement,
  EvenementDuCatalogue,
} from "../content/types";
import type { EffetsDeFait, FaitDeCampagne } from "./faits";
import {
  creerFluxPseudoAleatoire,
  type FluxPseudoAleatoire,
} from "./aleatoire";
import type { GraineDeCampagne } from "./graine";
import { formaterEmpreinteFnv1a32V1 } from "./empreinte";
import {
  creerPilotageInitial,
  engagerTransitionDeDoctrine,
  ordonnerResolutionDIncident,
  traiterEcheancesDePilotage,
  type CommandeDeDoctrine,
  type CommandeDIncident,
  type EtatPilotage,
  type EvenementDeDoctrine,
  type EvenementDIncidentResolu,
} from "./pilotage";
import {
  creerInfrastructureInitiale,
  engagerChantier,
  faireProgresserChantier,
  IDENTIFIANTS_DE_PLATEFORME_INITIALE,
  secondesAvantFinDuChantier,
  type CommandeDInfrastructure,
  type EtatInfrastructure,
  type EvenementDInfrastructure,
} from "./infrastructure";
import { VERSION_SIMULATION_COURANTE } from "./versions";
import {
  affecterCompagnon,
  deciderAuConseil,
  type CommandeDAffectationDeCompagnon,
  type CommandeDeDecisionDuConseil,
  type EvenementDAffectationDeCompagnon,
  type EvenementDeDecisionDuConseil,
} from "./conseil";

export type { GraineDeCampagne } from "./graine";
export const IDENTIFIANTS_PLATEFORMES_MOBILES =
  IDENTIFIANTS_DE_PLATEFORME_INITIALE;
export type IdentifiantPlateformeMobile =
  (typeof IDENTIFIANTS_PLATEFORMES_MOBILES)[number];
export const VITESSES_DU_CONVOI = [0, 1, 2, 4] as const;
export type VitesseDuConvoi = (typeof VITESSES_DU_CONVOI)[number];

export type { FaitDeCampagne } from "./faits";

export interface EcheanceDeCampagne {
  readonly id: string;
  readonly secondeDEcheance: number;
  readonly cause: string;
  readonly commande: CommandeCampagne;
}

export interface EtatCampagne {
  readonly version: typeof VERSION_SIMULATION_COURANTE;
  readonly graine: GraineDeCampagne;
  readonly tempsDuConvoi: {
    readonly secondes: number;
    readonly vitesse: VitesseDuConvoi;
  };
  readonly citeCaravane: {
    readonly habitants: number;
    readonly phare: "actif";
    readonly formation: {
      readonly type: "grappe";
      readonly plateformes: readonly IdentifiantPlateformeMobile[];
    };
  };
  readonly narration: {
    readonly evenementActif: string | null;
    readonly evenementsJoues: readonly string[];
    readonly faitsDeCampagne: readonly FaitDeCampagne[];
  };
  readonly pilotage: EtatPilotage;
  readonly infrastructure: EtatInfrastructure;
  readonly echeances: readonly EcheanceDeCampagne[];
  readonly fluxPseudoAleatoires: Readonly<{
    "evenements-narratifs": FluxPseudoAleatoire;
  }>;
}

export type CommandeCampagne =
  | {
      readonly type: "temps-du-convoi.regler-vitesse";
      readonly vitesse: VitesseDuConvoi;
    }
  | {
      readonly type: "temps-du-convoi.ecouler";
      readonly secondesReelles: number;
    }
  | {
      readonly type: "evenement-narratif.choisir";
      readonly evenementId: string;
      readonly choixId: string;
    }
  | CommandeDAffectationDeCompagnon
  | CommandeDeDecisionDuConseil
  | CommandeDeDoctrine
  | CommandeDIncident
  | CommandeDInfrastructure;

export type EvenementDeDomaine =
  | {
      readonly type: "temps-du-convoi.vitesse-modifiee";
      readonly vitessePrecedente: VitesseDuConvoi;
      readonly vitesse: VitesseDuConvoi;
    }
  | {
      readonly type: "temps-du-convoi.ecoule";
      readonly secondeInitiale: number;
      readonly secondeFinale: number;
    }
  | {
      readonly type: "temps-du-convoi.premiere-minute-atteinte";
      readonly secondeAtteinte: 60;
    }
  | {
      readonly type: "evenement-narratif.declenche";
      readonly evenementId: string;
      readonly fenetre: string;
    }
  | {
      readonly type: "evenement-narratif.choix-resolu";
      readonly evenementId: string;
      readonly choixId: string;
      readonly effets: readonly EffetDEvenement[];
      readonly faitsProduits: readonly string[];
    }
  | EvenementDAffectationDeCompagnon
  | EvenementDeDecisionDuConseil
  | EvenementDeDoctrine
  | EvenementDIncidentResolu
  | EvenementDInfrastructure;

export interface TransitionDeCampagne {
  readonly etat: EtatCampagne;
  readonly evenements: readonly EvenementDeDomaine[];
}

export function creerCampagneInitiale(graine: GraineDeCampagne): EtatCampagne {
  return {
    version: VERSION_SIMULATION_COURANTE,
    graine,
    tempsDuConvoi: {
      secondes: 0,
      vitesse: 1,
    },
    citeCaravane: {
      habitants: 184,
      phare: "actif",
      formation: {
        type: "grappe",
        plateformes: IDENTIFIANTS_PLATEFORMES_MOBILES,
      },
    },
    narration: {
      evenementActif: null,
      evenementsJoues: [],
      faitsDeCampagne: [],
    },
    pilotage: creerPilotageInitial(),
    infrastructure: creerInfrastructureInitiale(),
    echeances: [],
    fluxPseudoAleatoires: {
      "evenements-narratifs": creerFluxPseudoAleatoire(
        graine,
        "evenements-narratifs",
      ),
    },
  };
}

function conditionEstRemplie(
  etat: EtatCampagne,
  condition: ConditionDEvenement,
): boolean {
  if (condition.type === "temps-au-moins") {
    return etat.tempsDuConvoi.secondes >= condition.secondes;
  }

  return etat.narration.faitsDeCampagne.some(
    (fait) => fait.id === condition.fait,
  );
}

function evenementEstEligible(
  etat: EtatCampagne,
  evenement: EvenementDuCatalogue,
  fenetre: string,
): boolean {
  return (
    evenement.fenetre === fenetre &&
    etat.tempsDuConvoi.secondes >= evenement.periodeEligibilite.debut &&
    etat.tempsDuConvoi.secondes <= evenement.periodeEligibilite.fin &&
    !etat.narration.evenementsJoues.includes(evenement.id) &&
    evenement.conditions.requises.every((condition) =>
      conditionEstRemplie(etat, condition),
    ) &&
    evenement.conditions.interdites.every(
      (condition) => !conditionEstRemplie(etat, condition),
    )
  );
}

function declencherEvenement(
  etat: EtatCampagne,
  fenetre: string,
): TransitionDeCampagne | undefined {
  if (etat.narration.evenementActif !== null) {
    return undefined;
  }

  const evenement = catalogueDEvenements.evenements
    .filter((candidat) => evenementEstEligible(etat, candidat, fenetre))
    .sort((gauche, droite) => droite.priorite - gauche.priorite)[0];

  if (evenement === undefined) {
    return undefined;
  }

  return {
    etat: {
      ...etat,
      narration: {
        ...etat.narration,
        evenementActif: evenement.id,
      },
    },
    evenements: [
      {
        type: "evenement-narratif.declenche",
        evenementId: evenement.id,
        fenetre,
      },
    ],
  };
}

function appliquerEffets(
  etat: EtatCampagne,
  effets: readonly EffetDEvenement[],
): EtatCampagne {
  const variationHabitants = effets.reduce(
    (total, effet) =>
      effet.type === "habitants.modifier" ? total + effet.valeur : total,
    0,
  );

  if (variationHabitants === 0) {
    return etat;
  }

  return {
    ...etat,
    citeCaravane: {
      ...etat.citeCaravane,
      habitants: etat.citeCaravane.habitants + variationHabitants,
    },
  };
}

function decrireEffetsDeFait(effets: readonly EffetDEvenement[]): EffetsDeFait {
  return {
    materiels: [],
    humains: effets.map((effet) => ({
      type: "habitants.modifies" as const,
      variation: effet.valeur,
    })),
  };
}

function enregistrerFaitsDeCampagne(
  etat: EtatCampagne,
  faits: readonly FaitDeCampagne[],
): EtatCampagne {
  if (faits.length === 0) {
    return etat;
  }

  return {
    ...etat,
    narration: {
      ...etat.narration,
      faitsDeCampagne: [...etat.narration.faitsDeCampagne, ...faits],
    },
  };
}

function traiterPilotageEtChantier(
  etat: EtatCampagne,
  secondeInitiale: number,
  secondeFinale: number,
): TransitionDeCampagne {
  let nouvelEtat = etat;
  let curseur = secondeInitiale;
  const evenements: EvenementDeDomaine[] = [];

  while (curseur < secondeFinale) {
    const secondesAvantFin = secondesAvantFinDuChantier(
      nouvelEtat.infrastructure,
    );
    const prochaineLimite =
      secondesAvantFin === undefined
        ? secondeFinale
        : Math.min(secondeFinale, curseur + secondesAvantFin);
    const pilotage = traiterEcheancesDePilotage(
      nouvelEtat.pilotage,
      curseur,
      prochaineLimite,
    );
    nouvelEtat = enregistrerFaitsDeCampagne(
      { ...nouvelEtat, pilotage: pilotage.etat },
      pilotage.faitsProduits,
    );
    evenements.push(...pilotage.evenements);

    const infrastructure = faireProgresserChantier(
      nouvelEtat.infrastructure,
      nouvelEtat.pilotage,
      prochaineLimite - curseur,
      prochaineLimite,
    );
    nouvelEtat = {
      ...nouvelEtat,
      pilotage: infrastructure.pilotage,
      infrastructure: infrastructure.infrastructure,
    };
    evenements.push(...infrastructure.evenements);
    curseur = prochaineLimite;
  }

  return { etat: nouvelEtat, evenements };
}

function choisirDansEvenement(
  etat: EtatCampagne,
  commande: Extract<
    CommandeCampagne,
    { readonly type: "evenement-narratif.choisir" }
  >,
): TransitionDeCampagne {
  if (etat.narration.evenementActif !== commande.evenementId) {
    throw new Error(
      `L’Événement narratif « ${commande.evenementId} » n’est pas actif.`,
    );
  }

  const evenement = trouverEvenement(commande.evenementId);
  const choix = evenement?.choix.find(
    (candidat) => candidat.id === commande.choixId,
  );
  if (evenement === undefined || choix === undefined) {
    throw new Error(
      `L’intention « ${commande.choixId} » est inconnue pour « ${commande.evenementId} ».`,
    );
  }

  const etatApresEffets = appliquerEffets(etat, choix.effets);
  const effetsDeFait = decrireEffetsDeFait(choix.effets);
  const faitsProduits = choix.faitsProduits.map((fait) => ({
    id: fait.id,
    cause: evenement.id,
    acteurs: evenement.acteurs,
    cible: fait.cible,
    moment: etat.tempsDuConvoi.secondes,
    effets: effetsDeFait,
  }));

  return {
    etat: {
      ...etatApresEffets,
      narration: {
        evenementActif: null,
        evenementsJoues: [...etat.narration.evenementsJoues, evenement.id],
        faitsDeCampagne: [...etat.narration.faitsDeCampagne, ...faitsProduits],
      },
    },
    evenements: [
      {
        type: "evenement-narratif.choix-resolu",
        evenementId: evenement.id,
        choixId: choix.id,
        effets: choix.effets,
        faitsProduits: faitsProduits.map((fait) => fait.id),
      },
    ],
  };
}

export function appliquerCommande(
  etat: EtatCampagne,
  commande: CommandeCampagne,
): TransitionDeCampagne {
  if (commande.type === "temps-du-convoi.ecouler") {
    if (
      !Number.isInteger(commande.secondesReelles) ||
      commande.secondesReelles < 0
    ) {
      throw new Error(
        "Le Temps du convoi exige une durée entière positive ou nulle.",
      );
    }

    const nouvellesSecondes =
      etat.tempsDuConvoi.secondes +
      commande.secondesReelles * etat.tempsDuConvoi.vitesse;
    const evenements: EvenementDeDomaine[] = [];

    if (nouvellesSecondes !== etat.tempsDuConvoi.secondes) {
      evenements.push({
        type: "temps-du-convoi.ecoule",
        secondeInitiale: etat.tempsDuConvoi.secondes,
        secondeFinale: nouvellesSecondes,
      });
    }

    let nouvelEtat: EtatCampagne = {
      ...etat,
      tempsDuConvoi: {
        ...etat.tempsDuConvoi,
        secondes: nouvellesSecondes,
      },
    };

    const premiereMinuteAtteinte =
      etat.tempsDuConvoi.secondes < 60 && nouvellesSecondes >= 60;
    const premiereLimiteDEcheance = premiereMinuteAtteinte
      ? 60
      : nouvellesSecondes;
    const premieresEcheances = traiterPilotageEtChantier(
      nouvelEtat,
      etat.tempsDuConvoi.secondes,
      premiereLimiteDEcheance,
    );
    nouvelEtat = premieresEcheances.etat;
    evenements.push(...premieresEcheances.evenements);

    if (premiereMinuteAtteinte) {
      evenements.push({
        type: "temps-du-convoi.premiere-minute-atteinte",
        secondeAtteinte: 60,
      });
      const declenchement = declencherEvenement(
        nouvelEtat,
        "premiere-minute-atteinte",
      );
      if (declenchement !== undefined) {
        nouvelEtat = declenchement.etat;
        evenements.push(...declenchement.evenements);
      }
    }

    if (premiereLimiteDEcheance < nouvellesSecondes) {
      const echeancesRestantes = traiterPilotageEtChantier(
        nouvelEtat,
        premiereLimiteDEcheance,
        nouvellesSecondes,
      );
      nouvelEtat = echeancesRestantes.etat;
      evenements.push(...echeancesRestantes.evenements);
    }

    return { etat: nouvelEtat, evenements };
  }

  if (commande.type === "evenement-narratif.choisir") {
    return choisirDansEvenement(etat, commande);
  }

  if (commande.type === "halte.deployer") {
    if (etat.tempsDuConvoi.vitesse !== 0) {
      throw new Error(
        "Il faut suspendre le Temps du convoi avant de déployer la Halte.",
      );
    }
    if (etat.infrastructure.deploiement === "halte") {
      return { etat, evenements: [] };
    }
    return {
      etat: {
        ...etat,
        infrastructure: { ...etat.infrastructure, deploiement: "halte" },
      },
      evenements: [
        {
          type: "halte.deployee",
          moment: etat.tempsDuConvoi.secondes,
        },
      ],
    };
  }

  if (commande.type === "halte.replier") {
    if (etat.tempsDuConvoi.vitesse !== 0) {
      throw new Error(
        "Il faut suspendre le Temps du convoi avant de replier la Halte.",
      );
    }
    if (etat.infrastructure.chantierActif !== null) {
      throw new Error(
        "Le Déploiement de halte reste requis par le Chantier actif.",
      );
    }
    if (etat.infrastructure.deploiement === "voyage") {
      return { etat, evenements: [] };
    }
    return {
      etat: {
        ...etat,
        infrastructure: { ...etat.infrastructure, deploiement: "voyage" },
      },
      evenements: [
        {
          type: "halte.repliee",
          moment: etat.tempsDuConvoi.secondes,
        },
      ],
    };
  }

  if (commande.type === "chantier.engager") {
    const engagement = engagerChantier(
      etat.infrastructure,
      etat.pilotage,
      commande.ordre,
      commande.priorite,
      etat.tempsDuConvoi.secondes,
    );
    return {
      etat: { ...etat, infrastructure: engagement.etat },
      evenements: [engagement.evenement],
    };
  }

  if (commande.type === "doctrine.regler") {
    const transition = engagerTransitionDeDoctrine(
      etat.pilotage,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    return {
      etat: { ...etat, pilotage: transition.etat },
      evenements: transition.evenements,
    };
  }

  if (commande.type === "incident.ordonner") {
    const transition = ordonnerResolutionDIncident(
      etat.pilotage,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    return {
      etat: enregistrerFaitsDeCampagne(
        { ...etat, pilotage: transition.etat },
        transition.faitsProduits,
      ),
      evenements: transition.evenements,
    };
  }

  if (commande.type === "compagnon.affecter") {
    const transition = affecterCompagnon(
      etat.narration.faitsDeCampagne,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    return {
      etat: enregistrerFaitsDeCampagne(etat, [transition.faitProduit]),
      evenements: [transition.evenement],
    };
  }

  if (commande.type === "conseil.decider") {
    const transition = deciderAuConseil(
      etat.narration.faitsDeCampagne,
      commande,
      etat.tempsDuConvoi.secondes,
    );
    return {
      etat: enregistrerFaitsDeCampagne(etat, [transition.faitProduit]),
      evenements: [transition.evenement],
    };
  }

  return {
    etat: {
      ...etat,
      tempsDuConvoi: {
        ...etat.tempsDuConvoi,
        vitesse: commande.vitesse,
      },
    },
    evenements: [
      {
        type: "temps-du-convoi.vitesse-modifiee",
        vitessePrecedente: etat.tempsDuConvoi.vitesse,
        vitesse: commande.vitesse,
      },
    ],
  };
}

function serialiserCanonicalement(valeur: unknown): string {
  if (Array.isArray(valeur)) {
    return `[${valeur.map(serialiserCanonicalement).join(",")}]`;
  }

  if (valeur !== null && typeof valeur === "object") {
    const objet = valeur as Record<string, unknown>;
    const membres = Object.keys(objet)
      .sort()
      .map(
        (cle) =>
          `${JSON.stringify(cle)}:${serialiserCanonicalement(objet[cle])}`,
      );

    return `{${membres.join(",")}}`;
  }

  return JSON.stringify(valeur);
}

export function empreinteEtat(etat: EtatCampagne): string {
  return formaterEmpreinteFnv1a32V1(serialiserCanonicalement(etat));
}
