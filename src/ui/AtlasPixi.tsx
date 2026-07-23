import { Application, Container, Graphics, Text } from "pixi.js";
import { useEffect, useRef } from "react";

import type { ProjectionDeLAtlas, TronconProjete } from "../application/routes";

interface AtlasPixiProps {
  readonly projection: ProjectionDeLAtlas;
}

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
    .roundRect(x, y, largeur, hauteur, 6)
    .fill({ color: COULEURS.surface, alpha: 0.96 })
    .stroke({ color: COULEURS.cuivre, width: 1 });
  conteneur.addChild(carte);

  ajouterTexte(conteneur, troncon.destination, x + 12, y + 9, {
    taille: 17,
    graisse: "700",
    largeur: largeur - 70,
  });
  ajouterTexte(conteneur, troncon.duree, x + largeur - 52, y + 11, {
    couleur: COULEURS.ambre,
    graisse: "600",
  });
  ajouterTexte(conteneur, troncon.connexion, x + 12, y + 34, {
    couleur: COULEURS.secondaire,
    largeur: largeur - 24,
  });
  ajouterTexte(conteneur, troncon.consommation, x + 12, y + 54, {
    couleur: COULEURS.texte,
    graisse: "600",
  });

  let ligne = y + 78;
  for (const renseignement of troncon.renseignements) {
    const source = ajouterTexte(
      conteneur,
      `${renseignement.source} · ${renseignement.age} · ${renseignement.fiabilite}`,
      x + 12,
      ligne,
      { couleur: COULEURS.ambre, graisse: "600", largeur: largeur - 24 },
    );
    const ligneEtat = ligne + source.height + 3;
    const etat = ajouterTexte(
      conteneur,
      `${renseignement.etat} · ${renseignement.meteo} · ${renseignement.panache}`,
      x + 12,
      ligneEtat,
      { couleur: COULEURS.secondaire, largeur: largeur - 24 },
    );
    const ligneDanger = ligneEtat + etat.height + 3;
    const danger = ajouterTexte(
      conteneur,
      `${renseignement.danger} · ${renseignement.controlePolitique}`,
      x + 12,
      ligneDanger,
      { couleur: COULEURS.secondaire, largeur: largeur - 24 },
    );
    ligne = ligneDanger + danger.height + 8;
  }

  const bilanY = Math.max(ligne + 2, y + hauteur - 55);
  const consequences = ajouterTexte(
    conteneur,
    troncon.bilan.consequencesConnues.join(" · "),
    x + 12,
    bilanY,
    { couleur: COULEURS.texte, largeur: largeur - 24 },
  );
  ajouterTexte(
    conteneur,
    troncon.bilan.incertitudes
      .map(
        (incertitude) =>
          `${incertitude.valeur} — ${incertitude.source} · ${incertitude.age}`,
      )
      .join(" · "),
    x + 12,
    bilanY + consequences.height + 4,
    { couleur: COULEURS.ambre, largeur: largeur - 24 },
  );
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
    let observateur: ResizeObserver | null = null;
    let redimensionnementProgramme: number | null = null;

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
      application.stage.addChild(scene);

      const donnees = projectionRef.current;
      const largeur = application.screen.width;
      const hauteur = application.screen.height;
      scene.addChild(
        new Graphics().rect(0, 0, largeur, hauteur).fill(COULEURS.fond),
      );
      ajouterTexte(
        scene,
        `${donnees.libellePosition} · ${donnees.position}`,
        16,
        11,
        { taille: 14, graisse: "700", couleur: COULEURS.ambre },
      );

      if (donnees.troncons.length === 0) {
        return;
      }
      const marge = 16;
      const espace = 12;
      const dispositionVerticale = largeur < 680;
      const largeurCarte = dispositionVerticale
        ? largeur - marge * 2
        : (largeur - marge * 2 - espace * (donnees.troncons.length - 1)) /
          donnees.troncons.length;
      const y = 42;
      const hauteurCarte = dispositionVerticale
        ? (hauteur - y - 12 - espace * (donnees.troncons.length - 1)) /
          donnees.troncons.length
        : Math.max(200, hauteur - y - 12);
      for (const index of donnees.troncons.keys()) {
        const x = dispositionVerticale
          ? marge
          : marge + index * (largeurCarte + espace);
        const yCarte = dispositionVerticale
          ? y + index * (hauteurCarte + espace)
          : y;
        const liaison = new Graphics()
          .moveTo(largeur / 2, 33)
          .lineTo(x + largeurCarte / 2, yCarte)
          .stroke({ color: COULEURS.ambre, width: 2, alpha: 0.7 });
        scene!.addChild(liaison);
      }
      donnees.troncons.forEach((troncon, index) => {
        const x = dispositionVerticale
          ? marge
          : marge + index * (largeurCarte + espace);
        const yCarte = dispositionVerticale
          ? y + index * (hauteurCarte + espace)
          : y;
        dessinerTroncon(
          scene!,
          troncon,
          x,
          yCarte,
          largeurCarte,
          hauteurCarte,
        );
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
        autoStart: false,
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
      dessiner();
      conteneur.dataset.ready = "true";

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
