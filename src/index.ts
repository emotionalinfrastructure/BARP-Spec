/**
 * Public entry point for the Emotional Infrastructure™ SDK.
 *
 * This module re-exports the primary types and classes from the SDK so
 * consumers can import them from a single location. Refer to individual
 * modules for detailed documentation.
 */

export type { CTID, CTIDOptions } from './consent/ctid';
export { generateCTID } from './consent/ctid';

export { ConsentState, ConsentLifecycle, VALID_TRANSITIONS } from './consent/stateMachine';
export type { TransitionRecord } from './consent/stateMachine';

export { ToleranceWindow } from './consent/toleranceWindow';
export type { ToleranceWindowOptions } from './consent/toleranceWindow';

export { AuditLogger } from './audit/logger';
export type { AuditLogEntry } from './audit/logger';

export { validateConsentTrace } from './audit/traceValidator';
export type { TraceValidationResult, TraceIssue } from './audit/traceValidator';

export { computeTrustDelta } from './repair/trustDelta';
export type { TrustMetrics, TrustDeltaResult } from './repair/trustDelta';

export { EISClient } from './client';
