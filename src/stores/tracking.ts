export class Tracking {
  enabled: boolean;
  temporaryId: string;

  constructor(enabled?: boolean, temporaryId?: string) {
    this.enabled = enabled ?? false;
    this.temporaryId = temporaryId ?? crypto.randomUUID();
  }
}
