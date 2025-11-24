import { describe, expect, it } from '@jest/globals';
import { ToleranceWindow } from '../src/consent/toleranceWindow';

describe('ToleranceWindow', () => {
  it('validates window boundaries with tolerance', () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const window = new ToleranceWindow({ start, durationMs: 1000, toleranceMs: 100 });
    expect(window.isWithin(new Date('2023-01-01T00:00:00Z'))).toBe(true);
    expect(window.isWithin(new Date('2023-01-01T00:00:01.1Z'))).toBe(true);
    expect(window.isWithin(new Date('2022-12-31T23:59:59.8Z'))).toBe(true);
    expect(window.isWithin(new Date('2022-12-31T23:59:59.7Z'))).toBe(false);
  });

  it('requires end or duration', () => {
    expect(() => new ToleranceWindow({ start: new Date() } as any)).toThrow('Provide end or durationMs');
  });
});
