import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { Langue } from "../content/types";
import {
  calculerCoutDynamiqueDeLAiguillageZero,
  type CoutDynamiqueDeLAiguillageZero,
} from "../simulation/aiguillageZero";
import type { EtatCampagne } from "../simulation/campagne";
import {
  calculerDevenirsDesSitesDeLaTrame,
  type DevenirsDesSitesDeLaTrame,
} from "../simulation/sites";

export interface ProjectionDeLAiguillageZero {
  readonly visible: boolean;
  readonly titre: string;
  readonly eyebrow: string;
  readonly accordRegional: string;
  readonly grandAiguillage: string;
  readonly traverseLibre: string;
  readonly sites: string;
  readonly routes: string;
  readonly engagements: string;
  readonly relations: string;
  readonly soupcons: string;
  readonly echoFutur: string;
  readonly libelles: Readonly<
    Record<
      | "accordRegional"
      | "grandAiguillage"
      | "traverseLibre"
      | "sites"
      | "routes"
      | "engagements"
      | "relations"
      | "soupcons"
      | "echoFutur",
      string
    >
  >;
}

const SITES_DE_LA_TRAME = [
  "barriereNeuve",
  "dortoirDixSept",
  "pompeNeuve",
  "marcheDesTraverses",
  "signalZero",
] as const satisfies readonly (keyof DevenirsDesSitesDeLaTrame)[];

function idsDeFaits(etat: EtatCampagne): ReadonlySet<string> {
  return new Set(etat.narration.faitsDeCampagne.map(({ id }) => id));
}

function formater(
  modele: string,
  variables: Readonly<Record<string, string | number>>,
): string {
  return Object.entries(variables).reduce(
    (texte, [nom, valeur]) =>
      texte.replaceAll(`{${nom}}`, String(valeur)),
    modele,
  );
}

function formatterCout(
  cout: CoutDynamiqueDeLAiguillageZero,
  modeles: Readonly<Record<string, string>>,
): string {
  const cle =
    cout.preparation === "train-outil"
      ? "monopoleTrain"
      : cout.preparation === "attelage-federe"
        ? "transportAttelage"
        : cout.cible === 10
          ? "monopoleSansTrain"
          : "transportSansAttelage";
  return formater(modeles[cle] ?? "", {
    cout: cout.applique,
    deficit: cout.deficit,
  });
}

export function decrireCoutDeLAiguillageZero(
  etat: EtatCampagne,
  choixId: string,
  langue: Langue,
): string | undefined {
  const cout = calculerCoutDynamiqueDeLAiguillageZero(etat, choixId);
  const modeles =
    lirePresentationsPremium()?.aiguillage?.[langue].couts;
  return cout === undefined || modeles === undefined
    ? undefined
    : formatterCout(cout, modeles);
}

export function projeterAiguillageZero(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeLAiguillageZero {
  const visible =
    (etat.routes.position === "aiguillage-zero" ||
      etat.routes.position === "couronne-muette") &&
    !etat.routes.engagements.some(({ statut }) => statut === "en-cours");
  const textesPremium = lirePresentationsPremium();
  const textes = textesPremium?.aiguillage?.[langue];
  const textesTrame = textesPremium?.trame?.[langue];
  const textesTraverse = textesPremium?.traverse?.[langue];
  const libellesVides = {
    accordRegional: "",
    grandAiguillage: "",
    traverseLibre: "",
    sites: "",
    routes: "",
    engagements: "",
    relations: "",
    soupcons: "",
    echoFutur: "",
  };
  if (
    !visible ||
    textes === undefined ||
    textesTrame === undefined ||
    textesTraverse === undefined
  ) {
    return {
      visible: false,
      titre: "",
      eyebrow: "",
      accordRegional: "",
      grandAiguillage: "",
      traverseLibre: "",
      sites: "",
      routes: "",
      engagements: "",
      relations: "",
      soupcons: "",
      echoFutur: "",
      libelles: libellesVides,
    };
  }

  const faits = idsDeFaits(etat);
  const cleAccord = faits.has(
    "trame.aiguillage-zero.monopole-republicain",
  )
    ? "monopole"
    : faits.has("trame.aiguillage-zero.charte-partagee")
      ? "charte"
      : faits.has("trame.aiguillage-zero.piece-soustraite")
        ? "vol"
        : faits.has("trame.aiguillage-zero.transport-autonome")
          ? "transport"
          : "attente";
  const devenirsDesSites =
    etat.devenirsDesSites?.trameDeFer ??
    calculerDevenirsDesSitesDeLaTrame({
      routes: etat.routes,
      faits: etat.narration.faitsDeCampagne.map(({ id }) => id),
    });
  const etatsDesSites = SITES_DE_LA_TRAME.map(
    (site) =>
      `${textes.nomsDesSites[site]} : ${
        textes.devenirsDeSites[devenirsDesSites[site]]
      }`,
  ).join(" · ");
  const passageOuvert =
    faits.has("trame.aiguillage-zero.passage-consigne") ||
    faits.has("trame.aiguillage-zero.passage-transmis");
  const relationRail =
    textesTrame.relations[etat.trameDeFer.relationRepublique]!;
  const relationPuits =
    textesTraverse.relationsPuits[
      etat.traverseLibre.relationPuitsLibres
    ]!;
  const faitDuTransport = etat.narration.faitsDeCampagne.find(
    ({ id }) => id === "trame.aiguillage-zero.transport-autonome",
  );
  const materiauxPayes = Math.abs(
    faitDuTransport?.effets.materiels.find(
      (
        effet,
      ): effet is Extract<
        (typeof faitDuTransport.effets.materiels)[number],
        { readonly type: "stock.modifie" }
      > =>
        effet.type === "stock.modifie" &&
        effet.stock === "materiaux",
    )?.variation ?? 0,
  );
  const coutCibleDuTransport =
    etat.trameDeFer.occasions.attelageFedere.statut === "annoncee"
      ? 6
      : 14;
  const detteDeTransport =
    faitDuTransport === undefined
      ? 0
      : Math.max(0, coutCibleDuTransport - materiauxPayes);
  const engagements = etat.trameDeFer.engagements.map(
    ({ id }) => textesTrame.engagements[id]!,
  );
  if (detteDeTransport > 0) {
    engagements.push(
      formater(textes.formats.detteTransport, {
        deficit: detteDeTransport,
      }),
    );
  }

  return {
    visible: true,
    titre: textes.titre,
    eyebrow: textes.eyebrow,
    accordRegional: textes.solutions[cleAccord]!,
    grandAiguillage: formater(textes.formats.grandAiguillage, {
      statut:
        textesTrame.statuts[
          etat.trameDeFer.grandAiguillage.statut
        ]!,
      relation: relationRail,
    }),
    traverseLibre: formater(textes.formats.traverseLibre, {
      statut: textesTraverse.statuts[etat.traverseLibre.statut]!,
      relation: relationPuits,
    }),
    sites: formater(textes.formats.sites, {
      sites: etatsDesSites,
    }),
    routes: formater(
      passageOuvert
        ? textes.formats.routesOuvertes
        : textes.formats.routesFermees,
      { nombre: etat.routes.engagements.length },
    ),
    engagements:
      engagements.length === 0
        ? textes.aucunEngagement
        : engagements.join(" · "),
    relations: formater(textes.formats.relations, {
      rail: relationRail,
      puits: relationPuits,
    }),
    soupcons: faits.has("trame.aiguillage-zero.trace-du-vol")
      ? textes.soupcons.trace!
      : textes.soupcons.aucun!,
    echoFutur: faits.has(
      "trame.aiguillage-zero.retours-couronne-planifies",
    )
      ? textes.formats.echoPlanifie
      : textes.formats.echoAConsigner,
    libelles: textes.libelles as ProjectionDeLAiguillageZero["libelles"],
  };
}
