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
  if (!projection.visible) {
    return null;
  }
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
        <h4>{projection.libelles.pressions}</h4>
        <ul>
          {projection.colonie.pressions.map((pression) => (
            <li key={pression}>{pression}</li>
          ))}
        </ul>
        <h4>{projection.libelles.marche}</h4>
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
          <dt>{projection.libelles.devenir}</dt>
          <dd>{projection.hospice.devenir}</dd>
        </dl>
      </article>

      <article>
        <h3>{projection.cohorte.nom}</h3>
        <dl>
          <dt>{projection.libelles.origine}</dt>
          <dd>{projection.cohorte.origine}</dd>
          <dt>{projection.libelles.destination}</dt>
          <dd>{projection.cohorte.destination}</dd>
          <dt>{projection.libelles.taille}</dt>
          <dd>{projection.cohorte.taille}</dd>
          <dt>{projection.libelles.etatDominant}</dt>
          <dd>{projection.cohorte.etatDominant}</dd>
          <dt>{projection.libelles.specialite}</dt>
          <dd>{projection.cohorte.specialite}</dd>
          <dt>{projection.libelles.memoire}</dt>
          <dd>{projection.cohorte.memoire}</dd>
          <dt>{projection.libelles.integration}</dt>
          <dd>{projection.cohorte.integration}</dd>
        </dl>
      </article>

      <article>
        <h3>{projection.maelys.nom}</h3>
        <dl>
          <dt>{projection.libelles.decision}</dt>
          <dd>{projection.maelys.decision}</dd>
          <dt>{projection.libelles.position}</dt>
          <dd>{projection.maelys.position}</dd>
          <dt>{projection.libelles.releve}</dt>
          <dd>{projection.maelys.releve}</dd>
        </dl>
      </article>

      {projection.revelationsEssentielles.length === 0 ? null : (
        <aside>
          <h3>{projection.libelles.revelation}</h3>
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
