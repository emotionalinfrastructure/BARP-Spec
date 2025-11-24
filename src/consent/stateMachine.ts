import { ConsentError } from '../utils/errors';

export type ConsentState =
  | 'requested'
  | 'pending'
  | 'active'
  | 'renewed'
  | 'suspended'
  | 'resumed'
  | 'revoked'
  | 'expired'
  | 'audit_hold'
  | 'deleted';

export const VALID_TRANSITIONS: Record<ConsentState, ConsentState[]> = {
  requested: ['pending', 'active'],
  pending: ['active', 'revoked', 'audit_hold'],
  active: ['renewed', 'suspended', 'revoked', 'expired', 'audit_hold'],
  renewed: ['active', 'suspended', 'revoked', 'expired', 'audit_hold'],
  suspended: ['resumed', 'revoked', 'expired', 'audit_hold'],
  resumed: ['active', 'suspended', 'revoked', 'expired', 'audit_hold'],
  revoked: ['deleted'],
  expired: ['deleted', 'pending'],
  audit_hold: ['pending', 'revoked', 'deleted'],
  deleted: [],
};

export interface TransitionRecord {
  from: ConsentState;
  to: ConsentState;
  timestamp: string;
}

export class ConsentStateMachine {
  private current: ConsentState;

  private readonly history: TransitionRecord[] = [];

  constructor(initialState: ConsentState = 'requested') {
    this.current = initialState;
  }

  public get state(): ConsentState {
    return this.current;
  }

  public get transitions(): TransitionRecord[] {
    return [...this.history];
  }

  public transition(next: ConsentState, at: Date = new Date()): TransitionRecord {
    const allowed = VALID_TRANSITIONS[this.current];
    if (!allowed.includes(next)) {
      throw new ConsentError(`Invalid transition from ${this.current} to ${next}`);
    }
    const record: TransitionRecord = {
      from: this.current,
      to: next,
      timestamp: at.toISOString(),
    };
    this.history.push(record);
    this.current = next;
    return record;
  }
}
