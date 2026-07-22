import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDExpedition } from "../application/expeditions";
import type { Langue } from "../content/types";

interface ExpeditionDansAtlasProps {
  readonly application: ApplicationCampagne;
  readonly projection: ProjectionDExpedition;
  readonly langue: Langue;
}

function ListeDeMemoire({
  titre,
  valeurs,
  aucun,
}: {
  readonly titre: string;
  readonly valeurs: readonly string[];
  readonly aucun: string;
}) {
  return (
    <section>
      <h5>{titre}</h5>
      {valeurs.length === 0 ? (
        <p>{aucun}</p>
      ) : (
        <ul>{valeurs.map((valeur) => <li key={valeur}>{valeur}</li>)}</ul>
      )}
    </section>
  );
}

export function ExpeditionDansAtlas({
  application,
  projection,
  langue,
}: ExpeditionDansAtlasProps) {
  const libelles = projection.libelles;
  const titreId = `titre-expedition-${projection.id}`;
  return (
    <section
      className={`expedition-atlas expedition-atlas--${projection.statut}`}
      aria-label={`${libelles.expedition} — ${projection.titre}`}
      lang={langue}
    >
      <header>
        <div>
          <p>{libelles.atelier}</p>
          <h3 id={titreId}>{projection.titre}</h3>
        </div>
        <strong>{projection.statutLibelle}</strong>
      </header>

      {projection.statut === "prete" ? (
        <>
          <section aria-labelledby={`${titreId}-mandat`}>
            <h4 id={`${titreId}-mandat`}>{libelles.mandat}</h4>
            <dl className="expedition-atlas__mandat">
              <div><dt>{libelles.objectif}</dt><dd>{projection.mandat.objectif}</dd></div>
              <div><dt>{libelles.repli}</dt><dd>{projection.mandat.issueDeRepli}</dd></div>
              <div><dt>{libelles.responsable}</dt><dd>{projection.mandat.responsable}</dd></div>
              <div><dt>{libelles.groupe}</dt><dd>{projection.mandat.groupe}</dd></div>
              <div><dt>{libelles.equipement}</dt><dd>{projection.mandat.equipement}</dd></div>
              <div><dt>{libelles.autonomie}</dt><dd>{projection.mandat.enveloppeAutonomie}</dd></div>
              <div><dt>{libelles.seuil}</dt><dd>{projection.mandat.seuilDeRepli}</dd></div>
            </dl>
          </section>

          <section
            className="expedition-atlas__prevision"
            aria-labelledby={`${titreId}-prevision`}
          >
            <h4 id={`${titreId}-prevision`}>{libelles.prevision}</h4>
            <article>
              <h5>{libelles.coutsConnus}</h5>
              <ul>{projection.prevision.coutsConnus.map((cout) => <li key={cout}>{cout}</li>)}</ul>
            </article>
            <article>
              <h5>{libelles.duree}</h5>
              <strong>{projection.prevision.duree.intervalle}</strong>
              <small>{projection.prevision.duree.source} · {projection.prevision.duree.age}</small>
            </article>
            <article>
              <h5>{libelles.gain}</h5>
              <strong>{projection.prevision.gain.intervalle}</strong>
              <small>{projection.prevision.gain.source} · {projection.prevision.gain.age}</small>
            </article>
            <article>
              <h5>{libelles.risque}</h5>
              <strong>{projection.prevision.risque.nom}</strong>
              <small>{libelles.mitigation} : {projection.prevision.risque.mitigation}</small>
              <small>{libelles.pireConsequence} : {projection.prevision.risque.pireConsequence}</small>
            </article>
          </section>
        </>
      ) : null}

      {projection.suivi === null ? null : (
        <section
          className="expedition-atlas__suivi"
          aria-labelledby={`${titreId}-suivi`}
        >
          <h4 id={`${titreId}-suivi`}>{libelles.rapports}</h4>
          <div className="expedition-atlas__mesures">
            <label>
              <span>{projection.suivi.progression}</span>
              <progress
                aria-label={projection.suivi.progression}
                max={100}
                value={projection.suivi.progressionPourcent}
              />
            </label>
            <strong>{projection.suivi.duree}</strong>
            <strong>{projection.suivi.contact}</strong>
          </div>
          <ol>
            {projection.suivi.rapports.map((rapport, index) => (
              <li key={`${rapport.type}-${rapport.moment}-${index}`}>
                <time>{rapport.moment}</time>
                <strong>{rapport.titre}</strong>
                <small>{libelles.cause} : {rapport.cause}</small>
              </li>
            ))}
          </ol>
        </section>
      )}

      {projection.bilan === null ? null : (
        <section
          className="expedition-atlas__bilan"
          aria-labelledby={`${titreId}-bilan`}
        >
          <p>{libelles.bilan}</p>
          <h4 id={`${titreId}-bilan`}>{projection.bilan.titre}</h4>
          <div className="expedition-atlas__comparaison">
            <p><strong>{libelles.duree}</strong><span>{libelles.prevu} : {projection.bilan.duree.prevue}</span><span>{libelles.realise} : {projection.bilan.duree.realisee}</span></p>
            <p><strong>{libelles.gain}</strong><span>{libelles.prevu} : {projection.bilan.gain.prevu}</span><span>{libelles.realise} : {projection.bilan.gain.realise}</span></p>
          </div>
          <p><strong>{libelles.ecart} :</strong> {projection.bilan.causeEcart}</p>
          <div className="expedition-atlas__memoire">
            <ListeDeMemoire titre={libelles.ecartsAutonomes} valeurs={projection.bilan.ecarts} aucun={libelles.aucun} />
            <ListeDeMemoire titre={libelles.coutsConnus} valeurs={projection.bilan.couts} aucun={libelles.aucun} />
            <ListeDeMemoire titre={libelles.ordres} valeurs={projection.bilan.ordres} aucun={libelles.aucun} />
            <ListeDeMemoire titre={libelles.blessures} valeurs={projection.bilan.blessures} aucun={libelles.aucun} />
            <ListeDeMemoire titre={libelles.renseignements} valeurs={projection.bilan.renseignements} aucun={libelles.aucun} />
            <ListeDeMemoire titre={libelles.engagements} valeurs={projection.bilan.engagements} aucun={libelles.aucun} />
            <ListeDeMemoire titre={libelles.cicatrices} valeurs={projection.bilan.cicatrices} aucun={libelles.aucun} />
          </div>
        </section>
      )}

      {projection.actionPrincipale === null ? null : (
        <>
          {projection.refusLancement === null ? null : (
            <p id={`${titreId}-refus-lancement`} role="status">
              {projection.refusLancement}
            </p>
          )}
          <button
            className="expedition-atlas__action"
            type="button"
            disabled={!projection.actionPrincipaleDisponible}
            aria-describedby={
              projection.refusLancement === null
                ? undefined
                : `${titreId}-refus-lancement`
            }
            onClick={() =>
              application.envoyerCommande({
                type: "expedition.lancer",
                expeditionId: projection.id,
              })
            }
          >
            {projection.actionPrincipale}
          </button>
        </>
      )}
    </section>
  );
}
