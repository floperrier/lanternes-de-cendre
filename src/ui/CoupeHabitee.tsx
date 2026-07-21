import { Application, Assets, Sprite, type Texture, type Ticker } from "pixi.js";
import { useEffect, useRef } from "react";

const SOURCE_COUPE_HABITEE = "/assets/cite-caravane.png";

export function CoupeHabitee() {
  const conteneurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const conteneur = conteneurRef.current;
    const application = new Application();
    const mouvementReduit = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let annule = false;
    let initialisee = false;
    let detruite = false;

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
        resizeTo: conteneur,
      });
      initialisee = true;

      if (annule) {
        detruireApplication();
        return;
      }

      application.canvas.setAttribute("aria-hidden", "true");
      conteneur.append(application.canvas);

      const texture = await Assets.load<Texture>(SOURCE_COUPE_HABITEE);

      if (annule) {
        detruireApplication();
        return;
      }

      const scene = new Sprite(texture);
      let baseY = 0;
      let largeurPrecedente = 0;
      let hauteurPrecedente = 0;

      const ajusterScene = () => {
        const echelle =
          Math.max(
            application.screen.width / texture.width,
            application.screen.height / texture.height,
          ) * 1.01;
        scene.scale.set(echelle);
        scene.x = (application.screen.width - texture.width * echelle) / 2;
        baseY = (application.screen.height - texture.height * echelle) / 2;
        scene.y = baseY;
        largeurPrecedente = application.screen.width;
        hauteurPrecedente = application.screen.height;
      };

      ajusterScene();
      application.stage.addChild(scene);
      conteneur.dataset.ready = "true";

      const animerPresentation = (ticker: Ticker) => {
        if (
          largeurPrecedente !== application.screen.width ||
          hauteurPrecedente !== application.screen.height
        ) {
          ajusterScene();
        }

        if (!mouvementReduit) {
          scene.y = baseY + Math.sin(ticker.lastTime / 2_800) * 1.25;
        }
      };

      application.ticker.add(animerPresentation);
    }

    void monterCoupeHabitee();

    return () => {
      annule = true;
      if (conteneur !== null) {
        delete conteneur.dataset.ready;
      }
      detruireApplication();
    };
  }, []);

  return (
    <div
      ref={conteneurRef}
      className="coupe-habitee"
      data-testid="coupe-habitee"
      aria-hidden="true"
    />
  );
}
