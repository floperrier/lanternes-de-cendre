import {
  executerCampagneHeadless,
  STRATEGIES_D_EQUILIBRAGE,
} from "../diagnostic/equilibrageCampagne";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type CommandeCampagne,
  type EtatCampagne,
} from "../simulation/campagne";

type ComportementHistoriqueDesCrises =
  | "historiques-v14"
  | "historiques-v15"
  | "historiques-v16";

export function creerCheckpointApresCascadeEvitee(
  graine: string,
  crises: ComportementHistoriqueDesCrises,
): {
  readonly avantFait: EtatCampagne;
  readonly commandeDuFait: CommandeCampagne;
  readonly apresFait: EtatCampagne;
} {
  const strategie = STRATEGIES_D_EQUILIBRAGE.find(
    ({ id }) => id === "prudence-causale",
  );
  if (strategie === undefined) {
    throw new Error("La stratégie de migration de la Trame est absente.");
  }
  const campagne = executerCampagneHeadless({
    graine,
    strategie,
    tracerEmpreintes: true,
  });
  let courant = creerCampagneInitiale(graine);
  let historique = creerCampagneInitiale(graine);

  for (const etape of campagne.commandes) {
    const courantApres = appliquerCommande(courant, etape.commande).etat;
    const historiqueApres = appliquerCommande(
      historique,
      etape.commande,
      { crises },
    ).etat;
    if (
      courantApres.crises.alerte?.id ===
        "trame-fer.cascade-materielle" &&
      courant.crises.alerte?.id !== "trame-fer.cascade-materielle"
    ) {
      if (
        historiqueApres.crises.alerte !== null ||
        historiqueApres.crises.historique.some(
          ({ id }) => id === "veille-basse.accueil-sous-penurie",
        )
      ) {
        throw new Error(
          "Le checkpoint historique ne représente pas une cascade évitée.",
        );
      }
      return {
        avantFait: historique,
        commandeDuFait: etape.commande,
        apresFait: historiqueApres,
      };
    }
    courant = courantApres;
    historique = historiqueApres;
  }
  throw new Error("La campagne de migration n’atteint pas la cascade.");
}
