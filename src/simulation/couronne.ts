import type { EtatCampagne } from "./campagne";
import type { DevenirDeSite } from "./sites";

export type StatutDePreparationDeLaCouronne =
  | "indisponible"
  | "preparable"
  | "amorce"
  | "reporte";

export interface EtatDesApprochesDeLaCouronne {
  readonly teteDeLigne: {
    readonly besoin: "pieces-de-voie";
    readonly interaction:
      | "en-attente"
      | "mandat-republicain"
      | "atelier-commun";
    readonly devenir: DevenirDeSite | "indetermine";
  };
  readonly veilleDesTrois: {
    readonly besoin: "filtres-de-sanctuaire";
    readonly interaction:
      | "en-attente"
      | "sanctuaire-renforce"
      | "releves-evacues";
    readonly devenir: DevenirDeSite | "indetermine";
  };
  readonly delegations: {
    readonly republique: "absente" | "conditionnelle" | "mandatee";
    readonly pelerins: "absente" | "conditionnelle" | "mandatee";
    readonly puitsLibres: "absente" | "conditionnelle" | "mandatee";
  };
  readonly diagnostic:
    | "inconnu"
    | "socles-cartographies"
    | "compatibilites-etablies";
  readonly preparatifs: {
    readonly berceauDAncrage: StatutDePreparationDeLaCouronne;
    readonly etalonDeReaccord: StatutDePreparationDeLaCouronne;
    readonly precipitateurEmbarque: StatutDePreparationDeLaCouronne;
  };
  readonly gardeDesPlans: "indecise" | "ilyana" | "equipes";
}

interface ContexteDesApproches {
  readonly trameDeFer: EtatCampagne["trameDeFer"];
  readonly traverseLibre: EtatCampagne["traverseLibre"];
  readonly veilleBasse: EtatCampagne["veilleBasse"];
  readonly hautPuits: EtatCampagne["hautPuits"];
  readonly pilotage: EtatCampagne["pilotage"];
  readonly narration: EtatCampagne["narration"];
}

export type IdentifiantDeRenseignementHeriteDeLaCouronne =
  | "tete-de-ligne-charte"
  | "tete-de-ligne-trace"
  | "veille-des-trois-registres"
  | "veille-des-trois-repli";

function idsDeFaits(
  contexte: ContexteDesApproches,
): ReadonlySet<string> {
  return new Set(
    contexte.narration.faitsDeCampagne.map(({ id }) => id),
  );
}

export function reconstruireEtatDesApprochesDeLaCouronne(
  contexte: ContexteDesApproches,
): EtatDesApprochesDeLaCouronne {
  const faits = idsDeFaits(contexte);
  const mandatRepublicain = faits.has(
    "couronne.tete-de-ligne.mandat-republicain",
  );
  const atelierCommun = faits.has(
    "couronne.tete-de-ligne.atelier-commun",
  );
  const sanctuaireRenforce = faits.has(
    "couronne.veille-des-trois.sanctuaire-renforce",
  );
  const relevesEvacues = faits.has(
    "couronne.veille-des-trois.releves-evacues",
  );
  const traceAttribuable = faits.has(
    "trame.aiguillage-zero.trace-du-vol",
  );
  const chartePartagee = faits.has(
    "trame.aiguillage-zero.charte-partagee",
  );
  const engagementDeTransportAutonome =
    contexte.trameDeFer.engagements.some(
      ({ id }) => id === "transport-autonome-aiguillage-zero",
    ) ||
    faits.has(
      "trame.aiguillage-zero.engagement-transport-autonome",
    );
  const berceauPreparable =
    contexte.trameDeFer.relationRepublique === "cooperative" ||
    contexte.trameDeFer.occasions.trainOutil.statut !== "inconnue";
  const etalonPreparable =
    (faits.has("trame.signal-zero.interface-rail-lue") ||
      faits.has("trame.signal-zero.interface-libre-lue")) &&
    (faits.has("trame.signal-zero.echos-conserves") ||
      faits.has("trame.signal-zero.frequences-separees"));
  const precipitateurPreparable =
    faits.has("bassins.deversoir.ligne-zero-relevee") ||
    contexte.hautPuits.projetRegional?.id === "decanteur-itinerant";
  const plansReportes = faits.has(
    "couronne.approches.preparatifs-reportes",
  );
  const statutDePreparation = (
    fait: string,
    preparable: boolean,
  ): StatutDePreparationDeLaCouronne =>
    faits.has(fait)
      ? "amorce"
      : plansReportes
        ? "reporte"
        : preparable
          ? "preparable"
          : "indisponible";

  const republique =
    traceAttribuable ||
    contexte.trameDeFer.relationRepublique === "fermee"
      ? mandatRepublicain || atelierCommun
        ? "conditionnelle"
        : "absente"
      : mandatRepublicain ||
          faits.has("trame.aiguillage-zero.monopole-republicain")
        ? "mandatee"
        : "conditionnelle";
  const pelerins =
    sanctuaireRenforce &&
    contexte.veilleBasse.colonie.statut !== "perdue"
      ? "mandatee"
      : sanctuaireRenforce || relevesEvacues
        ? "conditionnelle"
        : "absente";
  const puitsLibres =
    contexte.traverseLibre.relationPuitsLibres === "cooperative"
      ? chartePartagee || engagementDeTransportAutonome
        ? "mandatee"
        : "conditionnelle"
      : "absente";

  return {
    teteDeLigne: {
      besoin: "pieces-de-voie",
      interaction: mandatRepublicain
        ? "mandat-republicain"
        : atelierCommun
          ? "atelier-commun"
          : "en-attente",
      devenir: mandatRepublicain
        ? "absorbe"
        : atelierCommun
          ? "actif"
          : "indetermine",
    },
    veilleDesTrois: {
      besoin: "filtres-de-sanctuaire",
      interaction: sanctuaireRenforce
        ? "sanctuaire-renforce"
        : relevesEvacues
          ? "releves-evacues"
          : "en-attente",
      devenir: sanctuaireRenforce
        ? "actif"
        : relevesEvacues
          ? "evacue"
          : "indetermine",
    },
    delegations: { republique, pelerins, puitsLibres },
    diagnostic: faits.has(
      "couronne.approches.socles-cartographies",
    )
      ? "socles-cartographies"
      : faits.has("couronne.approches.compatibilites-etablies")
        ? "compatibilites-etablies"
        : "inconnu",
    preparatifs: {
      berceauDAncrage: statutDePreparation(
        "couronne.approches.berceau-amorce",
        berceauPreparable,
      ),
      etalonDeReaccord: statutDePreparation(
        "couronne.approches.etalon-calibre",
        etalonPreparable,
      ),
      precipitateurEmbarque: statutDePreparation(
        "couronne.approches.precipitateur-assemble",
        precipitateurPreparable,
      ),
    },
    gardeDesPlans: faits.has(
      "couronne.approches.plans-confies-a-ilyana",
    )
      ? "ilyana"
      : faits.has("couronne.approches.plans-repartis-aux-equipes")
        ? "equipes"
        : "indecise",
  };
}

export function choixDesApprochesDeLaCouronneEstDisponible(
  contexte: ContexteDesApproches,
  choixId: string,
): boolean {
  const etat = reconstruireEtatDesApprochesDeLaCouronne(contexte);
  const materiaux =
    contexte.pilotage.economie.stocks.materiaux.quantite;
  if (choixId === "ratifier-mandat") {
    return (
      etat.delegations.republique !== "absente" &&
      !idsDeFaits(contexte).has(
        "trame.aiguillage-zero.trace-du-vol",
      )
    );
  }
  if (choixId === "renforcer-sanctuaire") {
    return contexte.veilleBasse.colonie.statut !== "perdue";
  }
  if (choixId === "amorcer-berceau") {
    return (
      etat.preparatifs.berceauDAncrage === "preparable" &&
      materiaux >= 8
    );
  }
  if (choixId === "calibrer-etalon") {
    return (
      etat.preparatifs.etalonDeReaccord === "preparable" &&
      materiaux >= 6
    );
  }
  if (choixId === "assembler-precipitateur") {
    return (
      etat.preparatifs.precipitateurEmbarque === "preparable" &&
      materiaux >= 10
    );
  }
  return true;
}

export function renseignementHeriteDeLaCouronneEstDisponible(
  contexte: ContexteDesApproches,
  renseignementId: string,
): boolean {
  const faits = idsDeFaits(contexte);
  if (renseignementId === "tete-de-ligne-charte") {
    return (
      faits.has("trame.aiguillage-zero.charte-partagee") ||
      faits.has(
        "trame.aiguillage-zero.engagement-transport-autonome",
      ) ||
      contexte.trameDeFer.engagements.some(
        ({ id }) =>
          id === "charte-de-circulation-partagee" ||
          id === "transport-autonome-aiguillage-zero",
      )
    );
  }
  if (renseignementId === "tete-de-ligne-trace") {
    return faits.has("trame.aiguillage-zero.trace-du-vol");
  }
  if (renseignementId === "veille-des-trois-registres") {
    return faits.has("veille-basse.registres-copies");
  }
  if (renseignementId === "veille-des-trois-repli") {
    return (
      contexte.veilleBasse.colonie.statut === "perdue" ||
      faits.has("veille-basse.intervention-refusee")
    );
  }
  return true;
}
