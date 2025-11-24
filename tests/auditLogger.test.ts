import { describe, expect, it } from '@jest/globals';
import { AuditLogger } from '../src/audit/logger';

describe('AuditLogger', () => {
  it('stores JSONL lines and defaults missing fields', () => {
    const logger = new AuditLogger();
    logger.log({ event: 'test.event' });
    const lines = logger.getLines();
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]);
    expect(parsed.event).toBe('test.event');
    expect(parsed.actor).toBe('unknown');
    expect(parsed.subject).toBe('unknown');
    expect(typeof parsed.timestamp).toBe('string');
  });

  it('emits lines via callback', () => {
    const emitted: string[] = [];
    const logger = new AuditLogger((line) => emitted.push(line));
    logger.log({ event: 'callback.event', actor: 'user' });
    expect(emitted).toHaveLength(1);
    expect(JSON.parse(emitted[0]).actor).toBe('user');
  });
});
