import { ValidationError } from '../utils/errors';

export interface ToleranceConfig {
  /** Baseline emotional value used as the center of the window */
  baseline: number;
  /** Allowed deviation from the baseline */
  threshold: number;
  /** Rolling window duration for baseline updates */
  windowMs: number;
}

export interface EmotionalSignal {
  timestamp: Date;
  value: number;
  dimension?: string;
}

export class ToleranceWindow {
  private readonly signals: EmotionalSignal[] = [];

  private baseline: number;

  constructor(private readonly config: ToleranceConfig) {
    if (config.threshold < 0) {
      throw new ValidationError('threshold must be non-negative');
    }
    this.baseline = config.baseline;
  }

  public record(signal: EmotionalSignal): boolean {
    if (Number.isNaN(signal.value)) {
      throw new ValidationError('signal value must be a number');
    }
    this.signals.push(signal);
    this.compact(signal.timestamp);
    return this.isWithin(signal.value);
  }

  public isWithin(value: number): boolean {
    return Math.abs(value - this.baseline) <= this.config.threshold;
  }

  public updateBaseline(): number {
    if (this.signals.length === 0) {
      return this.baseline;
    }
    const sum = this.signals.reduce((total, signal) => total + signal.value, 0);
    this.baseline = sum / this.signals.length;
    return this.baseline;
  }

  private compact(currentTime: Date): void {
    const cutoff = currentTime.getTime() - this.config.windowMs;
    while (this.signals.length > 0 && this.signals[0].timestamp.getTime() < cutoff) {
      this.signals.shift();
    }
  }
}
