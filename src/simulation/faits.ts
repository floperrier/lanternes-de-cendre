import type { IdentifiantDeStock } from "./pilotage";
import type { IdentifiantDePlateformeMobile } from "./infrastructure";

export const IDENTIFIANTS_DE_FAITS_D_INCIDENT = [
  "incident.purification.pompe-instable.securisee",
  "incident.purification.pompe-instable.circuit-isole",
  "incident.purification.pompe-instable.debit-maintenu",
] as const;

export type EffetMaterielDeFait =
  | {
      readonly type: "stock.modifie";
      readonly stock: IdentifiantDeStock;
      readonly variation: number;
    }
  | {
      readonly type: "installation.etat-modifie";
      readonly installation: "pompe-purification";
      readonly etat: "securisee" | "stabilisee" | "degradee";
    }
  | {
      readonly type: "plateforme.detachee";
      readonly plateforme: IdentifiantDePlateformeMobile;
    };

export type EffetHumainDeFait =
  | {
      readonly type: "habitants.modifies";
      readonly variation: number;
    }
  | {
      readonly type: "habitants.exposes";
      readonly nombre: number;
    }
  | {
      readonly type: "habitants.sous-surveillance";
      readonly nombre: number;
    };

export interface EffetsDeFait {
  readonly materiels: readonly EffetMaterielDeFait[];
  readonly humains: readonly EffetHumainDeFait[];
}

export interface FaitDeCampagne {
  readonly id: string;
  readonly cause: string;
  readonly acteurs: readonly string[];
  readonly cible: string;
  readonly moment: number;
  readonly effets: EffetsDeFait;
}

const FAITS_D_INCIDENT = new Set<string>(IDENTIFIANTS_DE_FAITS_D_INCIDENT);

export function estFaitDIncidentOuDeCrise(fait: FaitDeCampagne): boolean {
  return FAITS_D_INCIDENT.has(fait.id) || fait.id.startsWith("crise.");
}
