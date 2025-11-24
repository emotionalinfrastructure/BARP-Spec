import { describe, expect, it } from '@jest/globals';

import { ConsentStateMachine } from '../src/consent/stateMachine';

describe('ConsentStateMachine', () => {
  it('allows valid transitions', () => {
    const machine = new ConsentStateMachine();
    const first = machine.transition('pending');
    const second = machine.transition('active');

    expect(first.to).toBe('pending');
    expect(second.to).toBe('active');
    expect(machine.state).toBe('active');
  });

  it('rejects invalid transitions', () => {
    const machine = new ConsentStateMachine();
    expect(() => machine.transition('revoked')).toThrow('Invalid transition');
  });
});
