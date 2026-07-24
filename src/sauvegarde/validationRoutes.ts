import {
  TRONCONS_DE_ROUTE,
  creerEtatDesRoutesInitial,
  type EngagementDeRoute,
  type EtatDesRoutes,
  type EtatReelDeRoute,
  type IdentifiantDeLieu,
  type IdentifiantDeTroncon,
  type JalonDeRoute,
  type RenseignementDeRoute,
  type TronconDeRoute,
} from "../simulation/routes";
import { consommationsDesNacellesSontAtteignables } from "../simulation/nacelles";

type ObjetInconnu = Record<string, unknown>;

const TRONCONS_A_COUT_CONTEXTUEL = [
  "chenal-des-vannes",
  "nacelles-de-veille-basse",
] as const;

function estTronconACoutContextuel(
  tronconId: unknown,
): tronconId is (typeof TRONCONS_A_COUT_CONTEXTUEL)[number] {
  return TRONCONS_A_COUT_CONTEXTUEL.some((id) => id === tronconId);
}

function estObjet(valeur: unknown): valeur is ObjetInconnu {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
}

function estConsommationContextuelleValide(
  valeur: unknown,
): valeur is { readonly combustible: number; readonly eau: number } {
  return (
    estObjet(valeur) &&
    memesCles(valeur, ["combustible", "eau"]) &&
    typeof valeur.combustible === "number" &&
    Number.isInteger(valeur.combustible) &&
    valeur.combustible > 0 &&
    typeof valeur.eau === "number" &&
    Number.isInteger(valeur.eau) &&
    valeur.eau > 0
  );
}

function memesCles(objet: ObjetInconnu, cles: readonly string[]): boolean {
  const clesObtenues = Object.keys(objet).sort();
  const clesAttendues = [...cles].sort();
  return (
    clesObtenues.length === clesAttendues.length &&
    clesObtenues.every((cle, index) => cle === clesAttendues[index])
  );
}

function memeRenseignement(
  valeur: unknown,
  attendu: RenseignementDeRoute,
): boolean {
  if (!estObjet(valeur)) {
    return false;
  }
  const cles = [
    "id",
    "tronconId",
    "source",
    "releveA",
    "fiabilite",
    "etatAnnonce",
    "meteo",
    "panache",
    "danger",
    "controlePolitique",
  ] as const;
  return (
    memesCles(valeur, cles) &&
    cles.every((cle) => valeur[cle] === attendu[cle])
  );
}

function trouverTroncon(id: unknown): TronconDeRoute | undefined {
  return TRONCONS_DE_ROUTE.find((troncon) => troncon.id === id);
}

function trouverDestination(
  troncon: TronconDeRoute,
  origine: IdentifiantDeLieu,
): IdentifiantDeLieu | undefined {
  if (
    troncon.originesAutorisees !== undefined &&
    !troncon.originesAutorisees.includes(origine)
  ) {
    return undefined;
  }
  if (troncon.extremites[0] === origine) {
    return troncon.extremites[1];
  }
  if (troncon.extremites[1] === origine) {
    return troncon.extremites[0];
  }
  return undefined;
}

function estEngagementAttendu(
  valeur: unknown,
  index: number,
  position: IdentifiantDeLieu,
  secondeMinimale: number,
  secondeCourante: number,
  engagementsPrecedents: readonly EngagementDeRoute[],
  coutsV7DesNacelles: boolean,
  autoriserTopologieHistoriqueDesNacelles: boolean,
): valeur is EngagementDeRoute {
  const cles = [
    "id",
    "tronconId",
    "origine",
    "destination",
    "engageA",
    "arriveeA",
    "statut",
    ...("consommationsAppliquees" in (estObjet(valeur) ? valeur : {})
      ? ["consommationsAppliquees" as const]
      : []),
  ] as const;
  if (
    !estObjet(valeur) ||
    !memesCles(valeur, cles)
  ) {
    return false;
  }
  const consommations = valeur.consommationsAppliquees;
  const estNacelles = estTronconACoutContextuel(valeur.tronconId);
  if (
    (!estNacelles && consommations !== undefined) ||
    (estNacelles && coutsV7DesNacelles && consommations === undefined) ||
    (estNacelles &&
      !coutsV7DesNacelles &&
      (valeur.tronconId !== "chenal-des-vannes" ||
        consommations !== undefined))
  ) {
    return false;
  }
  if (
    consommations !== undefined &&
    (!estConsommationContextuelleValide(consommations) ||
      !estTronconACoutContextuel(valeur.tronconId) ||
      !consommationsDesNacellesSontAtteignables(
        valeur.tronconId,
        consommations,
      ))
  ) {
    return false;
  }
  const troncon = trouverTroncon(valeur.tronconId);
  const destinationHistoriqueV7 =
    autoriserTopologieHistoriqueDesNacelles &&
    valeur.tronconId === "nacelles-de-veille-basse" &&
    position === "veille-basse" &&
    valeur.destination === "relais-des-vannes";
  const destination = destinationHistoriqueV7
    ? "relais-des-vannes"
    : troncon === undefined
      ? undefined
      : trouverDestination(troncon, position);
  const engagementsPrealablesSatisfaits =
    troncon?.engagementsPrealables?.every((requis) =>
      engagementsPrecedents.some(
        (engagement) =>
          engagement.statut === "termine" &&
          engagement.tronconId === requis.tronconId &&
          engagement.destination === requis.destination,
      ),
    ) ?? true;
  return (
    troncon !== undefined &&
    destination !== undefined &&
    engagementsPrealablesSatisfaits &&
    valeur.id === `engagement-${index + 1}` &&
    valeur.origine === position &&
    valeur.destination === destination &&
    typeof valeur.engageA === "number" &&
    Number.isInteger(valeur.engageA) &&
    valeur.engageA >= secondeMinimale &&
    valeur.engageA <= secondeCourante &&
    valeur.arriveeA === valeur.engageA + troncon.dureeSecondes &&
    (valeur.statut === "en-cours" || valeur.statut === "termine")
  );
}

function estJalonAttendu(
  valeur: unknown,
  engagement: EngagementDeRoute,
  index: number,
): valeur is JalonDeRoute {
  return (
    estObjet(valeur) &&
    memesCles(valeur, ["id", "type", "moment", "tronconId", "cause"]) &&
    valeur.id === `jalon-route-${index + 1}` &&
    valeur.type === "fin-de-troncon" &&
    valeur.moment === engagement.arriveeA &&
    valeur.tronconId === engagement.tronconId &&
    valeur.cause === "front-de-cendre.condamnation-arriere"
  );
}

export function estEtatDesRoutes(
  valeur: unknown,
  secondeCourante: number,
  autoriserTopologieHistoriqueSansMarqueur = false,
): valeur is EtatDesRoutes {
  const clesAttendues = [
    "position",
    "etatsReels",
    "renseignements",
    "engagements",
    "jalons",
    ...(estObjet(valeur) && "topologieHistorique" in valeur
      ? ["topologieHistorique" as const]
      : []),
  ] as const;
  if (
    !estObjet(valeur) ||
    !memesCles(valeur, clesAttendues) ||
    (valeur.topologieHistorique !== undefined &&
      valeur.topologieHistorique !== "nacelles-v7") ||
    !estObjet(valeur.etatsReels) ||
    !Array.isArray(valeur.renseignements) ||
    !Array.isArray(valeur.engagements) ||
    !Array.isArray(valeur.jalons)
  ) {
    return false;
  }

  const initial = creerEtatDesRoutesInitial();
  const etatsReels = valeur.etatsReels;
  const coutsV7DesNacelles = "nacelles-de-veille-basse" in etatsReels;
  const topologieHistoriqueEstAutorisee =
    valeur.topologieHistorique === "nacelles-v7" ||
    autoriserTopologieHistoriqueSansMarqueur;
  if (
    valeur.renseignements.length !== initial.renseignements.length ||
    !valeur.renseignements.every((renseignement, index) =>
      memeRenseignement(renseignement, initial.renseignements[index]!),
    )
  ) {
    return false;
  }

  let position: IdentifiantDeLieu = initial.position;
  let prochaineSecondePossible = 0;
  let nombreDeJalons = 0;
  let topologieHistoriqueEstUtilisee = false;
  const engagementsValides: EngagementDeRoute[] = [];
  const etatsAttendus: Partial<
    Record<IdentifiantDeTroncon, EtatReelDeRoute>
  > = { ...initial.etatsReels };

  for (const [index, candidat] of valeur.engagements.entries()) {
    const candidatUtiliseLaTopologieHistorique =
      estObjet(candidat) &&
      candidat.tronconId === "nacelles-de-veille-basse" &&
      position === "veille-basse" &&
      candidat.destination === "relais-des-vannes";
    if (
      !estEngagementAttendu(
        candidat,
        index,
        position,
        prochaineSecondePossible,
        secondeCourante,
        engagementsValides,
        coutsV7DesNacelles,
        topologieHistoriqueEstAutorisee,
      )
    ) {
      return false;
    }
    engagementsValides.push(candidat);
    topologieHistoriqueEstUtilisee ||= candidatUtiliseLaTopologieHistorique;
    if (etatsAttendus[candidat.tronconId] === "coupe") {
      return false;
    }

    if (candidat.statut === "en-cours") {
      if (
        index !== valeur.engagements.length - 1 ||
        candidat.arriveeA <= secondeCourante
      ) {
        return false;
      }
      prochaineSecondePossible = candidat.engageA;
      continue;
    }

    if (
      candidat.arriveeA > secondeCourante ||
      !estJalonAttendu(
        valeur.jalons[nombreDeJalons],
        candidat,
        nombreDeJalons,
      )
    ) {
      return false;
    }
    nombreDeJalons += 1;
    prochaineSecondePossible = candidat.arriveeA;
    position = candidat.destination;
    etatsAttendus[candidat.tronconId] = "coupe";
  }

  return (
    nombreDeJalons === valeur.jalons.length &&
    valeur.position === position &&
    ["digue-des-puits", "chaussee-de-veille-basse"].every(
      (id) => id in etatsReels,
    ) &&
    Object.keys(etatsReels).every((id) =>
      TRONCONS_DE_ROUTE.some((troncon) => troncon.id === id),
    ) &&
    TRONCONS_DE_ROUTE.every(
      ({ id, etatInitial }) =>
        (etatsReels[id] ?? etatInitial) === etatsAttendus[id],
    ) &&
    (valeur.topologieHistorique === undefined ||
      topologieHistoriqueEstUtilisee)
  );
}

const FAITS_OUVRANT_LA_CONDUITE_DU_DEVERSOIR = new Set([
  "bassins.nacelles.conseil-passage-partage",
  "bassins.nacelles.conseil-maintenance-commune",
]);

const FAITS_OUVRANT_LE_PASSAGE_REGIONAL = new Set([
  "bassins.deversoir.passage-prepare",
  "bassins.deversoir.passage-transmis",
]);
const FAITS_OUVRANT_LE_PASSAGE_DE_LA_COURONNE = new Set([
  "trame.aiguillage-zero.passage-consigne",
  "trame.aiguillage-zero.passage-transmis",
]);
const FAITS_D_INTERFACE_DE_SIGNAL_ZERO = new Set([
  "trame.signal-zero.interface-rail-lue",
  "trame.signal-zero.interface-libre-lue",
]);
const FAITS_D_ECHO_DE_SIGNAL_ZERO = new Set([
  "trame.signal-zero.echos-conserves",
  "trame.signal-zero.frequences-separees",
]);
const FAITS_DE_TRACE_RESOLUE_A_SIGNAL_ZERO = new Set([
  "trame.signal-zero.trace-sous-scelles",
  "trame.signal-zero.trace-transmise",
]);

export function engagementsDuDeversoirSontCausaux(
  routes: EtatDesRoutes,
  faits: readonly { readonly id: string; readonly moment: number }[],
): boolean {
  return routes.engagements.every((engagement) => {
    const faitsAnterieurs = faits.filter(
      ({ moment }) => moment <= engagement.engageA,
    );
    if (engagement.tronconId === "faisceau-de-l-aiguillage-zero") {
      const ids = new Set(faitsAnterieurs.map(({ id }) => id));
      return (
        [...FAITS_D_INTERFACE_DE_SIGNAL_ZERO].some((id) => ids.has(id)) &&
        [...FAITS_D_ECHO_DE_SIGNAL_ZERO].some((id) => ids.has(id)) &&
        (!ids.has("trame.marche.trace-bascule-clandestine") ||
          [...FAITS_DE_TRACE_RESOLUE_A_SIGNAL_ZERO].some((id) =>
            ids.has(id),
          ))
      );
    }
    const faitsRequis =
      engagement.tronconId === "conduite-du-deversoir"
        ? FAITS_OUVRANT_LA_CONDUITE_DU_DEVERSOIR
        : engagement.tronconId === "passage-de-la-couronne-muette"
          ? FAITS_OUVRANT_LE_PASSAGE_DE_LA_COURONNE
        : engagement.tronconId === "passage-de-la-ligne-zero" ||
            engagement.tronconId === "piste-des-levees"
          ? FAITS_OUVRANT_LE_PASSAGE_REGIONAL
          : null;
    return (
      faitsRequis === null ||
      (faits.some(
          (fait) =>
            faitsRequis.has(fait.id) && fait.moment <= engagement.engageA,
        ) &&
        (engagement.tronconId !== "passage-de-la-ligne-zero" ||
          faits.some(
            (fait) =>
              fait.id === "bassins.deversoir.ligne-zero-relevee" &&
              fait.moment <= engagement.engageA,
          )))
    );
  });
}
