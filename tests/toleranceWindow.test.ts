import { describe, expect, it } from '@jest/globals';

import { ToleranceWindow } from '../src/consent/toleranceWindow';

describe('ToleranceWindow', () => {
  it('evaluates signals against baseline', () => {
    const window = new ToleranceWindow({ baseline: 0.5, threshold: 0.2, windowMs: 1000 });
    const within = window.record({ timestamp: new Date(), value: 0.6 });
    const outside = window.record({ timestamp: new Date(), value: 1.0 });

    expect(within).toBe(true);
    expect(outside).toBe(false);
  });

  it('updates baseline over time', () => {
    const window = new ToleranceWindow({ baseline: 0, threshold: 1, windowMs: 10_000 });
    window.record({ timestamp: new Date(), value: 1 });
    window.record({ timestamp: new Date(), value: 2 });
    expect(window.updateBaseline()).toBeCloseTo(1.5, 1);
  });
});
