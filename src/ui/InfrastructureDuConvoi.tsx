import { useMemo, useState, type FormEvent } from "react";

import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDInfrastructure } from "../application/infrastructure";
import type { Langue } from "../content/types";
import type {
  IdentifiantDInstallation,
  PrioriteDeChantier,
} from "../simulation/infrastructure";

interface PropsInfrastructureDuConvoi {
  readonly application: ApplicationCampagne;
  readonly langue: Langue;
  readonly projection: ProjectionDInfrastructure;
}

type Operation = "construction" | "demontage" | "deplacement";

const LIBELLES = {
  fr: {
    surtitre: "Plateformes & Quartiers",
    titre: "Infrastructure",
    deployer: "Déployer la Halte",
    replier: "Replier la Halte",
    voyage:
      "En voyage — construction, démontage et déplacement exigent un Déploiement de halte.",
    halte: "Halte déployée — les Chantiers structurels sont autorisés.",
    plateformes: "Plateformes",
    installations: "installations",
    libres: "Emplacements libres",
    phare: "Phare",
    libre: "libre",
    fiches: "Fiches des installations",
    etat: "état",
    stocks: "Stocks",
    postes: "Postes",
    chaleur: "Chaleur",
    charge: "Charge",
    entretien: "Entretien",
    operationnelle: "Opérationnelle",
    degradee: "Dégradée",
    horsService: "Hors service",
    quartier: "Quartier mobile",
    ordre: "Ordre structurel",
    operations: {
      construction: "Construction",
      demontage: "Démontage",
      deplacement: "Déplacement",
    },
    installation: "Installation",
    origine: "Origine",
    emplacement: "Emplacement",
    priorite: "Priorité",
    priorites: { basse: "Basse", normale: "Normale", haute: "Haute" },
    engager: "Engager le Chantier",
    engage: "Chantier engagé.",
    actif: "Chantier actif",
    progression: "Progression du Chantier",
    materiaux: "Matériaux",
    restantes: "s restantes",
    refuse: "L’ordre a été refusé.",
    categories: {
      technique: "technique",
      habitable: "habitable",
      polyvalent: "polyvalent",
    },
    etats: {
      operationnelle: "opérationnelle",
      degradee: "dégradée",
      "hors-service": "hors service",
    },
    charges: { faible: "faible", normale: "normale", forte: "forte" },
    entretiens: { faible: "faible", normal: "normal", fort: "fort" },
  },
  en: {
    surtitre: "Platforms & Quarters",
    titre: "Infrastructure",
    deployer: "Deploy the Halt",
    replier: "Pack up the Halt",
    voyage:
      "Travelling — construction, dismantling and moves require a deployed Halt.",
    halte: "Halt deployed — structural Worksites are allowed.",
    plateformes: "Platforms",
    installations: "installations",
    libres: "Free Slots",
    phare: "Lighthouse",
    libre: "free",
    fiches: "Installation sheets",
    etat: "condition",
    stocks: "Stocks",
    postes: "Posts",
    chaleur: "Heat",
    charge: "Load",
    entretien: "Maintenance",
    operationnelle: "Operational",
    degradee: "Degraded",
    horsService: "Out of service",
    quartier: "Mobile Quarter",
    ordre: "Structural order",
    operations: {
      construction: "Construction",
      demontage: "Dismantling",
      deplacement: "Move",
    },
    installation: "Installation",
    origine: "Origin",
    emplacement: "Slot",
    priorite: "Priority",
    priorites: { basse: "Low", normale: "Normal", haute: "High" },
    engager: "Start Worksite",
    engage: "Worksite started.",
    actif: "Active Worksite",
    progression: "Worksite progress",
    materiaux: "Materials",
    restantes: "s remaining",
    refuse: "The order was refused.",
    categories: {
      technique: "technical",
      habitable: "habitable",
      polyvalent: "multipurpose",
    },
    etats: {
      operationnelle: "operational",
      degradee: "degraded",
      "hors-service": "out of service",
    },
    charges: { faible: "low", normale: "normal", forte: "high" },
    entretiens: { faible: "low", normal: "normal", fort: "high" },
  },
} as const;

const ERREURS_ANGLAISES: Readonly<Record<string, string>> = {
  "Il faut suspendre le Temps du convoi avant de déployer la Halte.":
    "Pause Convoy Time before deploying the Halt.",
  "Il faut suspendre le Temps du convoi avant de replier la Halte.":
    "Pause Convoy Time before packing up the Halt.",
  "Le Déploiement de halte reste requis par le Chantier actif.":
    "The active Worksite still requires the Halt to remain deployed.",
  "Un Chantier structurel exige un Déploiement de halte ; le convoi est en voyage.":
    "A structural Worksite requires a deployed Halt; the convoy is travelling.",
  "Un autre Chantier structurel est déjà actif.":
    "Another structural Worksite is already active.",
  "Cet Emplacement est déjà occupé.": "This Slot is already occupied.",
  "Aucune installation ne peut être démontée ici.":
    "There is no installation to dismantle here.",
  "Cette installation assure la dernière fonction vitale de ce type.":
    "This installation provides the last vital function of its kind.",
  "Aucune installation ne peut être déplacée depuis l’origine.":
    "There is no installation to move from the origin.",
  "L’Emplacement de destination est déjà occupé.":
    "The destination Slot is already occupied.",
  "L’Emplacement de destination est incompatible.":
    "The destination Slot is incompatible.",
  "La contrainte de Chaleur empêche ce Chantier.":
    "The Heat constraint prevents this Worksite.",
  "La contrainte de Main-d’œuvre empêche ce Chantier.":
    "The Labour constraint prevents this Worksite.",
  "La contrainte d’Entretien empêche ce Chantier.":
    "The Maintenance constraint prevents this Worksite.",
  "La contrainte de Charge empêche ce Chantier.":
    "The Load constraint prevents this Worksite.",
  "Les Matériaux disponibles ne couvrent pas ce Chantier.":
    "The available Materials do not cover this Worksite.",
  "La contrainte de Charge empêche ce déplacement.":
    "The Load constraint prevents this move.",
  "Les Matériaux disponibles ne couvrent pas ce déplacement.":
    "The available Materials do not cover this move.",
};

function traduireErreur(message: string, langue: Langue): string {
  if (langue === "fr") {
    return message;
  }
  if (message.includes("est incompatible avec cette installation")) {
    return "This Slot is incompatible with the installation.";
  }
  if (message.includes("est inconnu")) {
    return "The selected Slot is unknown.";
  }
  return ERREURS_ANGLAISES[message] ?? "The order was refused.";
}

export function InfrastructureDuConvoi({
  application,
  langue,
  projection,
}: PropsInfrastructureDuConvoi) {
  const libelles = LIBELLES[langue];
  const [operation, definirOperation] = useState<Operation>("construction");
  const [quartierId, definirQuartier] = useState("intendance");
  const [definitionId, definirDefinition] = useState<IdentifiantDInstallation>(
    "condenseur-thermique",
  );
  const [emplacementId, definirEmplacement] = useState("intendance.polyvalent");
  const [origineId, definirOrigine] = useState("intendance.technique");
  const [priorite, definirPriorite] = useState<PrioriteDeChantier>("normale");
  const [erreur, definirErreur] = useState<string | null>(null);

  const installationsDuQuartier = useMemo(
    () =>
      projection.installations.filter(
        (installation) => installation.plateformeId === quartierId,
      ),
    [projection.installations, quartierId],
  );
  const origineSelectionnee = installationsDuQuartier.some(
    (installation) => installation.emplacementId === origineId,
  )
    ? origineId
    : (installationsDuQuartier[0]?.emplacementId ?? origineId);
  const destinations = useMemo(
    () =>
      projection.emplacementsLibres.filter(
        ({ id, plateformeId }) =>
          (operation !== "deplacement" || id !== origineSelectionnee) &&
          plateformeId === quartierId,
      ),
    [
      operation,
      origineSelectionnee,
      projection.emplacementsLibres,
      quartierId,
    ],
  );
  const emplacementSelectionne = destinations.some(
    (destination) => destination.id === emplacementId,
  )
    ? emplacementId
    : (destinations[0]?.id ?? emplacementId);

  const choisirQuartier = (nouveauQuartierId: string) => {
    definirQuartier(nouveauQuartierId);
    const premierEmplacement = projection.emplacementsLibres.find(
      ({ plateformeId }) => plateformeId === nouveauQuartierId,
    );
    const premiereInstallation = projection.installations.find(
      ({ plateformeId }) => plateformeId === nouveauQuartierId,
    );
    if (premierEmplacement !== undefined) {
      definirEmplacement(premierEmplacement.id);
    }
    if (premiereInstallation !== undefined) {
      definirOrigine(premiereInstallation.emplacementId);
    }
  };

  const executer = (action: () => void) => {
    try {
      action();
      definirErreur(null);
    } catch (cause) {
      definirErreur(
        cause instanceof Error
          ? traduireErreur(cause.message, langue)
          : libelles.refuse,
      );
    }
  };

  const basculerHalte = () => {
    executer(() => {
      application.envoyerCommande({
        type:
          projection.deploiement === "voyage"
            ? "halte.deployer"
            : "halte.replier",
      });
    });
  };

  const engager = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    executer(() => {
      if (operation === "construction") {
        application.envoyerCommande({
          type: "chantier.engager",
          ordre: {
            type: "construction",
            definitionId,
            emplacementId: emplacementSelectionne,
          },
          priorite,
        });
      } else if (operation === "demontage") {
        application.envoyerCommande({
          type: "chantier.engager",
          ordre: {
            type: "demontage",
            emplacementId: origineSelectionnee,
          },
          priorite,
        });
      } else {
        application.envoyerCommande({
          type: "chantier.engager",
          ordre: {
            type: "deplacement",
            origineId: origineSelectionnee,
            destinationId: emplacementSelectionne,
          },
          priorite,
        });
      }
    });
  };

  return (
    <section
      className="infrastructure-du-convoi"
      aria-labelledby="titre-infrastructure"
    >
      <header>
        <div>
          <p className="type-d-infrastructure">{libelles.surtitre}</p>
          <h2 id="titre-infrastructure">{libelles.titre}</h2>
        </div>
        <button type="button" onClick={basculerHalte}>
          {projection.deploiement === "voyage"
            ? libelles.deployer
            : libelles.replier}
        </button>
      </header>

      <p className="statut-deploiement">
        {projection.deploiement === "voyage"
          ? libelles.voyage
          : libelles.halte}
      </p>
      {erreur === null ? null : <p role="alert">{erreur}</p>}

      <details>
        <summary>
          {projection.plateformes.length} {libelles.plateformes} ·{" "}
          {projection.installations.length} {libelles.installations} ·{" "}
          {projection.emplacementsLibres.length} {libelles.libres}
        </summary>
        <ul className="liste-plateformes">
          {projection.plateformes.map((plateforme) => (
            <li key={plateforme.id}>
              <strong>{plateforme.nom}</strong>
              <span>
                {plateforme.type === "phare"
                  ? libelles.phare
                  : plateforme.emplacements
                      .map(
                        (emplacement) =>
                          `${libelles.categories[emplacement.categorie]}: ${
                            emplacement.installation ?? libelles.libre
                          }`,
                      )
                      .join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      </details>

      <details>
        <summary>{libelles.fiches}</summary>
        <ul className="fiches-installations">
          {projection.installations.map((installation) => (
            <li key={installation.id}>
              <article>
                <h3>{installation.nom}</h3>
                <p>
                  {installation.plateforme} ·{" "}
                  {libelles.categories[installation.categorie]} ·{" "}
                  {libelles.etat}{" "}
                  {libelles.etats[installation.etatMateriel]}
                </p>
                <p>{installation.service}</p>
                <dl>
                  <div>
                    <dt>{libelles.stocks}</dt>
                    <dd>{installation.transformationsDeStocks.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>{libelles.postes}</dt>
                    <dd>{installation.postesRequis}</dd>
                  </div>
                  <div>
                    <dt>{libelles.chaleur}</dt>
                    <dd>{installation.effetThermique}</dd>
                  </div>
                  <div>
                    <dt>{libelles.charge}</dt>
                    <dd>{libelles.charges[installation.charge]}</dd>
                  </div>
                  <div>
                    <dt>{libelles.entretien}</dt>
                    <dd>{libelles.entretiens[installation.entretien]}</dd>
                  </div>
                </dl>
                <ul>
                  <li>
                    {libelles.operationnelle} :{" "}
                    {installation.consequences.operationnelle}
                  </li>
                  <li>
                    {libelles.degradee} : {installation.consequences.degradee}
                  </li>
                  <li>
                    {libelles.horsService} :{" "}
                    {installation.consequences["hors-service"]}
                  </li>
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </details>

      {projection.chantierActif === null ? (
        <form className="ordre-de-chantier" onSubmit={engager}>
          <label>
            {libelles.quartier}
            <select
              value={quartierId}
              onChange={(event) => choisirQuartier(event.target.value)}
            >
              {projection.plateformes
                .filter((plateforme) => plateforme.type === "standard")
                .map((plateforme) => (
                  <option key={plateforme.id} value={plateforme.id}>
                    {plateforme.nom}
                  </option>
                ))}
            </select>
          </label>
          <fieldset>
            <legend>{libelles.ordre}</legend>
            {(["construction", "demontage", "deplacement"] as const).map(
              (valeur) => (
                <label key={valeur}>
                  <input
                    type="radio"
                    name="operation"
                    value={valeur}
                    checked={operation === valeur}
                    onChange={() => definirOperation(valeur)}
                  />
                  {libelles.operations[valeur]}
                </label>
              ),
            )}
          </fieldset>

          {operation === "construction" ? (
            <label>
              {libelles.installation}
              <select
                value={definitionId}
                onChange={(event) =>
                  definirDefinition(
                    event.target.value as IdentifiantDInstallation,
                  )
                }
              >
                {projection.definitionsConstructibles.map((definition) => (
                  <option key={definition.id} value={definition.id}>
                    {definition.nom}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label>
              {libelles.origine}
              <select
                value={origineSelectionnee}
                onChange={(event) => definirOrigine(event.target.value)}
              >
                {installationsDuQuartier.map((installation) => (
                  <option
                    key={installation.id}
                    value={installation.emplacementId}
                  >
                    {installation.plateforme} — {installation.nom}
                  </option>
                ))}
              </select>
            </label>
          )}

          {operation !== "demontage" ? (
            <label>
              {libelles.emplacement}
              <select
                value={emplacementSelectionne}
                onChange={(event) => definirEmplacement(event.target.value)}
              >
                {destinations.map((emplacement) => (
                  <option key={emplacement.id} value={emplacement.id}>
                    {emplacement.plateforme} —{" "}
                    {libelles.categories[emplacement.categorie]}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label>
            {libelles.priorite}
            <select
              value={priorite}
              onChange={(event) =>
                definirPriorite(event.target.value as PrioriteDeChantier)
              }
            >
              <option value="basse">{libelles.priorites.basse}</option>
              <option value="normale">{libelles.priorites.normale}</option>
              <option value="haute">{libelles.priorites.haute}</option>
            </select>
          </label>
          <button type="submit">{libelles.engager}</button>
        </form>
      ) : (
        <article className="chantier-actif">
          <p className="sr-only" role="status">
            {libelles.engage}
          </p>
          <h3>{libelles.actif}</h3>
          <p>
            {projection.chantierActif.operation} · priorité{" "}
            {projection.chantierActif.priorite}
          </p>
          <progress
            aria-label={libelles.progression}
            value={projection.chantierActif.progressionPourcent}
            max="100"
          >
            {projection.chantierActif.progressionPourcent} %
          </progress>
          <p>
            {projection.chantierActif.progressionPourcent} % ·{" "}
            {libelles.materiaux}{" "}
            {projection.chantierActif.materiauxConsommes}/
            {projection.chantierActif.coutMateriaux} ·{" "}
            {projection.chantierActif.secondesRestantes} {libelles.restantes}
          </p>
        </article>
      )}
    </section>
  );
}
