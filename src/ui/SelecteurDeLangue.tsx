import type { Langue } from "../content/types";

interface SelecteurDeLangueProps {
  readonly langue: Langue;
  readonly choisirLangue: (langue: Langue) => void;
}

export function SelecteurDeLangue({
  langue,
  choisirLangue,
}: SelecteurDeLangueProps) {
  return (
    <fieldset className="selecteur-de-langue">
      <legend className="sr-only">Langue</legend>
      <button
        type="button"
        aria-pressed={langue === "fr"}
        onClick={() => choisirLangue("fr")}
      >
        Français
      </button>
      <button
        type="button"
        aria-pressed={langue === "en"}
        onClick={() => choisirLangue("en")}
      >
        English
      </button>
    </fieldset>
  );
}
