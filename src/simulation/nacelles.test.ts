import { describe, expect, it } from "vitest";

import { creerEtatDeHautPuitsInitial } from "./hautPuits";
import {
  calculerOffreDesNacelles,
  routeAvalDesBassinsEstPreparee,
  type ContexteDesNacelles,
} from "./nacelles";
import { creerEtatInitialDeVeilleBasse } from "./veilleBasse";

function creerContexte(
  changements: Partial<ContexteDesNacelles> = {},
): ContexteDesNacelles {
  return {
    position: "les-vanniers",
    hautPuits: creerEtatDeHautPuitsInitial(),
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    faits: [],
    ...changements,
  };
}

describe("liaison coûteuse des Nacelles", () => {
  it("verrouille les départs de branche mais laisse le chenal historique récupérable", () => {
    expect(
      routeAvalDesBassinsEstPreparee(
        "chemin-des-vanniers",
        null,
        [],
      ),
    ).toBe(false);
    expect(
      routeAvalDesBassinsEstPreparee(
        "chemin-des-vanniers",
        "bassins.haut-puits.ilyana-et-la-vanne",
        ["bassins.haut-puits.ilyana-garante"],
      ),
    ).toBe(false);
    expect(
      routeAvalDesBassinsEstPreparee(
        "chemin-des-vanniers",
        null,
        ["bassins.haut-puits.ilyana-garante"],
      ),
    ).toBe(true);
    expect(
      routeAvalDesBassinsEstPreparee(
        "nacelles-de-veille-basse",
        null,
        ["veille-basse.intervention-refusee"],
      ),
    ).toBe(true);
    expect(
      routeAvalDesBassinsEstPreparee("chenal-des-vannes", null, []),
    ).toBe(true);
  });

  it("garde la Ligne Zéro utile mais non obligatoire quand sa conduite est préservée", () => {
    const passagePrepare = ["bassins.deversoir.passage-prepare"];

    expect(
      routeAvalDesBassinsEstPreparee(
        "passage-de-la-ligne-zero",
        null,
        [
          ...passagePrepare,
          "bassins.deversoir.ligne-zero-preservee",
        ],
      ),
    ).toBe(false);
    expect(
      routeAvalDesBassinsEstPreparee(
        "piste-des-levees",
        null,
        [
          ...passagePrepare,
          "bassins.deversoir.ligne-zero-preservee",
        ],
      ),
    ).toBe(true);
    expect(
      routeAvalDesBassinsEstPreparee(
        "passage-de-la-ligne-zero",
        null,
        [
          ...passagePrepare,
          "bassins.deversoir.ligne-zero-relevee",
        ],
      ),
    ).toBe(true);
  });

  it("fait coopérer les deux branches pour réduire le coût et confirmer le Renseignement", () => {
    const hautPuits = {
      ...creerEtatDeHautPuitsInitial(),
      relationPublique: "cooperative" as const,
    };
    const veilleInitiale = creerEtatInitialDeVeilleBasse();
    const veilleBasse = {
      ...veilleInitiale,
      colonie: { ...veilleInitiale.colonie, statut: "stable" as const },
      cohorte: {
        ...veilleInitiale.cohorte,
        memoire: "aidee" as const,
      },
    };

    expect(
      calculerOffreDesNacelles(
        creerContexte({
          hautPuits,
          veilleBasse,
          faits: ["bassins.haut-puits.panache-confine"],
        }),
      ),
    ).toEqual({
      tronconId: "chenal-des-vannes",
      branche: "haut-puits",
      destination: "relais-des-vannes",
      consommations: { combustible: 2, eau: 5 },
      factions: {
        puitsLibres: "cooperatifs",
        pelerinsDeCendre: "cooperatifs",
      },
      renseignementId: "nacelles-accord-des-bassins",
      options: [
        "treuil-principal",
        "contrepoids-de-la-cohorte",
        "accord-des-factions",
      ],
      facteurs: [
        "haut-puits-cooperatif",
        "veille-basse-stable",
        "cohorte-aidee",
        "panache-confine",
        "factions-cooperatives",
      ],
    });
  });

  it("rend chaque dette causale lorsque les Colonies, la Cohorte, le panache et les Factions se ferment", () => {
    const hautPuits = {
      ...creerEtatDeHautPuitsInitial(),
      relationPublique: "fermee" as const,
    };
    const veilleInitiale = creerEtatInitialDeVeilleBasse();
    const veilleBasse = {
      ...veilleInitiale,
      colonie: { ...veilleInitiale.colonie, statut: "perdue" as const },
      cohorte: {
        ...veilleInitiale.cohorte,
        memoire: "refusee" as const,
      },
    };

    expect(
      calculerOffreDesNacelles(
        creerContexte({
          hautPuits,
          veilleBasse,
          faits: ["bassins.haut-puits.panache-derive"],
        }),
      ),
    ).toEqual({
      tronconId: "chenal-des-vannes",
      branche: "haut-puits",
      destination: "relais-des-vannes",
      consommations: { combustible: 6, eau: 11 },
      factions: {
        puitsLibres: "hostiles",
        pelerinsDeCendre: "hostiles",
      },
      renseignementId: "nacelles-passage-conteste",
      options: ["treuil-principal"],
      facteurs: [
        "haut-puits-ferme",
        "veille-basse-perdue",
        "cohorte-refusee",
        "panache-derive",
        "factions-hostiles",
      ],
    });
  });

  it("propose une branche basse distincte seulement avant le dépassement", () => {
    expect(
      calculerOffreDesNacelles(
        creerContexte({ position: "veille-basse" }),
      ),
    ).toMatchObject({
      tronconId: "nacelles-de-veille-basse",
      branche: "veille-basse",
      destination: "haut-puits",
    });
    expect(
      calculerOffreDesNacelles(
        creerContexte({ position: "relais-des-vannes" }),
      ),
    ).toBeNull();
  });
});
