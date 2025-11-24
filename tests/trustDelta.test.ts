import { describe, expect, it } from '@jest/globals';

import { TrustDeltaCalculator } from '../src/repair/trustDelta';

describe('TrustDeltaCalculator', () => {
  it('computes deltas and percentage changes', () => {
    const calculator = new TrustDeltaCalculator();
    const result = calculator.calculateDelta(
      [
        { dimension: 'safety', score: 0.6 },
        { dimension: 'transparency', score: 0.5 },
      ],
      [
        { dimension: 'safety', score: 0.8 },
        { dimension: 'transparency', score: 0.4 },
      ],
    );

    expect(result.deltas.safety).toBeCloseTo(0.2);
    expect(result.deltas.transparency).toBeCloseTo(-0.1);
    expect(result.overallDelta).toBeCloseTo(0.05);
  });
});
