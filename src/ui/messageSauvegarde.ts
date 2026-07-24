interface MessagesDeSauvegarde {
  readonly erreurAsynchrone?: string;
  readonly messageLocal: string | null;
  readonly statutAutomatique: string;
}

export function choisirMessageDeSauvegarde({
  erreurAsynchrone,
  messageLocal,
  statutAutomatique,
}: MessagesDeSauvegarde): string {
  if (erreurAsynchrone !== undefined) {
    return erreurAsynchrone;
  }
  if (statutAutomatique.startsWith("Point de reprise")) {
    return statutAutomatique;
  }
  return messageLocal ?? statutAutomatique;
}
