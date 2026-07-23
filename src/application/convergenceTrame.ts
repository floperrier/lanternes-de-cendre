import type { Langue } from "../content/types";
import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { EtatCampagne } from "../simulation/campagne";

export type OptionDeLAiguillageZero =
  | "monopole"
  | "charte"
  | "vol"
  | "transport";

export interface ProjectionDeConvergenceDeLaTrame {
  readonly visible: boolean;
  readonly titre: string;
  readonly eyebrow: string;
  readonly offreOfficielle: string;
  readonly offreClandestine: string;
  readonly interfaceLigneZero: string;
  readonly trace: string;
  readonly echoGrandAiguillage: string;
  readonly echoTraverseLibre: string;
  readonly optionsDuClimax: readonly string[];
  readonly libelles: {
    readonly offreOfficielle: string;
    readonly offreClandestine: string;
    readonly interface: string;
    readonly trace: string;
    readonly echoGrandAiguillage: string;
    readonly echoTraverseLibre: string;
    readonly options: string;
  };
}

function idsDeFaits(etat: EtatCampagne): ReadonlySet<string> {
  return new Set(etat.narration.faitsDeCampagne.map(({ id }) => id));
}

export function calculerOptionsDeLAiguillageZero(
  etat: EtatCampagne,
): readonly OptionDeLAiguillageZero[] {
  const faits = idsDeFaits(etat);
  return [
    ...(etat.trameDeFer.pieceDeRegulation.monopoleRepublicain ||
    faits.has("trame.marche.coupleur-officiel-acquis")
      ? (["monopole"] as const)
      : []),
    ...(etat.trameDeFer.grandAiguillage.statut === "atelier-negocie" ||
    etat.traverseLibre.aide.statut === "publique"
      ? (["charte"] as const)
      : []),
    ...(etat.traverseLibre.contournement === "praticable"
      ? (["vol"] as const)
      : []),
    "transport",
  ];
}

export function projeterConvergenceDeLaTrame(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeConvergenceDeLaTrame {
  const auMarche = etat.routes.position === "marche-des-traverses";
  const auSignal = etat.routes.position === "signal-zero";
  const visible =
    (auMarche || auSignal) &&
    !etat.routes.engagements.some(({ statut }) => statut === "en-cours");
  const textes = lirePresentationsPremium()?.convergence?.[langue];
  const libellesVides = {
    offreOfficielle: "",
    offreClandestine: "",
    interface: "",
    trace: "",
    echoGrandAiguillage: "",
    echoTraverseLibre: "",
    options: "",
  };
  if (!visible || textes === undefined) {
    return {
      visible: false,
      titre: "",
      eyebrow: "",
      offreOfficielle: "",
      offreClandestine: "",
      interfaceLigneZero: "",
      trace: "",
      echoGrandAiguillage: "",
      echoTraverseLibre: "",
      optionsDuClimax: [],
      libelles: libellesVides,
    };
  }

  const faits = idsDeFaits(etat);
  const offreOfficielleEpuisee =
    faits.has("trame.marche.coupleur-officiel-acquis") ||
    faits.has("trame.marche.reserve-echangee");
  const offreClandestineEpuisee =
    faits.has("trame.marche.filtres-sans-marque-acquis") ||
    faits.has("trame.marche.trace-bascule-clandestine");
  const interfaceLigneZero = faits.has(
    "trame.signal-zero.interface-rail-lue",
  )
    ? "rail"
    : faits.has("trame.signal-zero.interface-libre-lue")
      ? "puits"
      : "inconnue";
  const interventionClandestine = faits.has(
    "trame.marche.trace-bascule-clandestine",
  );
  const trace = !interventionClandestine
    ? "aucune"
    : faits.has("trame.signal-zero.trace-transmise")
      ? "transmise"
      : faits.has("trame.signal-zero.trace-sous-scelles")
        ? "scellee"
        : "latente";
  const attelageFedere =
    etat.trameDeFer.occasions.attelageFedere.statut === "annoncee";
  const monopoleRepublicain =
    etat.trameDeFer.pieceDeRegulation.monopoleRepublicain;
  const ateliersNegocies =
    etat.trameDeFer.grandAiguillage.statut === "atelier-negocie";
  const galerieEtayee =
    etat.traverseLibre.routeSecondaire.statut === "reparee";
  const contournementPraticable =
    etat.traverseLibre.contournement === "praticable";
  const aidePublique = etat.traverseLibre.aide.statut === "publique";
  const echoGrandAiguillage =
    attelageFedere && monopoleRepublicain
      ? "monopole_attelage"
      : attelageFedere && ateliersNegocies
        ? "ateliers_attelage"
        : monopoleRepublicain
          ? "monopole"
          : attelageFedere
            ? "attelage"
            : ateliersNegocies
              ? "ateliers"
              : "absent";
  const echoTraverseLibre =
    contournementPraticable && aidePublique
      ? "contournement_public"
      : galerieEtayee && aidePublique
        ? "galerie_publique"
        : contournementPraticable
          ? "contournement"
          : galerieEtayee
            ? "galerie"
            : etat.traverseLibre.aide.statut !== "aucune" ||
                etat.traverseLibre.marche.lotsDeFiltresManquants < 2
              ? "filtres"
              : "absent";
  const varianteDeTransport = attelageFedere
    ? galerieEtayee
      ? "transport_attelage_galerie"
      : "transport_attelage"
    : galerieEtayee
      ? "transport_galerie"
      : "transport";

  return {
    visible: true,
    titre: auMarche ? textes.titres.marche : textes.titres.signal,
    eyebrow: auMarche
      ? textes.libelles.eyebrowMarche
      : textes.libelles.eyebrowSignal,
    offreOfficielle: offreOfficielleEpuisee
      ? textes.offresOfficielles.epuisee!
      : textes.offresOfficielles[
          etat.trameDeFer.grandAiguillage.marche
            .servicesLourdsRestants > 0
            ? "ouverte_services"
            : "ouverte_coupleur"
        ]!,
    offreClandestine: offreClandestineEpuisee
      ? textes.offresClandestines.epuisee!
      : textes.offresClandestines[
          etat.traverseLibre.marche.lotsDeFiltresManquants > 0
            ? "ouverte_besoin"
            : "ouverte_surplus"
        ]!,
    interfaceLigneZero: textes.interfaces[interfaceLigneZero]!,
    trace: textes.traces[trace]!,
    echoGrandAiguillage:
      textes.echosDeGrandAiguillage[echoGrandAiguillage]!,
    echoTraverseLibre:
      textes.echosDeTraverseLibre[echoTraverseLibre]!,
    optionsDuClimax: calculerOptionsDeLAiguillageZero(etat).map(
      (option) =>
        textes.optionsDuClimax[
          option === "transport" ? varianteDeTransport : option
        ]!,
    ),
    libelles: textes.libelles,
  };
}
