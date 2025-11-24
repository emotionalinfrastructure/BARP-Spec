export interface AuditLogEntry {
  event: string;
  actor?: string;
  subject?: string;
  timestamp?: string;
  details?: Record<string, unknown>;
}

/**
 * AuditLogger serializes entries as JSON Lines for easy ingestion. A callback
 * may be provided to stream lines as they are produced.
 */
export class AuditLogger {
  private readonly lines: string[] = [];

  constructor(private readonly output?: (line: string) => void) {}

  public log(entry: AuditLogEntry): void {
    const normalized: Required<AuditLogEntry> = {
      timestamp: entry.timestamp ?? new Date().toISOString(),
      event: entry.event,
      actor: entry.actor ?? 'unknown',
      subject: entry.subject ?? 'unknown',
      details: entry.details ?? {},
    };
    const line = JSON.stringify(normalized);
    this.lines.push(line);
    if (this.output) {
      this.output(line);
    }
  }

  public getLines(): string[] {
    return [...this.lines];
  }
}
