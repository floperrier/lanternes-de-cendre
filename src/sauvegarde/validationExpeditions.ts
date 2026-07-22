import {
  creerFaitPourRapportDExpedition,
  creerEtatDesExpeditionsInitial,
  lancerExpedition,
  ordonnerExpedition,
  traiterEcheancesDExpedition,
  type EtatDesExpeditions,
  type IntentionDOrdreDistant,
} from "../simulation/expeditions";
import type { FaitDeCampagne } from "../simulation/faits";

function estObjet(valeur: unknown): valeur is Record<string, unknown> {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
}

function sontStructurellementEgaux(gauche: unknown, droite: unknown): boolean {
  if (Object.is(gauche, droite)) {
    return true;
  }
  if (Array.isArray(gauche) || Array.isArray(droite)) {
    return (
      Array.isArray(gauche) &&
      Array.isArray(droite) &&
      gauche.length === droite.length &&
      gauche.every((membre, index) =>
        sontStructurellementEgaux(membre, droite[index]),
      )
    );
  }
  if (!estObjet(gauche) || !estObjet(droite)) {
    return false;
  }
  const clesGauche = Object.keys(gauche).sort();
  const clesDroite = Object.keys(droite).sort();
  return (
    clesGauche.length === clesDroite.length &&
    clesGauche.every(
      (cle, index) =>
        cle === clesDroite[index] &&
        sontStructurellementEgaux(gauche[cle], droite[cle]),
    )
  );
}

const INTENTIONS = new Set<IntentionDOrdreDistant>([
  "couper-contourner",
  "forcer-galerie",
  "ordonner-repli",
]);

function estOperationDExpedition(
  operation: Record<string, unknown>,
  secondesCourantes: number,
): boolean {
  if (operation.id !== "vannes-grises") {
    return false;
  }
  if (operation.statut === "prete") {
    return sontStructurellementEgaux(
      operation,
      creerEtatDesExpeditionsInitial().operations[0],
    );
  }
  if (
    typeof operation.lanceeA !== "number" ||
    !Number.isInteger(operation.lanceeA) ||
    operation.lanceeA < 0 ||
    operation.lanceeA > secondesCourantes
  ) {
    return false;
  }

  const lancement = lancerExpedition(
    creerEtatDesExpeditionsInitial(),
    { type: "expedition.lancer", expeditionId: "vannes-grises" },
    operation.lanceeA,
  );

  if (operation.statut === "en-cours" || operation.statut === "ordre-requis") {
    const attendu = traiterEcheancesDExpedition(
      lancement.etat,
      operation.lanceeA,
      secondesCourantes,
    ).etat;
    return sontStructurellementEgaux(operation, attendu.operations[0]);
  }

  if (
    (operation.statut !== "retour" && operation.statut !== "terminee") ||
    !Array.isArray(operation.ordresDistants) ||
    operation.ordresDistants.length !== 1 ||
    !estObjet(operation.ordresDistants[0]) ||
    typeof operation.ordresDistants[0].moment !== "number" ||
    !Number.isInteger(operation.ordresDistants[0].moment) ||
    operation.ordresDistants[0].moment < operation.lanceeA + 9_420 ||
    operation.ordresDistants[0].moment > secondesCourantes ||
    typeof operation.ordresDistants[0].intention !== "string" ||
    !INTENTIONS.has(
      operation.ordresDistants[0].intention as IntentionDOrdreDistant,
    )
  ) {
    return false;
  }

  const ordre = operation.ordresDistants[0] as {
    readonly moment: number;
    readonly intention: IntentionDOrdreDistant;
  };
  const enAttente = traiterEcheancesDExpedition(
    lancement.etat,
    operation.lanceeA,
    ordre.moment,
  ).etat;
  const enRetour = ordonnerExpedition(
    enAttente,
    {
      type: "expedition.ordonner",
      expeditionId: "vannes-grises",
      intention: ordre.intention,
    },
    ordre.moment,
  ).etat;
  const attendu = traiterEcheancesDExpedition(
    enRetour,
    ordre.moment,
    secondesCourantes,
  ).etat;
  return sontStructurellementEgaux(operation, attendu.operations[0]);
}

export function estEtatDesExpeditions(
  valeur: unknown,
  secondesCourantes: number,
): valeur is EtatDesExpeditions {
  if (
    !estObjet(valeur) ||
    !Array.isArray(valeur.operations) ||
    valeur.operations.length === 0 ||
    !valeur.operations.every(estObjet)
  ) {
    return false;
  }
  const identifiants = valeur.operations.map((operation) => operation.id);
  return (
    new Set(identifiants).size === identifiants.length &&
    valeur.operations.every((operation) =>
      estOperationDExpedition(operation, secondesCourantes),
    )
  );
}

export function estJournalDExpeditionCoherent(
  expeditions: EtatDesExpeditions,
  faits: readonly FaitDeCampagne[],
): boolean {
  const attendus = expeditions.operations
    .flatMap((operation, indexOperation) =>
      operation.rapports.map((rapport, indexRapport) => ({
        fait: creerFaitPourRapportDExpedition(operation.id, rapport),
        indexOperation,
        indexRapport,
      })),
    )
    .sort(
      (gauche, droite) =>
        gauche.fait.moment - droite.fait.moment ||
        gauche.indexOperation - droite.indexOperation ||
        gauche.indexRapport - droite.indexRapport,
    )
    .map(({ fait }) => fait);
  const declares = faits.filter((fait) =>
    fait.id.startsWith("expedition."),
  );
  return sontStructurellementEgaux(declares, attendus);
}
