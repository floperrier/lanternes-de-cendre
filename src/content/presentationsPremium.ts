import type { Langue } from "./types";

type DictionnaireDeTextes = Readonly<Record<string, string>>;

export interface TextesDeHautPuits {
  readonly titre: string;
  readonly colonie: string;
  readonly statut: string;
  readonly devenir: string;
  readonly pressions: string;
  readonly relation: string;
  readonly engagements: string;
  readonly projets: string;
  readonly projetChoisi: string;
  readonly aucunEngagement: string;
  readonly aucunProjetChoisi: string;
  readonly marche: string;
  readonly echanger: string;
  readonly epuisee: string;
  readonly echangesRestants: string;
  readonly negociation: string;
  readonly tranchee: string;
  readonly instruction: string;
  readonly statuts: DictionnaireDeTextes;
  readonly devenirs: DictionnaireDeTextes;
  readonly pressionsLocales: DictionnaireDeTextes;
  readonly relations: DictionnaireDeTextes;
  readonly besoins: DictionnaireDeTextes;
  readonly stocks: DictionnaireDeTextes;
  readonly projetsPossibles: DictionnaireDeTextes;
  readonly projetsChoisis: DictionnaireDeTextes;
  readonly decisions: Readonly<
    Record<
      string,
      {
        readonly libelle: string;
        readonly consequence: string;
      }
    >
  >;
  readonly engagement: string;
}

export interface TextesDeVeilleBasse {
  readonly titre: string;
  readonly veilleBasse: string;
  readonly typeColonie: string;
  readonly statuts: DictionnaireDeTextes;
  readonly pressions: DictionnaireDeTextes;
  readonly marche: DictionnaireDeTextes;
  readonly archives: DictionnaireDeTextes;
  readonly affectations: DictionnaireDeTextes;
  readonly equipes: string;
  readonly avertissement: string;
  readonly hospice: string;
  readonly typeHospice: string;
  readonly besoin: string;
  readonly devenirs: DictionnaireDeTextes;
  readonly cohorte: string;
  readonly destinations: DictionnaireDeTextes;
  readonly origine: string;
  readonly personnes: string;
  readonly etatDominant: string;
  readonly specialite: string;
  readonly memoires: DictionnaireDeTextes;
  readonly integrations: DictionnaireDeTextes;
  readonly revelation: string;
  readonly maelys: string;
  readonly decisionsDeMaelys: DictionnaireDeTextes;
  readonly positionsDeMaelys: DictionnaireDeTextes;
  readonly relevesDeMaelys: DictionnaireDeTextes;
  readonly libellePressions: string;
  readonly libelleMarche: string;
  readonly libelleDevenir: string;
  readonly libelleOrigine: string;
  readonly libelleDestination: string;
  readonly libelleTaille: string;
  readonly libelleEtatDominant: string;
  readonly libelleSpecialite: string;
  readonly libelleMemoire: string;
  readonly libelleIntegration: string;
  readonly libelleDecision: string;
  readonly libellePosition: string;
  readonly libelleReleve: string;
  readonly libelleRevelation: string;
}

export interface TextesDeTrameDeFer {
  readonly titre: string;
  readonly statuts: DictionnaireDeTextes;
  readonly relations: DictionnaireDeTextes;
  readonly eau: DictionnaireDeTextes;
  readonly requisitions: DictionnaireDeTextes;
  readonly engagements: DictionnaireDeTextes;
  readonly voies: DictionnaireDeTextes;
  readonly servicesLourdsRestants: string;
  readonly reserveDeRefroidissementRestante: string;
  readonly occasionTrainOutil: string;
  readonly occasionAttelageFedere: string;
  readonly libelles: {
    readonly eyebrow: string;
    readonly republique: string;
    readonly pressions: string;
    readonly marche: string;
    readonly engagements: string;
    readonly aucunEngagement: string;
    readonly piece: string;
    readonly voieAOuvrir: string;
  };
}

export interface PresentationsPremium {
  readonly hautPuits: Readonly<Record<Langue, TextesDeHautPuits>>;
  readonly veilleBasse: Readonly<Record<Langue, TextesDeVeilleBasse>>;
  readonly trame?: Readonly<Record<Langue, TextesDeTrameDeFer>>;
  readonly deversoir?: Readonly<
    Record<
      Langue,
      {
        readonly nomsDesLieux: DictionnaireDeTextes;
        readonly lieuxTraverses: string;
        readonly lieuxNonRejoints: string;
        readonly aucunLieu: string;
        readonly etatDesColonies: string;
        readonly occasions: string;
        readonly ligneZeroEmportee: string;
        readonly ligneZeroNonEmportee: string;
        readonly projetNonRetenu: string;
        readonly projets: DictionnaireDeTextes;
        readonly statutsDeProjet: DictionnaireDeTextes;
        readonly statutsDeColonie: DictionnaireDeTextes;
        readonly devenirsDeHautPuits: DictionnaireDeTextes;
        readonly devenirsDeHospice: DictionnaireDeTextes;
        readonly destinationsDeCohorte: DictionnaireDeTextes;
        readonly etatsDArchives: DictionnaireDeTextes;
        readonly nomDePlateforme: string;
        readonly servicesDeProjet: DictionnaireDeTextes;
        readonly contraintesDeProjet: DictionnaireDeTextes;
        readonly devenirsDeSites: DictionnaireDeTextes;
      }
    >
  >;
}

let presentationsInstallees: PresentationsPremium | null = null;

function estObjet(valeur: unknown): valeur is Record<string, unknown> {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
}

function estArbreDeTextes(valeur: unknown): boolean {
  if (typeof valeur === "string") {
    return valeur.length > 0;
  }
  return (
    estObjet(valeur) &&
    Object.keys(valeur).length > 0 &&
    Object.values(valeur).every(estArbreDeTextes)
  );
}

export function lirePresentationsPremium(): PresentationsPremium | null {
  return presentationsInstallees;
}

export function installerPresentationsPremium(valeur: unknown): void {
  const catalogue = estObjet(valeur) ? valeur.catalogue : undefined;
  const presentations = estObjet(catalogue)
    ? catalogue.presentations
    : undefined;
  const evenements = estObjet(catalogue) ? catalogue.evenements : undefined;
  const inclutLeDeversoir =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        evenement.id.startsWith("bassins.deversoir."),
    );
  const inclutLaTrame =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        evenement.id.startsWith("trame."),
    );
  const surfacesAttendues = [
    "hautPuits",
    "veilleBasse",
    ...(inclutLeDeversoir ? ["deversoir"] : []),
    ...(inclutLaTrame ? ["trame"] : []),
  ];
  if (
    !estObjet(presentations) ||
    !surfacesAttendues.every((surface) => {
      return (
        estObjet(presentations[surface]) &&
        ["fr", "en"].every((langue) =>
          estArbreDeTextes(
            (presentations[surface] as Record<string, unknown>)[langue],
          ),
        )
      );
    })
  ) {
    throw new Error("presentations-premium-invalides");
  }
  presentationsInstallees = presentations as unknown as PresentationsPremium;
}
