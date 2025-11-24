import { describe, expect, it } from '@jest/globals';

import { AuditLogger } from '../src/audit/logger';
import { TraceValidator } from '../src/audit/traceValidator';
import { ConsentState } from '../src/consent/stateMachine';

const states: ConsentState[] = ['requested', 'pending', 'active', 'renewed', 'revoked'];

describe('TraceValidator', () => {
  it('validates allowed transitions', () => {
    const validator = new TraceValidator();
    const result = validator.validate(states);
    expect(result.valid).toBe(true);
  });

  it('detects illegal transitions', () => {
    const validator = new TraceValidator();
    const result = validator.validate(['requested', 'revoked']);
    expect(result.valid).toBe(false);
    expect(result.issues[0]).toMatchObject({ from: 'requested', to: 'revoked' });
  });

  it('extracts states from audit log', () => {
    const logger = new AuditLogger();
    logger.log({ event_type: 'consent', details: { state: 'pending' } });
    logger.log({ event_type: 'consent', details: { state: 'active' } });

    const validator = new TraceValidator(logger.getEvents());
    const result = validator.validate();
    expect(result.valid).toBe(true);
  });
});
