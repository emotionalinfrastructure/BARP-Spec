import { AuditError } from '../utils/errors';

export interface LogEvent {
  event_type: string;
  timestamp?: string;
  ctid?: string;
  details?: Record<string, unknown>;
}

export class AuditLogger {
  private readonly events: LogEvent[] = [];

  constructor(private readonly output?: (line: string) => void) {}

  public log(event: LogEvent): void {
    if (!event.event_type) {
      throw new AuditError('event_type is required');
    }
    const normalized: Required<LogEvent> = {
      event_type: event.event_type,
      timestamp: event.timestamp ?? new Date().toISOString(),
      ctid: event.ctid ?? 'unknown',
      details: event.details ?? {},
    };
    this.events.push(normalized);
    const line = JSON.stringify(normalized);
    if (this.output) {
      this.output(line);
    }
  }

  public getLines(): string[] {
    return this.events.map((entry) => JSON.stringify(entry));
  }

  public getEvents(): LogEvent[] {
    return [...this.events];
  }
}
