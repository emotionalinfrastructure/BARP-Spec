import { readFileSync } from 'node:fs';

import { ConsentState, VALID_TRANSITIONS } from '../consent/stateMachine';
import { ValidationError } from '../utils/errors';
import { LogEvent } from './logger';

export interface ValidationIssue {
  index: number;
  from: ConsentState;
  to: ConsentState;
  reason: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export class TraceValidator {
  private readonly events: LogEvent[] = [];

  public constructor(events: LogEvent[] = []) {
    this.events = [...events];
  }

  public loadFromFile(path: string): void {
    const content = readFileSync(path, 'utf-8');
    const lines = content.split('\n').filter(Boolean);
    lines.forEach((line) => {
      const parsed = JSON.parse(line) as LogEvent;
      this.events.push(parsed);
    });
  }

  public validate(states?: ConsentState[]): ValidationResult {
    const consentStates = states ?? this.extractStates();
    const issues: ValidationIssue[] = [];

    for (let i = 1; i < consentStates.length; i += 1) {
      const from = consentStates[i - 1];
      const to = consentStates[i];
      const allowed = VALID_TRANSITIONS[from];
      if (!allowed || !allowed.includes(to)) {
        issues.push({ index: i, from, to, reason: 'Illegal state transition' });
      }
    }

    return { valid: issues.length === 0, issues };
  }

  public generateReport(result: ValidationResult): string {
    if (result.valid) {
      return 'Trace is valid. No issues detected.';
    }
    const lines = result.issues.map(
      (issue) =>
        `#${issue.index}: ${issue.from} -> ${issue.to} (${issue.reason})`,
    );
    return ['Trace validation failed:', ...lines].join('\n');
  }

  private extractStates(): ConsentState[] {
    const states = this.events
      .map((event) => event.details?.state)
      .filter((state): state is ConsentState => typeof state === 'string')
      .map((state) => state as ConsentState);

    if (states.length === 0) {
      throw new ValidationError('No consent states found in audit log');
    }

    return states;
  }
}
