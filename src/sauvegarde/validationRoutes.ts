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

type ObjetInconnu = Record<string, unknown>;

function estObjet(valeur: unknown): valeur is ObjetInconnu {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
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
): valeur is EngagementDeRoute {
  if (
    !estObjet(valeur) ||
    !memesCles(valeur, [
      "id",
      "tronconId",
      "origine",
      "destination",
      "engageA",
      "arriveeA",
      "statut",
    ])
  ) {
    return false;
  }
  const troncon = trouverTroncon(valeur.tronconId);
  const destination =
    troncon === undefined ? undefined : trouverDestination(troncon, position);
  return (
    troncon !== undefined &&
    destination !== undefined &&
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
): valeur is EtatDesRoutes {
  if (
    !estObjet(valeur) ||
    !memesCles(valeur, [
      "position",
      "etatsReels",
      "renseignements",
      "engagements",
      "jalons",
    ]) ||
    !estObjet(valeur.etatsReels) ||
    !Array.isArray(valeur.renseignements) ||
    !Array.isArray(valeur.engagements) ||
    !Array.isArray(valeur.jalons)
  ) {
    return false;
  }

  const initial = creerEtatDesRoutesInitial();
  const etatsReels = valeur.etatsReels;
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
  const etatsAttendus: Partial<
    Record<IdentifiantDeTroncon, EtatReelDeRoute>
  > = { ...initial.etatsReels };

  for (const [index, candidat] of valeur.engagements.entries()) {
    if (
      !estEngagementAttendu(
        candidat,
        index,
        position,
        prochaineSecondePossible,
        secondeCourante,
      )
    ) {
      return false;
    }
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
    memesCles(etatsReels, TRONCONS_DE_ROUTE.map(({ id }) => id)) &&
    TRONCONS_DE_ROUTE.every(
      ({ id }) => etatsReels[id] === etatsAttendus[id],
    )
  );
}
