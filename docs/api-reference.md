# API Reference

## Consent
- `generateCTID(options?: CTIDOptions): CTID`
- `ConsentLifecycle` with `state`, `transitions`, and `transitionTo(next: ConsentState, at?: Date)`
- `VALID_TRANSITIONS` map for permitted lifecycle progressions
- `ToleranceWindow` with `isWithin(at: Date): boolean`

## Audit
- `AuditLogger.log(entry: AuditLogEntry): void`
- `AuditLogger.getLines(): string[]`
- `validateConsentTrace(states: ConsentState[]): TraceValidationResult`

## Repair
- `computeTrustDelta(baseline: TrustMetrics, current: TrustMetrics): TrustDeltaResult`

## Client
- `EISClient` factories for CTIDs, consent lifecycles, tolerance windows, audit logging, trace validation, and trust deltas

## Errors
- `EISDKError` base class
- `TransitionError` for invalid consent transitions
- `ValidationError` for configuration problems
