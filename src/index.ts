/**
 * Emotional Infrastructure™ SDK (EIS-SDK)
 *
 * A complete implementation of the EIS v1.1 standard for ethical AI
 * consent management, audit logging, and trust repair.
 *
 * @packageDocumentation
 * @module eis-sdk
 * @version 0.1.0
 * @license Apache-2.0
 * @author Brittany Wright
 */

// Consent Management
export { generateCTID } from './consent/ctid';
export type { ConsentTransactionID } from './consent/ctid';

export { ConsentStateMachine, ConsentState } from './consent/stateMachine';

export { ToleranceWindow } from './consent/toleranceWindow';
export type { ToleranceConfig, EmotionalSignal } from './consent/toleranceWindow';

// Audit & Compliance
export { AuditLogger } from './audit/logger';
export type { LogEvent } from './audit/logger';

export { TraceValidator } from './audit/traceValidator';
export type { ValidationResult } from './audit/traceValidator';

// Trust Repair
export { TrustDeltaCalculator } from './repair/trustDelta';
export type {
  TrustSurveyResponse,
  TrustDeltaResult,
  RepairMetrics,
} from './repair/trustDelta';

// Utilities
export { EISError, ConsentError, AuditError, ValidationError } from './utils/errors';

export { createEISClient } from './client';
export type { EISClient, EISConfig } from './client';

/**
 * SDK Version
 */
export const VERSION = '0.1.0';

/**
 * EIS Standard Version
 */
export const EIS_VERSION = '1.1';

/**
 * Quick start helpers for simple use cases.
 *
 * These use dynamic imports to keep bundle size lean for consumers
 * that only need specific modules.
 */
export const QuickStart = {
  /**
   * Create a basic consent flow with audit logging.
   *
   * NOTE: This is a convenience helper; for production,
   * use `createEISClient` directly and configure secrets properly.
   */
  createConsentFlow: async (secretKey: string, tiers: number[]) => {
    const { generateCTID } = await import('./consent/ctid');
    const { ConsentStateMachine } = await import('./consent/stateMachine');
    const { AuditLogger } = await import('./audit/logger');

    const ctid = generateCTID(secretKey, tiers);
    const machine = new ConsentStateMachine();
    const logger = new AuditLogger();

    machine.transition('pending');
    logger.log({
      event_type: 'consent_initiated',
      timestamp: new Date().toISOString(),
      ctid: ctid.user_id,
      details: { tiers },
    });

    machine.transition('active');
    logger.log({
      event_type: 'consent_granted',
      timestamp: new Date().toISOString(),
      ctid: ctid.user_id,
      details: { tiers, state: 'active' },
    });

    return { ctid, machine, logger };
  },

  /**
   * Create an emotional monitoring system (ToleranceWindow only).
   */
  createMonitor: async () => {
    const { ToleranceWindow } = await import('./consent/toleranceWindow');
    return new ToleranceWindow({ baseline: 0, threshold: 0.5, windowMs: 60_000 });
  },

  /**
   * Create a trust repair assessment calculator.
   */
  createTrustAssessment: async () => {
    const { TrustDeltaCalculator } = await import('./repair/trustDelta');
    return new TrustDeltaCalculator();
  },
};
