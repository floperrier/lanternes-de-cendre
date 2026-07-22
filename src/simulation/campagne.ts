import { catalogueDEvenements, trouverEvenement } from "../content/catalogue";
import type {
  ConditionDEvenement,
  EffetDEvenement,
  EvenementDuCatalogue,
} from "../content/types";

export type GraineDeCampagne = string;
export type IdentifiantPlateformeMobile =
  | "phare"
  | "foyers"
  | "atelier"
  | "serres"
  | "reservoirs"
  | "vigie"
  | "forge";
export type VitesseDuConvoi = 0 | 1 | 2 | 4;

export interface FaitDeCampagne {
  readonly id: string;
  readonly cause: string;
  readonly acteurs: readonly string[];
  readonly cible: string;
  readonly moment: number;
}

export interface EtatCampagne {
  readonly version: 1;
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
    };

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
    };

export interface TransitionDeCampagne {
  readonly etat: EtatCampagne;
  readonly evenements: readonly EvenementDeDomaine[];
}

export function creerCampagneInitiale(
  graine: GraineDeCampagne,
): EtatCampagne {
  return {
    version: 1,
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
        plateformes: [
          "phare",
          "foyers",
          "atelier",
          "serres",
          "reservoirs",
          "vigie",
          "forge",
        ],
      },
    },
    narration: {
      evenementActif: null,
      evenementsJoues: [],
      faitsDeCampagne: [],
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
  const faitsProduits = choix.faitsProduits.map((fait) => ({
    id: fait.id,
    cause: evenement.id,
    acteurs: evenement.acteurs,
    cible: fait.cible,
    moment: etat.tempsDuConvoi.secondes,
  }));

  return {
    etat: {
      ...etatApresEffets,
      narration: {
        evenementActif: null,
        evenementsJoues: [...etat.narration.evenementsJoues, evenement.id],
        faitsDeCampagne: [
          ...etat.narration.faitsDeCampagne,
          ...faitsProduits,
        ],
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

    if (etat.tempsDuConvoi.secondes < 60 && nouvellesSecondes >= 60) {
      evenements.push({
        type: "temps-du-convoi.premiere-minute-atteinte",
        secondeAtteinte: 60,
      });
    }

    let nouvelEtat: EtatCampagne = {
        ...etat,
        tempsDuConvoi: {
          ...etat.tempsDuConvoi,
          secondes: nouvellesSecondes,
        },
    };

    if (etat.tempsDuConvoi.secondes < 60 && nouvellesSecondes >= 60) {
      const declenchement = declencherEvenement(
        nouvelEtat,
        "premiere-minute-atteinte",
      );
      if (declenchement !== undefined) {
        nouvelEtat = declenchement.etat;
        evenements.push(...declenchement.evenements);
      }
    }

    return { etat: nouvelEtat, evenements };
  }

  if (commande.type === "evenement-narratif.choisir") {
    return choisirDansEvenement(etat, commande);
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
  const octets = new TextEncoder().encode(serialiserCanonicalement(etat));
  let empreinte = 0x811c9dc5;

  for (const octet of octets) {
    empreinte ^= octet;
    empreinte = Math.imul(empreinte, 0x01000193);
  }

  return (empreinte >>> 0).toString(16).padStart(8, "0");
}
