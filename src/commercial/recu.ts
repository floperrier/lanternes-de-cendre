const CLE_PUBLIQUE_DE_DEVELOPPEMENT =
  "MCowBQYDK2VwAyEAU+ZjlLEBAeBrSglL4dNL4gbP3kRGn66D0DJ74LlxhXI=";

interface ChargeUtileDuRecu {
  readonly version: 1;
  readonly sujet: string;
  readonly portee: "acces-premium-permanent";
  readonly contenu: string;
}

function decoderBase64Url(valeur: string): Uint8Array {
  const base64 = valeur
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(valeur.length / 4) * 4, "=");
  const texte = atob(base64);
  return Uint8Array.from(texte, (caractere) => caractere.charCodeAt(0));
}

function decoderBase64(valeur: string): Uint8Array {
  const texte = atob(valeur.replaceAll(/\s/g, ""));
  return Uint8Array.from(texte, (caractere) => caractere.charCodeAt(0));
}

function encoderBase64Url(valeur: Uint8Array): string {
  let texte = "";
  for (const octet of valeur) {
    texte += String.fromCharCode(octet);
  }
  return btoa(texte)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function versArrayBuffer(valeur: Uint8Array): ArrayBuffer {
  return valeur.slice().buffer as ArrayBuffer;
}

export async function empreinteDuContenuPremium(
  contenu: unknown,
): Promise<string> {
  const octets = new TextEncoder().encode(JSON.stringify(contenu));
  return encoderBase64Url(
    new Uint8Array(await crypto.subtle.digest("SHA-256", octets)),
  );
}

export async function verifierRecuPremium({
  recu,
  identiteId,
  contenu,
  clePublique = import.meta.env.VITE_PREMIUM_RECEIPT_PUBLIC_KEY ??
    CLE_PUBLIQUE_DE_DEVELOPPEMENT,
}: {
  readonly recu: string;
  readonly identiteId: string;
  readonly contenu: unknown;
  readonly clePublique?: string;
}): Promise<boolean> {
  try {
    const [chargeUtileEncodee, signatureEncodee, surplus] =
      recu.split(".");
    if (
      chargeUtileEncodee === undefined ||
      signatureEncodee === undefined ||
      surplus !== undefined
    ) {
      return false;
    }
    const chargeUtile = JSON.parse(
      new TextDecoder().decode(decoderBase64Url(chargeUtileEncodee)),
    ) as Partial<ChargeUtileDuRecu>;
    if (
      chargeUtile.version !== 1 ||
      chargeUtile.sujet !== identiteId ||
      chargeUtile.portee !== "acces-premium-permanent" ||
      chargeUtile.contenu !== (await empreinteDuContenuPremium(contenu))
    ) {
      return false;
    }
    const cle = await crypto.subtle.importKey(
      "spki",
      versArrayBuffer(decoderBase64(clePublique)),
      { name: "Ed25519" },
      false,
      ["verify"],
    );
    return crypto.subtle.verify(
      { name: "Ed25519" },
      cle,
      versArrayBuffer(decoderBase64Url(signatureEncodee)),
      versArrayBuffer(new TextEncoder().encode(chargeUtileEncodee)),
    );
  } catch {
    return false;
  }
}
