import {
  useId,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

import type {
  ControleurAccesPremium,
  IntentionCommerciale,
} from "../commercial/controleur";
import type { Langue } from "../content/types";

interface PanneauAccesPremiumProps {
  readonly controleur: ControleurAccesPremium;
  readonly langue: Langue;
  readonly achatDisponible: boolean;
}

const TEXTES = {
  fr: {
    titre: "Accès premium permanent",
    explication:
      "Un compte léger est créé uniquement pour acheter ou restaurer. Votre Campagne reste dans ce navigateur.",
    email: "Adresse email",
    acheter: "Acheter la V1 — 19,99 € TTC",
    restaurer: "Restaurer mon achat",
    lienEnvoye:
      "Lien de connexion envoyé. Il expire dans cinq minutes.",
    ouvrirLienTest: "Ouvrir le lien de test",
    paiementTest:
      "Environnement Paddle de test : choisissez l’issue du paiement.",
    accepter: "Valider le paiement test",
    refuser: "Simuler un paiement refusé",
    attente:
      "Paiement ouvert dans Paddle. L’accès sera accordé après son webhook.",
    actualiser: "Vérifier mon accès",
    actif:
      "Accès premium permanent actif. La même Campagne peut continuer.",
  },
  en: {
    titre: "Permanent Premium Access",
    explication:
      "A lightweight account is created only to buy or restore. Your Campaign stays in this browser.",
    email: "Email address",
    acheter: "Buy V1 — €19.99 incl. tax",
    restaurer: "Restore my purchase",
    lienEnvoye:
      "Sign-in link sent. It expires in five minutes.",
    ouvrirLienTest: "Open the test link",
    paiementTest:
      "Paddle test environment: choose the payment outcome.",
    accepter: "Complete the test payment",
    refuser: "Simulate a declined payment",
    attente:
      "Payment opened in Paddle. Access will be granted after its webhook.",
    actualiser: "Check my access",
    actif:
      "Permanent Premium Access is active. The same Campaign can continue.",
  },
} as const;

export function PanneauAccesPremium({
  controleur,
  langue,
  achatDisponible,
}: PanneauAccesPremiumProps) {
  const textes = TEXTES[langue];
  const identifiantEmail = useId();
  const [email, definirEmail] = useState("");
  const [developpe, definirDeveloppe] = useState(achatDisponible);
  const etat = useSyncExternalStore(
    controleur.sabonner,
    controleur.lireEtat,
    controleur.lireEtat,
  );

  const demanderLien = (
    evenement: FormEvent,
    intention: IntentionCommerciale,
  ) => {
    evenement.preventDefault();
    void controleur.demanderLien(email, intention);
  };

  if (etat.statut === "premium") {
    return (
      <p className="acces-premium__actif" role="status">
        {textes.actif}
      </p>
    );
  }

  if (
    !achatDisponible &&
    !developpe &&
    etat.statut === "demonstration"
  ) {
    return (
      <button
        type="button"
        className="bouton-secondaire"
        onClick={() => definirDeveloppe(true)}
      >
        {textes.restaurer}
      </button>
    );
  }

  return (
    <section
      className="acces-premium"
      aria-labelledby={`${identifiantEmail}-titre`}
      lang={langue}
    >
      <h3 id={`${identifiantEmail}-titre`}>{textes.titre}</h3>
      <p>{textes.explication}</p>

      {etat.statut === "lien-envoye" ? (
        <div>
          <p role="status">{textes.lienEnvoye}</p>
          {etat.jetonDeTestDisponible ? (
            <button
              type="button"
              onClick={() => void controleur.verifierLienDeTest()}
            >
              {textes.ouvrirLienTest}
            </button>
          ) : null}
        </div>
      ) : etat.statut === "paiement-test" ? (
        <div>
          <p role="status">{textes.paiementTest}</p>
          <div className="acces-premium__actions">
            <button
              type="button"
              onClick={() =>
                void controleur.finaliserPaiementDeTest("accepte")
              }
            >
              {textes.accepter}
            </button>
            <button
              type="button"
              className="bouton-secondaire"
              onClick={() =>
                void controleur.finaliserPaiementDeTest("refuse")
              }
            >
              {textes.refuser}
            </button>
          </div>
        </div>
      ) : etat.statut === "attente-paiement" ? (
        <div>
          <p role="status">{textes.attente}</p>
          <button
            type="button"
            onClick={() => void controleur.actualiserAcces()}
          >
            {textes.actualiser}
          </button>
        </div>
      ) : (
        <form
          className="acces-premium__formulaire"
          onSubmit={(evenement) =>
            demanderLien(
              evenement,
              achatDisponible ? "acheter" : "restaurer",
            )
          }
        >
          <label htmlFor={identifiantEmail}>{textes.email}</label>
          <input
            id={identifiantEmail}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(evenement) => definirEmail(evenement.target.value)}
          />
          <div className="acces-premium__actions">
            {achatDisponible ? (
              <button
                type="submit"
              >
                {textes.acheter}
              </button>
            ) : null}
            <button
              type={achatDisponible ? "button" : "submit"}
              className={achatDisponible ? "bouton-secondaire" : undefined}
              onClick={
                achatDisponible
                  ? (evenement) =>
                      demanderLien(evenement, "restaurer")
                  : undefined
              }
            >
              {textes.restaurer}
            </button>
          </div>
          {etat.statut === "erreur" ? (
            <p role="alert">{etat.explication}</p>
          ) : null}
        </form>
      )}
    </section>
  );
}
