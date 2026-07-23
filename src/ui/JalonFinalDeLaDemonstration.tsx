import { useEffect, useRef, type ReactNode } from "react";

import type { ProjectionDeDemonstration } from "../application/demonstration";
import type { Langue } from "../content/types";

interface JalonFinalDeLaDemonstrationProps {
  readonly projection: ProjectionDeDemonstration;
  readonly langue: Langue;
  readonly children: ReactNode;
}

export function JalonFinalDeLaDemonstration({
  projection,
  langue,
  children,
}: JalonFinalDeLaDemonstrationProps) {
  const titre = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titre.current?.focus({ preventScroll: true });
  }, []);

  if (projection.jalonFinal === null) {
    return null;
  }

  return (
    <section
      className="jalon-final-demonstration"
      aria-labelledby="titre-jalon-final-demonstration"
      aria-describedby="explication-jalon-final-demonstration"
      lang={langue}
    >
      <p>{langue === "fr" ? "Jalon de la Démonstration" : "Demonstration milestone"}</p>
      <h2
        ref={titre}
        id="titre-jalon-final-demonstration"
        tabIndex={-1}
      >
        {projection.jalonFinal.titre}
      </h2>
      <p id="explication-jalon-final-demonstration">
        {projection.jalonFinal.explication}
      </p>
      <div className="jalon-final-demonstration__outils">{children}</div>
    </section>
  );
}
