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
  return erreurAsynchrone ?? messageLocal ?? statutAutomatique;
}
