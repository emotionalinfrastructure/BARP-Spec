import { describe, expect, it } from '@jest/globals';
import { validateConsentTrace } from '../src/audit/traceValidator';
import { ConsentState } from '../src/consent/stateMachine';

describe('validateConsentTrace', () => {
  it('accepts valid transition chain', () => {
    const result = validateConsentTrace([
      ConsentState.Requested,
      ConsentState.PendingReview,
      ConsentState.Granted,
      ConsentState.Suspended,
      ConsentState.Resumed,
    ]);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('flags invalid transitions', () => {
    const result = validateConsentTrace([
      ConsentState.Requested,
      ConsentState.Revoked,
    ]);
    expect(result.valid).toBe(false);
    expect(result.issues[0]).toMatchObject({ from: ConsentState.Requested, to: ConsentState.Revoked });
  });
});
