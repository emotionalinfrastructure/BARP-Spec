import { ConsentLifecycle, ConsentState } from '../src/consent/stateMachine';

describe('ConsentLifecycle', () => {
  it('initializes with requested state by default', () => {
    const lifecycle = new ConsentLifecycle();
    expect(lifecycle.state).toBe(ConsentState.Requested);
  });

  it('records valid transitions', () => {
    const lifecycle = new ConsentLifecycle();
    const record = lifecycle.transitionTo(ConsentState.Granted);
    expect(record.from).toBe(ConsentState.Requested);
    expect(record.to).toBe(ConsentState.Granted);
    expect(lifecycle.state).toBe(ConsentState.Granted);
    expect(lifecycle.transitions).toHaveLength(1);
  });

  it('rejects invalid transitions', () => {
    const lifecycle = new ConsentLifecycle(ConsentState.Revoked);
    expect(() => lifecycle.transitionTo(ConsentState.Granted)).toThrow('Invalid transition');
  });
});
