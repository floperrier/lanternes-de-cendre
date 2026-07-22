import type {
  CommandeCampagne,
  EtatCampagne,
  GraineDeCampagne,
} from "../simulation/campagne";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";

export {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_COURANTE,
} from "./version";

export interface CommandeDeReproduction {
  readonly sequence: number;
  readonly commande: CommandeCampagne;
  readonly empreinteApres: string;
}

export interface ReproductionDeCampagne {
  readonly snapshot: EtatCampagne;
  readonly empreinteSnapshot: string;
  readonly commandes: readonly CommandeDeReproduction[];
}

export interface SauvegardeCampagne {
  readonly format: typeof FORMAT_SAUVEGARDE;
  readonly id: string;
  readonly version: typeof VERSION_SAUVEGARDE_COURANTE;
  readonly versions: typeof VERSIONS_DU_SNAPSHOT_COURANT;
  readonly graine: GraineDeCampagne;
  readonly horloge: {
    readonly secondes: number;
  };
  readonly etat: EtatCampagne;
  readonly reproduction: ReproductionDeCampagne;
  readonly empreinte: string;
}

export type ResultatReplay =
  | {
      readonly statut: "termine";
      readonly etat: EtatCampagne;
      readonly empreinte: string;
    }
  | {
      readonly statut: "divergence-snapshot";
      readonly empreinteAttendue: string;
      readonly empreinteObtenue: string;
    }
  | {
      readonly statut: "divergence";
      readonly indexCommande: number;
      readonly sequence: number;
      readonly commande: CommandeCampagne;
      readonly empreinteAttendue: string;
      readonly empreinteObtenue: string;
      readonly erreur?: string;
    };

export type ResultatImportSauvegarde =
  | {
      readonly statut: "compatible";
      readonly sauvegarde: SauvegardeCampagne;
    }
  | {
      readonly statut: "migree";
      readonly sauvegarde: SauvegardeCampagne;
      readonly archiveOriginale: string;
    }
  | {
      readonly statut: "incompatible";
      readonly id: string;
      readonly version: number;
      readonly archiveOriginale: string;
      readonly explication: string;
    }
  | {
      readonly statut: "invalide";
      readonly archiveOriginale: string;
      readonly explication: string;
    };
