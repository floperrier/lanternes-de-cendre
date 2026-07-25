export function prochaineCibleDeFocus<Element>(
  elements: readonly Element[],
  actif: Element | null,
  recul: boolean,
): Element | undefined {
  if (elements.length === 0) {
    return undefined;
  }
  const index = actif === null ? -1 : elements.indexOf(actif);
  if (recul) {
    return index <= 0 ? elements.at(-1) : elements[index - 1];
  }
  return index < 0 || index === elements.length - 1
    ? elements[0]
    : elements[index + 1];
}
