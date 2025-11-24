export interface ToleranceWindowOptions {
  /** Start of the window */
  start: Date;
  /** Explicit end date of the window */
  end?: Date;
  /** Duration in milliseconds to derive the end from the start */
  durationMs?: number;
  /** Additional tolerance in milliseconds applied to both start and end */
  toleranceMs?: number;
}

/**
 * ToleranceWindow evaluates whether a given timestamp falls within a window
 * that may include a configurable tolerance buffer. This is useful for
 * handling clock skew or network delays.
 */
export class ToleranceWindow {
  private readonly start: Date;
  private readonly end: Date;
  private readonly toleranceMs: number;

  constructor(options: ToleranceWindowOptions) {
    const { start, end, durationMs, toleranceMs = 0 } = options;
    if (!start) {
      throw new Error('start is required');
    }
    if (end && durationMs) {
      throw new Error('Provide either end or durationMs, not both');
    }
    if (!end && !durationMs) {
      throw new Error('Provide end or durationMs to establish window');
    }
    this.start = new Date(start);
    this.end = end ? new Date(end) : new Date(this.start.getTime() + (durationMs ?? 0));
    this.toleranceMs = toleranceMs;
    if (this.end.getTime() < this.start.getTime()) {
      throw new Error('end must be after start');
    }
  }

  public isWithin(at: Date): boolean {
    const time = at.getTime();
    const lowerBound = this.start.getTime() - this.toleranceMs;
    const upperBound = this.end.getTime() + this.toleranceMs;
    return time >= lowerBound && time <= upperBound;
  }
}
