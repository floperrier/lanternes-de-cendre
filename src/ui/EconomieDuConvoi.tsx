import type { ProjectionDuPilotage } from "../application/pilotage";

interface EconomieDuConvoiProps {
  readonly projection: ProjectionDuPilotage;
}

export function EconomieDuConvoi({ projection }: EconomieDuConvoiProps) {
  return (
    <section className="economie-du-convoi" aria-labelledby="titre-autonomies">
      <h2 id="titre-autonomies">Autonomies</h2>
      <dl className="indicateurs-economiques indicateurs-economiques--stocks">
        {projection.autonomies.map((autonomie) => (
          <div key={autonomie.id}>
            <dt>{autonomie.nom}</dt>
            <dd>{autonomie.valeur}</dd>
          </div>
        ))}
      </dl>

      <h3>Marges</h3>
      <dl className="indicateurs-economiques indicateurs-economiques--capacites">
        {projection.marges.map((marge) => (
          <div key={marge.id}>
            <dt>{marge.nom}</dt>
            <dd>{marge.valeur}</dd>
          </div>
        ))}
      </dl>

      <details className="details-economiques">
        <summary>Quantités, flux et prévision</summary>
        <p>{projection.details.prochainJalon}</p>
        <p>{projection.details.entretien}</p>
        <div className="tableau-economique" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Stock</th>
                <th scope="col">Quantité</th>
                <th scope="col">Flux</th>
                <th scope="col">Au Jalon</th>
              </tr>
            </thead>
            <tbody>
              {projection.details.stocks.map((stock) => {
                const autonomie = projection.autonomies.find(
                  (candidat) => candidat.id === stock.id,
                );
                return (
                  <tr key={stock.id}>
                    <th scope="row">{autonomie?.nom ?? stock.id}</th>
                    <td>{stock.quantite}</td>
                    <td>{stock.flux}</td>
                    <td>{stock.prevision}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="incertitude-sourcee">
          <strong>Incertitude sourcée</strong>
          <span>{projection.details.incertitude.explication}</span>
          <span>
            {projection.details.incertitude.source} · {projection.details.incertitude.age}
          </span>
        </p>
      </details>
    </section>
  );
}
