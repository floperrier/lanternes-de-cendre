import type { EtatDeHautPuits } from "../simulation/hautPuits";
import type { FaitDeCampagne } from "../simulation/faits";
import type { EtatDesRoutes, IdentifiantDeLieu } from "../simulation/routes";

type ObjetInconnu = Record<string, unknown>;

function estObjet(valeur: unknown): valeur is ObjetInconnu {
  return (
    valeur !== null && typeof valeur === "object" && !Array.isArray(valeur)
  );
}

function estMouvement(
  valeur: unknown,
  stock: string,
  variation: number,
): boolean {
  return (
    estObjet(valeur) &&
    valeur.stock === stock &&
    valeur.variation === variation
  );
}

function estOffre(
  valeur: unknown,
  secondeCourante: number,
  attendue: {
    readonly id: string;
    readonly besoin: string;
    readonly mouvements: readonly [
      { readonly stock: string; readonly variation: number },
      { readonly stock: string; readonly variation: number },
    ];
  },
): boolean {
  return (
    estObjet(valeur) &&
    valeur.id === attendue.id &&
    valeur.besoin === attendue.besoin &&
    (valeur.echangesRestants === 0 || valeur.echangesRestants === 1) &&
    ((valeur.echangesRestants === 1 && valeur.echangeA === null) ||
      (valeur.echangesRestants === 0 &&
        Number.isInteger(valeur.echangeA) &&
        (valeur.echangeA as number) >= 0 &&
        (valeur.echangeA as number) <= secondeCourante)) &&
    Array.isArray(valeur.mouvements) &&
    valeur.mouvements.length === attendue.mouvements.length &&
    valeur.mouvements.every((mouvement, index) => {
      const attendu = attendue.mouvements[index]!;
      return estMouvement(mouvement, attendu.stock, attendu.variation);
    })
  );
}

export function estEtatDeHautPuits(
  valeur: unknown,
  secondeCourante: number,
): valeur is EtatDeHautPuits {
  if (
    !estObjet(valeur) ||
    !estObjet(valeur.colonie) ||
    valeur.colonie.id !== "haut-puits" ||
    !Array.isArray(valeur.colonie.pressions) ||
    valeur.colonie.pressions.length > 2 ||
    !estObjet(valeur.marche) ||
    !Array.isArray(valeur.marche.offres) ||
    valeur.marche.offres.length !== 2 ||
    !Array.isArray(valeur.engagementsDiplomatiques) ||
    !Array.isArray(valeur.projetsTransformationDisponibles) ||
    valeur.projetsTransformationDisponibles.length !== 2 ||
    valeur.projetsTransformationDisponibles[0] !==
      "decanteur-itinerant" ||
    valeur.projetsTransformationDisponibles[1] !== "arche-des-deplaces" ||
    valeur.projetChoisi !== null
  ) {
    return false;
  }

  if (
    !estOffre(valeur.marche.offres[0], secondeCourante, {
      id: "eau-contre-materiaux",
      besoin: "pieces-de-filtration",
      mouvements: [
        { stock: "eau", variation: 60 },
        { stock: "materiaux", variation: -8 },
      ],
    }) ||
    !estOffre(valeur.marche.offres[1], secondeCourante, {
      id: "eau-contre-remedes",
      besoin: "remedes-pour-les-puisatiers",
      mouvements: [
        { stock: "eau", variation: 35 },
        { stock: "remedes", variation: -4 },
      ],
    })
  ) {
    return false;
  }

  const engagementsValides = valeur.engagementsDiplomatiques.every(
    (engagement) =>
      estObjet(engagement) &&
      engagement.id === "haut-puits.partage-au-conseil-des-vannes" &&
      Number.isInteger(engagement.prisA) &&
      (engagement.prisA as number) >= 0 &&
      (engagement.prisA as number) <= secondeCourante &&
      engagement.echoPrevu === "conseil-des-vannes",
  );
  if (!engagementsValides) {
    return false;
  }

  const pressions = valeur.colonie.pressions;
  if (valeur.colonie.devenir === "negociation-ouverte") {
    return (
      valeur.colonie.statut === "stable" &&
      pressions.length === 1 &&
      pressions[0] === "autonomie-hydrique-menacee" &&
      valeur.relationPublique === "transactionnelle" &&
      valeur.engagementsDiplomatiques.length === 0 &&
      valeur.decisionPriseA === null
    );
  }
  if (
    !Number.isInteger(valeur.decisionPriseA) ||
    (valeur.decisionPriseA as number) < 0 ||
    (valeur.decisionPriseA as number) > secondeCourante
  ) {
    return false;
  }
  if (valeur.colonie.devenir === "partage-organise") {
    return (
      valeur.colonie.statut === "fragile" &&
      pressions.length === 1 &&
      pressions[0] === "reserves-entamees" &&
      valeur.relationPublique === "cooperative" &&
      valeur.engagementsDiplomatiques.length === 1 &&
      (valeur.engagementsDiplomatiques[0] as ObjetInconnu).prisA ===
        valeur.decisionPriseA
    );
  }
  return (
    valeur.colonie.devenir === "reserves-protegees" &&
    valeur.colonie.statut === "stable" &&
    pressions.length === 1 &&
    pressions[0] === "familles-ecartees" &&
    valeur.relationPublique === "fermee" &&
    valeur.engagementsDiplomatiques.length === 0
  );
}

function estMomentDePresenceAHautPuits(
  routes: EtatDesRoutes,
  moment: number,
  secondeCourante: number,
): boolean {
  let position: IdentifiantDeLieu = "halte-du-puits-sec";
  let presentDepuis = 0;
  for (const engagement of routes.engagements) {
    if (
      position === "haut-puits" &&
      moment >= presentDepuis &&
      moment <= engagement.engageA
    ) {
      return true;
    }
    if (engagement.statut === "en-cours") {
      return false;
    }
    position = engagement.destination;
    presentDepuis = engagement.arriveeA;
  }
  return (
    position === "haut-puits" &&
    moment >= presentDepuis &&
    moment <= secondeCourante
  );
}

export function activitesDeHautPuitsSontCausales(
  hautPuits: EtatDeHautPuits,
  routes: EtatDesRoutes,
  secondeCourante: number,
  faits: readonly FaitDeCampagne[],
): boolean {
  const moments = [
    ...hautPuits.marche.offres.flatMap(({ echangeA }) =>
      echangeA === null ? [] : [echangeA],
    ),
    ...(hautPuits.decisionPriseA === null
      ? []
      : [hautPuits.decisionPriseA]),
  ];
  if (
    !moments.every((moment) =>
      estMomentDePresenceAHautPuits(routes, moment, secondeCourante),
    )
  ) {
    return false;
  }

  const faitsDuPacte = faits.filter(
    (fait) =>
      fait.id === "bassins.haut-puits.pacte-partage" ||
      fait.id === "bassins.haut-puits.pacte-autonomie",
  );
  if (hautPuits.colonie.devenir === "negociation-ouverte") {
    return faitsDuPacte.length === 0;
  }
  const faitAttendu =
    hautPuits.colonie.devenir === "partage-organise"
      ? "bassins.haut-puits.pacte-partage"
      : "bassins.haut-puits.pacte-autonomie";
  return (
    faitsDuPacte.length === 1 &&
    faitsDuPacte[0]?.id === faitAttendu &&
    faitsDuPacte[0].moment === hautPuits.decisionPriseA
  );
}
