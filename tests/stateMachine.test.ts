import { describe, expect, it } from '@jest/globals';
import { ConsentLifecycle, ConsentState } from '../src/consent/stateMachine';

describe('ConsentLifecycle', () => {
  it('initializes with requested state by default', () => {
    const lifecycle = new ConsentLifecycle();
    expect(lifecycle.state).toBe(ConsentState.Requested);
  });

  it('records valid transitions', () => {
    const lifecycle = new ConsentLifecycle();
    const toPending = lifecycle.transitionTo(ConsentState.PendingReview);
    const toGranted = lifecycle.transitionTo(ConsentState.Granted);
    expect(toPending.from).toBe(ConsentState.Requested);
    expect(toGranted.from).toBe(ConsentState.PendingReview);
    expect(lifecycle.state).toBe(ConsentState.Granted);
    expect(lifecycle.transitions).toHaveLength(2);
  });

  it('rejects invalid transitions', () => {
    const lifecycle = new ConsentLifecycle(ConsentState.Granted);
    expect(() => lifecycle.transitionTo(ConsentState.Requested)).toThrow('Invalid transition');
  });
});
