import type { ApplicationCampagne } from "../application/application";
import type { ProjectionDuCompagnon } from "../application/conseil";
import type { Langue } from "../content/types";

interface PanneauCompagnonProps {
  readonly application: ApplicationCampagne;
  readonly compagnon: ProjectionDuCompagnon;
  readonly langue: Langue;
}

export function PanneauCompagnon({
  application,
  compagnon,
  langue,
}: PanneauCompagnonProps) {
  const titreId = `compagnon-${compagnon.id}`;
  const libelles = compagnon.libelles;

  return (
    <section
      className="panneau-compagnon"
      aria-labelledby={titreId}
      lang={langue}
    >
      <p className="panneau-compagnon__type">{libelles.type}</p>
      <h2 id={titreId}>{libelles.type} — {compagnon.nom}</h2>
      <dl className="profil-compagnon">
        <div>
          <dt>{libelles.majeure}</dt>
          <dd>{compagnon.competenceMajeure}</dd>
        </div>
        <div>
          <dt>{libelles.secondaire}</dt>
          <dd>{compagnon.competenceSecondaire}</dd>
        </div>
        <div>
          <dt>{libelles.trait}</dt>
          <dd>
            <strong>{compagnon.trait.nom}</strong>
            <span>{compagnon.trait.ambivalence}</span>
          </dd>
        </div>
        <div>
          <dt>{libelles.conviction}</dt>
          <dd>{compagnon.conviction}</dd>
        </div>
        <div>
          <dt>{libelles.projet}</dt>
          <dd>{compagnon.projet}</dd>
        </div>
        <div>
          <dt>{libelles.etat}</dt>
          <dd>
            <strong>{compagnon.etatPersonnel.nom}</strong>
            <span>{compagnon.etatPersonnel.contrainte}</span>
            <span>{libelles.soin} — {compagnon.etatPersonnel.voieDeSoin}</span>
          </dd>
        </div>
      </dl>

      {compagnon.affectation === null ? (
        <button
          type="button"
          onClick={() =>
            application.envoyerCommande({
              type: "compagnon.affecter",
              compagnonId: compagnon.id,
              quartierId: compagnon.quartierDAffectationId,
            })
          }
        >
          {libelles.affecter}
        </button>
      ) : (
        <div className="affectation-compagnon" role="status">
          <p>{libelles.affectee} — {compagnon.affectation.quartier}</p>
          <p>
            <strong>{libelles.information}</strong> — {" "}
            {compagnon.affectation.informationOuverte}
          </p>
        </div>
      )}
    </section>
  );
}
