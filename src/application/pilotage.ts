import type { EtatCampagne } from "../simulation/campagne";
import { catalogueDEvenements } from "../content/catalogue";
import type { Langue } from "../content/types";
import type {
  EffetHumainDeFait,
  EffetMaterielDeFait,
  FaitDeCampagne,
} from "../simulation/faits";
import {
  IDENTIFIANTS_DE_CAPACITE,
  IDENTIFIANTS_DE_POLITIQUE,
  IDENTIFIANTS_DE_STOCK,
  INCIDENT_INITIAL,
  POSITIONS_DE_DOCTRINE,
  SECONDES_PAR_HEURE,
  type CapaciteDuConvoi,
  type IdentifiantDeCapacite,
  type IdentifiantDePolitique,
  type IdentifiantDeStock,
  type OrdreDIncident,
  type PositionDeDoctrine,
  type StockDuConvoi,
} from "../simulation/pilotage";

interface ValeurEconomiqueProjetee<Identifiant extends string> {
  readonly id: Identifiant;
  readonly nom: string;
  readonly valeur: string;
}

interface DetailDeStockProjete {
  readonly id: IdentifiantDeStock;
  readonly quantite: string;
  readonly flux: string;
  readonly prevision: string;
}

export interface ProjectionDePolitique {
  readonly id: IdentifiantDePolitique;
  readonly nom: string;
  readonly position: string;
  readonly options: readonly {
    readonly id: PositionDeDoctrine;
    readonly nom: string;
  }[];
  readonly transition: {
    readonly position: string;
    readonly delai: string;
  } | null;
}

export interface ProjectionDIncident {
  readonly id: "purification.pompe-instable";
  readonly titre: string;
  readonly cause: string;
  readonly priorite: string;
  readonly echeance: string;
  readonly incertitude: {
    readonly source: string;
    readonly age: string;
    readonly observation: string;
  };
  readonly ordres: readonly {
    readonly id: OrdreDIncident;
    readonly nom: string;
    readonly coutConnu: string;
  }[];
}

export interface ProjectionDuJournalCausal {
  readonly id: string;
  readonly titre: string;
  readonly cause: string;
  readonly acteurs: readonly string[];
  readonly cible: string;
  readonly effetsMateriels: readonly string[];
  readonly effetsHumains: readonly string[];
  readonly moment: string;
}

export interface ProjectionDuPilotage {
  readonly autonomies: readonly ValeurEconomiqueProjetee<IdentifiantDeStock>[];
  readonly marges: readonly ValeurEconomiqueProjetee<IdentifiantDeCapacite>[];
  readonly details: {
    readonly prochainJalon: string;
    readonly entretien: string;
    readonly incertitude: {
      readonly source: string;
      readonly age: string;
      readonly explication: string;
    };
    readonly stocks: readonly DetailDeStockProjete[];
  };
  readonly doctrine: readonly ProjectionDePolitique[];
  readonly incident: ProjectionDIncident | null;
  readonly journalCausal: readonly ProjectionDuJournalCausal[];
}

const NOMS_DES_STOCKS: Readonly<Record<IdentifiantDeStock, string>> = {
  vivres: "Vivres",
  eau: "Eau",
  combustible: "Combustible",
  materiaux: "Matériaux",
  remedes: "Remèdes",
};

const NOMS_DES_CAPACITES: Readonly<
  Record<IdentifiantDeCapacite, string>
> = {
  chaleur: "Chaleur",
  "main-d-oeuvre": "Main-d’œuvre",
  charge: "Charge",
};

const NOMS_DES_POLITIQUES: Readonly<
  Record<IdentifiantDePolitique, string>
> = {
  rationnement: "Rationnement",
  allure: "Allure",
  entretien: "Entretien",
  "delestage-thermique": "Délestage thermique",
};

const LIBELLES_DES_POSITIONS: Readonly<
  Record<PositionDeDoctrine, string>
> = {
  genereux: "Généreux",
  mesure: "Mesuré",
  strict: "Strict",
  prudente: "Prudente",
  soutenue: "Soutenue",
  forcee: "Forcée",
  preventif: "Préventif",
  equilibre: "Équilibré",
  urgence: "Urgence",
  foyers: "Foyers prioritaires",
  machines: "Machines prioritaires",
};

function libellerPositionDeDoctrine(
  politique: IdentifiantDePolitique,
  position: PositionDeDoctrine,
): string {
  return politique === "delestage-thermique" && position === "equilibre"
    ? "Équilibre"
    : LIBELLES_DES_POSITIONS[position];
}

function libelleUniteDeStock(
  stock: StockDuConvoi,
  quantite: number,
): string {
  if (stock.unite === "litres") {
    return "L";
  }
  if (stock.unite === "pieces") {
    return quantite === 1 ? "pièce" : "pièces";
  }
  if (stock.unite === "doses") {
    return quantite === 1 ? "dose" : "doses";
  }
  return quantite === 1 ? "ration" : "rations";
}

function formaterAutonomie(stock: StockDuConvoi): string {
  if (stock.fluxParHeure >= 0) {
    return "stable";
  }

  return `${Math.floor(
    quantiteEffective(stock) / Math.abs(stock.fluxParHeure),
  )} h`;
}

function quantiteEffective(stock: StockDuConvoi): number {
  return stock.quantite + stock.reliquatDeFlux / SECONDES_PAR_HEURE;
}

function formaterMarge(capacite: CapaciteDuConvoi): string {
  const marge = capacite.production - capacite.demande;
  const signe = marge >= 0 ? "+" : "−";
  const unite =
    capacite.unite === "kilowatts"
      ? "kW"
      : capacite.unite === "tonnes"
        ? "t"
        : marge === 1
          ? "équipe"
          : "équipes";
  return `${signe}${Math.abs(marge)} ${unite}`;
}

function formaterAge(
  releveeA: number,
  secondeCourante: number,
  genre: "masculin" | "feminin" = "masculin",
): string {
  const ageEnMinutes = Math.floor((secondeCourante - releveeA) / 60);
  const adjectif = genre === "feminin" ? "relevée" : "relevé";
  return ageEnMinutes === 0
    ? `${adjectif} maintenant`
    : `${adjectif} il y a ${ageEnMinutes} min`;
}

function formaterDelai(secondesRestantes: number): string {
  if (secondesRestantes < 60) {
    return `${secondesRestantes} s`;
  }
  return `dans ${Math.ceil(secondesRestantes / 60)} min`;
}

function formaterMoment(secondes: number): string {
  const minutes = Math.floor(secondes / 60);
  const secondesRestantes = secondes % 60;
  return `${minutes.toString().padStart(2, "0")}:${secondesRestantes
    .toString()
    .padStart(2, "0")}`;
}

const JOURNAL_GENERIQUE: Readonly<
  Record<
    Langue,
    {
      readonly titres: Readonly<Record<string, string>>;
      readonly causes: Readonly<Record<string, string>>;
      readonly acteurs: Readonly<Record<string, string>>;
      readonly cibles: Readonly<Record<string, string>>;
    }
  >
> = {
  fr: {
    titres: {
      "incident.purification.pompe-instable.securisee":
        "Pompe de purification — joint remplacé",
      "incident.purification.pompe-instable.circuit-isole":
        "Pompe de purification — circuit isolé",
      "incident.purification.pompe-instable.debit-maintenu":
        "Pompe de purification — débit maintenu",
      "crise.purification.eau-contaminee":
        "Réserve d’Eau — contamination isolée",
      "crise.purification.isoler-et-rationner":
        "Crise de purification — circuit isolé et Eau rationnée",
      "crise.purification.mobiliser-les-remedes":
        "Crise de purification — Remèdes mobilisés",
      "crise.purification.evacuer-les-foyers-exposes":
        "Crise de purification — Foyers évacués",
      "prologue.cohorte-accueillie": "Cohorte accueillie",
      "prologue.cohorte-orientee": "Cohorte orientée vers Veille-Basse",
    },
    causes: {
      [INCIDENT_INITIAL.id]: INCIDENT_INITIAL.cause,
      "incident.purification.pompe-instable.debit-maintenu":
        "Pompe maintenue en service malgré le joint dégradé",
      "penurie-eau.pompe-purification": "Crise de pénurie d’Eau",
      "prologue.signaux-sous-la-cendre": "Des signaux sous la cendre",
    },
    acteurs: {
      "porte-lanterne": "Porte-Lanterne",
      "equipes-entretien": "Équipes d’entretien",
      "cohorte-de-refugies": "Cohorte de réfugiés",
      "equipes-purification": "Équipes de purification",
      "foyers-du-convoi": "Foyers du convoi",
      "foyers-exposes": "Foyers exposés",
      liora: "Liora",
      "equipe-vannes-grises": "Équipe des Vannes Grises",
    },
    cibles: {
      "pompe-purification": "Pompe de purification",
      "cohorte-de-refugies": "Cohorte de réfugiés",
      "reserve-deau-purifiee": "Réserve d’Eau purifiée",
      "foyers-du-convoi": "Foyers du convoi",
      "station-vannes-grises": "Station des Vannes Grises",
      "canal-sec": "Canal sec",
      "passerelle-rompue": "Passerelle rompue",
      "sas-contamine": "Sas contaminé",
      "salle-des-pompes": "Salle des pompes",
      "atelier-operations": "Atelier–Opérations",
    },
  },
  en: {
    titres: {
      "incident.purification.pompe-instable.securisee":
        "Purification pump — seal replaced",
      "incident.purification.pompe-instable.circuit-isole":
        "Purification pump — circuit isolated",
      "incident.purification.pompe-instable.debit-maintenu":
        "Purification pump — flow maintained",
      "crise.purification.eau-contaminee":
        "Water reserve — contamination isolated",
      "crise.purification.isoler-et-rationner":
        "Purification crisis — circuit isolated and Water rationed",
      "crise.purification.mobiliser-les-remedes":
        "Purification crisis — Remedies mobilized",
      "crise.purification.evacuer-les-foyers-exposes":
        "Purification crisis — Hearths evacuated",
      "prologue.cohorte-accueillie": "Cohort welcomed",
      "prologue.cohorte-orientee": "Cohort directed to Veille-Basse",
    },
    causes: {
      [INCIDENT_INITIAL.id]: "Purification pump instability",
      "incident.purification.pompe-instable.debit-maintenu":
        "Pump kept running despite the degraded seal",
      "penurie-eau.pompe-purification": "Water shortage crisis",
      "prologue.signaux-sous-la-cendre": "Signals beneath the ash",
    },
    acteurs: {
      "porte-lanterne": "Lantern-Bearer",
      "equipes-entretien": "Maintenance crews",
      "cohorte-de-refugies": "Refugee cohort",
      "equipes-purification": "Purification crews",
      "foyers-du-convoi": "Convoy Hearths",
      "foyers-exposes": "Exposed Hearths",
      liora: "Liora",
      "equipe-vannes-grises": "Grey Sluices team",
    },
    cibles: {
      "pompe-purification": "Purification pump",
      "cohorte-de-refugies": "Refugee cohort",
      "reserve-deau-purifiee": "Purified Water reserve",
      "foyers-du-convoi": "Convoy Hearths",
      "station-vannes-grises": "Grey Sluices Station",
      "canal-sec": "Dry channel",
      "passerelle-rompue": "Broken footbridge",
      "sas-contamine": "Contaminated airlock",
      "salle-des-pompes": "Pump room",
      "atelier-operations": "Workshop–Operations",
    },
  },
};

const TITRES_DES_RAPPORTS_D_EXPEDITION: Readonly<
  Record<Langue, Readonly<Record<string, string>>>
> = {
  fr: {
    "mandat.vannes-grises.confirme": "Expédition — mandat confirmé",
    "jalon.canal-sec": "Expédition — canal sec atteint",
    "ecart.passerelle-rompue": "Expédition — détour autonome consigné",
    "ecart.sas-contamine": "Expédition — sas traité dans le mandat",
    "ecart.salle-des-pompes-alimentee":
      "Expédition — rupture du mandat consignée",
    "ordre.couper-contourner": "Expédition — ordre de contournement transmis",
    "ordre.forcer-galerie": "Expédition — ordre de forcer transmis",
    "ordre.ordonner-repli": "Expédition — ordre de repli transmis",
  },
  en: {
    "mandat.vannes-grises.confirme": "Expedition — mandate confirmed",
    "jalon.canal-sec": "Expedition — dry channel reached",
    "ecart.passerelle-rompue": "Expedition — autonomous detour recorded",
    "ecart.sas-contamine": "Expedition — airlock handled within mandate",
    "ecart.salle-des-pompes-alimentee":
      "Expedition — mandate breach recorded",
    "ordre.couper-contourner": "Expedition — bypass order sent",
    "ordre.forcer-galerie": "Expedition — force-through order sent",
    "ordre.ordonner-repli": "Expedition — withdrawal order sent",
  },
};

const TITRES_DE_RETOUR_D_EXPEDITION: Readonly<Record<Langue, string>> = {
  fr: "Expédition — équipe revenue à Atelier–Opérations",
  en: "Expedition — team returned to Workshop–Operations",
};

function textesDeJournalDuConseil(fait: FaitDeCampagne, langue: Langue) {
  return catalogueDEvenements.conseils
    .map((conseil) => conseil.textes[langue].journal[fait.id])
    .find((textes) => textes !== undefined);
}

function libellesDuJournalDeContenu(langue: Langue) {
  return catalogueDEvenements.libellesTransversaux[langue].journal;
}

function titrerFait(fait: FaitDeCampagne, langue: Langue): string {
  const titreDeRetour = fait.id.includes(".retour.")
    ? TITRES_DE_RETOUR_D_EXPEDITION[langue]
    : undefined;
  const titre =
    textesDeJournalDuConseil(fait, langue)?.titre.modele ??
    titreDeRetour ??
    TITRES_DES_RAPPORTS_D_EXPEDITION[langue][fait.cause] ??
    libellesDuJournalDeContenu(langue).titres[fait.id] ??
    JOURNAL_GENERIQUE[langue].titres[fait.id];
  if (titre === undefined) {
    throw new Error(
      `Le Fait de campagne « ${fait.id} » ne possède pas de titre joueur.`,
    );
  }
  return titre;
}

function expliquerCause(fait: FaitDeCampagne, langue: Langue): string {
  return (
    textesDeJournalDuConseil(fait, langue)?.cause.modele ??
    libellesDuJournalDeContenu(langue).causes[fait.cause] ??
    JOURNAL_GENERIQUE[langue].causes[fait.cause] ??
    fait.cause
  );
}

function libellerActeurs(
  fait: FaitDeCampagne,
  langue: Langue,
): readonly string[] {
  const textes = textesDeJournalDuConseil(fait, langue);
  if (textes !== undefined) {
    return textes.acteurs.map((acteur) => acteur.modele);
  }
  return fait.acteurs.map(
    (acteur) =>
      libellesDuJournalDeContenu(langue).acteurs[acteur] ??
      JOURNAL_GENERIQUE[langue].acteurs[acteur] ??
      acteur,
  );
}

function libellerCible(fait: FaitDeCampagne, langue: Langue): string {
  return (
    textesDeJournalDuConseil(fait, langue)?.cible.modele ??
    libellesDuJournalDeContenu(langue).cibles[fait.cible] ??
    JOURNAL_GENERIQUE[langue].cibles[fait.cible] ??
    fait.cible
  );
}

function decrireEffetMateriel(
  effet: EffetMaterielDeFait,
  langue: Langue,
): string {
  if (effet.type === "stock.modifie") {
    const quantite = Math.abs(effet.variation);
    if (langue === "en") {
      const noms = {
        vivres: "food unit",
        eau: "water unit",
        combustible: "fuel unit",
        materiaux: "material",
        remedes: "medicine",
      } as const;
      const action = effet.variation < 0 ? "consumed" : "recovered";
      return `${quantite} ${noms[effet.stock]}${quantite > 1 ? "s" : ""} ${action}`;
    }
    const action = effet.variation < 0 ? "consommé" : "récupéré";
    return `${quantite} ${NOMS_DES_STOCKS[effet.stock]} ${action}${quantite > 1 ? "s" : ""}`;
  }

  const descriptions = {
    fr: {
      securisee: "Pompe de purification sécurisée",
      stabilisee: "Circuit de purification stabilisé",
      degradee: "Filtres de purification dégradés",
    },
    en: {
      securisee: "Purification pump secured",
      stabilisee: "Purification circuit stabilized",
      degradee: "Purification filters degraded",
    },
  } as const;
  return descriptions[langue][effet.etat];
}

function decrireEffetHumain(
  effet: EffetHumainDeFait,
  langue: Langue,
): string {
  if (effet.type === "habitants.modifies") {
    const quantite = Math.abs(effet.variation);
    if (langue === "en") {
      return `${quantite} inhabitant${quantite > 1 ? "s" : ""} ${
        effet.variation >= 0 ? "welcomed" : "departed"
      }`;
    }
    return `${quantite} Habitant${quantite > 1 ? "s" : ""} ${
      effet.variation >= 0 ? "accueilli" : "parti"
    }${quantite > 1 ? "s" : ""}`;
  }
  if (effet.type === "habitants.exposes") {
    if (langue === "en") {
      return effet.nombre === 0
        ? "No inhabitant exposed"
        : `${effet.nombre} inhabitants exposed`;
    }
    return effet.nombre === 0
      ? "Aucun Habitant exposé"
      : `${effet.nombre} Habitants exposés`;
  }
  return langue === "en"
    ? `${effet.nombre} inhabitants placed under medical supervision`
    : `${effet.nombre} Habitants placés sous surveillance médicale`;
}

function projeterFaitDansLeJournal(
  fait: FaitDeCampagne,
  langue: Langue,
): ProjectionDuJournalCausal {
  return {
    id: fait.id,
    titre: titrerFait(fait, langue),
    cause: expliquerCause(fait, langue),
    acteurs: libellerActeurs(fait, langue),
    cible: libellerCible(fait, langue),
    effetsMateriels: fait.effets.materiels.map((effet) =>
      decrireEffetMateriel(effet, langue),
    ),
    effetsHumains: fait.effets.humains.map((effet) =>
      decrireEffetHumain(effet, langue),
    ),
    moment: formaterMoment(fait.moment),
  };
}

function projeterDetailDeStock(
  id: IdentifiantDeStock,
  stock: StockDuConvoi,
  heuresAvantJalon: number,
  heuresCouvertesParIncertitude: number,
  variationFluxPourcent: number,
): DetailDeStockProjete {
  const consommationProjetee = stock.fluxParHeure * heuresAvantJalon;
  const valeurCentrale = quantiteEffective(stock) + consommationProjetee;
  const incertitude = Math.ceil(
    Math.abs(stock.fluxParHeure * heuresCouvertesParIncertitude) *
      (variationFluxPourcent / 100),
  );
  const minimum = Math.max(0, Math.floor(valeurCentrale - incertitude));
  const maximum = Math.max(0, Math.ceil(valeurCentrale + incertitude));
  const uniteActuelle = libelleUniteDeStock(stock, stock.quantite);
  const uniteProjetee = libelleUniteDeStock(stock, maximum);
  const signeDuFlux = stock.fluxParHeure < 0 ? "−" : "+";

  return {
    id,
    quantite: `${stock.quantite} ${uniteActuelle}`,
    flux: `${signeDuFlux}${Math.abs(stock.fluxParHeure)} ${libelleUniteDeStock(
      stock,
      Math.abs(stock.fluxParHeure),
    )}/h`,
    prevision: `${minimum}–${maximum} ${uniteProjetee}`,
  };
}

export function projeterPilotage(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDuPilotage {
  const economie = etat.pilotage.economie;
  const secondesAvantJalon = Math.max(
    0,
    economie.prochainJalon.atteintA - etat.tempsDuConvoi.secondes,
  );
  const heuresAvantJalon = secondesAvantJalon / SECONDES_PAR_HEURE;
  const incertitude = economie.prochainJalon.incertitude;
  const heuresCouvertesParIncertitude =
    secondesAvantJalon === 0
      ? 0
      : (economie.prochainJalon.atteintA - incertitude.releveeA) /
        SECONDES_PAR_HEURE;
  const incident = etat.pilotage.incidentActif;

  return {
    autonomies: IDENTIFIANTS_DE_STOCK.map((id) => ({
      id,
      nom: NOMS_DES_STOCKS[id],
      valeur: formaterAutonomie(economie.stocks[id]),
    })),
    marges: IDENTIFIANTS_DE_CAPACITE.map((id) => ({
      id,
      nom: NOMS_DES_CAPACITES[id],
      valeur: formaterMarge(economie.capacites[id]),
    })),
    details: {
      prochainJalon: `${economie.prochainJalon.nom} dans ${Math.ceil(
        heuresAvantJalon,
      )} h`,
      entretien: `${economie.entretien.equipesMobilisees} équipes mobilisées · ${economie.entretien.materiauxParHeure} Matériaux par heure`,
      incertitude: {
        source: incertitude.source,
        age: formaterAge(incertitude.releveeA, etat.tempsDuConvoi.secondes),
        explication: incertitude.explication,
      },
      stocks: IDENTIFIANTS_DE_STOCK.map((id) =>
        projeterDetailDeStock(
          id,
          economie.stocks[id],
          heuresAvantJalon,
          heuresCouvertesParIncertitude,
          incertitude.variationFluxPourcent,
        ),
      ),
    },
    doctrine: IDENTIFIANTS_DE_POLITIQUE.map((id) => {
      const politique = etat.pilotage.doctrine[id];
      const transition = politique.transition;
      return {
        id,
        nom: NOMS_DES_POLITIQUES[id],
        position: libellerPositionDeDoctrine(id, politique.position),
        options: (POSITIONS_DE_DOCTRINE[id] as readonly PositionDeDoctrine[]).map(
          (position) => ({
            id: position,
            nom: libellerPositionDeDoctrine(id, position),
          }),
        ),
        transition:
          transition === null
            ? null
            : {
                position: libellerPositionDeDoctrine(
                  id,
                  transition.position,
                ),
                delai: formaterDelai(
                  Math.max(
                    0,
                    transition.appliqueA - etat.tempsDuConvoi.secondes,
                  ),
                ),
              },
      };
    }),
    incident:
      incident === null
        ? null
        : {
            id: incident.id,
            titre: incident.titre,
            cause: incident.cause,
            priorite: "Préserver les Habitants",
            echeance: formaterDelai(
              Math.max(0, incident.echeance - etat.tempsDuConvoi.secondes),
            ),
            incertitude: {
              source: incident.incertitude.source,
              age: formaterAge(
                incident.incertitude.releveeA,
                etat.tempsDuConvoi.secondes,
                "feminin",
              ),
              observation: incident.incertitude.observation,
            },
            ordres: [
              {
                id: "securiser-pompe",
                nom: "Sécuriser la pompe",
                coutConnu: "3 Matériaux",
              },
              {
                id: "maintenir-debit",
                nom: "Maintenir le débit",
                coutConnu: "2 Habitants sous surveillance médicale",
              },
            ],
          },
    journalCausal: etat.narration.faitsDeCampagne.map((fait) =>
      projeterFaitDansLeJournal(fait, langue),
    ),
  };
}
