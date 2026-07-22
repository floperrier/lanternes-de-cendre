import {
  Application,
  Assets,
  Graphics,
  Sprite,
  type Texture,
  type Ticker,
} from "pixi.js";
import { useEffect, useRef } from "react";

const SOURCE_COUPE_HABITEE = "/assets/cite-caravane.png";

interface PropsCoupeHabitee {
  readonly implantation: string;
  readonly chantierActif: boolean;
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
      const silhouettes = new Graphics();
      let baseY = 0;
      let largeurPrecedente = 0;
      let hauteurPrecedente = 0;

      const ajusterSilhouettes = () => {
        silhouettes.clear();
        const marge = Math.max(14, application.screen.width * 0.025);
        const espacement = Math.max(8, application.screen.width * 0.012);
        const largeurDisponible =
          application.screen.width - marge * 2 - espacement * 4;
        const largeurPlateforme = Math.max(54, largeurDisponible / 5);
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
        scene.x = (application.screen.width - texture.width * echelle) / 2;
        baseY = (application.screen.height - texture.height * echelle) / 2;
        scene.y = baseY;
        largeurPrecedente = application.screen.width;
        hauteurPrecedente = application.screen.height;
        ajusterSilhouettes();
      };

      ajusterScene();
      application.stage.addChild(scene);
      application.stage.addChild(silhouettes);
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
  }, [chantierActif, implantation]);

  return (
    <div
      ref={conteneurRef}
      className="coupe-habitee"
      data-testid="coupe-habitee"
      data-installations={nombreInstallations}
      data-implantation={implantation}
      data-chantier-actif={chantierActif ? "true" : "false"}
      aria-hidden="true"
    />
  );
}
