import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  type Texture,
  type Ticker,
} from "pixi.js";
import { useEffect, useRef } from "react";

import type { VitesseDuConvoi } from "../simulation/campagne";

const SOURCE_COUPE_HABITEE = "/assets/cite-caravane.png";

interface PropsCoupeHabitee {
  readonly implantation: string;
  readonly chantierActif: boolean;
  readonly vitesse: VitesseDuConvoi;
}

function decoderImplantation(implantation: string) {
  return implantation.split("|").map((entree) => {
    const [id, emplacements = ""] = entree.split(":");
    return { id, emplacements: [...emplacements] };
  });
}

export function CoupeHabitee({
  implantation,
  chantierActif,
  vitesse,
}: PropsCoupeHabitee) {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const nombreInstallations = decoderImplantation(implantation).reduce(
    (total, plateforme) =>
      total + plateforme.emplacements.filter((etat) => etat === "1").length,
    0,
  );

  useEffect(() => {
    const plateformes = decoderImplantation(implantation);
    const conteneur = conteneurRef.current;
    const application = new Application();
    const mouvementReduit = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let annule = false;
    let initialisee = false;
    let detruite = false;
    let observateur: ResizeObserver | null = null;
    let redimensionnementProgramme: number | null = null;

    const detruireApplication = () => {
      if (initialisee && !detruite) {
        detruite = true;
        application.destroy({ removeView: true }, { children: true });
      }
    };

    async function monterCoupeHabitee() {
      if (conteneur === null) {
        return;
      }

      await application.init({
        autoDensity: true,
        background: "#17242e",
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

      const texture = await Assets.load<Texture>(SOURCE_COUPE_HABITEE);

      if (annule) {
        detruireApplication();
        return;
      }

      const scene = new Sprite(texture);
      const lueurDuPhare = new Graphics()
        .circle(0, 0, 68)
        .fill({ color: 0xe09a35, alpha: 0.045 })
        .circle(0, 0, 33)
        .fill({ color: 0xffd078, alpha: 0.075 })
        .circle(0, 0, 8)
        .fill({ color: 0xffecb3, alpha: 0.52 });
      const cendres = new Container();
      const silhouettes = new Graphics();
      const particules = Array.from({ length: 34 }, (_, index) => {
        const poussiere = new Graphics()
          .circle(0, 0, 0.7 + (index % 4) * 0.42)
          .fill({
            color: index % 5 === 0 ? 0xe09a35 : 0xd8c4a3,
            alpha: 0.17 + (index % 3) * 0.07,
          });
        cendres.addChild(poussiere);
        return {
          poussiere,
          progressionX: ((index * 37) % 101) / 100,
          progressionY: ((index * 61) % 97) / 96,
          vitesse: 0.14 + (index % 7) * 0.035,
          derive: ((index % 9) - 4) * 0.02,
        };
      });
      let baseX = 0;
      let baseY = 0;
      let parallaxeX = 0;
      let parallaxeY = 0;
      let largeurPrecedente = 0;
      let hauteurPrecedente = 0;

      const ajusterSilhouettes = () => {
        silhouettes.clear();
        const marge = Math.max(14, application.screen.width * 0.025);
        const espacement = Math.max(8, application.screen.width * 0.012);
        const nombreDePlateformes = Math.max(1, plateformes.length);
        const largeurDisponible =
          application.screen.width -
          marge * 2 -
          espacement * Math.max(0, nombreDePlateformes - 1);
        const largeurPlateforme = Math.max(
          54,
          largeurDisponible / nombreDePlateformes,
        );
        const basePlateformes = application.screen.height - 52;
        plateformes.forEach((plateforme, index) => {
          const x = marge + index * (largeurPlateforme + espacement);
          const y = basePlateformes - (index % 2) * 10;
          silhouettes
            .roundRect(x, y, largeurPlateforme, 25, 7)
            .fill(plateforme.id === "phare" ? 0xa87843 : 0x755231);
          const nombreDEmplacements = plateforme.emplacements.length;
          plateforme.emplacements.forEach((occupe, emplacementIndex) => {
            const positionX =
              x +
              ((emplacementIndex + 1) * largeurPlateforme) /
                (nombreDEmplacements + 1);
            silhouettes
              .circle(positionX, y + 12.5, 4.5)
              .fill(occupe === "1" ? 0xffd078 : 0x17242e);
          });
        });
        if (chantierActif) {
          silhouettes
            .rect(marge - 7, basePlateformes - 16, 4, 45)
            .fill(0xffd078);
        }
      };

      const ajusterScene = () => {
        const echelle =
          Math.max(
            application.screen.width / texture.width,
            application.screen.height / texture.height,
          ) * 1.01;
        scene.scale.set(echelle);
        baseX = (application.screen.width - texture.width * echelle) / 2;
        scene.x = baseX;
        baseY = (application.screen.height - texture.height * echelle) / 2;
        scene.y = baseY;
        lueurDuPhare.position.set(
          baseX + texture.width * 0.51 * echelle,
          baseY + texture.height * 0.12 * echelle,
        );
        lueurDuPhare.scale.set(
          Math.max(0.52, Math.min(1.15, application.screen.width / 1_000)),
        );
        particules.forEach(({ poussiere, progressionX, progressionY }) => {
          poussiere.position.set(
            progressionX * application.screen.width,
            progressionY * application.screen.height,
          );
        });
        largeurPrecedente = application.screen.width;
        hauteurPrecedente = application.screen.height;
        ajusterSilhouettes();
      };

      ajusterScene();
      application.stage.addChild(scene);
      application.stage.addChild(lueurDuPhare);
      application.stage.addChild(cendres);
      application.stage.addChild(silhouettes);
      application.renderer.render(application.stage);
      conteneur.dataset.ready = "true";

      const suivrePointeur = (evenement: PointerEvent) => {
        if (mouvementReduit) {
          return;
        }
        const limites = conteneur.getBoundingClientRect();
        parallaxeX =
          ((evenement.clientX - limites.left) / Math.max(1, limites.width) -
            0.5) *
          2;
        parallaxeY =
          ((evenement.clientY - limites.top) / Math.max(1, limites.height) -
            0.5) *
          2;
      };
      const recentrer = () => {
        parallaxeX = 0;
        parallaxeY = 0;
      };
      conteneur.addEventListener("pointermove", suivrePointeur);
      conteneur.addEventListener("pointerleave", recentrer);

      observateur = new ResizeObserver(() => {
        if (annule || detruite || redimensionnementProgramme !== null) {
          return;
        }
        redimensionnementProgramme = window.requestAnimationFrame(() => {
          redimensionnementProgramme = null;
          if (annule || detruite) {
            return;
          }
          const largeur = conteneur.clientWidth;
          const hauteur = conteneur.clientHeight;
          if (largeur <= 0 || hauteur <= 0) {
            return;
          }
          if (
            largeur !== application.screen.width ||
            hauteur !== application.screen.height
          ) {
            application.renderer.resize(largeur, hauteur);
            application.canvas.style.width = "100%";
            application.canvas.style.height = "100%";
          }
          if (
            largeurPrecedente !== application.screen.width ||
            hauteurPrecedente !== application.screen.height
          ) {
            ajusterScene();
          }
          application.renderer.render(application.stage);
        });
      });
      observateur.observe(conteneur);

      const animerPresentation = (ticker: Ticker) => {
        if (
          largeurPrecedente !== application.screen.width ||
          hauteurPrecedente !== application.screen.height
        ) {
          ajusterScene();
        }

        if (!mouvementReduit) {
          const souffle = Math.sin(ticker.lastTime / 2_800);
          const facteurVitesse = vitesse === 0 ? 0.18 : vitesse;
          scene.x +=
            (baseX + parallaxeX * 5 - scene.x) *
            Math.min(1, 0.045 * ticker.deltaTime);
          scene.y +=
            (baseY + parallaxeY * 3 + souffle * 1.25 - scene.y) *
            Math.min(1, 0.045 * ticker.deltaTime);
          lueurDuPhare.alpha = 0.72 + souffle * 0.14;
          lueurDuPhare.scale.set(
            Math.max(0.52, Math.min(1.15, application.screen.width / 1_000)) *
              (1 + souffle * 0.035),
          );
          particules.forEach(
            ({ poussiere, vitesse: vitesseParticule, derive }) => {
              poussiere.y -=
                vitesseParticule * facteurVitesse * ticker.deltaTime;
              poussiere.x += derive * facteurVitesse * ticker.deltaTime;
              if (poussiere.y < -5) {
                poussiere.y = application.screen.height + 5;
              }
              if (poussiere.x < -5) {
                poussiere.x = application.screen.width + 5;
              } else if (poussiere.x > application.screen.width + 5) {
                poussiere.x = -5;
              }
            },
          );
        }
      };

      if (mouvementReduit) {
        application.ticker.stop();
      } else {
        application.ticker.add(animerPresentation);
      }

      return () => {
        conteneur.removeEventListener("pointermove", suivrePointeur);
        conteneur.removeEventListener("pointerleave", recentrer);
      };
    }

    let retirerInteractions: (() => void) | undefined;
    void monterCoupeHabitee().then((nettoyage) => {
      retirerInteractions = nettoyage;
    });

    return () => {
      annule = true;
      retirerInteractions?.();
      observateur?.disconnect();
      if (redimensionnementProgramme !== null) {
        window.cancelAnimationFrame(redimensionnementProgramme);
      }
      if (conteneur !== null) {
        delete conteneur.dataset.ready;
      }
      detruireApplication();
    };
  }, [chantierActif, implantation, vitesse]);

  return (
    <div
      ref={conteneurRef}
      className="coupe-habitee"
      data-testid="coupe-habitee"
      data-installations={nombreInstallations}
      data-implantation={implantation}
      data-chantier-actif={chantierActif ? "true" : "false"}
      data-vitesse={vitesse}
      aria-hidden="true"
    />
  );
}
