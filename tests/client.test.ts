import { describe, expect, it } from '@jest/globals';
import { EISClient } from '../src/client';
import { ConsentState } from '../src/consent/stateMachine';

describe('EISClient', () => {
  it('creates CTIDs and manages modules cohesively', () => {
    const client = new EISClient();
    const ctid = client.createCTID({ prefix: 'test', entropyBytes: 4 });
    expect(ctid.startsWith('test-')).toBe(true);

    const lifecycle = client.createConsentLifecycle();
    lifecycle.transitionTo(ConsentState.Granted);
    client.logAudit({ event: 'consent.granted', subject: ctid });
    expect(client.getAuditLines()).toHaveLength(1);

    const validation = client.validateTrace([ConsentState.Requested, ConsentState.Granted]);
    expect(validation.valid).toBe(true);
  });
});
