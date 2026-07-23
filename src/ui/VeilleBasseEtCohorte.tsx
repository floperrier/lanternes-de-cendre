import type { ProjectionDeVeilleBasse } from "../application/veilleBasse";
import type { Langue } from "../content/types";

interface PropsVeilleBasseEtCohorte {
  readonly projection: ProjectionDeVeilleBasse;
  readonly langue: Langue;
}

export function VeilleBasseEtCohorte({
  projection,
  langue,
}: PropsVeilleBasseEtCohorte) {
  return (
    <section
      className="panneau-veille-basse"
      aria-labelledby="titre-veille-basse"
      lang={langue}
    >
      <h2 id="titre-veille-basse">{projection.titre}</h2>

      <article>
        <h3>{projection.colonie.nom}</h3>
        <p>
          <strong>{projection.colonie.type}</strong> —{" "}
          {projection.colonie.statut}
        </p>
        {projection.colonie.avertissement === null ? null : (
          <p role="alert">{projection.colonie.avertissement}</p>
        )}
        <h4>{langue === "fr" ? "Pressions" : "Pressures"}</h4>
        <ul>
          {projection.colonie.pressions.map((pression) => (
            <li key={pression}>{pression}</li>
          ))}
        </ul>
        <h4>{langue === "fr" ? "Marché de besoins" : "Needs market"}</h4>
        <ul>
          {projection.colonie.marche.map((offre) => (
            <li key={offre}>{offre}</li>
          ))}
        </ul>
        <p>{projection.colonie.archives}</p>
        <p>{projection.colonie.techniciens}</p>
      </article>

      <article>
        <h3>{projection.hospice.nom}</h3>
        <dl>
          <dt>{projection.hospice.type}</dt>
          <dd>{projection.hospice.besoin}</dd>
          <dt>{langue === "fr" ? "Devenir" : "Fate"}</dt>
          <dd>{projection.hospice.devenir}</dd>
        </dl>
      </article>

      <article>
        <h3>{projection.cohorte.nom}</h3>
        <dl>
          <dt>{langue === "fr" ? "Origine" : "Origin"}</dt>
          <dd>{projection.cohorte.origine}</dd>
          <dt>{langue === "fr" ? "Destination" : "Destination"}</dt>
          <dd>{projection.cohorte.destination}</dd>
          <dt>{langue === "fr" ? "Taille" : "Size"}</dt>
          <dd>{projection.cohorte.taille}</dd>
          <dt>{langue === "fr" ? "État dominant" : "Dominant condition"}</dt>
          <dd>{projection.cohorte.etatDominant}</dd>
          <dt>{langue === "fr" ? "Spécialité" : "Specialty"}</dt>
          <dd>{projection.cohorte.specialite}</dd>
          <dt>{langue === "fr" ? "Mémoire" : "Memory"}</dt>
          <dd>{projection.cohorte.memoire}</dd>
          <dt>{langue === "fr" ? "Intégration" : "Integration"}</dt>
          <dd>{projection.cohorte.integration}</dd>
        </dl>
      </article>

      <article>
        <h3>{projection.maelys.nom}</h3>
        <dl>
          <dt>{langue === "fr" ? "Décision" : "Decision"}</dt>
          <dd>{projection.maelys.decision}</dd>
          <dt>{langue === "fr" ? "Position" : "Location"}</dt>
          <dd>{projection.maelys.position}</dd>
          <dt>{langue === "fr" ? "Relevé" : "Survey"}</dt>
          <dd>{projection.maelys.releve}</dd>
        </dl>
      </article>

      {projection.revelationsEssentielles.length === 0 ? null : (
        <aside>
          <h3>
            {langue === "fr"
              ? "Révélation essentielle"
              : "Essential revelation"}
          </h3>
          <ul>
            {projection.revelationsEssentielles.map((revelation) => (
              <li key={revelation}>{revelation}</li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  );
}
