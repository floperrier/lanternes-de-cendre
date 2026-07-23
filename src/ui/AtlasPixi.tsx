import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  type Spritesheet,
  type Texture,
  type Ticker,
} from "pixi.js";
import { useEffect, useRef } from "react";

import type { ProjectionDeLAtlas, TronconProjete } from "../application/routes";

interface AtlasPixiProps {
  readonly projection: ProjectionDeLAtlas;
}

const SOURCE_CARTE = "/assets/ui/atlas-bassins-fendus.webp";
const SOURCE_FUMEE = "/assets/sprites/cite.fumee-01.json";

const COULEURS = {
  fond: 0x0b151a,
  surface: 0x111f25,
  cuivre: 0xa87843,
  ambre: 0xe09a35,
  texte: 0xfff2d9,
  secondaire: 0xaa9c84,
} as const;

function ajouterTexte(
  conteneur: Container,
  texte: string,
  x: number,
  y: number,
  options: {
    readonly taille?: number;
    readonly couleur?: number;
    readonly largeur?: number;
    readonly graisse?: "400" | "600" | "700";
  } = {},
): Text {
  const libelle = new Text({
    text: texte,
    style: {
      fill: options.couleur ?? COULEURS.texte,
      fontFamily: "Source Sans 3, Segoe UI, sans-serif",
      fontSize: options.taille ?? 13,
      fontWeight: options.graisse ?? "400",
      lineHeight: (options.taille ?? 13) * 1.25,
      wordWrap: options.largeur !== undefined,
      wordWrapWidth: options.largeur,
    },
    resolution: 2,
  });
  libelle.position.set(x, y);
  conteneur.addChild(libelle);
  return libelle;
}

function dessinerTroncon(
  conteneur: Container,
  troncon: TronconProjete,
  x: number,
  y: number,
  largeur: number,
  hauteur: number,
) {
  const carte = new Graphics()
    .roundRect(x, y, largeur, hauteur, 8)
    .fill({ color: COULEURS.surface, alpha: 0.82 })
    .stroke({ color: COULEURS.cuivre, width: 1.2, alpha: 0.9 });
  conteneur.addChild(carte);

  ajouterTexte(conteneur, troncon.libelle, x + 11, y + 8, {
    taille: largeur < 170 ? 13 : 16,
    graisse: "700",
    largeur: largeur - 62,
  });
  ajouterTexte(conteneur, troncon.duree, x + largeur - 48, y + 10, {
    taille: 12,
    couleur: COULEURS.ambre,
    graisse: "600",
  });
  ajouterTexte(conteneur, troncon.connexion, x + 11, y + 33, {
    taille: 11,
    couleur: COULEURS.secondaire,
    largeur: largeur - 22,
  });
  ajouterTexte(conteneur, troncon.consommation, x + 11, y + hauteur - 22, {
    taille: 11,
    couleur: COULEURS.texte,
    graisse: "600",
    largeur: largeur - 22,
  });
}

export function AtlasPixi({ projection }: AtlasPixiProps) {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const projectionRef = useRef(projection);
  const redessinerRef = useRef<(() => void) | null>(null);
  const signatureVisuelle = JSON.stringify({
    position: projection.position,
    troncons: projection.troncons,
  });

  useEffect(() => {
    projectionRef.current = projection;
  }, [projection]);

  useEffect(() => {
    redessinerRef.current?.();
  }, [signatureVisuelle]);

  useEffect(() => {
    const conteneur = conteneurRef.current;
    const application = new Application();
    let annule = false;
    let initialisee = false;
    let detruite = false;
    let scene: Container | null = null;
    let textureCarte: Texture | null = null;
    let plancheFumee: Spritesheet | null = null;
    let balisesAnimees: Graphics[] = [];
    let fumeeAnimee: AnimatedSprite | null = null;
    let observateur: ResizeObserver | null = null;
    let redimensionnementProgramme: number | null = null;
    const mouvementReduit = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const detruireApplication = () => {
      if (initialisee && !detruite) {
        detruite = true;
        application.destroy({ removeView: true }, { children: true });
      }
    };

    const dessiner = () => {
      if (!initialisee || annule || detruite) {
        return;
      }
      if (application.screen.width <= 0 || application.screen.height <= 0) {
        return;
      }
      if (scene !== null) {
        application.stage.removeChild(scene);
        scene.destroy({ children: true });
      }
      scene = new Container();
      balisesAnimees = [];
      fumeeAnimee = null;
      application.stage.addChild(scene);

      const donnees = projectionRef.current;
      const largeur = application.screen.width;
      const hauteur = application.screen.height;
      scene.addChild(
        new Graphics().rect(0, 0, largeur, hauteur).fill(COULEURS.fond),
      );
      if (textureCarte !== null) {
        const carteDuMonde = new Sprite(textureCarte);
        carteDuMonde.anchor.set(0.5);
        carteDuMonde.position.set(largeur / 2, hauteur / 2);
        carteDuMonde.scale.set(
          Math.max(largeur / textureCarte.width, hauteur / textureCarte.height),
        );
        carteDuMonde.alpha = 0.88;
        scene.addChild(carteDuMonde);
        scene.addChild(
          new Graphics()
            .rect(0, 0, largeur, hauteur)
            .fill({ color: COULEURS.fond, alpha: 0.22 }),
        );
      }

      const pointCentralX = largeur * 0.5;
      const pointCentralY = hauteur * 0.39;
      const baliseCentrale = new Graphics()
        .circle(0, 0, 18)
        .stroke({ color: COULEURS.ambre, width: 1.3, alpha: 0.68 })
        .circle(0, 0, 7)
        .fill({ color: COULEURS.ambre, alpha: 0.88 })
        .circle(0, 0, 2.5)
        .fill(COULEURS.texte);
      baliseCentrale.position.set(pointCentralX, pointCentralY);
      balisesAnimees.push(baliseCentrale);
      scene.addChild(baliseCentrale);

      const texturesFumee = plancheFumee?.animations["cite.fumee-01"];
      if (texturesFumee !== undefined && texturesFumee.length > 0) {
        fumeeAnimee = new AnimatedSprite(texturesFumee);
        fumeeAnimee.anchor.set(0.5, 1);
        fumeeAnimee.position.set(largeur * 0.78, hauteur * 0.43);
        fumeeAnimee.scale.set(Math.max(0.22, Math.min(0.38, largeur / 1_800)));
        fumeeAnimee.alpha = 0.86;
        fumeeAnimee.animationSpeed = 0.1;
        if (!mouvementReduit) {
          fumeeAnimee.play();
        }
        scene.addChild(fumeeAnimee);
      }

      ajouterTexte(
        scene,
        `${donnees.libellePosition} · ${donnees.position}`,
        16,
        11,
        { taille: 14, graisse: "700", couleur: COULEURS.ambre },
      );

      if (donnees.troncons.length === 0) {
        application.renderer.render(application.stage);
        return;
      }
      const marge = 14;
      const largeurCarte = Math.min(
        270,
        Math.max(126, (largeur - marge * 3) / 2),
      );
      const hauteurCarte = Math.min(94, Math.max(82, hauteur * 0.25));
      const y = hauteur - hauteurCarte - 14;
      for (const index of donnees.troncons.keys()) {
        const destinationX = index % 2 === 0 ? largeur * 0.25 : largeur * 0.78;
        const destinationY = hauteur * (index % 2 === 0 ? 0.27 : 0.43);
        const liaison = new Graphics()
          .moveTo(pointCentralX, pointCentralY)
          .lineTo(destinationX, destinationY)
          .stroke({ color: COULEURS.ambre, width: 1.7, alpha: 0.64 });
        scene!.addChild(liaison);
        const destination = new Graphics()
          .circle(0, 0, 10)
          .stroke({ color: COULEURS.ambre, width: 1.2, alpha: 0.74 })
          .circle(0, 0, 3.5)
          .fill({ color: COULEURS.texte, alpha: 0.92 });
        destination.position.set(destinationX, destinationY);
        balisesAnimees.push(destination);
        scene!.addChild(destination);
      }
      donnees.troncons.forEach((troncon, index) => {
        const x = index % 2 === 0 ? marge : largeur - largeurCarte - marge;
        const yCarte = y - Math.floor(index / 2) * (hauteurCarte + 8);
        dessinerTroncon(scene!, troncon, x, yCarte, largeurCarte, hauteurCarte);
      });
      application.renderer.render(application.stage);
    };
    redessinerRef.current = dessiner;

    async function monterAtlas() {
      if (conteneur === null) {
        return;
      }
      await application.init({
        autoDensity: true,
        autoStart: !mouvementReduit,
        background: "#0b151a",
        resolution: Math.min(window.devicePixelRatio, 2),
        width: Math.max(1, conteneur.clientWidth),
        height: Math.max(1, conteneur.clientHeight),
      });
      initialisee = true;
      if (annule) {
        detruireApplication();
        return;
      }
      application.canvas.setAttribute("aria-hidden", "true");
      application.canvas.style.width = "100%";
      application.canvas.style.height = "100%";
      conteneur.append(application.canvas);
      [textureCarte, plancheFumee] = await Promise.all([
        Assets.load<Texture>(SOURCE_CARTE),
        Assets.load<Spritesheet>(SOURCE_FUMEE),
      ]);
      if (annule) {
        detruireApplication();
        return;
      }
      dessiner();
      conteneur.dataset.ready = "true";

      const animerAtlas = (ticker: Ticker) => {
        const pulsation = Math.sin(ticker.lastTime / 750);
        balisesAnimees.forEach((balise, index) => {
          const amplitude = 1 + pulsation * (index === 0 ? 0.08 : 0.045);
          balise.scale.set(amplitude);
          balise.alpha = 0.78 + pulsation * 0.14;
        });
        if (fumeeAnimee !== null) {
          fumeeAnimee.rotation = Math.sin(ticker.lastTime / 2_400) * 0.008;
        }
      };
      if (mouvementReduit) {
        application.ticker.stop();
      } else {
        application.ticker.add(animerAtlas);
      }

      observateur = new ResizeObserver(() => {
        if (redimensionnementProgramme === null) {
          redimensionnementProgramme = window.requestAnimationFrame(() => {
            redimensionnementProgramme = null;
            if (annule || detruite) {
              return;
            }
            const largeur = conteneur.clientWidth;
            const hauteur = conteneur.clientHeight;
            if (
              largeur > 0 &&
              hauteur > 0 &&
              (largeur !== application.screen.width ||
                hauteur !== application.screen.height)
            ) {
              application.renderer.resize(largeur, hauteur);
              application.canvas.style.width = "100%";
              application.canvas.style.height = "100%";
              dessiner();
            }
          });
        }
      });
      observateur.observe(conteneur);
    }

    void monterAtlas();
    return () => {
      annule = true;
      redessinerRef.current = null;
      observateur?.disconnect();
      if (redimensionnementProgramme !== null) {
        window.cancelAnimationFrame(redimensionnementProgramme);
      }
      if (conteneur !== null) {
        delete conteneur.dataset.ready;
      }
      detruireApplication();
    };
  }, []);

  return (
    <div
      ref={conteneurRef}
      className="atlas-pixi"
      data-testid="atlas-pixi"
      aria-hidden="true"
    />
  );
}
