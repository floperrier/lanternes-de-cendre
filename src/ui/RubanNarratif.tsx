import type {
  ApplicationCampagne,
  ProjectionEvenementNarratif,
} from "../application/application";
import type { Langue } from "../content/types";

interface RubanNarratifProps {
  readonly application: ApplicationCampagne;
  readonly evenement: ProjectionEvenementNarratif;
  readonly langue: Langue;
}

export function RubanNarratif({
  application,
  evenement,
  langue,
}: RubanNarratifProps) {
  const titreId = `titre-${evenement.id}`;

  return (
    <section
      className={`ruban-narratif${evenement.asset === null ? " ruban-narratif--sans-asset" : ""}`}
      aria-labelledby={titreId}
      lang={langue}
    >
      {evenement.asset === null ? null : (
        <figure>
          <img
            src={evenement.asset.fichier}
            alt={evenement.asset.alternative}
          />
        </figure>
      )}

      <div className="ruban-narratif__contenu">
        <p className="ruban-narratif__origine">{evenement.origine}</p>
        <h2 id={titreId}>{evenement.titre}</h2>
        <p>{evenement.presentation}</p>
        <p className="ruban-narratif__variante">{evenement.variante}</p>
        <ul className="ruban-narratif__informations">
          {evenement.informations.map((information) => (
            <li key={information}>{information}</li>
          ))}
        </ul>

        <div
          className="ruban-narratif__choix"
          role="group"
          aria-label={evenement.libelleIntentions}
        >
          {evenement.choix.map((choix) => (
            <button
              key={choix.id}
              type="button"
              disabled={choix.disponible === false}
              onClick={() =>
                application.envoyerCommande({
                  type: "evenement-narratif.choisir",
                  evenementId: evenement.id,
                  choixId: choix.id,
                })
              }
            >
              <span>{choix.intention}</span>
              {choix.coutsConnus.map((cout) => (
                <small key={cout}>{cout}</small>
              ))}
              {choix.indisponibilite === undefined ? null : (
                <small>{choix.indisponibilite}</small>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
