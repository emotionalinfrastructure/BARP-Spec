/**
 * Unified client for Emotional Infrastructure™ SDK.
 *
 * The `EISClient` class orchestrates the various modules of the SDK,
 * exposing a simple API for common operations such as generating CTIDs,
 * managing consent lifecycles, creating tolerance windows, logging audit
 * events, validating consent traces and computing trust deltas. Consumers
 * may choose to use these modules individually, but the client provides
 * sensible defaults and a cohesive interface.
 */

import { generateCTID, CTIDOptions, CTID } from './consent/ctid';
import {
  ConsentLifecycle,
  ConsentState,
} from './consent/stateMachine';
import { ToleranceWindow, ToleranceWindowOptions } from './consent/toleranceWindow';
import { AuditLogger, AuditLogEntry } from './audit/logger';
import {
  validateConsentTrace,
  TraceValidationResult,
} from './audit/traceValidator';
import {
  computeTrustDelta,
  TrustMetrics,
  TrustDeltaResult,
} from './repair/trustDelta';

/**
 * Configuration for the audit logger used by `EISClient`.
 */
export interface AuditLoggerOptions {
  /** Optional callback invoked with each JSONL string produced by the logger. */
  output?: (line: string) => void;
}

/**
 * The primary entry point to the Emotional Infrastructure™ SDK. Provides
 * methods to create and manage CTIDs, consent lifecycles, tolerance
 * windows, audit logs, trace validation and trust delta calculations. An
 * optional logger output can be supplied to stream audit entries to an
 * external sink.
 */
export class EISClient {
  private readonly logger: AuditLogger;

  constructor(private readonly loggerOptions: AuditLoggerOptions = {}) {
    this.logger = new AuditLogger(this.loggerOptions.output);
  }

  public createCTID(options?: CTIDOptions): CTID {
    return generateCTID(options);
  }

  public createConsentLifecycle(
    initialState?: ConsentState,
  ): ConsentLifecycle {
    return new ConsentLifecycle(initialState);
  }

  public createToleranceWindow(options: ToleranceWindowOptions): ToleranceWindow {
    return new ToleranceWindow(options);
  }

  public logAudit(entry: AuditLogEntry): void {
    this.logger.log(entry);
  }

  public getAuditLines(): string[] {
    return this.logger.getLines();
  }

  public validateTrace(states: ConsentState[]): TraceValidationResult {
    return validateConsentTrace(states);
  }

  public computeTrustDelta(
    baseline: TrustMetrics,
    current: TrustMetrics,
  ): TrustDeltaResult {
    return computeTrustDelta(baseline, current);
  }
}

export {
  generateCTID,
  ConsentLifecycle,
  ConsentState,
  ToleranceWindow,
  AuditLogger,
  validateConsentTrace,
  computeTrustDelta,
};
