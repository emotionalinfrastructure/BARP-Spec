export enum ConsentState {
  Requested = 'requested',
  Granted = 'granted',
  Revoked = 'revoked',
  Expired = 'expired',
}

export const VALID_TRANSITIONS: Record<ConsentState, ConsentState[]> = {
  [ConsentState.Requested]: [ConsentState.Granted, ConsentState.Expired],
  [ConsentState.Granted]: [ConsentState.Revoked, ConsentState.Expired],
  [ConsentState.Revoked]: [],
  [ConsentState.Expired]: [],
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
