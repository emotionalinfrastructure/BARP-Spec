import { describe, expect, it } from '@jest/globals';

import { AuditLogger } from '../src/audit/logger';

describe('AuditLogger', () => {
  it('serializes events to JSONL', () => {
    const logger = new AuditLogger();
    logger.log({ event_type: 'consent_initiated', ctid: 'abc', details: { level: 1 } });
    const lines = logger.getLines();
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0])).toMatchObject({ event_type: 'consent_initiated', ctid: 'abc' });
  });

  it('requires event_type', () => {
    const logger = new AuditLogger();
    // @ts-expect-error missing event type
    expect(() => logger.log({})).toThrow('event_type is required');
  });
});
