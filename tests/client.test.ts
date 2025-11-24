import { describe, expect, it } from '@jest/globals';

import { createEISClient } from '../src/client';

describe('EISClient', () => {
  it('creates consent lifecycles and audit logs', async () => {
    const client = createEISClient({ secretKey: 'secret' });
    const ctid = await client.initializeConsent([1]);
    const state = await client.grantConsent();

    expect(ctid.user_id).toBeDefined();
    expect(state).toBe('active');
    expect(client.getAuditLines().length).toBeGreaterThan(0);
  });

  it('monitors tolerance windows when configured', async () => {
    const client = createEISClient({
      secretKey: 'secret',
      tolerance: { baseline: 0.2, threshold: 0.3, windowMs: 1000 },
    });

    await client.initializeConsent([]);
    const within = await client.monitorSignal({ timestamp: new Date(), value: 0.25 });
    const outside = await client.monitorSignal({ timestamp: new Date(), value: 1 });

    expect(within).toBe(true);
    expect(outside).toBe(false);
  });
});
