import type { EtatCampagne } from "../simulation/campagne";
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

const TITRES_FRANCAIS_DES_FAITS = {
  "incident.purification.pompe-instable.securisee":
    "Pompe de purification — joint remplacé",
  "incident.purification.pompe-instable.circuit-isole":
    "Pompe de purification — circuit isolé",
  "incident.purification.pompe-instable.debit-maintenu":
    "Pompe de purification — débit maintenu",
  "prologue.cohorte-accueillie": "Cohorte accueillie",
  "prologue.cohorte-orientee": "Cohorte orientée vers Veille-Basse",
} as const;

type IdentifiantDeFaitAvecTitre = keyof typeof TITRES_FRANCAIS_DES_FAITS;

const TITRES_ANGLAIS_DES_FAITS = {
  "incident.purification.pompe-instable.securisee":
    "Purification pump — seal replaced",
  "incident.purification.pompe-instable.circuit-isole":
    "Purification pump — circuit isolated",
  "incident.purification.pompe-instable.debit-maintenu":
    "Purification pump — flow maintained",
  "prologue.cohorte-accueillie": "Cohort welcomed",
  "prologue.cohorte-orientee": "Cohort directed to Veille-Basse",
} as const satisfies Readonly<Record<IdentifiantDeFaitAvecTitre, string>>;

const TITRES_DES_FAITS: Readonly<
  Record<
    Langue,
    Readonly<Record<IdentifiantDeFaitAvecTitre, string>>
  >
> = {
  fr: TITRES_FRANCAIS_DES_FAITS,
  en: TITRES_ANGLAIS_DES_FAITS,
};

function titrerFait(fait: FaitDeCampagne, langue: Langue): string {
  const titre = (
    TITRES_DES_FAITS[langue] as Readonly<Partial<Record<string, string>>>
  )[fait.id];
  if (titre === undefined) {
    throw new Error(
      `Le Fait de campagne « ${fait.id} » ne possède pas de titre joueur.`,
    );
  }
  return titre;
}

function expliquerCause(fait: FaitDeCampagne): string {
  const causes: Readonly<Record<string, string>> = {
    [INCIDENT_INITIAL.id]: INCIDENT_INITIAL.cause,
    "prologue.signaux-sous-la-cendre": "Des signaux sous la cendre",
  };
  return causes[fait.cause] ?? fait.cause;
}

function libellerActeur(acteur: string): string {
  const acteurs: Readonly<Record<string, string>> = {
    "porte-lanterne": "Porte-Lanterne",
    "equipes-entretien": "Équipes d’entretien",
    "cohorte-de-refugies": "Cohorte de réfugiés",
  };
  return acteurs[acteur] ?? acteur;
}

function libellerCible(cible: string): string {
  const cibles: Readonly<Record<string, string>> = {
    "pompe-purification": "Pompe de purification",
    "cohorte-de-refugies": "Cohorte de réfugiés",
  };
  return cibles[cible] ?? cible;
}

function decrireEffetMateriel(effet: EffetMaterielDeFait): string {
  if (effet.type === "stock.modifie") {
    const quantite = Math.abs(effet.variation);
    const action = effet.variation < 0 ? "consommé" : "récupéré";
    return `${quantite} ${NOMS_DES_STOCKS[effet.stock]} ${action}${
      quantite > 1 ? "s" : ""
    }`;
  }

  const descriptions = {
    securisee: "Pompe de purification sécurisée",
    stabilisee: "Circuit de purification stabilisé",
    degradee: "Filtres de purification dégradés",
  } as const;
  return descriptions[effet.etat];
}

function decrireEffetHumain(effet: EffetHumainDeFait): string {
  if (effet.type === "habitants.modifies") {
    const quantite = Math.abs(effet.variation);
    return `${quantite} Habitant${quantite > 1 ? "s" : ""} ${
      effet.variation >= 0 ? "accueilli" : "parti"
    }${quantite > 1 ? "s" : ""}`;
  }
  if (effet.type === "habitants.exposes") {
    return effet.nombre === 0
      ? "Aucun Habitant exposé"
      : `${effet.nombre} Habitants exposés`;
  }
  return `${effet.nombre} Habitants placés sous surveillance médicale`;
}

function projeterFaitDansLeJournal(
  fait: FaitDeCampagne,
  langue: Langue,
): ProjectionDuJournalCausal {
  return {
    id: fait.id,
    titre: titrerFait(fait, langue),
    cause: expliquerCause(fait),
    acteurs: fait.acteurs.map(libellerActeur),
    cible: libellerCible(fait.cible),
    effetsMateriels: fait.effets.materiels.map(decrireEffetMateriel),
    effetsHumains: fait.effets.humains.map(decrireEffetHumain),
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
