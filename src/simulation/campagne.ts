export type VitesseDuConvoi = 0 | 1 | 2 | 4;

export interface EtatCampagne {
  readonly version: 1;
  readonly graine: string;
  readonly tempsDuConvoi: {
    readonly secondes: number;
    readonly vitesse: VitesseDuConvoi;
  };
  readonly citeCaravane: {
    readonly habitants: number;
    readonly phare: "actif";
    readonly formation: {
      readonly type: "grappe";
      readonly plateformes: readonly string[];
    };
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
    };

export type EvenementDeDomaine =
  | {
      readonly type: "temps-du-convoi.vitesse-modifiee";
      readonly vitessePrecedente: VitesseDuConvoi;
      readonly vitesse: VitesseDuConvoi;
    }
  | {
      readonly type: "temps-du-convoi.ecoule";
      readonly de: number;
      readonly a: number;
    }
  | {
      readonly type: "temps-du-convoi.premiere-minute-atteinte";
      readonly a: 60;
    };

export interface TransitionDeCampagne {
  readonly etat: EtatCampagne;
  readonly evenements: readonly EvenementDeDomaine[];
}

export function creerCampagneInitiale(graine: string): EtatCampagne {
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
        de: etat.tempsDuConvoi.secondes,
        a: nouvellesSecondes,
      });
    }

    if (etat.tempsDuConvoi.secondes < 60 && nouvellesSecondes >= 60) {
      evenements.push({
        type: "temps-du-convoi.premiere-minute-atteinte",
        a: 60,
      });
    }

    return {
      etat: {
        ...etat,
        tempsDuConvoi: {
          ...etat.tempsDuConvoi,
          secondes: nouvellesSecondes,
        },
      },
      evenements,
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
  const octets = new TextEncoder().encode(serialiserCanonicalement(etat));
  let empreinte = 0x811c9dc5;

  for (const octet of octets) {
    empreinte ^= octet;
    empreinte = Math.imul(empreinte, 0x01000193);
  }

  return (empreinte >>> 0).toString(16).padStart(8, "0");
}
