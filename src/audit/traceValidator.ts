import { ConsentState, VALID_TRANSITIONS } from '../consent/stateMachine';

export interface TraceIssue {
  index: number;
  from: ConsentState;
  to: ConsentState;
  reason: string;
}

export interface TraceValidationResult {
  valid: boolean;
  issues: TraceIssue[];
}

/**
 * Validate a sequence of consent states to ensure only permitted transitions
 * occur. Returns details describing any invalid jumps.
 */
export function validateConsentTrace(states: ConsentState[]): TraceValidationResult {
  const issues: TraceIssue[] = [];
  for (let i = 1; i < states.length; i += 1) {
    const from = states[i - 1];
    const to = states[i];
    if (!VALID_TRANSITIONS[from] || !VALID_TRANSITIONS[from].includes(to)) {
      issues.push({ index: i, from, to, reason: 'Illegal state transition' });
    }
  }
  return { valid: issues.length === 0, issues };
}
