export enum ConsentState {
  Requested = 'requested',
  PendingReview = 'pending_review',
  Granted = 'granted',
  Suspended = 'suspended',
  Resumed = 'resumed',
  Revoked = 'revoked',
  Expired = 'expired',
  Denied = 'denied',
  AuditHold = 'audit_hold',
  Deleted = 'deleted',
}

export const VALID_TRANSITIONS: Record<ConsentState, ConsentState[]> = {
  [ConsentState.Requested]: [ConsentState.PendingReview, ConsentState.Granted, ConsentState.Denied],
  [ConsentState.PendingReview]: [ConsentState.Granted, ConsentState.Denied, ConsentState.AuditHold],
  [ConsentState.Granted]: [ConsentState.Suspended, ConsentState.Revoked, ConsentState.Expired, ConsentState.AuditHold],
  [ConsentState.Suspended]: [ConsentState.Resumed, ConsentState.Revoked, ConsentState.Expired, ConsentState.AuditHold],
  [ConsentState.Resumed]: [ConsentState.Suspended, ConsentState.Revoked, ConsentState.Expired, ConsentState.AuditHold],
  [ConsentState.Revoked]: [ConsentState.Deleted, ConsentState.Requested],
  [ConsentState.Expired]: [ConsentState.Requested, ConsentState.Deleted],
  [ConsentState.Denied]: [ConsentState.Requested, ConsentState.Deleted],
  [ConsentState.AuditHold]: [ConsentState.PendingReview, ConsentState.Revoked, ConsentState.Deleted],
  [ConsentState.Deleted]: [],
};

export interface TransitionRecord {
  from: ConsentState;
  to: ConsentState;
  timestamp: Date;
}

export class ConsentLifecycle {
  private current: ConsentState;
  private readonly history: TransitionRecord[] = [];

  constructor(initialState: ConsentState = ConsentState.Requested) {
    this.current = initialState;
  }

  public get state(): ConsentState {
    return this.current;
  }

  public get transitions(): TransitionRecord[] {
    return [...this.history];
  }

  public transitionTo(next: ConsentState, at: Date = new Date()): TransitionRecord {
    if (!VALID_TRANSITIONS[this.current].includes(next)) {
      throw new Error(`Invalid transition from ${this.current} to ${next}`);
    }
    const record: TransitionRecord = { from: this.current, to: next, timestamp: at };
    this.history.push(record);
    this.current = next;
    return record;
  }
}
