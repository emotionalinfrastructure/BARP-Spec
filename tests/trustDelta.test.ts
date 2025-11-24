import { describe, expect, it } from '@jest/globals';
import { computeTrustDelta } from '../src/repair/trustDelta';

describe('computeTrustDelta', () => {
  it('calculates deltas and percentage change', () => {
    const baseline = { reliability: 80, transparency: 50 };
    const current = { reliability: 90, transparency: 45, empathy: 10 };
    const result = computeTrustDelta(baseline, current);

    expect(result.deltas.reliability).toBe(10);
    expect(result.percentageChange.reliability).toBeCloseTo(12.5);
    expect(result.deltas.transparency).toBe(-5);
    expect(result.percentageChange.transparency).toBeCloseTo(-10);
    expect(result.deltas.empathy).toBe(10);
    expect(result.percentageChange.empathy).toBe(Infinity);
    expect(result.overallDelta).toBeCloseTo((10 - 5 + 10) / 3);
  });
});
