import type { IdentifiantDeStock } from "./pilotage";

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
