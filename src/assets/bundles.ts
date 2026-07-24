import type { IdentifiantDeLieu } from "../simulation/routes";
import {
  determinerBundleRegional,
  listerAssetsDuBundle,
  type IdentifiantDeBundle,
  type IdentifiantDeBundleRegional,
} from "./catalogueBundles";

export * from "./catalogueBundles";

const BUNDLE_SUIVANT: Readonly<
  Partial<Record<IdentifiantDeBundleRegional, IdentifiantDeBundleRegional>>
> = {
  bassins: "trame",
  trame: "couronne",
  couronne: "finale",
};

interface ImagePrechargee {
  src: string;
}

type FabriqueDImage = () => ImagePrechargee & {
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  decode?: () => Promise<void>;
};

type Planificateur = (action: () => void) => number;
type Annulateur = (identifiant: number) => void;

function creerPlanificateur(): {
  readonly planifier: Planificateur;
  readonly annuler: Annulateur;
} {
  if (
    typeof window !== "undefined" &&
    "requestIdleCallback" in window &&
    "cancelIdleCallback" in window
  ) {
    return {
      planifier: (action) =>
        window.requestIdleCallback(() => action(), { timeout: 1_500 }),
      annuler: (identifiant) => window.cancelIdleCallback(identifiant),
    };
  }
  return {
    planifier: (action) =>
      globalThis.setTimeout(action, 0) as unknown as number,
    annuler: (identifiant) => globalThis.clearTimeout(identifiant),
  };
}

export class GestionnaireDeBundlesCampagne {
  readonly #imagesParBundle = new Map<
    IdentifiantDeBundle,
    ImagePrechargee[]
  >();
  readonly #signaturesParBundle = new Map<IdentifiantDeBundle, string>();
  readonly #creerImage: FabriqueDImage;
  readonly #planifier: Planificateur;
  readonly #annuler: Annulateur;
  #planification: number | null = null;
  #generation = 0;

  constructor(
    creerImage: FabriqueDImage = () => new Image(),
    planification = creerPlanificateur(),
  ) {
    this.#creerImage = creerImage;
    this.#planifier = planification.planifier;
    this.#annuler = planification.annuler;
  }

  synchroniser(
    position: IdentifiantDeLieu,
    accesPremium: boolean,
  ): void {
    const courant = determinerBundleRegional(position);
    const prochain = BUNDLE_SUIVANT[courant];
    const desires = new Set<IdentifiantDeBundle>(["commun", courant]);
    if (accesPremium && prochain !== undefined) {
      desires.add(prochain);
    }
    for (const id of this.#imagesParBundle.keys()) {
      if (!desires.has(id)) {
        this.#decharger(id);
      }
    }
    if (this.#planification !== null) {
      this.#annuler(this.#planification);
    }
    const generation = ++this.#generation;
    this.#planification = this.#planifier(() => {
      this.#planification = null;
      if (generation !== this.#generation) {
        return;
      }
      for (const id of desires) {
        this.#precharger(id);
      }
      this.#publierEtat();
    });
  }

  arreter(): void {
    this.#generation += 1;
    if (this.#planification !== null) {
      this.#annuler(this.#planification);
      this.#planification = null;
    }
    for (const id of [...this.#imagesParBundle.keys()]) {
      this.#decharger(id);
    }
    this.#publierEtat();
  }

  #precharger(id: IdentifiantDeBundle): void {
    const sources = listerAssetsDuBundle(id).filter(
      (source) => !source.endsWith(".json"),
    );
    const signature = sources.join("\n");
    if (this.#signaturesParBundle.get(id) === signature) {
      return;
    }
    if (this.#imagesParBundle.has(id)) {
      this.#decharger(id);
    }
    const images = sources.map((source) => {
      const image = this.#creerImage();
      image.decoding = "async";
      image.fetchPriority = "low";
      image.src = source;
      void image.decode?.().catch(() => undefined);
      return image;
    });
    this.#imagesParBundle.set(id, images);
    this.#signaturesParBundle.set(id, signature);
  }

  #decharger(id: IdentifiantDeBundle): void {
    for (const image of this.#imagesParBundle.get(id) ?? []) {
      image.src = "";
    }
    this.#imagesParBundle.delete(id);
    this.#signaturesParBundle.delete(id);
  }

  #publierEtat(): void {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.dataset.bundlesPrecharges = [
      ...this.#imagesParBundle.keys(),
    ]
      .sort()
      .join(",");
  }
}

export const gestionnaireDeBundlesCampagne =
  new GestionnaireDeBundlesCampagne();
